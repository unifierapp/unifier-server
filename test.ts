import "@/utils/axiosDev"
import axios from "axios";

async function main() {
    const resp = await axios.get("/api/v1/accounts/search", {
        baseURL: "https://mastodon.local"
    })
    console.log(resp.data)
}
