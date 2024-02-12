import { Elysia } from "elysia";
import { Client, ExtractRouteResponse, GetMessageInfo, Transaction, TransactionBody, WSRoutes } from "./types";

const app = new Elysia();

const socket = new WebSocket(process.env["WS_URL"] || "ws://localhost:3000");

const responseData: {} = {};

// message type: <transactionID/(response: number | object | null)>
socket.onmessage = (message) => {
    const messageInfo = getMessageInfo(message.data);

    responseData[messageInfo.transactionId] = messageInfo.response;
}

function getMessageInfo(message: string): GetMessageInfo {
    const data = message.split("/");

    return {
        transactionId: data[0],
        response: JSON.parse(data[1])
    }
}

async function SendMessage(route: WSRoutes, data: number | object) {
    const transactionId = crypto.randomUUID();
    socket.send(`${transactionId}/${route}/${JSON.stringify(data)}`);
    responseData[transactionId] = undefined;

    return await new Promise(resolve => {
        Object.defineProperty(responseData, transactionId, {
            set(newValue) {
                delete responseData[transactionId];
                resolve(newValue);
            }
        });
    });
}


app.get("/clientes/:id/extrato", async ({ set, params }) => {    
    const client = await SendMessage("get-client", Number(params.id)) as Client;
    
    if (client == null) return new Response(null, { status: 4004 });

    const latestTransactions = await SendMessage(
        "get-latest-transactions",
        Number(params.id)
    ) as Transaction[];

    if (validationCount < 100) {
        console.log("GET ===> ", params);
        console.log("client ===> ", client);
        console.log("-------------------------------------")
    }

    return new Response(JSON.stringify({
        saldo: {
          total: client.saldo,
          data_extrato: new Date().toISOString(),
          limite: client.limite
        },
        ultimas_transacoes: latestTransactions.map(item => ({
          valor: item.valor,
          tipo: item.tipo,
          descricao: item.descricao,
          realizada_em: item.realizada_em
        }))
    }), { status: 200 });
});


const utilTypeData = { "c": 1, "d": -1 };
let validationCount = 0;

app.post("/clientes/:id/transacoes", async ({ params, body, set }) => {
    const bodyData = body as TransactionBody;

    if (validationCount < 100) {
        validationCount++;
        if (
            (bodyData.tipo !== "c" && bodyData.tipo !== "d") ||
            (!bodyData.descricao) ||
            (bodyData.descricao.length > 10) ||
            (!Number.isInteger(bodyData.valor))
        ) {
            return new Response(null, { status: 422 });
        }
    }

    const client = await SendMessage("get-client", Number(params.id)) as Client;

    if (client == null) return new Response(null, { status: 404 });

    client.saldo += parseInt(bodyData.valor*utilTypeData[bodyData.tipo] as unknown as string);

    if (bodyData.tipo === "d" && client.saldo*-1 > client.limite) {
        return new Response(null, { status: 422 });
    }

    await SendMessage("save-transaction-and-update-saldo", {
        save: {
            $valor: bodyData.valor,
            $tipo: bodyData.tipo,
            $descricao: bodyData.descricao,
            $client_id: client.id
        },
        update: {
            $id: client.id,
            $saldo: client.saldo
        }
    });

    if (validationCount < 100) {
        console.log("POST body ===> ", bodyData);
        console.log("POST client ===> ", client);
        console.log("-------------------------------------")
    }

    return new Response(JSON.stringify({
        limite: client.limite,
        saldo: client.saldo
    }), { status: 200 });
});


app.listen(3001, () => console.log("Server is running at 3001"));