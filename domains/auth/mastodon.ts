import passport from "passport";
import axios from "axios";
import express from "express";
import Account from "@/models/Account";

export interface ProfileField {
    name: string;
    value: string;
    verified_at: Date | null;
}

export interface ProfileSource {
    privacy: string;
    sensitive: boolean;
    language: string;
    note: string;
    fields: ProfileField[];
    follow_requests_count: number;
}

export interface ProfileEmoji {
    shortcode: string;
    url: string;
    static_url: string;
    visible_in_picker: boolean;
}

export interface Profile {
    id: string;
    username: string;
    acct: string;
    display_name: string;
    locked: boolean;
    bot: boolean;
    created_at: Date;
    note: string;
    url: string;
    avatar: string;
    avatar_static: string;
    header: string;
    header_static: string;
    followers_count: number;
    following_count: number;
    statuses_count: number;
    last_status_at: Date;
    source: ProfileSource;
    emojis: ProfileEmoji[];
    fields: ProfileField[];
}

export interface Server {
    url: string;
    client_id: string;
    client_secret: string;
}

export interface TokenResponse {
    access_token: string;
    token_type: string;
    scope: string;
    created_at: string;
}

type Callback = (req: express.Request,
                 domain: string,
                 accessToken: string,
                 profile: Profile,
                 callback: (err?: Error | null, user?: Express.User, info?: any) => void) => void

export default class Strategy extends passport.Strategy {
    private readonly _redirectUri: string;
    private _servers: Map<string, Server>
    private _scopes: string[];
    private _force_login: boolean;
    private readonly _callback: Callback;

    // Supports http://mastodon.social, https://mastodon.social or mastodon.social
    static _resolveShortDomainName(domain: string) {
        let result;
        try {
            result = new URL(domain).hostname
        } catch {
            result = domain
        }
        return result;
    }

    addServer(props: Server) {
        const domain = Strategy._resolveShortDomainName(props.url);
        if (this._servers.has(domain)) {
            throw new Error("This Mastodon server has already been added to this strategy.");
        }
        const newServerConfig = {...props};
        try {
            new URL(newServerConfig.url)
        } catch (e) {
            newServerConfig.url = `https://${newServerConfig.url}`
        }
        Object.freeze(newServerConfig);
        this._servers.set(domain, newServerConfig);
    }

    getServer(domain: string): Server {
        const shortDomain = Strategy._resolveShortDomainName(domain);
        const result = this._servers.get(shortDomain);
        if (!result) {
            throw new Error("This Mastodon server has not been configured.");
        }
        return result;
    }

    removeServer(domain: string) {
        const shortDomain = Strategy._resolveShortDomainName(domain);
        this._servers.delete(shortDomain)
    }

    async authenticate(req: express.Request): Promise<void> {
        const domain = req.query.domain;
        if (!domain) {
            return this.fail(new Error("No domain specified."));
        }
        const server = this.getServer(domain as string);
        // Process without code
        if (!req.query.code) {
            const url = new URL("/oauth/authorize", server.url);
            const searchParams = url.searchParams;
            searchParams.set("response_type", "code");
            searchParams.set("client_id", server.client_id);
            searchParams.set("redirect_uri", this.resolveRedirectUrl(req, server.url));
            searchParams.set("scope", this._scopes.join(" "));
            this.redirect(url.toString(), 200);
        } else {
            const tokenInfo = (await axios.post<TokenResponse>("/oauth/token", {
                grant_type: "authorization_code",
                code: req.query.code,
                client_id: server.client_id,
                client_secret: server.client_secret,
                redirect_uri: this.resolveRedirectUrl(req, server.url),
                scope: this._scopes.join(" "),
            }, {baseURL: server.url})).data;
            const credentials = (await axios.get<Profile>("/api/v1/accounts/verify_credentials", {
                headers: {
                    Authorization: `${tokenInfo.token_type} ${tokenInfo.access_token}`
                },
                baseURL: server.url
            })).data;
            this._callback(req, Strategy._resolveShortDomainName(server.url), tokenInfo.access_token, credentials, (err, user, info) => {
                if (err) {
                    this.fail(err);
                } else {
                    this.success(user);
                }
            })
        }
    }

    resolveRedirectUrl(req: express.Request, domain: string): string {
        const url = new URL(this._redirectUri, req.originalUrl);
        url.searchParams.set("state", JSON.stringify({domain: domain}));
        return url.toString();
    }

    constructor({redirectUri, scope, force_login = true}: {
        redirectUri: string,
        scope: string[],
        force_login?: boolean,
    }, callback: Callback) {
        super();
        this._redirectUri = redirectUri;
        this._scopes = [...scope];
        this._force_login = force_login;
        this._callback = callback;
    }
};

export const mastodonStrategy = new Strategy({
    redirectUri: "/api/auth/mastodon/callback",
    scope: ["read", "write", "follow", "push"],
}, async (req, domain, accessToken, profile, callback) => {
    if (!req.isAuthenticated()) {
        return callback(new Error("You must sign in first before you can link your Mastodon account."));
    }
    await Account.findOneAndUpdate({
        provider: "mastodon",
        providerDomain: domain,
        user: req.user._id,
    }, {
        $set: {
            user: req.user._id,
            providerAccountId: profile.id,
            provider: "mastodon",
            providerDomain: domain,
            accessToken: accessToken,
            displayName: profile.display_name,
            userName: profile.username,
        }
    }, {
        upsert: true,
    });
    callback(null, req.user);
});
