import { config as loadEnv } from "dotenv";
import path from "path";
import { homedir } from "os";

loadEnv();

export interface AppConfig {
  rpcEndpoint: string;
  keypairPath: string;
  pinataMetadataUri: string;
  auctionHouseAddress?: string;
}

const DEFAULT_RPC = 'https://api.devnet.solana.com';
const DEFAULT_KEYPAIR = path.join(homedir(), ".config", "solana", "id.json");

export function getConfig(): AppConfig {
  const {
    SOLANA_RPC_ENDPOINT,
    SOLANA_KEYPAIR_PATH,
    PINATA_METADATA_URI,
    METAPLEX_AUCTION_HOUSE,
  } = process.env;

  if (!PINATA_METADATA_URI) {
    throw new Error(
      "PINATA_METADATA_URI is required and should point to your Pinata-hosted metadata JSON."
    );
  }

  return {
    rpcEndpoint: SOLANA_RPC_ENDPOINT ?? DEFAULT_RPC,
    keypairPath: SOLANA_KEYPAIR_PATH ?? DEFAULT_KEYPAIR,
    pinataMetadataUri: PINATA_METADATA_URI,
    auctionHouseAddress: METAPLEX_AUCTION_HOUSE,
  } satisfies AppConfig;
}
