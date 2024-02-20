import Bun from "bun";
import { GETExtract } from "./routes/get-extract";
import { GetIdFromPathname, GetTransactionFromRequest } from "./utils";
import { POSTTtransaction } from "./routes/post-transaction";

let validationCountLimit = 0;

Bun.serve({
    port: 3000,
    async fetch(request: Request) {
        const { pathname } = new URL(request.url);

        if (pathname.includes("cliente")) {
            if (process.env["IS_SERVER_2"] && validationCountLimit < 123/2) {
                validationCountLimit++;

                const response = await fetch("http://server_01:3000"+pathname, {
                    method: request.method,
                    body: await request.text()
                });

                return new Response(response.body, { status: response.status });
            }

            const clientId = GetIdFromPathname(pathname);

            if (clientId > 5 || clientId < 1 || isNaN(clientId)) return new Response(null, { status: 404 });

            const { body, status } = request.method === "GET"
                ? GETExtract(clientId)
                : POSTTtransaction(clientId, await GetTransactionFromRequest(request))

            return new Response(JSON.stringify(body), { status })
        }

        return new Response(null, {status: 404});
    }
});
