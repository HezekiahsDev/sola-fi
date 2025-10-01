# Solana NFT Toolkit

This project provides a modular TypeScript toolkit for minting Solana NFTs using metadata hosted on Pinata (or any IPFS gateway).

## Features

- Loads signer keypairs and network configuration from environment variables.
- Mints NFTs through the Metaplex SDK while reusing existing off-chain metadata.
- Offers a ready-to-use CLI with a `mint` subcommand.
- Exposes reusable modules for composing custom workflows.

## Project Structure

```
src/
  cli.ts                 # Command-line interface for minting
  config.ts              # Environment-aware configuration loader
  index.ts               # Barrel file exporting all utilities
  services/
    nft.ts               # NFT minting service
  utils/
    connection.ts        # Solana RPC connection helper
    metaplex.ts          # Metaplex client factory
    wallet.ts            # Signer keypair loader
```

## Prerequisites

- Node.js 18+
- A Solana keypair JSON file with enough SOL to cover transaction fees
- An IPFS metadata URI (e.g., from Pinata) that follows the Metaplex JSON schema

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the example environment file and update the values as needed:

```bash
cp .env.example .env
```

| Variable              | Description                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `SOLANA_RPC_ENDPOINT` | RPC endpoint (defaults to `https://api.mainnet-beta.solana.com`). Use `https://api.devnet.solana.com` for testing. |
| `SOLANA_KEYPAIR_PATH` | Absolute path to the payer keypair JSON (defaults to `~/.config/solana/id.json`).                                  |
| `PINATA_METADATA_URI` | Metadata URI pointing to your Pinata/IPFS JSON.                                                                    |

3. (Optional) Audit dependencies:

```bash
npm audit fix
```

## CLI Usage

Run commands with the provided npm scripts or directly through `ts-node`.

### Mint an NFT

```bash
npm run mint -- \
  --name "My Collection #1" \
  --symbol "MYCOLL" \
  --fee 500 \
  --uri https://gateway.pinata.cloud/ipfs/<CID>/metadata.json
```

Arguments:

- `--name` _(required)_: On-chain NFT name.
- `--symbol`: Symbol stored on-chain (defaults to empty string).
- `--fee`: Royalty fee in basis points (e.g., `500` → 5%). Defaults to 0.
- `--uri`: Override metadata URI. Omitting it falls back to `PINATA_METADATA_URI`.
- `--maxSupply`: Maximum number of editions (defaults to 0 = unique master edition).
- `--mutable`: Set to `false` to make metadata immutable after mint.

On success, the CLI prints the mint address, metadata address, and transaction signature.

## Programmatic Usage

The toolkit exports reusable functions for advanced scripting:

```typescript
import { mintNft } from "./dist";

// Minting
const { nft } = await mintNft({
  name: "Exclusive Artwork",
  symbol: "ART",
  sellerFeeBasisPoints: 750,
});
```

Build the project before importing from `dist`:

```bash
npm run build
```

## On-chain Sell Program

The repository now ships with a lightweight Solana program written in Rust (see `programs/sell-nft.rs`) that escrows a single NFT inside a PDA-owned token account and sells it for a fixed price in lamports.

### Dependencies

The accompanying `programs/Cargo.toml` pins the latest stable crates at the time of writing:

- `solana-program = "1.18.14"`
- `spl-token = "4.0.0"` with the `no-entrypoint` feature
- `spl-associated-token-account = "3.0.2"` with the `no-entrypoint` feature
- `thiserror = "1.0"` for ergonomic error definitions

Update these versions if the Solana Playground toolchain requires newer releases.

### Deploying with Solana Playground

1. Open [Solana Playground](https://beta.solpg.io/) and create a new program project.
2. Replace the generated `Cargo.toml` and `src/lib.rs` with the contents of `programs/Cargo.toml` and `programs/sell-nft.rs` respectively.
3. Build and deploy from the Playground UI; no Anchor tooling is required because the program uses the raw `solana-program` crate.

### Instruction Overview

| Tag | Instruction      | Expected Accounts (ordered)                                                                                                                                 |
| --- | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0   | `CreateListing`  | Seller (signer), listing PDA account, NFT mint, seller NFT token account, escrow NFT token account (ATA owned by the listing PDA), token program, system program, rent sysvar |
| 1   | `Purchase`       | Buyer (signer), listing PDA account, seller, NFT mint, escrow NFT token account, buyer NFT token account, token program                                      |
| 2   | `Cancel`         | Seller (signer), listing PDA account, NFT mint, escrow NFT token account, seller NFT token account, token program                                           |

Implementation details:

- The listing account is derived with seeds `[b"listing", seller_pubkey, mint_pubkey]` and stores the seller, mint, and sale price.
- The escrow token account **must** already exist as the associated token account for the listing PDA and should be empty before calling `CreateListing`.
- During `CreateListing`, the program transfers one token (the NFT) from the seller to the escrow account and records the price.
- `Purchase` debits lamports from the buyer, releases the NFT to the buyer’s associated token account, and closes the escrow account, returning its rent to the seller.
- `Cancel` lets the seller reclaim the NFT from escrow before a sale happens.

### Client-side Notes

- Ensure the seller funds the listing PDA account with at least the rent-exempt minimum when creating the PDA via `system_instruction::create_account`.
- The buyer must supply (and sign for) enough lamports to cover the full price when executing the purchase.
- After a sale or cancellation the listing account remains rent-funded but is marked as uninitialized; you can reuse it for future listings or close it manually off-chain by reclaiming rent.

## Assumptions & Notes

- Transactions are sent with confirmation level `confirmed`; adjust `connection.ts` if higher finality is needed.
- Error handling is centralized in the CLI; extend the service modules for custom retry or logging behavior.
- The repository currently targets the legacy `@metaplex-foundation/js` SDK (`0.20.x`); upgrade paths may require API updates.

## Next Steps

- Add integration tests against Solana devnet using mock keypairs.
- Wire up a simple web dashboard that consumes the services.
- Integrate Bundlr or Shadow Drive upload flows to host metadata directly from the toolkit.
