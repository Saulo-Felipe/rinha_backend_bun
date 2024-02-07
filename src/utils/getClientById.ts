import { db } from "../../app"; 
import { Client } from "../types/Global";

export function getClientById(id: string): Client | null {
    const client = db.query(`SELECT * FROM clients WHERE id = ${Number(id)}`).get() as Client;

    return client;
}

