import { Client } from "pg";

const pgClient = new Client({
    host: "localhost",
    database: "rinhabackend",
    user: "admin",
    password: "123",
    port: 5432,
});

await pgClient.connect();

export { pgClient };