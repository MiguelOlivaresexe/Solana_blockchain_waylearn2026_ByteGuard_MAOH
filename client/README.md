# VaultChain Client

This directory contains TypeScript client code to interact with the VaultChain smart contract.

## Files

- **interact.ts** - Full example of vault initialization and data updates

## Prerequisites

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the smart contract:**
   ```bash
   anchor build
   ```

3. **Configure your wallet:**
   - Ensure Solana CLI is installed: `solana --version`
   - Create or import a wallet: `solana config set --keypair ~/.config/solana/id.json`
   - Verify connection: `solana cluster`

## Running the Client

### Option 1: Local Testing (Recommended for first run)

Run the full test suite which includes client interactions:

```bash
anchor test
```

This will:
- Build the program
- Start a local validator
- Run all tests including vault creation and data updates
- Display results

### Option 2: Devnet Interaction

Deploy to devnet first:

```bash
# Build the program
anchor build

# Update PROGRAM_ID in interact.ts with the deployed program ID
# Then run the client
ts-node client/interact.ts
```

## What the Client Does

The `interact.ts` script:

1. **Connects to Devnet** - Establishes a connection to the test network
2. **Loads your wallet** - Uses your Solana keypair for signing transactions
3. **Creates a vault** - Initializes a new vault account
4. **Updates data** - Modifies the stored u64 value
5. **Verifies results** - Reads back the updated data

## Environment Variables

Optional: Create a `.env` file for custom configuration:

```env
SOLANA_CLUSTER=devnet
WALLET_PATH=~/.config/solana/id.json
```

## Troubleshooting

**Problem: IDL not found**
```
Solution: Run anchor build first
```

**Problem: Insufficient SOL balance**
```
Solution: Request airdrop: solana airdrop 1 <your-address>
```

**Problem: Program not found**
```
Solution: Deploy first: anchor deploy --provider.cluster devnet
Update PROGRAM_ID in interact.ts with the deployed address
```

## Next Steps

- Modify `interact.ts` to add more vault interactions
- Create a web frontend using `@solana/web3.js` and `@coral-xyz/anchor`
- Build a full dApp with wallet connection (Phantom, Solflare, etc.)
