"use strict";
const expect = require("chai").expect;
const index = require("../dist/index.js");

describe("boost #BoostPowString.fromObject", () => {
  it("should correctly decode from object to string", async () => {
    const obj = index.BoostPowString.fromObject({
      content:
        "0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095",
      bits: 443192243,
      metadataHash:
        "0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c",
      time: 1305200806,
      nonce: 2436437219,
      category: 1,
    });

    expect(obj.hash.hex).to.eql(
      "0000000000002917ed80650c6174aac8dfc46f5fe36480aaef682ff6cd83c3ca"
    );

    expect(obj.toString()).to.eql(
      "010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991"
    );
  });
});

describe("boost #BoostPowString.fromString", () => {
  it("should fail empty or invalid hex string", async () => {
    const badHex = [
      "",
      null,
      undefined,
      1,
      "1",
      "x9",
      "abc!",
      0,
      "abc",
      "0000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991",
    ];
    for (const item of badHex) {
      try {
        index.BoostHeader.fromString(item);
      } catch (ex) {
        continue;
      }
      // Should never get here
      expect(true).to.equal(false);
    }
    expect(true).to.equal(true);
  });

  it("should correctly decode Bitcoin header", async () => {
    const boostPowString = index.BoostPowString.fromString(
      "010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991"
    );
    expect(boostPowString.hash.hex).to.equal(
      "0000000000002917ed80650c6174aac8dfc46f5fe36480aaef682ff6cd83c3ca"
    );
  });

  it("should correctly decode First boost header mined by attila", async () => {
    const boostPowString = index.BoostPowString.fromString(
      "01000000646c726f77206f6c6c65480000000000000000000000000000000000000000002a96153663424ecfd483872e26e59bb02fd781a965df6575c437b0848e27d8aca6c8cb4dffff001dae5172dc"
    );

    // 01000000646c726f77206f6c6c65480000000000000000000000000000000000000000002a96153663424ecfd483872e26e59bb02fd781a965df6575c437b0848e27d8aca6c8cb4dffff001dae5172dc
    // 1000000646c726f77206f6c6c65480000000000000000000000000000000000000000002a96
    // 153663424ecfd483872e26e59bb02fd781a965df6575c437b0848e27d8aca6c8cb4dffff001dae5172dc
    expect(boostPowString.hash.hex).to.equal(
      "0000000086915e291fe43f10bdd8232f65e6eb64628bbb4d128be3836c21b6cc"
    );

    expect(boostPowString.toObject()).to.eql({
      hash: "0000000086915e291fe43f10bdd8232f65e6eb64628bbb4d128be3836c21b6cc",
      content:
        "00000000000000000000000000000000000000000048656c6c6f20776f726c64",
      bits: 486604799,
      difficulty: 1,
      metadataHash:
        "acd8278e84b037c47565df65a981d72fb09be5262e8783d4cf4e42633615962a",
      time: 1305200806,
      nonce: 3698479534,
      category: 1,
    });
  });

  it("should correctly decode Bitcoin header but invalid target", async () => {
    try {
      index.BoostPowString.fromString(
        "020000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991"
      );
    } catch (ex) {
      expect(ex.message).to.equal("INVALID_POW");
      return;
    }
    // Should never get here
    expect(true).to.equal(false);
  });

  it("should correctly decode from string to object", async () => {
    const obj = index.BoostPowString.fromString(
      "010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991"
    );
    expect(obj.toObject()).to.eql({
      hash: "0000000000002917ed80650c6174aac8dfc46f5fe36480aaef682ff6cd83c3ca",
      content:
        "0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095",
      bits: 443192243,
      difficulty: 157416.40184364,
      metadataHash:
        "0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c",
      time: 1305200806,
      nonce: 2436437219,
      category: 1,
    });
  });
});

describe("boost #BoostPowString validateProofOfWork ", () => {
  it("validProofOfWorkFromString success ", async () => {
    const result = index.BoostPowString.validProofOfWorkFromString(
      "010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991"
    );
    expect(result).to.eql(true);
  });

  it("validProofOfWorkFromObject success ", async () => {
    const result = index.BoostPowString.validProofOfWorkFromObject({
      content:
        "0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095",
      bits: 443192243,
      metadataHash:
        "0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c",
      time: 1305200806,
      nonce: 2436437219,
      category: 1,
    });
    expect(result).to.eql(true);
  });

  it("validProofOfWorkFromBuffer success ", async () => {
    const buf = Buffer.from(
      "010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991",
      "hex"
    );
    const result = index.BoostPowString.validProofOfWorkFromBuffer(buf);
    expect(result).to.eql(true);
  });

  it("validProofOfWorkFromObject success", async () => {
    const result = index.BoostPowString.validProofOfWorkFromObject({
      content:
        "0000000000000b60bc96a44724fd72daf9b92cf8ad00510b5224c6253ac40095",
      bits: 443192243,
      metadataHash:
        "0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c",
      time: 1305200806,
      nonce: 1,
      category: 1,
    });
    expect(result).to.eql(false);
  });

  it("getDifficulty success", async () => {
    const boostPowString = index.BoostPowString.fromString(
      "010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991"
    );
    const diff = boostPowString.difficulty;
    expect(diff).to.eql(157416.40184364);
  });

  it("fromStringArray success ", async () => {
    const result = index.BoostPowString.fromStringArray([
      "010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991",
      "010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991",
    ]);

    const boostPowString1 = index.BoostPowString.fromString(
      "010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991"
    );
    const boostPowString2 = index.BoostPowString.fromString(
      "010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991"
    );

    expect(result).to.eql([boostPowString1, boostPowString2]);
  });
  it("fromStringArray success ensure always sorted direction=desc", async () => {
    const result = index.BoostPowString.fromStringArray([
      "010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991",
      "010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991",
    ]);

    const boostPowString1 = index.BoostPowString.fromString(
      "010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991"
    );
    const boostPowString2 = index.BoostPowString.fromString(
      "010000009500c43a25c624520b5100adf82cb9f9da72fd2447a496bc600b0000000000006cd862370395dedf1da2841ccda0fc489e3039de5f1ccddef0e834991a65600ea6c8cb4db3936a1ae3143991"
    );

    // todo
    expect(result).to.eql([boostPowString1, boostPowString2]);
  });
});

describe("BoostPowString", () => {
  it("should get correctly accessors", async () => {
    const boostPowString = index.BoostPowString.fromString(
      "01000000646c726f77206f6c6c65480000000000000000000000000000000000000000002a96153663424ecfd483872e26e59bb02fd781a965df6575c437b0848e27d8aca6c8cb4dffff001dae5172dc"
    );
    expect(boostPowString.hash.hex).to.equal(
      "0000000086915e291fe43f10bdd8232f65e6eb64628bbb4d128be3836c21b6cc"
    );
    expect(boostPowString.toObject()).to.eql({
      hash: "0000000086915e291fe43f10bdd8232f65e6eb64628bbb4d128be3836c21b6cc",
      content:
        "00000000000000000000000000000000000000000048656c6c6f20776f726c64",
      bits: 486604799,
      difficulty: 1,
      metadataHash:
        "acd8278e84b037c47565df65a981d72fb09be5262e8783d4cf4e42633615962a",
      time: 1305200806,
      nonce: 3698479534,
      category: 1,
    });

    expect(boostPowString.content.hex).to.eql(
      "00000000000000000000000000000000000000000048656c6c6f20776f726c64"
    );
    expect(boostPowString.content.buffer.toString("hex")).to.eql(
      "646c726f77206f6c6c6548000000000000000000000000000000000000000000"
    );
    expect(boostPowString.content.string).to.eql(
      "dlrow olleH"
    );
    expect(boostPowString.content.string).to.eql("dlrow olleH");
    expect(boostPowString.bits.number).to.eql(486604799);
    expect(boostPowString.bits.number.toString(16)).to.eql("1d00ffff");
    expect(boostPowString.difficulty).to.eql(1);
    expect(boostPowString.metadataHash.hex).to.eql(
      "acd8278e84b037c47565df65a981d72fb09be5262e8783d4cf4e42633615962a"
    );
    expect(boostPowString.time.number).to.eql(1305200806);
    expect(boostPowString.nonce.number).to.eql(3698479534);
    expect(boostPowString.category.number).to.eql(1);
  });
});

// this test was generated using the c++ library Gigamonkey, which has the
// reference implementation of Boost.
describe("boost integration test ", () => {

  // category corresponds to version in the Bitcoin protocol.
  const categoryHex = "d2040000";
  const categoryBuffer = new Buffer(categoryHex, "hex");
  const categoryNumber = categoryBuffer.readInt32LE();

  // content corresponds to previous.
  const contentString = "hello animal";
  const contentBuffer = index.BoostUtilsHelper.stringToBuffer(
    contentString,
    32
  );
  const contentHex = new Buffer(contentBuffer).reverse().toString("hex");

  const difficulty = 0.0001;
  const compactNumber = index.BoostUtilsHelper.difficulty2bits(difficulty);
  const compactHex = "1e270fd8";

  // tag, data, and user nonce are parts of metadata, which corresponds to
  // coinbase.
  const tagString = "this is a tag";
  const tagBuffer = new Buffer(tagString, "ascii");
  const tagHex = tagBuffer.toString("hex");

  const dataString = "this is more additionalData";
  const dataBuffer = new Buffer(dataString, "ascii");
  const dataHex = dataBuffer.toString("hex");

  const userNonceHex = "c8010000";
  const userNonceBuffer = new Buffer(userNonceHex, "hex");
  const userNonceNumber = userNonceBuffer.readInt32LE();

  // this signature is in proper DER format but is not
  // really a signature of anything.
  const signatureHex = "300602010a02010b41";
  const signatureBuffer = new Buffer(signatureHex, "hex");

  // properly formatted but not a real public key.
  const minerPubKeyHex =
    "020000000000000000000000000000000000000000000000000000000000000007";
  const minerPubKeyBuffer = new Buffer(minerPubKeyHex, "hex");

  const minerPubKeyHashHex = "1A7340DA6FB3F728439A4BECFCA9CBEDDAF8795F";
  const minerPubKeyHashBuffer = new Buffer(minerPubKeyHashHex, "hex");
  const minerPubKeyHashString = "13Qrdvv3cXys9aryjZho6vHxDW3PRgX5pm";

  const extraNonce1Hex = "02000000";
  const extraNonce1Buffer = new Buffer(extraNonce1Hex, "hex");
  const extraNonce1Number = extraNonce1Buffer.readUInt32BE();

  const extraNonce2Hex = "0000000300000003";
  const extraNonce2Buffer = new Buffer(extraNonce2Hex, "hex");
  const extraNonce2Number = 0x0300000003;

  const timeHex = "12300009";
  const timeBuffer = new Buffer(timeHex, "hex");
  const timeNumber = timeBuffer.readUInt32LE();

  const nonceV1Hex = "f8fc1600";
  const nonceV1Buffer = new Buffer(nonceV1Hex, "hex");
  const nonceV1Number = nonceV1Buffer.readUInt32LE();

  const nonceV2Hex = "04670400";
  const nonceV2Buffer = new Buffer(nonceV2Hex, "hex");
  const nonceV2Number = nonceV2Buffer.readUInt32LE();

  const generalPurposeBitsHex = "ffffffff";
  const generalPurposeBitsBuffer = new Buffer(generalPurposeBitsHex, "hex");
  const generalPurposeBitsNumber = generalPurposeBitsBuffer.readUInt32LE();

  const categoryWithGPBNumber =
    (index.BoostUtilsHelper.generalPurposeBitsMask() & categoryNumber) |
      (~index.BoostUtilsHelper.generalPurposeBitsMask() & generalPurposeBitsNumber);
  const categoryWithGPBBuffer = index.BoostUtilsHelper.writeUInt32LE(categoryWithGPBNumber);
  const categoryWithGPBHex = categoryWithGPBBuffer.toString("hex");

  // metadata corresponds to the coinbase tx in the standard Bitcoin work
  // function. It includes a tag, some extra entropy, the miner address, and
  // whatever other data is desired.
  const metadataStringHex =
    "746869732069732061207461671A7340DA6FB3F728439A" +
    "4BECFCA9CBEDDAF8795F020000000000000300000003C801000074686973206973206D" +
    "6F7265206164646974696F6E616C44617461";

  const metadataHashHex =
    "68B24D6F0E88658FA05A5A632BF69D1FC078F604EF6E5E6CBC42BBE770199BE5";
  const metadataHashBuffer = new Buffer(metadataHashHex, "hex").reverse();

  const proofStringHexV1 =
    "D204000068656C6C6F20616E696D616C0000000000000000000000000000000000000000E59B1970E7BB42BC6C5E6EEF04F678C01F9DF62B635A5AA08F65880E6F4DB26812300009D80F271EF8FC1600";

  const proofHashHexV1 =
    "0000055A709366C027B2B7D9A07A7DA88A88CFE735EB802A93BF29B4CE06572B";
  const proofHashBufferV1 = new Buffer(proofHashHexV1, "hex").reverse();

  const proofStringHexV2 =
    "D2E4FF1F68656C6C6F20616E696D616C0000000000000000000000000000000000000000E59B1970E7BB42BC6C5E6EEF04F678C01F9DF62B635A5AA08F65880E6F4DB26812300009D80F271E04670400";

  const proofHashHexV2 =
    "000017EFE2D4079F311DB00D8696A33CF6E8986174BB7CC29562DD2B2D328664";
  const proofHashBufferV2 = new Buffer(proofHashHexV2, "hex").reverse();

  const expectedLockingScriptV1 =
    "626F6F7374706F77 OP_DROP D2040000 " +
    "68656C6C6F20616E696D616C0000000000000000000000000000000000000000 " +
    "D80F271E 74686973206973206120746167 C8010000 " +
    "74686973206973206D6F7265206164646974696F6E616C44617461 " +
    "OP_CAT OP_SWAP OP_5 OP_ROLL OP_DUP OP_TOALTSTACK OP_CAT OP_2 " +
    "OP_PICK OP_TOALTSTACK OP_5 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY " +
    "OP_CAT OP_5 OP_ROLL OP_SIZE OP_8 OP_EQUALVERIFY OP_CAT OP_SWAP " +
    "OP_CAT OP_HASH256 OP_SWAP OP_TOALTSTACK OP_CAT OP_CAT OP_SWAP " +
    "OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_FROMALTSTACK OP_CAT " +
    "OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY OP_CAT OP_HASH256 00 OP_CAT " +
    "OP_BIN2NUM OP_FROMALTSTACK OP_SIZE OP_4 OP_EQUALVERIFY OP_3 " +
    "OP_SPLIT OP_DUP OP_BIN2NUM OP_3 21 OP_WITHIN OP_VERIFY " +
    "OP_TOALTSTACK OP_DUP OP_BIN2NUM 0 OP_GREATERTHAN OP_VERIFY " +
    "0000000000000000000000000000000000000000000000000000000000 " +
    "OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_8 OP_MUL OP_RSHIFT 00 " +
    "OP_CAT OP_BIN2NUM OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH160 " +
    "OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG";

const expectedLockingScriptV2 =
    "626F6F7374706F77 OP_DROP D2040000 " +
    "68656C6C6F20616E696D616C0000000000000000000000000000000000000000 " +
    "D80F271E 74686973206973206120746167 C8010000 " +
    "74686973206973206D6F7265206164646974696F6E616C44617461 " +
    "OP_CAT OP_SWAP OP_5 OP_ROLL OP_DUP OP_TOALTSTACK OP_CAT OP_2 " +
    "OP_PICK OP_TOALTSTACK OP_6 OP_ROLL OP_SIZE OP_4 OP_EQUALVERIFY " +
    "OP_CAT OP_6 OP_ROLL OP_SIZE OP_8 OP_EQUALVERIFY OP_CAT OP_SWAP OP_CAT " +
    "OP_HASH256 OP_SWAP OP_TOALTSTACK OP_CAT OP_TOALTSTACK FF1F00E0 " +
    "OP_DUP OP_INVERT OP_TOALTSTACK OP_AND OP_SWAP OP_FROMALTSTACK OP_AND " +
    "OP_OR OP_FROMALTSTACK OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY " +
    "OP_CAT OP_FROMALTSTACK OP_CAT OP_SWAP OP_SIZE OP_4 OP_EQUALVERIFY " +
    "OP_CAT OP_HASH256 00 OP_CAT OP_BIN2NUM OP_FROMALTSTACK OP_SIZE OP_4 " +
    "OP_EQUALVERIFY OP_3 OP_SPLIT OP_DUP OP_BIN2NUM OP_3 21 OP_WITHIN " +
    "OP_VERIFY OP_TOALTSTACK OP_DUP OP_BIN2NUM 0 OP_GREATERTHAN OP_VERIFY " +
    "0000000000000000000000000000000000000000000000000000000000 " +
    "OP_CAT OP_FROMALTSTACK OP_3 OP_SUB OP_8 OP_MUL OP_RSHIFT 00 " +
    "OP_CAT OP_BIN2NUM OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH160 " +
    "OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG"

  const expectedUnlockingScriptV1 =
    "300602010A02010B41 " +
    "020000000000000000000000000000000000000000000000000000000000000007 " +
    "F8FC1600 12300009 0000000300000003 02000000 " +
    "1A7340DA6FB3F728439A4BECFCA9CBEDDAF8795F";

  const expectedUnlockingScriptV2 =
    "300602010A02010B41 " +
    "020000000000000000000000000000000000000000000000000000000000000007 " +
    "04670400 12300009 0000000300000003 02000000 FFFFFFFF " +
    "1A7340DA6FB3F728439A4BECFCA9CBEDDAF8795F";

  const jobV1 = index.BoostPowJob.fromObject({
    category: categoryHex,
    content: contentHex,
    diff: difficulty,
    tag: tagHex,
    additionalData: dataHex,
    userNonce: userNonceHex,
  });

  const jobV2 = index.BoostPowJob.fromObject({
    category: categoryHex,
    content: contentHex,
    diff: difficulty,
    tag: tagHex,
    additionalData: dataHex,
    userNonce: userNonceHex,
    useGeneralPurposeBits: true
  });

  const solutionV1 = index.BoostPowJobProof.fromObject({
    signature: signatureHex,
    minerPubKeyHash: minerPubKeyHashHex,
    extraNonce1: extraNonce1Hex,
    extraNonce2: extraNonce2Hex,
    minerPubKey: minerPubKeyHex,
    time: timeHex,
    nonce: nonceV1Hex,
  });

  const solutionV2 = index.BoostPowJobProof.fromObject({
    signature: signatureHex,
    minerPubKeyHash: minerPubKeyHashHex,
    extraNonce1: extraNonce1Hex,
    extraNonce2: extraNonce2Hex,
    minerPubKey: minerPubKeyHex,
    time: timeHex,
    nonce: nonceV2Hex,
    generalPurposeBits: generalPurposeBitsHex
  });

  const metadata = index.BoostPowMetadata.fromObject({
    tag: tagHex,
    minerPubKeyHash: minerPubKeyHashHex,
    extraNonce1: extraNonce1Hex,
    extraNonce2: extraNonce2Hex,
    userNonce: userNonceHex,
    additionalData: dataHex,
  });

  const proofV1 = index.BoostPowJob.tryValidateJobProof(jobV1, solutionV1);
  const proofV2 = index.BoostPowJob.tryValidateJobProof(jobV2, solutionV2);

  console.log("integration test: generating scripts");
  const lockingScriptV1 = jobV1.toScript().toASM().toUpperCase();
  const unlockingScriptV1 = solutionV1.toScript().toASM().toUpperCase();

  const lockingScriptV2 = jobV2.toScript().toASM().toUpperCase();
  const unlockingScriptV2 = solutionV2.toScript().toASM().toUpperCase();
  console.log("scripts generated");

  // check if scripts are correct.
  it("should create the correct locking script", async () => {
    expect(lockingScriptV1).to.eql(expectedLockingScriptV1);
    expect(lockingScriptV2).to.eql(expectedLockingScriptV2);
  });

  it("should create the correct unlocking script", async () => {
    expect(unlockingScriptV1).to.eql(expectedUnlockingScriptV1);
    expect(unlockingScriptV2).to.eql(expectedUnlockingScriptV2);
  });

  // check getters for job.
  it("should get category from locking script", async () => {
    expect(jobV1.category.hex).to.eql(categoryHex);
    expect(jobV1.category.number).to.eql(categoryNumber);
    expect(jobV1.category.buffer).to.eql(categoryBuffer);

    expect(jobV2.category.hex).to.eql(categoryHex);
    expect(jobV2.category.number).to.eql(categoryNumber);
    expect(jobV2.category.buffer).to.eql(categoryBuffer);
  });

  it("should get content from locking script", async () => {
    expect(jobV1.content.hex).to.eql(contentHex);
    expect(jobV1.content.buffer).to.eql(contentBuffer);
    expect(jobV1.content.string).to.eql(contentString);

    expect(jobV2.content.hex).to.eql(contentHex);
    expect(jobV2.content.buffer).to.eql(contentBuffer);
    expect(jobV2.content.string).to.eql(contentString);
  });

  it("should get difficulty from locking script", async () => {
    expect(jobV1.difficulty).to.eql(difficulty);
    expect(jobV1.bits.number.toString(16)).to.eql(compactHex);

    expect(jobV2.difficulty).to.eql(difficulty);
    expect(jobV2.bits.number.toString(16)).to.eql(compactHex);
  });

  it("should get tag from locking script", async () => {
    expect(jobV1.tag.hex).to.eql(tagHex);
    expect(jobV1.tag.string).to.eql(tagString);
    expect(jobV1.tag.buffer).to.eql(tagBuffer);

    expect(jobV2.tag.hex).to.eql(tagHex);
    expect(jobV2.tag.string).to.eql(tagString);
    expect(jobV2.tag.buffer).to.eql(tagBuffer);
  });

  it("should get addational data from locking script", async () => {
    expect(jobV1.additionalData.hex).to.eql(dataHex);
    expect(jobV1.additionalData.string).to.eql(dataString);
    expect(jobV1.additionalData.buffer).to.eql(dataBuffer);

    expect(jobV2.additionalData.hex).to.eql(dataHex);
    expect(jobV2.additionalData.string).to.eql(dataString);
    expect(jobV2.additionalData.buffer).to.eql(dataBuffer);
  });

  it("should get user nonce from locking script", async () => {
    expect(jobV1.userNonce.hex).to.eql(userNonceHex);
    expect(jobV1.userNonce.number).to.eql(userNonceNumber);
    expect(jobV1.userNonce.buffer).to.eql(userNonceBuffer);

    expect(jobV2.userNonce.hex).to.eql(userNonceHex);
    expect(jobV2.userNonce.number).to.eql(userNonceNumber);
    expect(jobV2.userNonce.buffer).to.eql(userNonceBuffer);
  });

  // check getters for solution
  it("should get signature", async () => {
    expect(solutionV1.signature.buffer).to.eql(signatureBuffer);
    expect(solutionV1.signature.hex).to.eql(signatureHex);

    expect(solutionV2.signature.buffer).to.eql(signatureBuffer);
    expect(solutionV2.signature.hex).to.eql(signatureHex);
  });

  it("should get miner pubkey", async () => {
    expect(solutionV1.minerPubKey.buffer).to.eql(minerPubKeyBuffer);
    expect(solutionV1.minerPubKey.hex).to.eql(minerPubKeyHex);

    expect(solutionV2.minerPubKey.buffer).to.eql(minerPubKeyBuffer);
    expect(solutionV2.minerPubKey.hex).to.eql(minerPubKeyHex);
  });

  it("should get nonce", async () => {
    expect(solutionV1.nonce.number).to.eql(nonceV1Number);
    expect(solutionV1.nonce.buffer).to.eql(nonceV1Buffer);

    expect(solutionV2.nonce.number).to.eql(nonceV2Number);
    expect(solutionV2.nonce.buffer).to.eql(nonceV2Buffer);
  });

  it("should get time", async () => {
    expect(solutionV1.time.number).to.eql(timeNumber);
    expect(solutionV1.time.buffer).to.eql(timeBuffer);

    expect(solutionV2.time.number).to.eql(timeNumber);
    expect(solutionV2.time.buffer).to.eql(timeBuffer);
  });

  it("should get miner pubkey hash from solution", async () => {
    expect(solutionV1.minerPubKeyHash.buffer).to.eql(minerPubKeyHashBuffer);
    expect(solutionV1.minerPubKeyHash.hex.toUpperCase()).to.eql(
      minerPubKeyHashHex
    );

    expect(solutionV2.minerPubKeyHash.buffer).to.eql(minerPubKeyHashBuffer);
    expect(solutionV2.minerPubKeyHash.hex.toUpperCase()).to.eql(
      minerPubKeyHashHex
    );
  });

  it("should get extra nonce 1 from solution", async () => {
    expect(solutionV1.extraNonce1.number).to.eql(extraNonce1Number);
    expect(solutionV1.extraNonce1.buffer).to.eql(extraNonce1Buffer);

    expect(solutionV2.extraNonce1.number).to.eql(extraNonce1Number);
    expect(solutionV2.extraNonce1.buffer).to.eql(extraNonce1Buffer);
  });

  it("should get extra nonce 2 from solution", async () => {
    expect(solutionV1.extraNonce2.buffer).to.eql(extraNonce2Buffer);
    expect(solutionV2.extraNonce2.buffer).to.eql(extraNonce2Buffer);
  });

  // check valid metadata
  it("should generate correct metadata hash", async () => {
    expect(metadata.hash.hex.toUpperCase()).to.eql(metadataHashHex);
    expect(metadata.hash.buffer).to.eql(metadataHashBuffer);
  });

  it("should should write metadata to string", async () => {
    expect(metadata.toString().toUpperCase()).to.eql(metadataStringHex);
  });

  // check getters for metadata
  it("should get tag from metadata", async () => {
    expect(metadata.tag.string).to.eql(tagString);
    expect(metadata.tag.buffer).to.eql(tagBuffer);
  });

  it("should get addational data from metadata", async () => {
    expect(metadata.additionalData.string).to.eql(dataString);
    expect(metadata.additionalData.buffer).to.eql(dataBuffer);
  });

  it("should get user nonce from metadata", async () => {
    expect(metadata.userNonce.number).to.eql(userNonceNumber);
    expect(metadata.userNonce.buffer).to.eql(userNonceBuffer);
  });

  it("should get miner pubkey hash from metadata", async () => {
    expect(metadata.minerPubKeyHash.buffer).to.eql(minerPubKeyHashBuffer);
  });

  it("should get extra nonce 1 from metadata", async () => {
    expect(metadata.extraNonce1.number).to.eql(extraNonce1Number);
    expect(metadata.extraNonce1.buffer).to.eql(extraNonce1Buffer);
  });

  it("should get extra nonce 2 from metadata", async () => {
    expect(metadata.extraNonce2.buffer).to.eql(extraNonce2Buffer);
  });

  // check valid string
  it("should generate valid string v1", async () => {
    expect(proofV1).to.not.eql(null);
    let temp = proofV1.toString();
    expect(proofV1.boostPowString.toString().toUpperCase()).to.eql(
      proofStringHexV1
    );
    expect(proofV1.boostPowString.hash.hex.toUpperCase()).to.eql(proofHashHexV1);
    expect(proofV1.boostPowString.hash.buffer).to.eql(proofHashBufferV1);

    expect(proofV1.boostPowString.content.hex).to.eql(contentHex);
    expect(proofV1.boostPowString.content.string).to.eql(contentString);
    expect(proofV1.boostPowString.content.buffer).to.eql(contentBuffer);

    expect(proofV1.boostPowString.nonce.number).to.eql(nonceV1Number);
    expect(proofV1.boostPowString.time.number).to.eql(timeNumber);
    expect(proofV1.boostPowString.category.number).to.eql(categoryNumber);
    expect(proofV1.boostPowString.bits.number).to.eql(compactNumber);
    expect(proofV1.boostPowString.metadataHash.hex.toUpperCase()).to.eql(
      metadataHashHex
    );
  });

  it("should generate valid string v2", async () => {
    expect(proofV2).to.not.eql(null);
    let temp = proofV1.toString();
    expect(proofV2.boostPowString.toString().toUpperCase()).to.eql(
      proofStringHexV2
    );
    expect(proofV2.boostPowString.hash.hex.toUpperCase()).to.eql(proofHashHexV2);
    expect(proofV2.boostPowString.hash.buffer).to.eql(proofHashBufferV2);

    expect(proofV2.boostPowString.content.hex).to.eql(contentHex);
    expect(proofV2.boostPowString.content.string).to.eql(contentString);
    expect(proofV2.boostPowString.content.buffer).to.eql(contentBuffer);

    expect(proofV2.boostPowString.nonce.number).to.eql(nonceV2Number);
    expect(proofV2.boostPowString.time.number).to.eql(timeNumber);
    expect(proofV2.boostPowString.category.number).to.eql(categoryWithGPBNumber);
    expect(proofV2.boostPowString.bits.number).to.eql(compactNumber);
    expect(proofV2.boostPowString.metadataHash.hex.toUpperCase()).to.eql(
      metadataHashHex
    );
  });

  it("should write as objects and back", async () => {
    expect(index.BoostPowJob.fromObject(jobV1.toObject())).to.eql(jobV1);
    expect(index.BoostPowJob.fromObject(jobV2.toObject())).to.eql(jobV2);
    expect(index.BoostPowJobProof.fromObject(solutionV1.toObject())).to.eql(solutionV1);
    expect(index.BoostPowJobProof.fromObject(solutionV2.toObject())).to.eql(solutionV2);
    expect(index.BoostPowMetadata.fromObject(metadata.toObject())).to.eql(
      metadata
    );
  });
});
