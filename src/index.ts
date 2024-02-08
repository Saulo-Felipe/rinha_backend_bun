import Bun from "bun";
import { TransactionsRoute } from "./controllers/transactions";
import { ExtractRoute } from "./controllers/extract";



Bun.serve({
    port: 8081,
    fetch(request: Request) {
        if (request.method === "POST") {
            return TransactionsRoute(request);
        }

        if (request.method === "GET") {
            return ExtractRoute(request);
        }

        return new Response(null, {status: 404});
    }
})
