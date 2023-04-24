import express from "express";
import {AxiosError} from "axios";
import {NotFoundError, UnauthorizedError} from "@/utils/errors";
import addProfileToMastodonList from "@/domains/providers/services/addProfileToProviderList/mastodon";

export default async function addProfileToProviderList(user: Express.User, config: {
    provider: string,
    endpoint?: string,
}, accountIds: string[]) {
    const mappings: Record<string, (user: Express.User, params: { endpoint?: string, accountIds: string[] }) => void> = {
        mastodon: addProfileToMastodonList,
    }
    const func = mappings[config.provider];
    if (!func) {
        throw new NotFoundError("There is no service.");
    }
    try {
        await func(user, {
            endpoint: config.endpoint, accountIds,
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
