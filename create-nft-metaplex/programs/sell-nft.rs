//! Sell NFT program (Anchor version)
//!
//! This Anchor program escrows an NFT and lets a buyer purchase it for a fixed
//! amount of lamports. A PDA-backed listing account stores the sale metadata
//! and signs token transfers that move the NFT into and out of escrow.
//!
//! Instruction set:
//! - `create_listing(price)`: initializes the listing PDA, transfers the NFT from
//!   the seller into the escrow token account, and stores the sale price.
//! - `purchase`: moves lamports from the buyer to the seller, releases the NFT to
//!   the buyer, and closes the listing.
//! - `cancel`: lets the seller reclaim the escrowed NFT and close the listing.

#![deny(clippy::all)]
#![deny(missing_docs)]
#![allow(unexpected_cfgs)]

use anchor_lang::prelude::*;
use anchor_spl::token::{self, CloseAccount, Mint, Token, TokenAccount};

declare_id!("Fg6PaFpoGXkYsidMpWxTWqkHF1Ei3V9MeK3fU7LGeXJ");

/// Seed prefix used to derive the PDA that backs each listing account.
const LISTING_SEED: &[u8] = b"listing";
/// Number of tokens that must be escrowed for each listing (assumes an NFT).
const NFT_AMOUNT: u64 = 1;

#[program]
pub mod sell_nft {
    use super::*;

    /// Creates a listing and escrows the seller's NFT.
    pub fn create_listing(ctx: Context<CreateListing>, price: u64) -> Result<()> {
        require!(price > 0, SellNftError::InvalidPrice);

        let listing = &mut ctx.accounts.listing;
        require!(
            !listing.is_initialized,
            SellNftError::ListingAlreadyInitialized
        );

        require!(
            ctx.accounts.seller_nft_account.amount >= NFT_AMOUNT,
            SellNftError::InsufficientTokenBalance
        );

    let seller_key = ctx.accounts.seller.key();
    let mint_key = ctx.accounts.mint.key();
    let listing_key = listing.key();
        let (expected_listing, bump) = Pubkey::find_program_address(
            &[LISTING_SEED, seller_key.as_ref(), mint_key.as_ref()],
            ctx.program_id,
        );
        require_keys_eq!(expected_listing, listing_key, SellNftError::ListingAddressMismatch);

        listing.is_initialized = true;
        listing.seller = seller_key;
        listing.mint = mint_key;
        listing.price = price;
        listing.bump = bump;

        let transfer_accounts = token::Transfer {
            from: ctx.accounts.seller_nft_account.to_account_info(),
            to: ctx.accounts.escrow_nft_account.to_account_info(),
            authority: ctx.accounts.seller.to_account_info(),
        };
        token::transfer(
            CpiContext::new(ctx.accounts.token_program.to_account_info(), transfer_accounts),
            NFT_AMOUNT,
        )?;

        msg!(
            "Listing created for mint {} at price {} lamports",
            ctx.accounts.mint.key(),
            price
        );

        Ok(())
    }

    /// Executes the sale between buyer and seller.
    pub fn purchase(ctx: Context<Purchase>) -> Result<()> {
        let listing = &ctx.accounts.listing;
        require!(listing.is_initialized, SellNftError::ListingNotInitialized);
        require_keys_eq!(listing.seller, ctx.accounts.seller.key(), SellNftError::OwnerMismatch);
        require_keys_eq!(listing.mint, ctx.accounts.mint.key(), SellNftError::MintMismatch);

        let price = listing.price;
        require!(
            ctx.accounts.buyer.to_account_info().lamports() >= price,
            SellNftError::InsufficientFunds
        );

        transfer_lamports(
            &ctx.accounts.buyer.to_account_info(),
            &ctx.accounts.seller.to_account_info(),
            price,
        )?;

        require!(
            ctx.accounts.escrow_nft_account.amount >= NFT_AMOUNT,
            SellNftError::InsufficientTokenBalance
        );

    let bump = listing.bump;
    let seller_key = listing.seller;
        let mint_key = listing.mint;
        let signer_seeds: &[&[u8]] = &[LISTING_SEED, seller_key.as_ref(), mint_key.as_ref(), &[bump]];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.escrow_nft_account.to_account_info(),
                    to: ctx.accounts.buyer_nft_account.to_account_info(),
                    authority: ctx.accounts.listing.to_account_info(),
                },
                &[signer_seeds],
            ),
            NFT_AMOUNT,
        )?;

        token::close_account(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                CloseAccount {
                    account: ctx.accounts.escrow_nft_account.to_account_info(),
                    destination: ctx.accounts.seller.to_account_info(),
                    authority: ctx.accounts.listing.to_account_info(),
                },
                &[signer_seeds],
            ),
        )?;

        // Mark the listing inactive before the account is closed.
        let listing = &mut ctx.accounts.listing;
    listing.is_initialized = false;
    listing.price = 0;
    listing.seller = Pubkey::default();
    listing.mint = Pubkey::default();

        msg!(
            "NFT sold to {} for {} lamports",
            ctx.accounts.buyer.key(),
            price
        );
        Ok(())
    }

    /// Cancels the listing and returns the NFT to the seller.
    pub fn cancel(ctx: Context<Cancel>) -> Result<()> {
        let listing = &ctx.accounts.listing;
        require!(listing.is_initialized, SellNftError::ListingNotInitialized);
        require_keys_eq!(listing.seller, ctx.accounts.seller.key(), SellNftError::Unauthorized);
        require_keys_eq!(listing.mint, ctx.accounts.mint.key(), SellNftError::MintMismatch);

        require!(
            ctx.accounts.escrow_nft_account.amount >= NFT_AMOUNT,
            SellNftError::InsufficientTokenBalance
        );

    let bump = listing.bump;
    let seller_key = listing.seller;
        let mint_key = listing.mint;
        let signer_seeds: &[&[u8]] = &[LISTING_SEED, seller_key.as_ref(), mint_key.as_ref(), &[bump]];

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                token::Transfer {
                    from: ctx.accounts.escrow_nft_account.to_account_info(),
                    to: ctx.accounts.seller_nft_account.to_account_info(),
                    authority: ctx.accounts.listing.to_account_info(),
                },
                &[signer_seeds],
            ),
            NFT_AMOUNT,
        )?;

        token::close_account(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                CloseAccount {
                    account: ctx.accounts.escrow_nft_account.to_account_info(),
                    destination: ctx.accounts.seller.to_account_info(),
                    authority: ctx.accounts.listing.to_account_info(),
                },
                &[signer_seeds],
            ),
        )?;

        let listing = &mut ctx.accounts.listing;
    listing.is_initialized = false;
    listing.price = 0;
    listing.seller = Pubkey::default();
    listing.mint = Pubkey::default();

        msg!("Listing cancelled by seller {}", ctx.accounts.seller.key());
        Ok(())
    }
}

/// Accounts for the `create_listing` instruction.
#[derive(Accounts)]
pub struct CreateListing<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,
    #[account(
        init,
        payer = seller,
        space = ListingAccount::SPACE,
        seeds = [LISTING_SEED, seller.key().as_ref(), mint.key().as_ref()],
        bump,
    )]
    pub listing: Account<'info, ListingAccount>,
    pub mint: Account<'info, Mint>,
    #[account(
        mut,
        constraint = seller_nft_account.mint == mint.key() @ SellNftError::MintMismatch,
        constraint = seller_nft_account.owner == seller.key() @ SellNftError::OwnerMismatch,
    )]
    pub seller_nft_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint = escrow_nft_account.mint == mint.key() @ SellNftError::MintMismatch,
        constraint = escrow_nft_account.owner == listing.key() @ SellNftError::EscrowAuthorityMismatch,
        constraint = escrow_nft_account.amount == 0 @ SellNftError::EscrowAccountMustBeEmpty,
    )]
    pub escrow_nft_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

/// Accounts for the `purchase` instruction.
#[derive(Accounts)]
pub struct Purchase<'info> {
    #[account(mut)]
    pub buyer: Signer<'info>,
    #[account(mut)]
    pub seller: SystemAccount<'info>,
    #[account(
        mut,
        close = seller,
        seeds = [LISTING_SEED, listing.seller.as_ref(), listing.mint.as_ref()],
        bump = listing.bump,
        constraint = listing.is_initialized @ SellNftError::ListingNotInitialized,
    )]
    pub listing: Account<'info, ListingAccount>,
    pub mint: Account<'info, Mint>,
    #[account(
        mut,
        constraint = escrow_nft_account.owner == listing.key() @ SellNftError::EscrowAuthorityMismatch,
        constraint = escrow_nft_account.mint == listing.mint @ SellNftError::MintMismatch,
    )]
    pub escrow_nft_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint = buyer_nft_account.owner == buyer.key() @ SellNftError::OwnerMismatch,
        constraint = buyer_nft_account.mint == listing.mint @ SellNftError::MintMismatch,
    )]
    pub buyer_nft_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

/// Accounts for the `cancel` instruction.
#[derive(Accounts)]
pub struct Cancel<'info> {
    #[account(mut)]
    pub seller: Signer<'info>,
    #[account(
        mut,
        close = seller,
        seeds = [LISTING_SEED, listing.seller.as_ref(), listing.mint.as_ref()],
        bump = listing.bump,
        constraint = listing.is_initialized @ SellNftError::ListingNotInitialized,
        constraint = listing.seller == seller.key() @ SellNftError::Unauthorized,
    )]
    pub listing: Account<'info, ListingAccount>,
    pub mint: Account<'info, Mint>,
    #[account(
        mut,
        constraint = escrow_nft_account.owner == listing.key() @ SellNftError::EscrowAuthorityMismatch,
        constraint = escrow_nft_account.mint == listing.mint @ SellNftError::MintMismatch,
    )]
    pub escrow_nft_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        constraint = seller_nft_account.owner == seller.key() @ SellNftError::OwnerMismatch,
        constraint = seller_nft_account.mint == listing.mint @ SellNftError::MintMismatch,
    )]
    pub seller_nft_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

/// Data stored for each listing PDA.
#[account]
#[derive(Default)]
pub struct ListingAccount {
    /// Whether the listing is active.
    pub is_initialized: bool,
    /// Original seller that created the listing.
    pub seller: Pubkey,
    /// NFT mint that is held in escrow for this listing.
    pub mint: Pubkey,
    /// Fixed price (in lamports) required to purchase the NFT.
    pub price: u64,
    /// Bump used when deriving the PDA.
    pub bump: u8,
}

impl ListingAccount {
    /// Size of the serialized listing account, including the Anchor discriminator.
    pub const SPACE: usize = 8 + 1 + 32 + 32 + 8 + 1;
}

/// Program-specific errors.
#[error_code]
pub enum SellNftError {
    /// Provided account does not match the expected PDA address.
    #[msg("Listing PDA does not match the expected address")]
    ListingAddressMismatch,
    /// Listing account has already been initialized.
    #[msg("Listing is already initialized")]
    ListingAlreadyInitialized,
    /// Listing account is not initialized.
    #[msg("Listing is not initialized")]
    ListingNotInitialized,
    /// Invalid price provided when creating a listing.
    #[msg("Price must be greater than zero")]
    InvalidPrice,
    /// Account owner does not match the expected authority.
    #[msg("Account owner mismatch")]
    OwnerMismatch,
    /// The escrow token account is not owned by the expected PDA.
    #[msg("Escrow token account has unexpected authority")]
    EscrowAuthorityMismatch,
    /// Token account has an insufficient balance.
    #[msg("Token account balance is insufficient")]
    InsufficientTokenBalance,
    /// The mint does not match the listing.
    #[msg("Mint does not match the listing")]
    MintMismatch,
    /// Escrow token account must start empty.
    #[msg("Escrow token account should start empty")]
    EscrowAccountMustBeEmpty,
    /// Caller is not authorized to perform this action.
    #[msg("Caller is not authorized to perform this action")]
    Unauthorized,
    /// Buyer does not have enough lamports.
    #[msg("Buyer does not have enough lamports")]
    InsufficientFunds,
    /// Arithmetic overflow detected.
    #[msg("Arithmetic overflow")]
    MathOverflow,
}

fn transfer_lamports(from: &AccountInfo<'_>, to: &AccountInfo<'_>, amount: u64) -> Result<()> {
    let from_balance = from.lamports();
    require!(from_balance >= amount, SellNftError::InsufficientFunds);

    {
        let mut from_lamports = from.try_borrow_mut_lamports()?;
        let new_from_balance = from_balance
            .checked_sub(amount)
            .ok_or(SellNftError::MathOverflow)?;
    **from_lamports = new_from_balance;
    }

    let to_balance = to.lamports();
    {
        let mut to_lamports = to.try_borrow_mut_lamports()?;
        let new_to_balance = to_balance
            .checked_add(amount)
            .ok_or(SellNftError::MathOverflow)?;
    **to_lamports = new_to_balance;
    }

    Ok(())
}
