import { Database } from "bun:sqlite";

export const db = new Database(
    process.env["PRODUCTION"] 
    ? `/app/database/db.sqlite`
    : `${process.cwd()}/database/shared/db.sqlite`,
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
        id INTEGER,
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

export const clientQuery = db.query(`SELECT * FROM clients WHERE id = $id;`);

export const saveTransactionQuery = db.query(`
    INSERT INTO transactions (valor, tipo, descricao, client_id)
    VALUES ($valor, $tipo, $descricao, $client_id);
`);

export const updateClientSaldoQuery = db.query(`UPDATE clients SET saldo = $saldo WHERE id = $id;`);

export const latestTransactionsQuery = db.query(`
    SELECT id, valor, tipo, descricao, realizada_em 
    FROM transactions
    WHERE client_id = $id ORDER BY id DESC LIMIT 10
`);

const clearDbQuery = db.query(`
    DELETE FROM transactions
    WHERE id NOT IN (
        SELECT id
        FROM (
            SELECT id
            FROM transactions
            ORDER BY id DESC
            LIMIT 50
        )
    );
`);

if (process.env["CUSTOM_TRIGGER"]) {
    console.log("DB cleanup started");
    setInterval(() => clearDbQuery.run(), 10000);
}


console.warn("Database has been started.");