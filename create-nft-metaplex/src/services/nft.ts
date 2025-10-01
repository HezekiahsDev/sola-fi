import {
  Metaplex,
  Nft,
  NftWithToken,
  toBigNumber,
} from "@metaplex-foundation/js";
import { getConfig } from "../config";
import { createMetaplex } from "../utils/metaplex";

export interface MintNftInput {
  name: string;
  symbol?: string;
  sellerFeeBasisPoints?: number;
  uri?: string;
  maxSupply?: number;
  isMutable?: boolean;
}

export interface MintNftOutput {
  nft: Nft | NftWithToken;
  signature: string;
}

export async function mintNft(
  input: MintNftInput,
  metaplexInstance?: Metaplex
): Promise<MintNftOutput> {
  const metaplex = metaplexInstance ?? createMetaplex();
  const { pinataMetadataUri } = getConfig();

  const {
    name,
    symbol,
    sellerFeeBasisPoints,
    uri: providedUri,
    maxSupply,
    isMutable = true,
  } = input;

  const uri = providedUri ?? pinataMetadataUri;
  if (!uri) {
    throw new Error(
      "No metadata URI found. Please provide it in the mint input or set PINATA_METADATA_URI in your .env file."
    );
  }
  const maxSupplyOption =
    maxSupply !== undefined ? toBigNumber(maxSupply) : toBigNumber(0);

  if (
    sellerFeeBasisPoints !== undefined &&
    (sellerFeeBasisPoints < 0 || sellerFeeBasisPoints > 10000)
  ) {
    throw new Error("sellerFeeBasisPoints must be between 0 and 10000.");
  }

  const { nft, response } = await metaplex.nfts().create({
    uri,
    name,
    symbol,
    sellerFeeBasisPoints: sellerFeeBasisPoints ?? 0,
    maxSupply: maxSupplyOption,
    isMutable,
  });

  return { nft, signature: response.signature };
}
