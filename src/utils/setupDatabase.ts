import { db } from "../app";

export function setupDatabase() {
    db.exec("PRAGMA journal_mode = WAL;")

    db.exec(`
        CREATE TABLE IF NOT EXISTS clients (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            limite INTEGER,
            saldo INTEGER
        );
    `)

    db.exec(`
        CREATE TABLE IF NOT EXISTS transactions (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            valor INTEGER,
            tipo varchar(1),
            descricao varchar(10),
            realizada_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            client_id INTEGER
        );
    `);

    db.exec("DELETE FROM clients");
    db.exec("DELETE FROM transactions");

    db.exec(`
        INSERT INTO clients (id, limite, saldo) VALUES
        (1, 100000, 0),
        (2, 80000, 0),
        (3, 1000000, 0),
        (4, 10000000, 0),
        (5, 500000, 0);
    `);
}