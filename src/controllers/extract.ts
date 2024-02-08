import { db } from "../app";
import type { ExtractRouteRequest, ExtractRouteResponse } from "../types/Global";
import { getClientById } from "../utils/getClientById";
import type { Transaction } from "../types/Global";

export function ExtractRoute({ params, set }: ExtractRouteRequest): ExtractRouteResponse | null {
    const client = getClientById(params.id);
    if (client == null) {
        set.status = 404;
        return null;
    }

    const transactions = db.query(`SELECT valor, tipo, descricao, realizada_em FROM transactions 
        WHERE client_id = ${client.id}
        ORDER BY realizada_em DESC
    `).all() as Transaction[];

    return {
        saldo: {
            total: client.saldo,
            data_extrato: new Date().toISOString(),
            limite: client.limite
        },
        ultimas_transacoes: transactions
    };
}