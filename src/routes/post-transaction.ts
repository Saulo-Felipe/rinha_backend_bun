import type { Client, PostTransactionReturn, TransactionBody } from "../Types";
import { clientQuery, saveTransactionQuery, updateClientSaldoQuery } from "../database";

const utilTypeData = { "c": 1, "d": -1 };

export function POSTTtransaction(clientId: number, body: TransactionBody): PostTransactionReturn {
    if (
        (body.tipo !== "c" && body.tipo !== "d") ||
        (!body.descricao) ||
        (body.descricao.length > 10) ||
        (!Number.isInteger(body.valor))
    ) {
        return { body: null, status: 422 };
    }

    const client = clientQuery.get({ $id: clientId }) as Client;

    client.saldo += Number(body.valor*utilTypeData[body.tipo]);

    if (body.tipo === "d" && client.saldo*-1 > client.limite) {
        return { body: null, status: 422 };
    }

    (async () => {
        saveTransactionQuery.run({
            $descricao: body.descricao,
            $tipo: body.tipo,
            $valor: body.valor,
            $client_id: client.id
        });

        updateClientSaldoQuery.run({
            $saldo: client.saldo,
            $id: client.id
        });
    })();

    return {
        status: 200,
        body: {
            limite: client.limite,
            saldo: client.saldo
        }
    }
}