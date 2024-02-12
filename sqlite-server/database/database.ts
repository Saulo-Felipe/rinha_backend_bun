import { Database } from "bun:sqlite";

Bun.spawn(["rm", "-rf", "/home/saulof/rinha_backend_bun/sqlite-server/database/db*"]);

export const db = new Database(
    process.env["DB_PATHNAME"] || "/home/saulof/rinha_backend_bun/sqlite-server/database/db.sqlite", 
    { create: true }
);

db.exec("PRAGMA journal_mode = WAL;");
db.exec("pragma synchronous = off;")
db.exec('PRAGMA cache_size = 12000;');
db.exec('PRAGMA count_changes = FALSE;');
db.exec("pragma temp_store = memory;")
db.exec('PRAGMA busy_timeout = 30000;');
db.exec('PRAGMA temp_store = MEMORY;');
db.exec("PRAGMA default_cache_size = 15000;")
db.exec('PRAGMA ignore_check_constraints = TRUE;');



db.exec(`DROP TABLE IF EXISTS clients;`);
db.exec(`
    CREATE TABLE clients (
        id INTEGER PRIMARY KEY,
        saldo INTEGER NOT NULL,
        limite INTEGER NOT NULL
    );
`);

db.exec(`DROP TABLE IF EXISTS transactions;`);
db.exec(`
    CREATE TABLE transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        valor INTEGER NOT NULL,
        tipo VARCHAR(1) NOT NULL,
        descricao VARCHAR(50) NOT NULL,
        realizada_em DATETIME DEFAULT (CURRENT_TIMESTAMP),
        client_id INTEGER NOT NULL
    );
`);

db.exec(`
    INSERT INTO clients (id, limite, saldo) VALUES
    (1, 100000, 0),
    (2, 80000, 0),
    (3, 1000000, 0),
    (4, 10000000, 0),
    (5, 500000, 0)
`);

console.warn("Database has been started.");