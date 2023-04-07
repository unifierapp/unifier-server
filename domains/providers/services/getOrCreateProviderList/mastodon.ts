import express from "express";
import axios from "axios";
import {urlOrDomainToUrl} from "@/utils/urlHelpers";
import {NotFoundError} from "@/utils/errors";

export interface ListResponse {
    id: string,
    title: string,
    replies_policy: string,
}

export default async function createMastodonList(accessToken: string, domain?: string) {
    if (!domain) {
        throw new NotFoundError("You must specify a domain.")
    }
    const response = await axios.post<ListResponse>("/api/v1/lists", {
        title: "Converge API Connections"
    }, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        baseURL: urlOrDomainToUrl(domain),
    })
    return response.data.id;
}