import { pgClient } from "../config/database";
import type { Client } from "../../types/Global";

export async function getClientById(clientId: number): Promise<Client> {
    const client = await pgClient.query(`SELECT * FROM clients WHERE id = ${clientId}`);

    return client.rows[0] as Client;
}