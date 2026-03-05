# Simple Store - Solana Smart Contract

A minimal on-chain data store smart contract built with **Solana** and **Anchor**.

## Project Overview

This is a beginner-friendly smart contract that demonstrates the core concepts of Solana development:
- Creating accounts on-chain
- Implementing access control (owner-only updates)
- Writing and passing tests
- Handling custom errors

### What it does

The smart contract allows users to:
1. **Initialize** a new data store account (setting the owner)
2. **Set data** - Update the stored u64 value (owner-only)

### Technology Stack

- **Solana**: High-performance blockchain platform
- **Anchor**: Rust framework for building Solana programs
- **Rust**: Smart contract implementation
- **TypeScript**: Testing with Anchor's test suite

## Project Structure

```
rust_solana_blockchain/
├── Anchor.toml                 # Anchor configuration
├── Cargo.toml                  # Rust workspace configuration
├── package.json                # Node.js dependencies
├── programs/
│   └── simple_store/
│       ├── Cargo.toml          # Program-specific dependencies
│       └── src/
│           └── lib.rs          # Smart contract code
├── tests/
│   └── simple_store.ts         # TypeScript tests
└── README.md                   # This file
```

## Smart Contract Details

### Account Structure (DataStore)

```rust
pub struct DataStore {
    pub owner: Pubkey,  // 32 bytes - Account owner's public key
    pub data: u64,      // 8 bytes - Stored data value
}
```

### Instructions

#### 1. Initialize
Creates a new data store account and assigns an owner.
- **Parameters**: None
- **Accounts**: store, owner, system_program
- **Effect**: Sets owner and initializes data to 0

#### 2. Set Data
Updates the stored data value. Only the account owner can call this.
- **Parameters**: new_value (u64)
- **Accounts**: store, owner
- **Effect**: Updates store.data to new_value
- **Access Control**: Asserts that the signer is the account owner

### Error Handling

**SimpleStoreError::Unauthorized** - Thrown when a non-owner attempts to update the data.

## Getting Started

### Prerequisites

- [Rust](https://www.rust-lang.org/tools/install) (1.70+)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) (v1.17+)
- [Anchor](https://www.anchor-lang.com/docs/installation) (v0.28+)
- [Node.js](https://nodejs.org/) (v16+)
- [Yarn](https://yarnpkg.com/) or npm

### Installation

1. **Install Node dependencies**:
   ```bash
   yarn install
   # or: npm install
   ```

2. **Build the smart contract**:
   ```bash
   anchor build
   ```

## Running Tests

The test suite validates:
- ✅ Account initialization works correctly
- ✅ Data can be updated by the owner
- ✅ Unauthorized accounts cannot update data
- ✅ Stored values persist and update correctly

**Run all tests**:
```bash
anchor test
```

**Expected output**:
```
Simple Store
  ✓ Initializes the store account
  ✓ Updates the stored data value
  ✓ Rejects updates from unauthorized accounts
  ✓ Updates to a different value

4 passing
```

## Development Commands

```bash
# Build the smart contract
anchor build

# Run tests on a local validator
anchor test

# Deploy to devnet
anchor deploy --provider.cluster devnet

# Deploy to mainnet (be careful!)
anchor deploy --provider.cluster mainnet

# Build without running tests
anchor build --skip-test
```

## Local Development Setup

To run a local Solana validator:

```bash
# In a separate terminal
solana-test-validator

# In another terminal, run tests
anchor test --skip-build
```

## Understanding the Code

### key!(context.accounts.field) Pattern
The `require_eq!` macro checks that the signer matches the account owner, preventing unauthorized updates.

### Account Initialization
The `#[account(init, ...)]` attribute:
- Creates a new account on-chain
- Payer funds the account creation
- Allocates 40 bytes (8 for discriminator + 32 for owner + 8 for data)

### Signer Accounts
The `#[account(mut)]` + `Signer<'info>` pattern ensures:
- The account can be modified
- The account has signed the transaction

## Learning Resources

- [Anchor Documentation](https://docs.anchor-lang.com/)
- [Solana Docs](https://docs.solana.com/)
- [SPL Documentation](https://spl.solana.com/)
- [Anchor Examples](https://github.com/coral-xyz/anchor/tree/master/examples)

## Bootcamp Notes

This project is designed to be completed in one night and covers:
- ✅ Basic program structure
- ✅ Account management
- ✅ Instructions and context
- ✅ Access control patterns
- ✅ Error handling
- ✅ Testing with Anchor

## License

MIT - Feel free to use this as a learning resource or starting point for your projects.

## Next Steps

Once you master this contract, consider exploring:
- **PDAs (Program Derived Addresses)** - Deterministic account generation
- **SPL Tokens** - Creating and managing tokens
- **NFTs** - Building digital collectibles
- **Cross-program Invocation (CPI)** - Calling other programs
- **State Machines** - Building more complex programs
# Solana_blockchain_waylearn2026_ByteGuard_MAOH
