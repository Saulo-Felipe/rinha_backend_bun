import { serve } from "bun";
import { clientQuery, latestTransactionsQuery, saveTransactionQuery, updateClientSaldoQuery } from "./database/prepareQuery";

type WSRoutes = "get-client" | "get-latest-transactions" | "save-transaction-and-update-saldo";

interface MessageInfoType {
    transactionId: string;
    route: WSRoutes;
    data: null | number | object;
}

interface SaveAndUpdateBody {
    save: {
        $valor: number;
        $tipo: "c" | "d";
        $descricao: string;
        $client_id: number
    },
    update: {
        $id: number,
        $saldo: number
    }
}

function getMessageInfo(message: string): MessageInfoType {
    const data = message.split("/");

    return {
        transactionId: data[0],
        route: data[1] as WSRoutes,
        data: JSON.parse(data[2])
    }
}

const server = serve({
    port: 3000,
    fetch(request, response) {
        if (response.upgrade(request)) return;
    },
    websocket: {
        // message type: <transactionID/event-name/(data: number | object)>
        async message(ws, message: string) {
            const messageInfo = getMessageInfo(message);

            if (messageInfo.route === "get-client") {
                const client = clientQuery.get({ $id: messageInfo.data as number });

                ws.send(`${messageInfo.transactionId}/${JSON.stringify(client)}`)
            }

            else if (messageInfo.route === "get-latest-transactions") {
                const latestTransactions = latestTransactionsQuery.all({ $id: messageInfo.data as number });

                ws.send(`${messageInfo.transactionId}/${JSON.stringify(latestTransactions)}`)
            }

            else if (messageInfo.route === "save-transaction-and-update-saldo") {
                const data = messageInfo.data as SaveAndUpdateBody;

                // ordem importa
                saveTransactionQuery.run(data.save);
                updateClientSaldoQuery.run(data.update)

                ws.send(`${messageInfo.transactionId}/${JSON.stringify(null)}`)
            }
        }
    }
})

console.log("websocker running at: ", server.port);