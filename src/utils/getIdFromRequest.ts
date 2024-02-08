export function getIdFromRequest(requestUrl: string) {
    const urlPathname = new URL(requestUrl).pathname;

    return Number(urlPathname.split("/")[2]);
}