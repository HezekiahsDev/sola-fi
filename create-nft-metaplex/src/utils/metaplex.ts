import { Metaplex, keypairIdentity } from "@metaplex-foundation/js";
import { createConnection } from "./connection";
import { loadKeypair } from "./wallet";

export function createMetaplex(): Metaplex {
  const connection = createConnection();
  const keypair = loadKeypair();

  return Metaplex.make(connection).use(keypairIdentity(keypair));
}
