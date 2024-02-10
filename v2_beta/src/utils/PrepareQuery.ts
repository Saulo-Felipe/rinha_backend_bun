import { db } from "../database/init-database";

// =-=-=-==| transactions |=-=-=-=-=
const clientQuery = db.prepare(`SELECT * FROM clients WHERE id = $id;`);
export const clientTransaction = db.transaction((data) => {
    return clientQuery.get({ ...data })
    
});


const saveTransactionQuery = db.prepare(`
    INSERT INTO transactions (valor, tipo, descricao, client_id)
    VALUES ($valor, $tipo, $descricao, $client_id);
`);
export const saveTransactionQueryTransaction = db.transaction((data) => {
    return saveTransactionQuery.run({ ...data })
});


const updateClientSaldoQuery = db.prepare(`UPDATE clients SET saldo = $saldo`);
export const updateClientSaldoTransaction = db.transaction((data) => {
    return updateClientSaldoQuery.run({ ...data })
        
});

// =-=-=-==| extract |=-=-=-=-=

const latestTransactionsQuery = db.prepare(`
    SELECT id, valor, tipo, descricao, realizada_em 
    FROM transactions
    WHERE client_id = $id ORDER BY id DESC LIMIT 10
`);
export const latestTransactionsTransaction = db.transaction((data) => {
    return latestTransactionsQuery.all({ ...data })
});