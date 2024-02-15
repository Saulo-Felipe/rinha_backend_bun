import type { Client, GetExtractReturn, Transaction } from "../Types";
import { clientQuery, latestTransactionsQuery } from "../database";

export async function GETExtract(clientId: number): Promise<GetExtractReturn> {
    const client = clientQuery.get({$id: clientId}) as Client;

    if (client == null) return {body: null, status: 404};

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