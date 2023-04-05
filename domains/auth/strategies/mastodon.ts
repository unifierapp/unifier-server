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

export interface Client {
    url: string;
    client_id: string;
    client_secret: string;
    redirect_url: string;
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
    private _clients: Map<string, Client> = new Map();
    private _scopes: string[];
    private _force_login: boolean;
    private readonly _callback: Callback;

    name = "mastodon"

    // Supports http://mastodon.social, https://mastodon.social or mastodon.social
    static resolveShortDomainName(domain: string) {
        let result;
        try {
            result = new URL(domain).hostname
        } catch {
            result = domain
        }
        return result;
    }

    static getUrlFromDomain(url: string) {
        try {
            return new URL(url).toString()
        } catch (e) {
            return `https://${url}`
        }
    }

    addClient(props: Client): Client {
        const domain = Strategy.resolveShortDomainName(props.url);
        if (this._clients.has(domain)) {
            throw new Error("This Mastodon server has already been added to this strategy.");
        }
        const newClientConfig = {...props};
        newClientConfig.url = Strategy.getUrlFromDomain(newClientConfig.url);
        Object.freeze(newClientConfig);
        this._clients.set(domain, newClientConfig);
        return newClientConfig;
    }

    getClient(domain: string): Client {
        const shortDomain = Strategy.resolveShortDomainName(domain);
        const result = this._clients.get(shortDomain);
        if (!result) {
            throw new Error("This Mastodon server has not been configured.");
        }
        return result;
    }

    removeClient(domain: string) {
        const shortDomain = Strategy.resolveShortDomainName(domain);
        this._clients.delete(shortDomain)
    }

    async authenticate(req: express.Request): Promise<void> {
        try {
            const domain = req.query.domain;
            if (!domain) {
                return this.fail(new Error("No domain specified."));
            }
            const client = this.getClient(domain as string);

            // Process without code
            if (!req.query.code) {
                const url = new URL("/oauth/authorize", client.url);
                const searchParams = url.searchParams;
                searchParams.set("response_type", "code");
                searchParams.set("client_id", client.client_id);
                searchParams.set("redirect_uri", client.redirect_url);
                searchParams.set("scope", this._scopes.join(" "));
                searchParams.set("force_login", JSON.stringify(this._force_login));
                this.redirect(url.toString());
            } else {
                const tokenInfo = (await axios.post<TokenResponse>("/oauth/token", {
                    grant_type: "authorization_code",
                    code: req.query.code,
                    client_id: client.client_id,
                    client_secret: client.client_secret,
                    redirect_uri: client.redirect_url,
                    scope: this._scopes.join(" "),
                }, {baseURL: client.url})).data;
                const credentials = (await axios.get<Profile>("/api/v1/accounts/verify_credentials", {
                    headers: {
                        Authorization: `${tokenInfo.token_type} ${tokenInfo.access_token}`
                    },
                    baseURL: client.url
                })).data;
                this._callback(req, Strategy.resolveShortDomainName(client.url), tokenInfo.access_token, credentials, (err, user, info) => {
                    if (err) {
                        this.fail(err);
                    } else if (!user) {
                        this.fail(new Error("No user was signed in."))
                    } else {
                        this.success(user);
                    }
                })
            }
        } catch (e) {
            if (e instanceof Error) {
                this.fail(e)
            } else {
                this.fail(new Error("A strange error happened."))
            }
        }
    }

    constructor({scope, force_login = true}: {
        scope: string[],
        force_login?: boolean,
    }, callback: Callback) {
        super();
        this._scopes = [...scope];
        this._force_login = force_login;
        this._callback = callback;
    }
};

export const mastodonStrategy = new Strategy({
    scope: ["read", "write", "follow", "push"],
    force_login: true
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
