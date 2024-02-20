import type { Client, GetExtractReturn, Transaction } from "../Types";
import { clientQuery, latestTransactionsQuery } from "../database";

export function GETExtract(clientId: number): GetExtractReturn {
    const client = clientQuery.get({$id: clientId}) as Client;

    const latestTransactions = latestTransactionsQuery.all({ $id: client.id }) as Transaction[];

    return {
        status: 200,
        body: {
            saldo: {
                total: client.saldo,
                data_extrato: new Date().toISOString(),
                limite: client.limite
            },
            ultimas_transacoes: latestTransactions
        }
    }
}