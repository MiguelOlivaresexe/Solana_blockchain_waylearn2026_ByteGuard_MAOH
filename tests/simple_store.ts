import anchor from "@coral-xyz/anchor";
import type { Program } from "@coral-xyz/anchor";
import type { VaultChain } from "../target/types/vault_chain";
import type { SimpleStore } from "../target/types/simple_store";
import { strict as assert } from "node:assert";

type VaultProgram = Program<VaultChain> | Program<SimpleStore>;

function runCrudSuite(name: string, program: VaultProgram) {
  describe(`${name} - CRUD Operations`, () => {
    const owner = anchor.web3.Keypair.generate();
    const vault = anchor.web3.Keypair.generate();

    before(async () => {
      const signature = await program.provider.connection.requestAirdrop(
        owner.publicKey,
        2_000_000_000
      );
      await program.provider.connection.confirmTransaction(signature, "confirmed");
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

      const vaultAccount = await program.account.vault.fetch(vault.publicKey);
      assert.strictEqual(vaultAccount.owner.toString(), owner.publicKey.toString());
      assert.strictEqual(vaultAccount.data.toNumber(), 0);
      console.log(`✅ ${name} CREATE: Vault initialized`);
    });

    it("READ: Fetches vault account data", async () => {
      const vaultAccount = await program.account.vault.fetch(vault.publicKey);
      assert.strictEqual(vaultAccount.owner.toString(), owner.publicKey.toString());
      assert.strictEqual(vaultAccount.data.toNumber(), 0);
      console.log(`✅ ${name} READ: Vault data retrieved successfully`);
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

      const vaultAccount = await program.account.vault.fetch(vault.publicKey);
      assert.strictEqual(vaultAccount.data.toNumber(), newValue);
      console.log(`✅ ${name} UPDATE: Data changed to 42`);
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

      const vaultAccount = await program.account.vault.fetch(vault.publicKey);
      assert.strictEqual(vaultAccount.data.toNumber(), anotherValue);
      console.log(`✅ ${name} UPDATE: Data changed to 100`);
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
        console.log(`✅ ${name} UPDATE: Unauthorized access rejected`);
      }
    });

    it("DELETE: Closes the vault and reclaims rent", async () => {
      const balanceBefore = await program.provider.connection.getBalance(owner.publicKey);

      await program.methods
        .closeVault()
        .accounts({
          vault: vault.publicKey,
          owner: owner.publicKey,
        })
        .signers([owner])
        .rpc();

      const balanceAfter = await program.provider.connection.getBalance(owner.publicKey);
      assert(balanceAfter > balanceBefore, "Owner should receive rent reclaim");
      console.log(`✅ ${name} DELETE: Vault closed, rent reclaimed`);

      const vaultAccount = await program.provider.connection.getAccountInfo(vault.publicKey);
      assert.strictEqual(vaultAccount, null, "Vault account should be closed");
      console.log(`✅ ${name} DELETE: Vault account verified as closed`);
    });
  });
}

describe("Anchor Workspace CRUD", () => {
  anchor.setProvider(anchor.AnchorProvider.env());

  const vaultChainProgram = anchor.workspace.VaultChain as Program<VaultChain>;
  const simpleStoreProgram = anchor.workspace.SimpleStore as Program<SimpleStore>;

  runCrudSuite("VaultChain", vaultChainProgram);
  runCrudSuite("SimpleStore", simpleStoreProgram);
});
