import { db } from "./database";

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
