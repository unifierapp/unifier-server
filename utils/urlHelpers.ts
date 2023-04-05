import * as domain from "domain";

export function urlOrDomainToUrl(urlOrDomain: string) {
    try {
        return new URL(urlOrDomain).toString();
    } catch (e) {
        return `https://${urlOrDomain}`;
    }
}

export function urlOrDomainToDomain(urlOrDomain: string) {
    try {
        return new URL(urlOrDomain).hostname;
    } catch (e) {
        return urlOrDomain;
    }
}