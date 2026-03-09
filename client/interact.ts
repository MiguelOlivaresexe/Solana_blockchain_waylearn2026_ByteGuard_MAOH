import * as anchor from "@coral-xyz/anchor";
import { Connection, PublicKey, Keypair } from "@solana/web3.js";
import * as fs from "fs";

/**
 * VaultChain Client - Complete CRUD Example
 * 
 * This script demonstrates all CRUD operations:
 * - CREATE: initialize a vault
 * - READ: fetch vault data
 * - UPDATE: modify stored value
 * - DELETE: close vault and reclaim rent
 * 
 * Usage:
 *   npm install
 *   anchor build
 *   ts-node client/interact.ts
 */

async function main() {
  // Connect to Devnet
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );

  // Load wallet (adjust path to your actual wallet)
  const walletPath = process.env.HOME + "/.config/solana/id.json";
  const walletSecret = JSON.parse(fs.readFileSync(walletPath, "utf-8"));
  const wallet = Keypair.fromSecretKey(Buffer.from(walletSecret));

  console.log("🔑 Wallet:", wallet.publicKey.toString());

  // Get airdrop if balance is low
  const balance = await connection.getBalance(wallet.publicKey);
  console.log("💰 Balance:", balance / 1e9, "SOL");

  if (balance < 1e9) {
    console.log("Requesting airdrop...");
    const airdropSig = await connection.requestAirdrop(wallet.publicKey, 2e9);
    await connection.confirmTransaction(airdropSig);
    console.log("✅ Airdrop confirmed (2 SOL)");
  }

  // Setup Anchor provider
  const provider = new anchor.AnchorProvider(
    connection,
    new anchor.Wallet(wallet),
    { commitment: "confirmed" }
  );
  anchor.setProvider(provider);

  // Load IDL and program
  const PROGRAM_ID = new PublicKey(
    "HSQMtGMTM4LfmQt7qGB52ZhpCH8LVAVYJcV2Q3ZDqfzJ"
  );

  const idlPath = "./target/idl/vault_chain.json";
  if (!fs.existsSync(idlPath)) {
    console.error("❌ IDL not found. Run: anchor build");
    process.exit(1);
  }

  const idl = JSON.parse(fs.readFileSync(idlPath, "utf-8"));
  const program = new anchor.Program(idl, PROGRAM_ID, provider);

  const vault = Keypair.generate();
  console.log("\n📦 Vault address:", vault.publicKey.toString());

  try {
    // ==================== CREATE ====================
    console.log("\n=== CREATE OPERATION ===");
    const initTx = await program.methods
      .initialize()
      .accounts({
        vault: vault.publicKey,
        owner: wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([vault])
      .rpc();

    console.log("✅ Vault initialized");
    console.log("   Signature:", initTx);

    // ==================== READ ====================
    console.log("\n=== READ OPERATION (Initial) ===");
    let vaultAccount = await program.account.vault.fetch(vault.publicKey);
    console.log("✅ Vault data retrieved:");
    console.log("   Owner:", vaultAccount.owner.toString());
    console.log("   Value:", vaultAccount.data.toNumber());
    console.log("   Size: 40 bytes (8 discriminator + 32 owner + 8 data)");

    // ==================== UPDATE #1 ====================
    console.log("\n=== UPDATE OPERATION #1 ===");
    const newValue = 42;
    const updateTx1 = await program.methods
      .setData(new anchor.BN(newValue))
      .accounts({
        vault: vault.publicKey,
        owner: wallet.publicKey,
      })
      .rpc();

    console.log(`✅ Data updated to ${newValue}`);
    console.log("   Signature:", updateTx1);

    // ==================== READ ====================
    console.log("\n=== READ OPERATION (After Update) ===");
    vaultAccount = await program.account.vault.fetch(vault.publicKey);
    console.log("✅ Vault data verified:");
    console.log("   Owner:", vaultAccount.owner.toString());
    console.log("   Value:", vaultAccount.data.toNumber());

    // ==================== UPDATE #2 ====================
    console.log("\n=== UPDATE OPERATION #2 ===");
    const anotherValue = 999;
    const updateTx2 = await program.methods
      .setData(new anchor.BN(anotherValue))
      .accounts({
        vault: vault.publicKey,
        owner: wallet.publicKey,
      })
      .rpc();

    console.log(`✅ Data updated to ${anotherValue}`);
    console.log("   Signature:", updateTx2);

    // ==================== DELETE ====================
    console.log("\n=== DELETE OPERATION ===");
    
    // Get balance before closing
    const balanceBefore = await connection.getBalance(wallet.publicKey);
    console.log("💰 Balance before close:", balanceBefore / 1e9, "SOL");

    // Close the vault
    const closeTx = await program.methods
      .closeVault()
      .accounts({
        vault: vault.publicKey,
        owner: wallet.publicKey,
      })
      .rpc();

    console.log("✅ Vault closed and rent reclaimed");
    console.log("   Signature:", closeTx);

    // Get balance after closing
    const balanceAfter = await connection.getBalance(wallet.publicKey);
    console.log("💰 Balance after close:", balanceAfter / 1e9, "SOL");
    console.log("   Rent recovered:", (balanceAfter - balanceBefore) / 1e9, "SOL");

    // Verify vault is closed
    const vaultInfo = await connection.getAccountInfo(vault.publicKey);
    if (vaultInfo === null) {
      console.log("✅ Vault account successfully closed and removed");
    } else {
      console.log("⚠️  Vault account still exists (unexpected)");
    }

    console.log("\n🎉 All CRUD operations completed successfully!");
    console.log("   ✅ CREATE: Vault initialized");
    console.log("   ✅ READ: Data retrieved twice");
    console.log("   ✅ UPDATE: Value changed twice");
    console.log("   ✅ DELETE: Vault closed with rent recovery");
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

main();
