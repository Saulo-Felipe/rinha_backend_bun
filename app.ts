import { Elysia } from "elysia";
import { Database } from "bun:sqlite";
import { TransactionRoute } from "./src/transactions";
import { ExtractRoute } from "./src/extract";

export const db = new Database("./d.sqlite");

new Elysia()
    .post("/clientes/:id/transacoes", TransactionRoute)
    .get("/clientes/:id/extrato", ExtractRoute)
    .listen(9999, () => console.log("server is running"));