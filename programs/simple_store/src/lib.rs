use anchor_lang::prelude::*;

declare_id!("SvmjFVPgVBBwEAV9p1w9CAF8sCmvBPjxPhhgXcNVBTe");

#[program]
pub mod simple_store {
    use super::*;

    /// Initialize a new data store account
    /// Sets the owner and initializes the stored value to 0
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let store = &mut ctx.accounts.store;
        store.owner = ctx.accounts.owner.key();
        store.data = 0;
        Ok(())
    }

    /// Update the stored data value
    /// Only the owner can call this instruction
    pub fn set_data(ctx: Context<SetData>, new_value: u64) -> Result<()> {
        let store = &mut ctx.accounts.store;
        require_eq!(
            store.owner,
            ctx.accounts.owner.key(),
            SimpleStoreError::Unauthorized
        );
        store.data = new_value;
        Ok(())
    }
}

/// The data store account structure
#[account]
pub struct DataStore {
    /// The public key of the account owner
    pub owner: Pubkey,
    /// The stored u64 value
    pub data: u64,
}

/// Accounts for the initialize instruction
#[derive(Accounts)]
pub struct Initialize<'info> {
    /// The store account to be created
    #[account(init, payer = owner, space = 8 + 32 + 8)]
    pub store: Account<'info, DataStore>,
    /// The owner of the store account
    #[account(mut)]
    pub owner: Signer<'info>,
    /// System program for account creation
    pub system_program: Program<'info, System>,
}

/// Accounts for the set_data instruction
#[derive(Accounts)]
pub struct SetData<'info> {
    /// The store account to be updated
    #[account(mut)]
    pub store: Account<'info, DataStore>,
    /// The owner of the store account
    pub owner: Signer<'info>,
}

/// Custom error types
#[error_code]
pub enum SimpleStoreError {
    /// Error thrown when an unauthorized account tries to update the data
    #[msg("Only the owner can update the stored data")]
    Unauthorized,
}
