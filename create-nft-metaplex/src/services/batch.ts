import { promises as fs } from "fs";
import path from "path";
import { Metaplex } from "@metaplex-foundation/js";
import { mintNft, MintNftInput } from "./nft";
import { createMetaplex } from "../utils/metaplex";

interface BatchMetadata {
  name: string;
  uri: string;
  symbol?: string;
  sellerFeeBasisPoints?: number;
}

// Helper to introduce a delay to avoid RPC rate-limiting
const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function batchMintNfts(metaplexInstance?: Metaplex) {
  const metaplex = metaplexInstance ?? createMetaplex();
  const filePath = path.join(process.cwd(), "metadata.json");

  let fileContent;
  try {
    fileContent = await fs.readFile(filePath, "utf-8");
  } catch (error) {
    throw new Error(
      `Could not read metadata file at ${filePath}. Make sure the file exists in the project root.`
    );
  }

  const nftsToMint: BatchMetadata[] = JSON.parse(fileContent);
  const mintResults: {
    name: string;
    mintAddress: string;
    signature: string;
  }[] = [];

  console.log(`Found ${nftsToMint.length} NFTs to mint from metadata.json.`);

  for (const [index, nftMeta] of nftsToMint.entries()) {
    console.log(
      `\n[${index + 1}/${nftsToMint.length}] Minting: ${nftMeta.name}`
    );

    try {
      const mintInput: MintNftInput = {
        name: nftMeta.name,
        uri: nftMeta.uri,
        symbol: nftMeta.symbol,
        sellerFeeBasisPoints: nftMeta.sellerFeeBasisPoints,
      };

      const { nft, signature } = await mintNft(mintInput, metaplex);

      const mintAddress = nft.address.toBase58();
      mintResults.push({ name: nftMeta.name, mintAddress, signature });

      console.log(`  ✅ Success!`);
      console.log(`     Mint Address: ${mintAddress}`);
      console.log(
        `     Transaction: https://explorer.solana.com/tx/${signature}?cluster=devnet`
      );

      // Add a small delay between mints to be kind to the RPC endpoint
      if (index < nftsToMint.length - 1) {
        await sleep(1000); // 1-second delay
      }
    } catch (error) {
      console.error(
        `  ❌ Failed to mint ${nftMeta.name}:`,
        (error as Error).message
      );
    }
  }

  if (mintResults.length > 0) {
    const outputFilePath = path.join(process.cwd(), "mint-outputs.json");
    await fs.writeFile(outputFilePath, JSON.stringify(mintResults, null, 2));
    console.log(
      `\n✨ Batch minting complete. All successful mint addresses have been saved to mint-outputs.json`
    );
  } else {
    console.log(
      `\nBatch minting finished, but no NFTs were successfully minted.`
    );
  }
}
