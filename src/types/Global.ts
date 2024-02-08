// ------------------------------| transactions types
export interface TransactionRouteRequest {
    body: {
        valor: number;
        tipo : "c" | "d";
        descricao : string;
    },
    params: {
        id: string;
    },
    set: {
        status: number;
    }
}

export interface TransactionRouteResponse {
    limite: number;
    saldo: number;
}
// ------------------------------| transactions types


// ------------------------------| extract types

export interface ExtractRouteRequest {
    params: {
        id: string;
    },
    set: {
        status: number;
    }
}

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

// ------------------------------| extract types


// ------------------------------| entities types

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
