import {HydratedDocument} from "mongoose";
import {IUser} from "@/models/User";
import getMastodonPosts from "@/domains/posts/services/getPosts/mastodon";
import {IConnection} from "@/models/Connection";
import getAccount from "@/domains/auth/services/getAccount";
import resolveProviderAccounts, {ProviderAccountQuery} from "@/domains/providers/services/resolveAccountToConnection";

export interface PaginationQuery {
    min_id?: string,
    max_id?: string,
    since_id?: string,
    limit?: number,
}

export interface RawPost {
    post_id: string,
    provider: string,
    domain: string,
    url: string,
    created_at: Date,
    account_id: string,
    content: string,
    attachments: Attachment[],
    engagement_stats: {
        likes: number,
        comments: number,
        reposts: number,
    }
}

export interface Post {
    post_id: string,
    provider: string,
    domain: string,
    url: string,
    created_at: Date,
    account_id: string,
    connection: HydratedDocument<IConnection>,
    content: string,
    attachments: Attachment[],
    engagement_stats: {
        likes: number,
        comments: number,
        reposts: number,
    }
}

interface Attachment {
    type: string,
    url: string,
    preview_url: string,
}

export interface PaginationResult {
    success: boolean,
    posts: RawPost[],
    status?: number,
}

export interface TransformedPaginationResult {
    success: boolean,
    posts: Post[],
    status?: number,
}


export interface ProviderConfig {
    provider: string,
    domain?: string,
}

function failPagination(status = 404) {
    return new Promise<PaginationResult>(r => r({
        success: false,
        posts: [],
        status: status,
    }))
}

export default async function getPosts(user: HydratedDocument<IUser>, queries: Map<ProviderConfig, PaginationQuery>): Promise<TransformedPaginationResult[]> {
    const mappings: Record<string, (props: {
        domain?: string, listId: string, authorizationToken: string,
    }, query: PaginationQuery) => Promise<PaginationResult>> = {
        mastodon: getMastodonPosts
    }

    // First step: Query the respective social media lists.
    const promises: Promise<PaginationResult>[] = [];
    queries.forEach((query, config) => {
        const func = mappings[config.provider];

        async function lookup() {
            const account = await getAccount(user, config);
            if (!account || !account.internalListId) {
                return failPagination(401);
            }
            return await func({
                domain: config.domain, authorizationToken: account.accessToken, listId: account.internalListId
            }, query);
        }

        if (!func) {
            promises.push(failPagination());
        } else {
            promises.push(lookup());
        }
    });
    const rawResults: PaginationResult[] = await Promise.all(promises);

    // Find which native social media accounts posted.
    const rawPosts = rawResults.flatMap(result => {
        return result.posts
    });
    const rawAccounts: ProviderAccountQuery[] = rawPosts.map(rawPost => {
        const transformed: ProviderAccountQuery = {
            provider: rawPost.provider,
            providerId: rawPost.account_id,
        };
        if (rawPost.domain) {
            transformed.domain = rawPost.domain;
        }
        return transformed
    });

    // Resolve native social media accounts to accounts tied to connections.
    const providerAccounts = await resolveProviderAccounts(user, rawAccounts);

    // Using a primitive key to associate connection to user.
    const providerAccountMap: Map<string, HydratedDocument<IConnection>> = new Map();
    for (let providerAccount of providerAccounts) {
        providerAccountMap.set(JSON.stringify({
            provider: providerAccount.provider,
            providerId: providerAccount.providerId,
            domain: providerAccount.domain,
        }), providerAccount.connection);
    }

    // Now associate each post back to the user.
    const results: TransformedPaginationResult[] = [];
    for (let rawResult of rawResults) {
        const transformedPosts: Post[] = [];
        for (let rawPost of rawResult.posts) {
            const accountKey = JSON.stringify({
                provider: rawPost.provider,
                providerId: rawPost.account_id,
                domain: rawPost.domain,
            });
            const connection = providerAccountMap.get(accountKey);
            if (connection) {
                const transformedPost: Post = {...rawPost, connection};
                transformedPosts.push(transformedPost);
            }
        }
        results.push({...rawResult, posts: transformedPosts});
    }
    return results;
}