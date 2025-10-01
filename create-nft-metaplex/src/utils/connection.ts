import { Connection, clusterApiUrl } from "@solana/web3.js";
import { getConfig } from "../config";

export function createConnection(): Connection {
  const { rpcEndpoint } = getConfig();
  const endpoint = rpcEndpoint || clusterApiUrl("devnet");
  return new Connection(endpoint, "confirmed");
}
