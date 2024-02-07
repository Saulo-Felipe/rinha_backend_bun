import { ExtractRouteRequest, ExtractRouteResponse } from "./types/Global";
import { getClientById } from "./utils/getClientById";

export function ExtractRoute({ params, set }: ExtractRouteRequest): ExtractRouteResponse {
    const client = getClientById(params.id)

    return null;
}