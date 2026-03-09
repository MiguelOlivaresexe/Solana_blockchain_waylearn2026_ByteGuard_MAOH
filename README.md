# VaultChain - Solana Developer Certification Project

> 🎓 A minimal on-chain data vault built for the **WayLearn Solana Developer Certification** bootcamp.

**VaultChain** is a beginner-friendly Solana program that teaches the fundamental concepts required for blockchain development:

## 📚 Bootcamp Learning Objectives

This project covers concepts from **Día 1-2** of the WayLearn certification:

- ✅ **Account-based architecture** - Solana's core data model
- ✅ **Program state management** - Creating and persisting data on-chain
- ✅ **Ownership and access control** - Secure authorization patterns
- ✅ **Instructions and invocation** - How programs execute
- ✅ **TypeScript client interactions** - Building transactions with Anchor
- ✅ **Testing and validation** - Verifying program behavior

## 🎯 What It Does

VaultChain allows users to:
1. **Initialize** a data vault (on-chain account) and become its owner
2. **Update vault data** - Only the owner can modify the stored u64 value

## 🛠️ Technology Stack

- **Solana**: High-performance blockchain (8,000 TPS, low fees)
- **Anchor**: Rust framework for Solana programs (reduces boilerplate)
- **Rust**: Safe, performant smart contract language
- **TypeScript**: Crafting transactions and tests
- **Devnet**: Solana's test network (free SOL via airdrop)

## 📁 Project Structure

```
vault-chain/
├── Anchor.toml                      # Anchor workspace config & program ID
├── Cargo.toml                       # Rust workspace dependencies
├── package.json                     # Node.js (TypeScript, testing)
├── .gitignore                       # Git ignore rules
├── PLAYGROUND.md                    # Solana Playground setup guide
├── README.md                        # This documentation
│
├── programs/vault-chain/             # Smart contract directory (Rust + Anchor)
│   ├── Cargo.toml                   # Program dependencies
│   └── src/
│       └── lib.rs                   # Main program code (CRUD operations)
│
├── tests/
│   └── simple_store.ts              # Comprehensive CRUD tests
│
└── client/
    ├── interact.ts                  # TypeScript client example
    └── README.md                    # Client documentation
```

## 🔐 Smart Contract Concepts

### CRUD Implementation

This project implements **complete CRUD** (Create, Read, Update, Delete):

| Operation | Status | Method | Instruction |
|-----------|--------|--------|---|
| **C**reate | ✅ Implemented | On-chain instruction | `initialize` |
| **R**ead | ✅ Implemented | Client-side `.fetch()` | Implicit |
| **U**pdate | ✅ Implemented | On-chain instruction | `set_data` |
| **D**elete | ✅ Implemented | On-chain instruction | `close_vault` |

**All CRUD operations are fully implemented and tested.**

### 1. Account Structure (Vault)
Each user creates an on-chain account that stores:

```rust
pub struct Vault {
    pub owner: Pubkey,  // 32 bytes - Account owner's public key (identity)
    pub data: u64,      // 8 bytes - Stored numeric value
}
```

### 2. Instructions (Transactions)

A program exposes instructions that users invoke via transactions:

| Instruction | Purpose | Access | CRUD |
|---|---|---|---|
| `initialize` | Creates a new Vault account and assigns owner | Public | **C** |
| `set_data` | Updates the stored u64 value | Owner only | **U** |
| `close_vault` | Closes the vault and reclaims rent | Owner only | **D** |

**Reading data:** Implemented on the client side using Anchor's `.fetch()` method (**R**)

### 3. Access Control & Security

- **Ownership model**: Only the account creator (owner) can modify or delete the vault
- **Signer validation**: Anchor verifies the transaction signer matches the owner
- **Custom errors**: Clear error messages for unauthorized attempts
- **Rent reclaim**: Closing a vault returns the SOL to the owner
- **Account creation**: Payer funds the account; Anchor handles rent/storage

### Error Handling

**VaultError::Unauthorized** - Thrown when a non-owner attempts to update or delete a vault.

## Getting Started

### Two Ways to Use This Project

**Option A: Solana Playground (Recommended - No Installation)**
- Zero setup required
- Browser-based IDE
- One-click deployment
- Perfect for learning

**Option B: Local Development**
- Full control over environment
- Compatible with professional workflows
- Requires local installation

### Option A: Solana Playground (Quickest)

1. **Go to:** https://beta.solpg.io/
2. **Click:** "Import from GitHub"
3. **Paste:** `https://github.com/YOUR_USERNAME/vault-chain`
4. **Click:** "Import"
5. **In terminal:**
   ```bash
   anchor build
   anchor test
   ```

That's it! 🎉 Tests will run in your browser.

### Option B: Local Development

**Prerequisites:**
- [Rust](https://www.rust-lang.org/tools/install) (1.70+)
- [Solana CLI](https://docs.solana.com/cli/install-solana-cli-tools) (v1.17+)
- [Anchor](https://www.anchor-lang.com/docs/installation) (v0.28+)
- [Node.js](https://nodejs.org/) (v16+)

1. **Clone and install:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/vault-chain
   cd vault-chain
   npm install
   ```

2. **Build:**
   ```bash
   anchor build
   ```

3. **Test:**
   ```bash
   anchor test
   ```

## ▶️ Running Tests

### Test Suite Overview

The comprehensive test suite validates all CRUD operations:

| Test | Operation | Validates |
|------|-----------|-----------|
| `CREATE: Initializes a new vault account` | CREATE | Account creation, owner assignment |
| `READ: Fetches vault account data` | READ | Data retrieval correctness |
| `UPDATE: Modifies the stored data value` | UPDATE | Data modification |
| `UPDATE: Verifies data persistence` | UPDATE | Value persistence |
| `UPDATE: Rejects unauthorized updates` | UPDATE | Authorization checks |
| `DELETE: Closes the vault and reclaims rent` | DELETE | Account closure, rent recovery |
| `DELETE: Vault account verified as closed` | DELETE | Verification of deletion |

**Run tests:**
```bash
anchor test
```

**Expected output:**
```
VaultChain - CRUD Operations
  ✅ CREATE: Initializes a new vault account
  ✅ READ: Fetches vault account data
  ✅ UPDATE: Modifies the stored data value
  ✅ UPDATE: Verifies data persistence with another update
  ✅ UPDATE: Rejects unauthorized data updates
  ✅ DELETE: Closes the vault and reclaims rent
  ✅ DELETE: Vault account verified as closed

7 passing ✅
```
   - Get a devnet wallet address
   - Run: `anchor deploy --provider.cluster devnet`

**Benefits of Solana Playground:**
- ✅ No local installation needed
- ✅ Built-in terminal and editor
- ✅ Integrated wallet (Phantom)
- ✅ One-click deployment to Devnet
- ✅ Free SOL airdrops for testing

## TypeScript Client

The `/client` directory contains a TypeScript example showing CRUD operations:

```bash
# Requires Anchor build first
anchor build

# Run the client
cd client
ts-node interact.ts
```

**What the client demonstrates:**
```
=== CREATE OPERATION ===
✅ Vault initialized

=== READ OPERATION (Initial) ===
✅ Vault data retrieved

=== UPDATE OPERATION #1 ===
✅ Data updated to 42

=== READ OPERATION (After Update) ===
✅ Vault data verified

=== UPDATE OPERATION #2 ===
✅ Data updated to 999

=== DELETE OPERATION ===
✅ Vault closed and rent reclaimed
✅ Vault account successfully closed and removed

🎉 All CRUD operations completed successfully!
```

See [client/README.md](client/README.md) for detailed instructions.

## 📦 Deployment

### Build
```bash
anchor build
```

### Test (Local)
```bash
anchor test
```

### Deploy to Devnet
```bash
anchor deploy --provider.cluster devnet
```

### Deploy to Mainnet
```bash
# ⚠️ Use with caution - real money involved
anchor deploy --provider.cluster mainnet
```

# Build without running tests
anchor build --skip-test
```

## 💡 Code Overview

### Program Module Name
```rust
#[program]
pub mod vault_chain {
    // Instructions: initialize, set_data, close_vault
}
```

### Authorization Pattern
```rust
require_eq!(
    vault.owner,
    ctx.accounts.owner.key(),
    VaultError::Unauthorized
);
```
- Verifies signer matches vault owner
- Prevents unauthorized access
- Throws custom error if mismatch

### Account Creation
```rust
#[account(init, payer = owner, space = 8 + 32 + 8)]
pub vault: Account<'info, Vault>
```
- `init`: Creates account on-chain
- `payer = owner`: Owner funds creation
- `space = 40`: Total bytes allocated
  - 8: Discriminator (Anchor)
  - 32: Pubkey (owner)
  - 8: u64 (data)

### Account Closure
```rust
#[account(mut, close = owner)]
pub vault: Account<'info, Vault>
```
- `close = owner`: Closes account and returns rent to owner
- Automatically handles cleanup

## 📖 Learning Path

This project maps to the WayLearn certification curriculum:

- **Día 1** [Preparación del entorno](https://waylearn.gitbook.io/solana-developer-certification/programa/dia-1-preparacion-del-entorno-de-desarrollo)
  - Solana Playground, DevNet, Airdrops
  - Understanding Programs and Accounts
  - Account-based architecture

- **Día 2** [Conociendo Rust](https://waylearn.gitbook.io/solana-developer-certification/programa/dia-2-conociendo-rust)
  - Ownership, borrowing, and traits
  - Structs and enums
  - Error handling

## 📚 Official Resources

- [Anchor Documentation](https://docs.anchor-lang.com/) - Rust framework reference
- [Solana Playground](https://beta.solpg.io/) - Browser-based IDE
- [Solana Developer Docs](https://docs.solana.com/) - Core blockchain concepts
- [WayLearn Certification](https://waylearn.gitbook.io/solana-developer-certification/) - Full bootcamp program
- [Solana Cookbook](https://solanacookbook.com/) - Common patterns and solutions
- [Anchor Examples](https://github.com/coral-xyz/anchor/tree/master/examples) - Reference code

## ✅ Submission Checklist

Before submitting to WayLearn, verify:

- [ ] Program compiles without errors: `anchor build`
- [ ] All 7 tests pass: `anchor test`
- [ ] Tests include all CRUD operations
- [ ] Custom error handling implemented
- [ ] Authorization checks in place (owner-only)
- [ ] Program deployable: `anchor deploy --provider.cluster devnet`
- [ ] Code is clean and well-documented
- [ ] README explains project clearly
- [ ] Compatible with Solana Playground
- [ ] Git repository is public

---

## ❓ FAQ: CRUD & Solana Playground

**Q: Does this project have full CRUD?**

A: Yes! This project implements **complete CRUD**:
- ✅ **C**reate: `initialize` instruction
- ✅ **R**ead: Client-side `.fetch()`
- ✅ **U**pdate: `set_data` instruction
- ✅ **D**elete: `close_vault` instruction (with rent reclaim)

**Q: Can I run this in Solana Playground?**

A: Yes! VaultChain is fully compatible with Solana Playground:
1. Go to https://beta.solpg.io/
2. Import from GitHub
3. Build with `anchor build`
4. Test with `anchor test`
5. Deploy with `anchor deploy`

**Q: What happens when I close a vault?**

A: The `close_vault` instruction:
- Verifies owner authorization
- Closes the vault account
- Automatically returns rent (SOL) to the owner
- Account is removed from the blockchain

**Q: Do I need to install anything to use Solana Playground?**

A: No! Solana Playground runs in your browser. You only need:
- A web browser (Chrome, Firefox, Safari)
- A GitHub account (to import)
- A Phantom wallet (for devnet transactions)

**Q: How much does it cost to deploy?**

A: Nothing during development:
- **Devnet**: Free (test network)
- **Mainnet**: Costs small SOL fees (production only)

**Q: I see the directory is called `vault-chain`. Why not `simple_store`?**

A: We renamed the project to use a more memorable name (`vault-chain`) that better represents the functionality. All internal module names are also updated to `vault_chain` for consistency.

**Q: How long does this typically take to complete?**

A: 2-3 hours with:
- 30-40 minutes understanding the code
- 20-30 minutes running tests locally or in Playground
- 1-2 hours extending or modifying the project

Perfect for a bootcamp assignment to complete in one evening.

**Q: Is my program ready for mainnet?**

A: Almost! This is production-quality code, but before mainnet:
- ✅ Audit the code thoroughly
- ✅ Test extensively on devnet
- ✅ Consider gas optimization if needed
- ✅ Add additional security measures if handling real value

---

## 🎓 For WayLearn Students

This project is part of the **Solana Developer Certification** bootcamp.

- **Duration**: Día 1-2 concepts
- **Difficulty**: Beginner
- **Focus**: Core program architecture & account safety

After completing this, move on to:
- Día 3: **SPL Tokens** - Creating and managing tokens
- Día 4: **PDAs** - Program Derived Addresses for deterministic accounts
- Día 5: **CPIs** - Cross-program invocation and composability
- Advanced: **NFTs**, **state machines**, **complex validations**

---

## 📜 License

MIT - Open source for learning and community contribution.

**Built for:** [WayLearn Solana Developer Certification](https://waylearn.gitbook.io/solana-developer-certification/)

---

## 🚀 Devnet Deployment Odyssey

This project's deployment was not a one-shot process. It took multiple real-world fixes that are worth documenting:

1. **Tooling PATH issues in WSL**
- `solana` and `cargo-build-sbf` were not available in a fresh shell.
- Fixed by exporting Solana's active release bin path in WSL.

2. **Program ID mismatch (`DeclaredProgramIdMismatch`)**
- A new deploy keypair generated IDs that did not match `declare_id!` and `Anchor.toml`.
- Fixed by syncing IDs across:
   - `programs/vault-chain/src/lib.rs`
   - `programs/simple_store/src/lib.rs`
   - `Anchor.toml` (`[programs.localnet]` and `[programs.devnet]`)

3. **Insufficient funds during deploy**
- Deploy failed when upgrade authority account had not enough SOL for program write + fee.
- Resolved by funding the deploy wallet and retrying once configuration was correct.

4. **Anchor test/module setup fixes before deploy**
- Updated test and TS configuration to avoid module resolution/runtime import issues.
- Confirmed full CRUD tests pass locally before retrying devnet deployment.

### Final verified deployment

- Wallet (devnet): `58njUyGj19dNZqYAyWGye3GvWC19nRjs86TKkciCHNsD`
- `vault_chain` Program ID: `DG4yk7viv6UpFBHaVRjyhviqPEeuRnNJuF6jb1Yt36so`
- `simple_store` Program ID: `BsPTGFdpimkW1KTCRtXDRYgVKjPc8w9oWVghuY4WRyfW`

Verification command:

```bash
solana program show DG4yk7viv6UpFBHaVRjyhviqPEeuRnNJuF6jb1Yt36so
solana program show BsPTGFdpimkW1KTCRtXDRYgVKjPc8w9oWVghuY4WRyfW
```

Both programs are confirmed on Devnet with this wallet as upgrade authority.

### On-chain verification output (evidence)

```bash
$ solana program show DG4yk7viv6UpFBHaVRjyhviqPEeuRnNJuF6jb1Yt36so
Program Id: DG4yk7viv6UpFBHaVRjyhviqPEeuRnNJuF6jb1Yt36so
Owner: BPFLoaderUpgradeab1e11111111111111111111111
ProgramData Address: 6zd99vMs7fKxDcrq3ddiKAxyY9hQ2HxPmDm7Z9r51sd5
Authority: 58njUyGj19dNZqYAyWGye3GvWC19nRjs86TKkciCHNsD
Last Deployed In Slot: 447221127
Data Length: 210536 (0x33668) bytes
Balance: 1.46653464 SOL

$ solana program show BsPTGFdpimkW1KTCRtXDRYgVKjPc8w9oWVghuY4WRyfW
Program Id: BsPTGFdpimkW1KTCRtXDRYgVKjPc8w9oWVghuY4WRyfW
Owner: BPFLoaderUpgradeab1e11111111111111111111111
ProgramData Address: CuXk58V6GS9EPGw8mDmUxErpSEu32XnCPJ6LNb4wjsXy
Authority: 58njUyGj19dNZqYAyWGye3GvWC19nRjs86TKkciCHNsD
Last Deployed In Slot: 447221179
Data Length: 210536 (0x33668) bytes
Balance: 1.46653464 SOL
```
