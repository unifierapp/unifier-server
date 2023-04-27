import axios from "axios";
import {z} from "zod";
import {NotFoundError} from "@/utils/errors";

export interface ListResponse {
    id: string,
    title: string,
    replies_policy: string,
}

export default async function createMastodonList(accessToken: string, endpoint?: string) {
    try {
        endpoint = z.string().nonempty().parse(endpoint);
    } catch (e) {
        throw new NotFoundError("You must create a domain - it's somehow missing.");
    }
    const response = await axios.post<ListResponse>("/api/v1/lists", {
        title: "Unifier API Connections"
    }, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
        baseURL: endpoint,
    })
    return response.data.id;
}