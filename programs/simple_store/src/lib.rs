use anchor_lang::prelude::*;

declare_id!("BsPTGFdpimkW1KTCRtXDRYgVKjPc8w9oWVghuY4WRyfW");

#[program]
pub mod simple_store {
    use super::*;

    /// Initialize a new data vault account
    /// Creates the account and sets the owner
    /// This is the CREATE operation in CRUD
    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        vault.owner = ctx.accounts.owner.key();
        vault.data = 0;
        msg!("✅ Vault initialized for owner: {}", vault.owner);
        Ok(())
    }

    /// Update the stored data value
    /// Only the owner can call this instruction
    /// This is the UPDATE operation in CRUD
    pub fn set_data(ctx: Context<SetData>, new_value: u64) -> Result<()> {
        let vault = &mut ctx.accounts.vault;
        require_eq!(
            vault.owner,
            ctx.accounts.owner.key(),
            VaultError::Unauthorized
        );
        vault.data = new_value;
        msg!("✅ Data updated to: {}", new_value);
        Ok(())
    }

    /// Close the vault and reclaim rent
    /// Only the owner can call this instruction
    /// This is the DELETE operation in CRUD
    pub fn close_vault(ctx: Context<CloseVault>) -> Result<()> {
        let vault = &ctx.accounts.vault;
        require_eq!(
            vault.owner,
            ctx.accounts.owner.key(),
            VaultError::Unauthorized
        );
        msg!("✅ Vault closed by owner: {}", vault.owner);
        Ok(())
    }
}

/// The vault account structure (data model)
#[account]
pub struct Vault {
    /// The public key of the account owner
    pub owner: Pubkey,
    /// The stored u64 value
    pub data: u64,
}

/// Accounts for the initialize instruction (CREATE)
#[derive(Accounts)]
pub struct Initialize<'info> {
    /// The vault account to be created
    #[account(init, payer = owner, space = 8 + 32 + 8)]
    pub vault: Account<'info, Vault>,
    /// The owner of the vault account
    #[account(mut)]
    pub owner: Signer<'info>,
    /// System program for account creation
    pub system_program: Program<'info, System>,
}

/// Accounts for the set_data instruction (UPDATE)
#[derive(Accounts)]
pub struct SetData<'info> {
    /// The vault account to be updated
    #[account(mut)]
    pub vault: Account<'info, Vault>,
    /// The owner of the vault account
    pub owner: Signer<'info>,
}

/// Accounts for the close_vault instruction (DELETE)
#[derive(Accounts)]
pub struct CloseVault<'info> {
    /// The vault account to be closed
    #[account(mut, close = owner)]
    pub vault: Account<'info, Vault>,
    /// The owner of the vault (receives rent reclaim)
    #[account(mut)]
    pub owner: Signer<'info>,
}

/// Custom error types
#[error_code]
pub enum VaultError {
    /// Error thrown when an unauthorized account tries to access the vault
    #[msg("Only the owner can perform this action")]
    Unauthorized,
}
