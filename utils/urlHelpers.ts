import {z} from "zod";

export function urlOrDomainToDomain(urlOrDomain: string) {
    try {
        return new URL(urlOrDomain).hostname;
    } catch (e) {
        return urlOrDomain;
    }
}

export function getUrl(url: unknown) {
    return new URL(decodeURIComponent(z.string().nonempty().parse(url))).toString();
}

export function getFrontendUrl(path: string) {
    return new URL(path, process.env.FRONTEND_URL).toString();
}