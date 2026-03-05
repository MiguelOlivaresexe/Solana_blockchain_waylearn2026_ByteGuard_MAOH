import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { SimpleStore } from "../target/types/simple_store";
import * as assert from "assert";

describe("Simple Store", () => {
  // Configure the client to use the local cluster
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.SimpleStore as Program<SimpleStore>;
  const owner = anchor.web3.Keypair.generate();
  const store = anchor.web3.Keypair.generate();

  before(async () => {
    // Airdrop SOL to the owner account
    const signature = await program.provider.connection.requestAirdrop(
      owner.publicKey,
      1000000000 // 1 SOL
    );
    await program.provider.connection.confirmTransaction(signature);
  });

  it("Initializes the store account", async () => {
    await program.methods
      .initialize()
      .accounts({
        store: store.publicKey,
        owner: owner.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([owner, store])
      .rpc();

    const storeAccount = await program.account.dataStore.fetch(
      store.publicKey
    );
    assert.strictEqual(storeAccount.owner.toString(), owner.publicKey.toString());
    assert.strictEqual(storeAccount.data.toNumber(), 0);
  });

  it("Updates the stored data value", async () => {
    const newValue = 42;
    await program.methods
      .setData(new anchor.BN(newValue))
      .accounts({
        store: store.publicKey,
        owner: owner.publicKey,
      })
      .signers([owner])
      .rpc();

    const storeAccount = await program.account.dataStore.fetch(
      store.publicKey
    );
    assert.strictEqual(storeAccount.data.toNumber(), newValue);
  });

  it("Rejects updates from unauthorized accounts", async () => {
    const unauthorizedUser = anchor.web3.Keypair.generate();

    try {
      await program.methods
        .setData(new anchor.BN(999))
        .accounts({
          store: store.publicKey,
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
    }
  });

  it("Updates to a different value", async () => {
    const anotherValue = 100;
    await program.methods
      .setData(new anchor.BN(anotherValue))
      .accounts({
        store: store.publicKey,
        owner: owner.publicKey,
      })
      .signers([owner])
      .rpc();

    const storeAccount = await program.account.dataStore.fetch(
      store.publicKey
    );
    assert.strictEqual(storeAccount.data.toNumber(), anotherValue);
  });
});
