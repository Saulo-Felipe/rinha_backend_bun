import type { Transaction } from "../Types";
import { unlink, open } from "node:fs/promises";
    
export function GetIdFromPathname(pathname: string): number {
    return Number(pathname.split("/")[2]);
}

export async function GetTransactionFromRequest(request: Request): Promise<Transaction> {
    return JSON.parse(await request.text());
}
