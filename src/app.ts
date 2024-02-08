import { Elysia } from "elysia";
import { Database } from "bun:sqlite";
import { TransactionRoute } from "./controllers/transactions";
import { ExtractRoute } from "./controllers/extract";
import { setupDatabase } from "./utils/setupDatabase";

export const db = new Database("./db/db.sqlite");
setupDatabase();

const PORT = process.env["PORT"] || 8081;

new Elysia()
    .post("/clientes/:id/transacoes", TransactionRoute)
    .get("/clientes/:id/extrato", ExtractRoute)
    .get("/all-transactions", () => {
        return db.query("select * from transactions").all();
    })
    .get("/all-clients", () => {
        return db.query("select * from clients").all();
    })
    .listen(PORT, () => console.log(`server is running at ${PORT}`));