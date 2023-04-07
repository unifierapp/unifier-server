import express from "express";
import {AxiosError} from "axios";
import {NotFoundError, UnauthorizedError} from "@/utils/errors";
import addProfileToMastodonList from "@/domains/providers/services/addProfileToProviderAccountList/mastodon";

export default async function addProfileToProviderAccountList(user: Express.User, config: {
    provider: string,
    domain?: string,
}, accountIds: string[]) {
    try {
        const mappings: Record<string, (user: Express.User, params: { domain?: string, accountIds: string[] }) => void> = {
            mastodon: addProfileToMastodonList,
        }
        const func = mappings[config.provider];
        if (!func) {
            throw new NotFoundError("There is no service.");
        }
        await func(user, {
            domain: config.domain, accountIds,
        });
    } catch (e) {
        if (e instanceof AxiosError) {
            if (e.status === 404) {
                throw new NotFoundError("One or more accounts are not found.");
            } else if (e.status === 401) {
                throw new UnauthorizedError("The user has logged out. Cannot proceed.");
            }
            throw e;
        }
        throw e;
    }
}