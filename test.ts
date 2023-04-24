import axios from "axios";
import {Post} from "@/types/mastodon";
import account from "@/models/Account";

async function main() {

    const rawData = await axios.get<Post[]>(`/api/v1/timelines/home`, {
        params: {
            limit: 10,
        },
        headers: {
            Authorization: `Bearer S8GYaa5Ys4IRBRhOndSIvLI0VZXiDejNdQSyK63sY8I`
        },
        baseURL: "https://mastodon.online",
    }).then(res => res.data);
}

main();