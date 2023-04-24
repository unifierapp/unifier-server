export function urlOrDomainToDomain(urlOrDomain: string) {
    try {
        return new URL(urlOrDomain).hostname;
    } catch (e) {
        return urlOrDomain;
    }
}