import { Transaction, TransactionRequestBody } from "../../types/Global";
import { pgClient } from "../config/database";
import { getClientById } from "../utils/getClientById";
import { getIdFromRequest } from "../utils/getIdFromRequest";

export async function ExtractRoute(request: Request): Promise<Response> {
    const clientId = getIdFromRequest(request.url);
    const client = await getClientById(clientId);

    if (typeof client === "undefined") {
        return new Response(null, {status: 404});
    }

    const transactions = (await pgClient.query(`SELECT valor, tipo, descricao, realizada_em FROM transactions
        WHERE client_id = ${client.id}
        ORDER BY id DESC LIMIT 10
    `)).rows as Transaction[];

    return new Response(JSON.stringify({
        saldo: {
            total: client.saldo,
            data_extrato: new Date().toISOString(),
            limite: client.limite
        },
        ultimas_transacoes: transactions
    }));
}