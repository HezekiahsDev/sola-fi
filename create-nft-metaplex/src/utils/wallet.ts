import { readFileSync } from "fs";
import { Keypair } from "@solana/web3.js";
import { getConfig } from "../config";

export function loadKeypair(): Keypair {
  const { keypairPath } = getConfig();

  try {
    const secretKeyString = readFileSync(keypairPath, "utf8");
    const secretKey = Uint8Array.from(JSON.parse(secretKeyString));
    return Keypair.fromSecretKey(secretKey);
  } catch (error) {
    throw new Error(
      `Unable to read keypair from ${keypairPath}: ${(error as Error).message}`
    );
  }
}
