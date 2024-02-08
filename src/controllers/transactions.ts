import { TransactionRequestBody } from "../../types/Global";
import { getClientById } from "../utils/getClientById";
import { getIdFromRequest } from "../utils/getIdFromRequest";
import { pgClient } from "../config/database";

const utilTypeData = {
    "c": 1,
    "d": -1
}

export async function TransactionsRoute(request: Request): Promise<Response> {
    const clientId = getIdFromRequest(request.url);
    const client = await getClientById(clientId);
    const body = await request.json() as TransactionRequestBody;

    if (typeof client === "undefined") {
        return new Response(null, {status: 404});
    }

    client.saldo += body.valor*utilTypeData[body.tipo];

    if (body.tipo === "d" && client.saldo*-1 > client.limite) {
        return new Response(null, { status: 422 });
    }

    // save transaction
    await pgClient.query(`
        INSERT INTO transactions (valor, tipo, descricao, realizada_em, client_id)
        VALUES (
            ${body.valor}, 
            '${body.tipo}', 
            '${body.descricao}', 
            '${new Date().toISOString()}', 
            ${client.id}
        );
    `);

    // update client saldo
    await pgClient.query(`UPDATE clients SET saldo = ${client.saldo} WHERE id = ${Number(client.id)};`);

    return new Response(JSON.stringify({
        limite: client.limite,
        saldo: client.saldo
    }));
}