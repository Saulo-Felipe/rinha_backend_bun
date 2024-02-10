import { Elysia } from "elysia";
import { db } from "./database/init-database";
import type { Client, ExtractRouteResponse, Transaction, TransactionBody } from "./types/Global";
import { clientTransaction, latestTransactionsTransaction, saveTransactionQueryTransaction, updateClientSaldoTransaction } from "./utils/PrepareQuery";


const app = new Elysia();

const utilTypeData = {
  "c": 1,
  "d": -1
}

app.get("/clientes/:id/extrato", ({ params, set }): ExtractRouteResponse | null => {
  try {
    const client = clientTransaction({ id: Number(params.id) }) as Client;

    if (client == null) {
      set.status = 404;
      return null;
    }

    const latestTransactions = latestTransactionsTransaction({ id: client.id }) as Transaction[];

    set.status = 200;
    return {
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
    }

  } catch(err) {
    console.log("=-=-=-==| extrato ERROR |=-=-=-=- \n", err);
    set.status = 422;
    return null;
  }
});

  // transactions
app.post("/clientes/:id/transacoes", ({ params, body, set }) => {
  try {
    const client = clientTransaction({ id: Number(params.id) }) as Client;

    if (client == null) {
      set.status = 404;
      return null;
    }

    // validate Nan
    const bodyData = body as TransactionBody;

    // client saldo after transaction
    client.saldo += parseInt(bodyData.valor*utilTypeData[bodyData.tipo] as unknown as string);

    if (bodyData.tipo === "d" && client.saldo*-1 > client.limite) {
      set.status = 422;
      return null;
    }

    // save transaction
    saveTransactionQueryTransaction({
      valor: bodyData.valor,
      tipo: bodyData.tipo,
      descricao: bodyData.descricao,
      client_id: client.id
    })

    // update client saldo
    updateClientSaldoTransaction({ saldo: client.saldo });

    set.status = 200;
    return {
      limite: client.limite,
      saldo: client.saldo
    };
  } catch(err) {
    console.log("=-=-=-==| extrato ERROR |=-=-=-=- \n", err);
    set.status = 422;
    return null;
  }
});

app.get("/all-transactions", () => {
  return latestTransactionsTransaction({ id: 1 });
})

app.get("/all-clients", () => {
  return db.prepare("select * from clients").all();
})

app.listen(3000);

console.log(`Server is running at {app.server?.hostname}:{app.server?.port}`);
