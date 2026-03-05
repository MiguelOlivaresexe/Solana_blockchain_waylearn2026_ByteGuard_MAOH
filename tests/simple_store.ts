import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { VaultChain } from "../target/types/vault_chain";
import * as assert from "assert";

describe("VaultChain - CRUD Operations", () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.VaultChain as Program<VaultChain>;
  const owner = anchor.web3.Keypair.generate();
  const vault = anchor.web3.Keypair.generate();

  before(async () => {
    // Airdrop SOL to the owner account
    const signature = await program.provider.connection.requestAirdrop(
      owner.publicKey,
      2000000000 // 2 SOL for operations
    );
    await program.provider.connection.confirmTransaction(signature);
  });

  it("CREATE: Initializes a new vault account", async () => {
    await program.methods
      .initialize()
      .accounts({
        vault: vault.publicKey,
        owner: owner.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([owner, vault])
      .rpc();

    const vaultAccount = await program.account.vault.fetch(
      vault.publicKey
    );
    assert.strictEqual(vaultAccount.owner.toString(), owner.publicKey.toString());
    assert.strictEqual(vaultAccount.data.toNumber(), 0);
    console.log("✅ CREATE: Vault initialized");
  });

  it("READ: Fetches vault account data", async () => {
    const vaultAccount = await program.account.vault.fetch(vault.publicKey);
    assert.strictEqual(vaultAccount.owner.toString(), owner.publicKey.toString());
    assert.strictEqual(vaultAccount.data.toNumber(), 0);
    console.log("✅ READ: Vault data retrieved successfully");
  });

  it("UPDATE: Modifies the stored data value", async () => {
    const newValue = 42;
    await program.methods
      .setData(new anchor.BN(newValue))
      .accounts({
        vault: vault.publicKey,
        owner: owner.publicKey,
      })
      .signers([owner])
      .rpc();

    const vaultAccount = await program.account.vault.fetch(
      vault.publicKey
    );
    assert.strictEqual(vaultAccount.data.toNumber(), newValue);
    console.log("✅ UPDATE: Data changed to 42");
  });

  it("UPDATE: Verifies data persistence with another update", async () => {
    const anotherValue = 100;
    await program.methods
      .setData(new anchor.BN(anotherValue))
      .accounts({
        vault: vault.publicKey,
        owner: owner.publicKey,
      })
      .signers([owner])
      .rpc();

    const vaultAccount = await program.account.vault.fetch(
      vault.publicKey
    );
    assert.strictEqual(vaultAccount.data.toNumber(), anotherValue);
    console.log("✅ UPDATE: Data changed to 100");
  });

  it("UPDATE: Rejects unauthorized data updates", async () => {
    const unauthorizedUser = anchor.web3.Keypair.generate();

    try {
      await program.methods
        .setData(new anchor.BN(999))
        .accounts({
          vault: vault.publicKey,
          owner: unauthorizedUser.publicKey,
        })
        .signers([unauthorizedUser])
        .rpc();
      assert.fail("Expected transaction to fail");
    } catch (error: any) {
      assert(
        error.message.includes("Unauthorized") ||
          error.message.includes("signature verification failed"),
        `Expected Unauthorized error, got: ${error.message}`
      );
      console.log("✅ UPDATE: Unauthorized access rejected");
    }
  });

  it("DELETE: Closes the vault and reclaims rent", async () => {
    // Get balance before closing
    const balanceBefore = await program.provider.connection.getBalance(
      owner.publicKey
    );

    // Close the vault
    await program.methods
      .closeVault()
      .accounts({
        vault: vault.publicKey,
        owner: owner.publicKey,
      })
      .signers([owner])
      .rpc();

    // Get balance after closing (should increase due to rent reclaim)
    const balanceAfter = await program.provider.connection.getBalance(
      owner.publicKey
    );

    assert(balanceAfter > balanceBefore, "Owner should receive rent reclaim");
    console.log("✅ DELETE: Vault closed, rent reclaimed");

    // Verify vault account no longer exists
    const vaultAccount = await program.provider.connection.getAccountInfo(
      vault.publicKey
    );
    assert.strictEqual(vaultAccount, null, "Vault account should be closed");
    console.log("✅ DELETE: Vault account verified as closed");
  });
});
