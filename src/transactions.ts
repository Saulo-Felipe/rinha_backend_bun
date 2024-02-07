import { db } from "../app";
import { TransactionRouteRequest, TransactionRouteResponse } from "./types/Global";
import { getClientById } from "./utils/getClientById";

const utilTypeData = {
    "c": 1,
    "d": -1
}

export function TransactionRoute({ body, params, set }: TransactionRouteRequest): TransactionRouteResponse | null {
    const client = getClientById(params.id);

    if (client == null) {
        set.status = 404;
        return null;
    }

    // client saldo after transaction
    client.saldo += body.valor*utilTypeData[body.tipo];

    if (body.tipo === "d" && client.saldo*-1 > client.limite) {
        set.status = 422;
        return null;
    }

    // save transaction
    db.query(`
        INSERT INTO transactions (valor, tipo, descricao, client_id)
        VALUES (${body.valor}, '${body.tipo}', '${body.descricao}', ${client.id})
    `).get();

    // update client saldo
    db.query(`UPDATE clients SET saldo = ${client.saldo}`).get();

    return {
        limite: client.limite,
        saldo: client.saldo
    };
}