"use strict";
var expect = require("chai").expect;
var index = require("../dist/index.js");
var bsv = require("bsv");

describe("boost #BoostPowJobProof", () => {
  it("should success create hex ", async () => {
    const jobProof = index.BoostPowJobProof.fromObject({
      signature:
        "0000000000000000000000000000000000000000000000000000000000000006",
      minerPubKeyHash: "0000000000000000000000000000000000000001",
      extraNonce1: "02000000",
      extraNonce2: "0000000300000003",
      minerPubKey:
        "000000000000000000000000000000000000000000000000000000000000000006",
      time: "12300009",
      nonce: "00000005",
    });

    const jobObj = jobProof.toObject();
    expect(jobObj).to.eql({
      signature:
        "0000000000000000000000000000000000000000000000000000000000000006",
      minerPubKeyHash: "0000000000000000000000000000000000000001",
      extraNonce1: "02000000",
      extraNonce2: "0000000300000003",
      minerPubKey:
        "000000000000000000000000000000000000000000000000000000000000000006",
      time: "12300009",
      nonce: "00000005",
    });

    expect(jobProof.toScript().toHex()).to.eql(
      "20000000000000000000000000000000000000000000000000000000000000000621000000000000000000000000000000000000000000000000000000000000000006040000000504123000090800000003000000030402000000140000000000000000000000000000000000000001"
    );

    const fromHex = index.BoostPowJobProof.fromHex(
      "20000000000000000000000000000000000000000000000000000000000000000621000000000000000000000000000000000000000000000000000000000000000006040000000504123000090800000003000000030402000000140000000000000000000000000000000000000001"
    );
    const hexAgain = fromHex.toScript().toHex();
    expect(jobProof.toScript().toHex()).to.eql(hexAgain);
  });

  // 00000000000000000000000000000000000000009fb8cb68b8850a13c7438e26e1d277b748be657a4600002c0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000

  it("should success create asm and string", async () => {
    const jobProof = index.BoostPowJobProof.fromObject({
      signature:
        "0000000000000000000000000000000000000000000000000000000000000006",
      minerPubKeyHash: "0000000000000000000000000000000000000001",
      extraNonce1: "02000000",
      extraNonce2: "0000000300000003",
      minerPubKey:
        "000000000000000000000000000000000000000000000000000000000000000006",
      time: "12300009",
      nonce: "00000005",
    });

    const jobObj = jobProof.toObject();
    expect(jobObj).to.eql({
      signature:
        "0000000000000000000000000000000000000000000000000000000000000006",
      minerPubKeyHash: "0000000000000000000000000000000000000001",
      extraNonce1: "02000000",
      extraNonce2: "0000000300000003",
      minerPubKey:
        "000000000000000000000000000000000000000000000000000000000000000006",
      time: "12300009",
      nonce: "00000005",
    });
    const str =
      "32 0x0000000000000000000000000000000000000000000000000000000000000006 33 0x000000000000000000000000000000000000000000000000000000000000000006 4 0x00000005 4 0x12300009 8 0x0000000300000003 4 0x02000000 20 0x0000000000000000000000000000000000000001";
    const asm =
      "0000000000000000000000000000000000000000000000000000000000000006 000000000000000000000000000000000000000000000000000000000000000006 00000005 12300009 0000000300000003 02000000 0000000000000000000000000000000000000001";
    expect(jobProof.toString()).to.eql(str);
    const fromString = index.BoostPowJobProof.fromString(str);
    expect(jobProof.toScript().toASM()).to.eql(fromString.toScript().toASM());
    expect(jobProof.toScript().toASM()).to.eql(asm);
    expect(jobProof.toScript().toHex()).to.eql(
      index.BoostPowJobProof.fromASM(jobProof.toScript().toASM()).toScript().toHex()
    );
  });

  it("should fail load job proof from transaction that is not a job proof", async () => {
    const jobProof = index.BoostPowJobProof.fromRawTransaction(
      "0100000001c57af713fdd0750ea6556fef16ba58c6fd7946b6a6600163b84303a6047d2ab9010000006a4730440220302c22161af7d29186d420477b5f41329c470fadd43750944e094be69f39cab802204259cff79fb9a6b0947363ac6c9da6e607436f5c5acda931db0c908d3633ee71412102b618dda1256faf611127bbe9f213a00b74014740712fd2c4bac2647a9603e26effffffff0240420f0000000000d40831307674736f6f627504000000002074736f6f42206f6c6c654800000000000000000000000000000000000000000004ffff001d1400000000000000000000000000000000000000000800000000000000002000000000000000000000000000000000000000000000000000000000000000005879825488567a766b7b5479825488537f7653a269760120a1696b1d00000000000000000000000000000000000000000000000000000000007e6c5394996b577a825888547f6b7e7b7e7e7eaa7c7e7e7e7c7e6c7e6c7eaa6c9f6976aa6c88aca3055f0e000000001976a914ac04bc2ddd762c0fae2d2756f6d673899366cd3588ac00000000"
    );
    expect(jobProof).to.eql(undefined);
  });

  it("should success load job proof from transaction", async () => {
    const jobProof = index.BoostPowJobProof.fromRawTransaction(
      "01000000012e5286d9ab0a2007c944db26040bef4f96549e905f95e842948625b4e127797f0100000098483045022100cd0c5025794c5bd5120a0634af824520360cb354df2c00c0606ccf227c44d0d802206a4040f5c0173c83827cd4d9e83f6c3f9fc09e336970776c02d07c211a977576412102f96821f6d9a6150e0ea06b00c8c77597e863330041be70438ff6fb211d7efe660462a3aeb004b851825e0800000000000000000446037ef11492e4d5ab4bb067f872d28f44d3e5433e56fca190ffffffff0181150000000000001976a91492e4d5ab4bb067f872d28f44d3e5433e56fca19088ac00000000"
    );
    expect(jobProof.toObject()).to.eql({
      extraNonce1: "46037ef1",
      extraNonce2: "0000000000000000",
      minerPubKey:
        "02f96821f6d9a6150e0ea06b00c8c77597e863330041be70438ff6fb211d7efe66",
      minerPubKeyHash: "92e4d5ab4bb067f872d28f44d3e5433e56fca190",
      nonce: "62a3aeb0",
      signature:
        "3045022100cd0c5025794c5bd5120a0634af824520360cb354df2c00c0606ccf227c44d0d802206a4040f5c0173c83827cd4d9e83f6c3f9fc09e336970776c02d07c211a97757641",
      time: "b851825e",
    });
    expect(jobProof.time().number()).to.eql(1585598904);
    expect(jobProof.nonce().number()).to.eql(2964235106);
    expect(jobProof.getTxid()).to.eql(
      "5fc289d2b04e98ca9ffb0156f5c66b9dac38af65630ea45ac8508a716af1e9b3"
    );
    expect(jobProof.getVin()).to.eql(0);

    expect(jobProof.getSpentTxid()).to.eql(
      "7f7927e1b425869442e8955f909e54964fef0b0426db44c907200aabd986522e"
    );
    expect(jobProof.getSpentVout()).to.eql(1);
  });

  it("should success load job proof from scripthex", async () => {
    const jobProof = index.BoostPowJobProof.fromHex(
      "483045022100cd0c5025794c5bd5120a0634af824520360cb354df2c00c0606ccf227c44d0d802206a4040f5c0173c83827cd4d9e83f6c3f9fc09e336970776c02d07c211a977576412102f96821f6d9a6150e0ea06b00c8c77597e863330041be70438ff6fb211d7efe660462a3aeb004b851825e0800000000000000000446037ef11492e4d5ab4bb067f872d28f44d3e5433e56fca190"
    );
    expect(jobProof.toObject()).to.eql({
      extraNonce1: "46037ef1",
      extraNonce2: "0000000000000000",
      minerPubKey:
        "02f96821f6d9a6150e0ea06b00c8c77597e863330041be70438ff6fb211d7efe66",
      minerPubKeyHash: "92e4d5ab4bb067f872d28f44d3e5433e56fca190",
      nonce: "62a3aeb0",
      signature:
        "3045022100cd0c5025794c5bd5120a0634af824520360cb354df2c00c0606ccf227c44d0d802206a4040f5c0173c83827cd4d9e83f6c3f9fc09e336970776c02d07c211a97757641",
      time: "b851825e",
    });
    expect(jobProof.time().number()).to.eql(1585598904);
    expect(jobProof.nonce().number()).to.eql(2964235106);
    expect(jobProof.getTxid()).to.eql(undefined);
    expect(jobProof.getVin()).to.eql(undefined);
  });

  it("should correctly get content and buffers as appropriate", async () => {
    const jobProof = index.BoostPowJobProof.fromObject({
      signature:
        "0000000000000000000000000000000000000000000000000000000000000001",
      minerPubKeyHash: "0000000000000000000000000000000000000000",
      extraNonce1: "00000000",
      extraNonce2: "0000000300000003",
      minerPubKey:
        "000000000000000000000000000000000000000000000000000000000000000001",
      time: "12300009",
      nonce: "30000002",
    });

    expect(jobProof.getTxid()).to.eql(undefined);
    expect(jobProof.getVin()).to.eql(undefined);
  });

  it("should correctly set and get miner", async () => {
    const address = new bsv.PublicKey(
      "020370f418d21765b33bc093db143aa1dd5cfefc97275652dc8396c2d567f93d65"
    );
    expect(address.toString()).to.eql(
      "020370f418d21765b33bc093db143aa1dd5cfefc97275652dc8396c2d567f93d65"
    );
    expect(address.toAddress().toString()).to.eql(
      "1FZXpFeq3qFUegVUPXQqnmK38UAqaA3Kdj"
    );
    expect(address.toAddress().toBuffer().toString("hex")).to.eql(
      "009fb8cb68b8850a13c7438e26e1d277b748be657a"
    );

    const jobProof = index.BoostPowJobProof.fromObject({
      signature:
        "0000000000000000000000000000000000000000000000000000000000000001",
      minerPubKeyHash: "9fb8cb68b8850a13c7438e26e1d277b748be657a",
      extraNonce1: "00000000",
      extraNonce2: "0000000300000003",
      minerPubKey:
        "020370f418d21765b33bc093db143aa1dd5cfefc97275652dc8396c2d567f93d65",
      time: "12300009",
      nonce: "30000002",
    });
    expect(jobProof.signature().hex()).to.eql(
      "0000000000000000000000000000000000000000000000000000000000000001"
    );

    expect(jobProof.minerPubKey().hex()).to.eql(
      "020370f418d21765b33bc093db143aa1dd5cfefc97275652dc8396c2d567f93d65"
    );

    expect(jobProof.minerPubKeyHash().hex()).to.eql(
      "9fb8cb68b8850a13c7438e26e1d277b748be657a"
    );
  });

  it("converting to ASM should always return the same result", async () => {
    const jobProof = index.BoostPowJobProof.fromObject({
      signature:
        "0000000000000000000000000000000000000000000000000000000000000006",
      minerPubKeyHash: "0000000000000000000000000000000000000001",
      extraNonce1: "00000002",
      extraNonce2: "0000000300000003",
      minerPubKey:
        "000000000000000000000000000000000000000000000000000000000000000007",
      time: "12300009",
      nonce: "00000005",
    });
    var jobProofScript = jobProof.toScript().toASM();
    expect(jobProofScript).to.eq(jobProof.toScript().toASM());
  });
});

describe("BoostPowJobProof ", () => {
  it("should correctly load fromHex", async () => {
    const job = index.BoostPowJobProof.fromHex(
      "4100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002102625DA04587E77640A731637CB24B3965DCDE3A05CE9CE837FFA217153F5F9ED8040B000000040100000004EA000000040000000014ECF5E2164C52D081EF19FBF59C81C66BABB02C55"
    );
    expect(job.toObject()).to.eql({
      extraNonce1: "00000000",
      extraNonce2: "ea000000",
      minerPubKey:
        "02625da04587e77640a731637cb24b3965dcde3a05ce9ce837ffa217153f5f9ed8",
      minerPubKeyHash: "ecf5e2164c52d081ef19fbf59c81c66babb02c55",
      nonce: "0b000000",
      signature:
        "0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      time: "01000000",
    });
  });
});
