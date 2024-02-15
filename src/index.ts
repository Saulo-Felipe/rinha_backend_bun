import Bun from "bun";
import { GETExtract } from "./routes/get-extract";
import { GetIdFromPathname, GetTransactionFromRequest } from "./utils";
import { POSTTtransaction } from "./routes/post-transaction";

Bun.serve({
    port: 3000,
    async fetch(request: Request) {
        const { pathname } = new URL(request.url);

        if (pathname.includes("cliente")) {
            const clientId = GetIdFromPathname(pathname);

            const { body, status } = request.method === "GET"
                ? await GETExtract(clientId)
                : await POSTTtransaction(clientId, await GetTransactionFromRequest(request))

            return new Response(JSON.stringify(body), { status })
        }

        return new Response(null, {status: 404});
    }
});
