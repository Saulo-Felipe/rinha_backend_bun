export type WSRoutes = "get-client" | "get-latest-transactions" | "save-transaction-and-update-saldo";

export interface GetMessageInfo {
    transactionId: string;
    response: number | object | null;
}

export interface Client {
    id: number;
    limite: number;
    saldo: number;
}

export interface TransactionBody {
    valor: number;
    tipo: "c" | "d";
    descricao: string;
}


export interface ExtractRouteResponse {
    saldo: {
        total: number;
        data_extrato: string;
        limite: number
    };
    ultimas_transacoes: Transaction[];
}

export interface Transaction {
    valor: number;
    tipo: "c" | "d";
    descricao: string;
    realizada_em: string;
}
