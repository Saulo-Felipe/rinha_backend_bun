export interface ExtractRouteResponse {
    saldo: {
        total: number;
        data_extrato: string;
        limite: number
    };
    ultimas_transacoes: {
        valor: number;
        tipo: "c" | "d";
        descricao: string;
        realizada_em: string;
    }[];
}

export interface TransactionRequestBody {
    valor: number;
    tipo: string;
    descricao: string;
}

export interface Client {
    id: number;
    limite: number;
    saldo: number;
}

export interface Transaction {
    id: number;
    valor: number;
    tipo: "c" | "d";
    descricao: string;
    realizada_em: string;
    client_id: number;
}

export interface Extract {
    id: number;
    limite: number;
    saldo: number;
}
