import {spawn} from "bun";
import { Elysia } from "elysia";
import Database from "bun:sqlite";
import { p } from "elysia/dist/index-59i0HOI0";

// spawn(["rm", "-rf", "/home/saulof/rinha_backend_bun/src/database/db.sqlite"])

const db = new Database("/home/saulof/rinha_backend_bun/src/database/db.sqlite");
const app = new Elysia();

db.exec(`create table if not exists test (
    id integer,
    name varchar(20)
)`);
// db.exec('BEGIN TRANSACTION;');
db.exec('PRAGMA busy_timeout = 5000;');
db.exec('PRAGMA journal_mode = WAL;');
// db.exec('PRAGMA synchronous = FULL;');
// db.exec('PRAGMA read_uncommitted = true;');
// db.exec('SET ISOLATION TO SERIALIZABLE;');
// db.exec('COMMIT TRANSACTION;');

const insert = db.query(`
    insert into test (id, name) values ($id, 'sauloss');
`);
const select = db.query(`
    select * from test where id = $id;
`);

app.get("/create/:id", (request) => {
    insert.run({ $id: request.params.id });
    console.log("finalizado create: ", request.params.id);
    return;
});

app.get("/select/:id", (request) => {
    select.get({ $id: request.params.id });
    console.log("finalizado select: ", request.params.id);
});

app.listen(8081);
console.log("server is running at 8081");

setTimeout(async () => {
    console.log("iniciando testes...");
    const proc = spawn(["bun", "teste.ts"], )
    const proc2 = spawn(["bun", "teste.ts"], )

    const text = await new Response(proc.stdout).text();
    const text2 = await new Response(proc2.stdout).text();

    console.log("--------------------------- SERVE 1: \n", text);
    console.log("--------------------------- SERVE 2: \n", text2);
}, 5000)
