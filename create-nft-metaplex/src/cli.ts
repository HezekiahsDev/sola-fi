#!/usr/bin/env ts-node
import { hideBin } from "yargs/helpers";
import yargs, { CommandModule } from "yargs";
import { mintNft } from "./services/nft";
import { batchMintNfts } from "./services/batch";
import { createMetaplex } from "./utils/metaplex";

type MintArgs = {
  name: string;
  symbol: string;
  fee: number;
  uri?: string;
  maxSupply?: number;
  mutable: boolean;
};

async function handleMint(argv: MintArgs) {
  const metaplex = createMetaplex();
  const { name, symbol, fee, uri, maxSupply, mutable } = argv;

  const { nft, signature } = await mintNft(
    {
      name,
      symbol,
      sellerFeeBasisPoints: fee,
      uri: uri as string | undefined,
      maxSupply: maxSupply as number | undefined,
      isMutable: mutable,
    },
    metaplex
  );

  console.log("NFT minted successfully");
  console.log("Mint address:", nft.address.toBase58());
  console.log("Metadata address:", nft.metadataAddress.toBase58());
  console.log("Transaction signature:", signature);
}

export function runCli(argv = hideBin(process.argv)) {
  const mintCommand: CommandModule<{}, MintArgs> = {
    command: "mint",
    describe: "Mint a new NFT using the configured signer",
    builder: (builder) =>
      builder
        .option("name", {
          type: "string",
          demandOption: true,
          describe: "On-chain name for the NFT",
        })
        .option("symbol", {
          type: "string",
          describe: "Symbol for the NFT",
          default: "",
        })
        .option("fee", {
          type: "number",
          describe: "Royalty fee in basis points (0-10000)",
          default: 0,
        })
        .option("uri", {
          type: "string",
          describe:
            "Override the metadata URI (defaults to PINATA_METADATA_URI)",
        })
        .option("maxSupply", {
          type: "number",
          describe: "Optional maximum number of editions",
        })
        .option("mutable", {
          type: "boolean",
          describe: "Whether the NFT metadata should remain mutable",
          default: true,
        }),
    handler: (args) => {
      handleMint(args).catch((error) => {
        console.error("Failed to mint NFT:", error);
        process.exitCode = 1;
      });
    },
  };

  const batchMintCommand: CommandModule<{}, {}> = {
    command: "batch-mint",
    describe: "Mint all NFTs specified in metadata.json",
    handler: () => {
      console.log("Starting batch mint process...");
      batchMintNfts().catch((error) => {
        console.error("Batch minting failed:", error);
        process.exitCode = 1;
      });
    },
  };

  return yargs(argv)
    .scriptName("nft-toolkit")
    .command(mintCommand)
    .command(batchMintCommand)
    .demandCommand(1, "Specify a command to run")
    .strict()
    .help()
    .parseAsync();
}

if (require.main === module) {
  runCli();
}
