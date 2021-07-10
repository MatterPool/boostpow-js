"use strict";
Object.defineProperty(exports, "__esModule", {value : true});
exports.BoostPowJobModel = void 0;
const bsv = require("bsv");
const boost_pow_string_model_1 = require("./boost-pow-string-model");
const boost_pow_metadata_model_1 = require("./boost-pow-metadata-model");
const boost_utils_1 = require("./boost-utils");
class BoostPowJobModel {
  constructor(content, difficulty, category, tag, additionalData, userNonce,
              useGeneralPurposeBits,
              // Optional tx information attached or not
              txid, vout, value) {
    this.content = content;
    this.difficulty = difficulty;
    this.category = category;
    this.tag = tag;
    this.additionalData = additionalData;
    this.userNonce = userNonce;
    this.useGeneralPurposeBits = useGeneralPurposeBits;
    this.txid = txid;
    this.vout = vout;
    this.value = value;
  }
  trimBufferString(str, trimTrailingNulls = true) {
    const content = str.toString('utf8');
    if (trimTrailingNulls) {
      return content.replace(/\0+$/g, '');
    } else {
      return content;
    }
  }
  getContentBuffer() { return this.content; }
  getContentString(trimTrailingNulls = true) {
    return this.trimBufferString(this.content, trimTrailingNulls);
  }
  getContentHex() {
    let content = new Buffer(this.content);
    return content.reverse().toString('hex');
  }
  getDiff() { return this.difficulty; }
  getCategoryBuffer() { return this.category; }
  getCategoryNumber() { return this.category.readInt32LE(); }
  getCategoryHex() { return this.category.toString('hex'); }
  getCategoryString(trimTrailingNulls = true) {
    return this.trimBufferString(this.category, trimTrailingNulls);
  }
  getTagString(trimTrailingNulls = true) {
    return this.trimBufferString(this.tag, trimTrailingNulls);
  }
  getTagHex() { return this.tag.toString('hex'); }
  getTagBuffer() { return this.tag; }
  getAdditionalDataString(trimTrailingNulls = true) {
    return this.trimBufferString(this.additionalData, trimTrailingNulls);
  }
  getAdditionalDataHex() { return this.additionalData.toString('hex'); }
  getAdditionalDataBuffer() { return this.additionalData; }
  getUserNonce() { return this.getUserNonceNumber(); }
  getUserNonceNumber() { return this.userNonce.readUInt32LE(); }
  getUserNonceBuffer() { return this.userNonce; }
  getUserNonceHex() { return this.userNonce.toString('hex'); }
  static fromObject(params) {
    if (params.content && params.content.length > 64) {
      throw new Error('content too large. Max 32 bytes.');
    }
    if (params.diff <= 0 || isNaN(params.diff) ||
        (typeof params.diff !== 'number')) {
      throw new Error('diff must be a positive number.');
    }
    if (params.category && params.category.length > 8) {
      throw new Error('category too large. Max 4 bytes.');
    }
    if (params.tag && params.tag.length > 40) {
      throw new Error('tag too large. Max 20 bytes.');
    }
    if (params.userNonce && params.userNonce.length > 8) {
      throw new Error('userNonce too large. Max 4 bytes.');
    }
    return new BoostPowJobModel(
        boost_utils_1.BoostUtils.createBufferAndPad(params.content, 32),
        params.diff,
        boost_utils_1.BoostUtils.createBufferAndPad(params.category, 4, false),
        params.tag ? new Buffer(params.tag, 'hex') : new Buffer(0),
        params.additionalData ? new Buffer(params.additionalData, 'hex')
                              : new Buffer(0),
        // TODO: if userNonce is not provided, it should be generated randomly,
        // not defaulted to zero.
        boost_utils_1.BoostUtils.createBufferAndPad(params.userNonce, 4, false),
        false);
  }
  getBits() {
    return boost_utils_1.BoostUtils.difficulty2bits(this.difficulty);
  }
  bits() { return boost_utils_1.BoostUtils.difficulty2bits(this.difficulty); }
  static hexBitsToDifficulty(hexBits) {
    let targetHex = (hexBits.match(/../g) || []).join('');
    let targetInt = parseInt(targetHex, 16);
    return boost_utils_1.BoostUtils.difficulty(targetInt);
  }
  getBitsHex() { return this.getTargetAsNumberHex(); }
  toObject() {
    return {
      content : this.getContentHex(),
      diff : this.difficulty,
      category : this.category.toString('hex'),
      tag : this.tag.toString('hex'),
      additionalData : this.additionalData.toString('hex'),
      userNonce : this.userNonce.toString('hex'),
    };
  }
  getTargetAsNumberHex() {
    const i = boost_utils_1.BoostUtils.difficulty2bits(this.difficulty);
    return Buffer.from(i.toString(16), 'hex').toString('hex');
  }
  getTargetAsNumberBuffer() {
    const i = boost_utils_1.BoostUtils.difficulty2bits(this.difficulty);
    return Buffer.from(i.toString(16), 'hex').reverse();
  }
  getId() { return this.getScriptHash(); }
  toHex() { return this.toScript(true); }
  toScript(isHex = false) {
    let buildOut = bsv.Script();
    buildOut.add(Buffer.from('boostpow', 'utf8'));
    buildOut.add(bsv.Opcode.OP_DROP);
    buildOut.add(this.category);
    buildOut.add(this.content);
    buildOut.add(this.getTargetAsNumberBuffer());
    buildOut.add(this.tag);
    buildOut.add(this.userNonce);
    buildOut.add(this.additionalData);
    // Add the rest of the script
    for (const op of BoostPowJobModel.scriptOperations(
             this.useGeneralPurposeBits)) {
      buildOut.add(op);
    }
    for (let i = 0; i < buildOut.chunks.length; i++) {
      if (!buildOut.checkMinimalPush(i)) {
        throw new Error('not min push');
      }
    }
    const hex = buildOut.toHex();
    const fromhex = bsv.Script.fromHex(hex);
    const hexIso = fromhex.toHex();
    if (hex != hexIso) {
      throw new Error('Not isomorphic');
    }
    if (isHex) {
      return hexIso;
    }
    // Return script
    return buildOut;
  }
  getDifficulty() { return this.difficulty; }
  static remainingOperationsMatchExactly(remainingChunks, start, expectedOps) {
    let i = 0;
    if ((remainingChunks.length - start) !== expectedOps.length) {
      return false;
    }
    while (i < (remainingChunks.length - start)) {
      // console.log(' i < ', remainingChunks.length, expectedOps[i],
      // remainingChunks[i]);
      if ((
              // If it's a buffer, then ensure the value matches expect length
              remainingChunks[start + i].buf &&
              (remainingChunks[start + i].len === expectedOps[i].length)) ||
          (remainingChunks[start + i].buf === undefined &&
           expectedOps[i] === remainingChunks[start + i].opcodenum)) {
        i++;
      } else {
        return false;
      }
    }
    return true;
  }
  static readScript(script, txid, vout, value) {
    let category;
    let content;
    let diff;
    let tag;
    let additionalData;
    let userNonce;
    let useGeneralPurposeBits;
    // console.log('script.chunks', script.chunks,  script.chunks.length);
    if (
        // boostv01
        script.chunks[0].buf.toString('utf8') === 'boostpow' &&
        // Drop the identifier
        script.chunks[1].opcodenum === bsv.Opcode.OP_DROP &&
        // Category
        script.chunks[2].buf && script.chunks[2].opcodenum === 4 &&
        // Content
        script.chunks[3].buf && script.chunks[3].len === 32 &&
        // Target
        script.chunks[4].buf && script.chunks[4].len === 4 &&
        // Tag
        script.chunks[5].buf && script.chunks[5].len === 20 &&
        // User Nonce
        script.chunks[6].buf && script.chunks[6].len === 4 &&
        // Additional Data
        script.chunks[7].buf) {
      if (BoostPowJobModel.remainingOperationsMatchExactly(
              script.chunks, 8,
              BoostPowJobModel.scriptOperationsV1NoASICBoost())) {
        useGeneralPurposeBits = false;
      } else if (BoostPowJobModel.remainingOperationsMatchExactly(
                     script.chunks, 8,
                     BoostPowJobModel.scriptOperationsV2ASICBoost())) {
        useGeneralPurposeBits = true;
      } else
        throw new Error('Not valid Boost Output');
      category = script.chunks[2].buf;
      content = script.chunks[3].buf;
      let targetHex = (script.chunks[4].buf.toString('hex').match(/../g) || [])
                          .reverse()
                          .join('');
      let targetInt = parseInt(targetHex, 16);
      diff = boost_utils_1.BoostUtils.difficulty(targetInt);
      tag = script.chunks[5].buf;
      // tag = (script.chunks[5].buf.toString('hex').match(/../g) ||
      // []).reverse().join('');
      userNonce = script.chunks[6].buf;
      // userNonce = (script.chunks[6].buf.toString('hex').match(/../g) ||
      // []).reverse().join('');
      additionalData = script.chunks[7].buf;
      // additionalData = (script.chunks[7].buf.toString('hex').match(/../g) ||
      // []).reverse().join('');
      return new BoostPowJobModel(content, diff, category, tag, additionalData,
                                  userNonce, useGeneralPurposeBits, txid, vout,
                                  value);
    }
    throw new Error('Not valid Boost Output');
  }
  static fromHex(asm, txid, vout, value) {
    return BoostPowJobModel.readScript(new bsv.Script(asm), txid, vout, value);
  }
  static fromASM(asm, txid, vout, value) {
    return BoostPowJobModel.readScript(new bsv.Script.fromASM(asm), txid, vout,
                                       value);
  }
  toASM() {
    const makeHex = this.toHex();
    const makeAsm = new bsv.Script(makeHex);
    return makeAsm.toASM();
  }
  static fromASM4(str, txid, vout, value) {
    return BoostPowJobModel.fromHex(str, txid, vout, value);
  }
  static fromASM2(str, txid, vout, value) {
    return BoostPowJobModel.fromHex(str, txid, vout, value);
  }
  toString() {
    const makeHex = this.toHex();
    const makeAsm = new bsv.Script(makeHex);
    return makeAsm.toString();
  }
  static fromString(str, txid, vout, value) {
    return BoostPowJobModel.fromHex(str, txid, vout, value);
  }
  static fromScript(script, txid, vout, value) {
    return BoostPowJobModel.fromHex(script, txid, vout, value);
  }
  // Optional attached information if available
  getTxOutpoint() {
    return {
      txid : this.txid,
      vout : this.vout,
      value : this.value,
    };
  }
  // Optional attached information if available
  getTxid() { return this.txid; }
  // Optional attached information if available
  getVout() { return this.vout; }
  // Optional attached information if available
  getValue() { return this.value; }
  getScriptHash() {
    const hex = this.toHex();
    const buffer = Buffer.from(hex, 'hex');
    return bsv.crypto.Hash.sha256(buffer).reverse().toString('hex');
  }
  static fromTransaction(tx, vout = 0) {
    if (!tx) {
      return undefined;
    }
    if (vout > tx.outputs.length - 1 || vout < 0 || vout === undefined ||
        vout === null) {
      return undefined;
    }
    if (tx.outputs[vout].script && tx.outputs[vout].script.chunks[0].buf &&
        tx.outputs[vout].script.chunks[0].buf.toString('hex') ===
            Buffer.from('boostpow', 'utf8').toString('hex')) {
      return BoostPowJobModel.fromScript(tx.outputs[vout].script, tx.hash, vout,
                                         tx.outputs[vout].satoshis);
    }
    return undefined;
  }
  static fromTransactionGetAllOutputs(tx) {
    if (!tx) {
      return [];
    }
    const boostJobs = [];
    let o = 0;
    for (const out of tx.outputs) {
      if (out.script && out.script.chunks[0].buf &&
          out.script.chunks[0].buf.toString('hex') ===
              Buffer.from('boostpow', 'utf8').toString('hex')) {
        boostJobs.push(
            BoostPowJobModel.fromScript(out.script, tx.hash, o, out.satoshis));
      }
      o++;
    }
    return boostJobs;
  }
  static fromRawTransaction(rawtx, vout = 0) {
    if (isNaN(vout)) {
      return undefined;
    }
    const tx = new bsv.Transaction(rawtx);
    return BoostPowJobModel.fromTransaction(tx, vout);
  }
  /**
   * Create a transaction fragment that can be modified to redeem the boost job
   *
   * @param boostPowJob Boost Job to redeem
   * @param boostPowJobProof Boost job proof to use to redeem
   * @param privateKey The private key string of the minerPubKeyHash
   */
  static createRedeemTransaction(boostPowJob, boostPowJobProof, privateKeyStr,
                                 receiveAddressStr) {
    const boostPowString =
        BoostPowJobModel.tryValidateJobProof(boostPowJob, boostPowJobProof);
    if (!boostPowString) {
      throw new Error('createRedeemTransaction: Invalid Job Proof');
    }
    if (!boostPowJob.getTxid() ||
        (boostPowJob.getVout() === undefined ||
         boostPowJob.getVout() === null) ||
        !boostPowJob.getValue()) {
      throw new Error(
          'createRedeemTransaction: Boost Pow Job requires txid, vout, and value');
    }
    let tx = new bsv.Transaction();
    tx.addInput(new bsv.Transaction.Input({
      output : new bsv.Transaction.Output(
          {script : boostPowJob.toScript(), satoshis : boostPowJob.getValue()}),
      prevTxId : boostPowJob.getTxid(),
      outputIndex : boostPowJob.getVout(),
      script : bsv.Script.empty()
    }));
    const privKey = new bsv.PrivateKey(privateKeyStr);
    const sigtype =
        bsv.crypto.Signature.SIGHASH_ALL | bsv.crypto.Signature.SIGHASH_FORKID;
    const flags = bsv.Script.Interpreter.SCRIPT_VERIFY_MINIMALDATA |
                  bsv.Script.Interpreter.SCRIPT_ENABLE_SIGHASH_FORKID |
                  bsv.Script.Interpreter.SCRIPT_ENABLE_MAGNETIC_OPCODES |
                  bsv.Script.Interpreter.SCRIPT_ENABLE_MONOLITH_OPCODES;
    const receiveSats =
        boostPowJob.getValue() !== undefined ? boostPowJob.getValue() : 0;
    tx.addOutput(new bsv.Transaction.Output({
      script : bsv.Script(new bsv.Address(receiveAddressStr)),
      satoshis : receiveSats ? receiveSats - 517 : 0 // subtract miner fee
    }));
    const signature = bsv.Transaction.sighash.sign(
        tx, privKey, sigtype, 0, tx.inputs[0].output.script,
        new bsv.crypto.BN(tx.inputs[0].output.satoshis), flags);
    const unlockingScript = new bsv.Script({});
    unlockingScript
        .add(Buffer.concat(
            [ signature.toBuffer(), Buffer.from([ sigtype & 0xff ]) ]))
        .add(privKey.toPublicKey().toBuffer())
        .add(boostPowJobProof.getNonce())
        .add(boostPowJobProof.getTime())
        .add(boostPowJobProof.getExtraNonce2())
        .add(boostPowJobProof.getExtraNonce1())
        .add(boostPowJobProof.getMinerPubKeyHash());
    tx.inputs[0].setScript(unlockingScript);
    return tx;
  }
  static createBoostPowMetadata(boostPowJob, boostPowJobProof) {
    return boost_pow_metadata_model_1.BoostPowMetadataModel.fromBuffer({
      tag : boostPowJob.getTagBuffer(),
      minerPubKeyHash : boostPowJobProof.getMinerPubKeyHash(),
      extraNonce1 : boostPowJobProof.getExtraNonce1(),
      extraNonce2 : boostPowJobProof.getExtraNonce2(),
      userNonce : boostPowJob.getUserNonceBuffer(),
      additionalData : boostPowJob.getAdditionalDataBuffer(),
    });
  }
  static tryValidateJobProof(boostPowJob, boostPowJobProof, debug = false) {
    const boostPowMetadataCoinbaseString =
        BoostPowJobModel.createBoostPowMetadata(boostPowJob, boostPowJobProof);
    if (debug) {
      console.log('BoostPowString.tryValidateJobProof');
      console.log('category', boostPowJob.getCategoryBuffer().toString('hex'),
                  boostPowJob.getCategoryBuffer().byteLength);
      console.log('content', boostPowJob.getContentBuffer().toString('hex'),
                  boostPowJob.getContentBuffer().byteLength);
      console.log('boostPowMetadataCoinbaseString',
                  boostPowMetadataCoinbaseString.toBuffer().toString('hex'),
                  boostPowMetadataCoinbaseString,
                  boostPowMetadataCoinbaseString.hash());
      console.log('time', boostPowJobProof.getTime().toString('hex'),
                  boostPowJobProof.getTime().byteLength);
      console.log('target',
                  boostPowJob.getTargetAsNumberBuffer().toString('hex'),
                  boostPowJob.getTargetAsNumberBuffer().byteLength);
      console.log('nonce', boostPowJobProof.getNonce().toString('hex'),
                  boostPowJobProof.getNonce().byteLength);
      console.log('userNonce', boostPowJob.getUserNonceBuffer().toString('hex'),
                  boostPowJob.getUserNonceBuffer().byteLength);
      console.log(
          "metadata hash:",
          boostPowMetadataCoinbaseString.hashAsBuffer().toString('hex'));
    }
    const headerBuf = Buffer.concat([
      boostPowJob.getCategoryBuffer(),
      boostPowJob.getContentBuffer(),
      boostPowMetadataCoinbaseString.hashAsBuffer(),
      boostPowJobProof.getTime(),
      boostPowJob.getTargetAsNumberBuffer(),
      boostPowJobProof.getNonce(),
    ]);
    const blockHeader = bsv.BlockHeader.fromBuffer(headerBuf);
    if (debug) {
      console.log('boostHeader candidate', headerBuf.toString('hex'),
                  blockHeader);
    }
    if (blockHeader.validProofOfWork()) {
      if (debug) {
        console.log('BoostPowString.tryValidateJobProof is valid');
      }
      return {
        boostPowString :
            new boost_pow_string_model_1.BoostPowStringModel(blockHeader),
        boostPowMetadata : boostPowMetadataCoinbaseString,
      };
    }
    if (debug) {
      console.log('BoostPowString.tryValidateJobProof is invalid');
    }
    return null;
  }
  static loopOperation(loopIterations, generateFragmentInvoker) {
    let concatOps = [];
    for (let i = 0; i < loopIterations; i++) {
      concatOps = concatOps.concat(generateFragmentInvoker());
    }
    return concatOps;
  }
  static scriptOperations(useGeneralPurposeBits) {
    if (useGeneralPurposeBits)
      return this.scriptOperationsV2ASICBoost();
    return this.scriptOperationsV1NoASICBoost();
  }
  static scriptOperationsV1NoASICBoost() {
    return [
      // CAT SWAP
      bsv.Opcode.OP_CAT,
      bsv.Opcode.OP_SWAP,
      // {5} ROLL DUP TOALTSTACK CAT                // copy mining pool’s pubkey
      // hash to alt stack. A copy remains on the stack.
      bsv.Opcode.OP_5,
      bsv.Opcode.OP_ROLL,
      bsv.Opcode.OP_DUP,
      bsv.Opcode.OP_TOALTSTACK,
      bsv.Opcode.OP_CAT,
      // {2} PICK TOALTSTACK                         // copy target and push to
      // altstack.
      bsv.Opcode.OP_2,
      bsv.Opcode.OP_PICK,
      bsv.Opcode.OP_TOALTSTACK,
      // {5} ROLL SIZE {4} EQUALVERIFY CAT          // check size of
      // extra_nonce_1
      bsv.Opcode.OP_5,
      bsv.Opcode.OP_ROLL,
      bsv.Opcode.OP_SIZE,
      bsv.Opcode.OP_4,
      bsv.Opcode.OP_EQUALVERIFY,
      bsv.Opcode.OP_CAT,
      // {5} ROLL SIZE {8} EQUALVERIFY CAT          // check size of
      // extra_nonce_2
      bsv.Opcode.OP_5,
      bsv.Opcode.OP_ROLL,
      bsv.Opcode.OP_SIZE,
      bsv.Opcode.OP_8,
      bsv.Opcode.OP_EQUALVERIFY,
      bsv.Opcode.OP_CAT,
      // SWAP CAT HASH256                           // create metadata string
      // and hash it.
      bsv.Opcode.OP_SWAP,
      bsv.Opcode.OP_CAT,
      bsv.Opcode.OP_HASH256,
      // SWAP TOALTSTACK CAT CAT                    // target to altstack.
      bsv.Opcode.OP_SWAP,
      bsv.Opcode.OP_TOALTSTACK,
      bsv.Opcode.OP_CAT,
      bsv.Opcode.OP_CAT,
      // SWAP SIZE {4} EQUALVERIFY CAT              // check size of timestamp.
      bsv.Opcode.OP_SWAP,
      bsv.Opcode.OP_SIZE,
      bsv.Opcode.OP_4,
      bsv.Opcode.OP_EQUALVERIFY,
      bsv.Opcode.OP_CAT,
      // FROMALTSTACK CAT                           // attach target
      bsv.Opcode.OP_FROMALTSTACK,
      bsv.Opcode.OP_CAT,
      // SWAP SIZE {4} EQUALVERIFY CAT             // check size of nonce. Boost
      // POW string is constructed.
      bsv.Opcode.OP_SWAP,
      bsv.Opcode.OP_SIZE,
      bsv.Opcode.OP_4,
      bsv.Opcode.OP_EQUALVERIFY,
      bsv.Opcode.OP_CAT,
      // Take hash of work string and ensure that it is positive and minimally
      // encoded.
      bsv.Opcode.OP_HASH256,
      ...BoostPowJobModel.ensure_positive(),
      bsv.Opcode.OP_FROMALTSTACK,
      ...BoostPowJobModel.expand_target(),
      ...BoostPowJobModel.ensure_positive(),
      // check that the hash of the Boost POW string is less than the target
      bsv.Opcode.OP_LESSTHAN,
      bsv.Opcode.OP_VERIFY,
      // check that the given address matches the pubkey and check signature.
      // DUP HASH160 FROMALTSTACK EQUALVERIFY CHECKSIG
      bsv.Opcode.OP_DUP,
      bsv.Opcode.OP_HASH160,
      bsv.Opcode.OP_FROMALTSTACK,
      bsv.Opcode.OP_EQUALVERIFY,
      bsv.Opcode.OP_CHECKSIG,
    ];
  }
  static scriptOperationsV2ASICBoost() {
    return [
      // CAT SWAP
      bsv.Opcode.OP_CAT,
      bsv.Opcode.OP_SWAP,
      // {5} ROLL DUP TOALTSTACK CAT                // copy mining pool’s pubkey
      // hash to alt stack. A copy remains on the stack.
      bsv.Opcode.OP_5,
      bsv.Opcode.OP_ROLL,
      bsv.Opcode.OP_DUP,
      bsv.Opcode.OP_TOALTSTACK,
      bsv.Opcode.OP_CAT,
      // {2} PICK TOALTSTACK                         // copy target and push to
      // altstack.
      bsv.Opcode.OP_2,
      bsv.Opcode.OP_PICK,
      bsv.Opcode.OP_TOALTSTACK,
      // {6} ROLL SIZE {4} EQUALVERIFY CAT          // check size of
      // extra_nonce_1
      bsv.Opcode.OP_6,
      bsv.Opcode.OP_ROLL,
      bsv.Opcode.OP_SIZE,
      bsv.Opcode.OP_4,
      bsv.Opcode.OP_EQUALVERIFY,
      bsv.Opcode.OP_CAT,
      // {6} ROLL SIZE {8} EQUALVERIFY CAT          // check size of
      // extra_nonce_2
      bsv.Opcode.OP_6,
      bsv.Opcode.OP_ROLL,
      bsv.Opcode.OP_SIZE,
      bsv.Opcode.OP_8,
      bsv.Opcode.OP_EQUALVERIFY,
      bsv.Opcode.OP_CAT,
      // SWAP CAT HASH256                           // create metadata string
      // and hash it.
      bsv.Opcode.OP_SWAP,
      bsv.Opcode.OP_CAT,
      bsv.Opcode.OP_HASH256,
      // SWAP TOALTSTACK CAT CAT                    // target and content +
      // merkleroot to altstack.
      bsv.Opcode.OP_SWAP,
      bsv.Opcode.OP_TOALTSTACK,
      bsv.Opcode.OP_CAT,
      bsv.Opcode.OP_TOALTSTACK,
      Buffer.from("ff1f00e0", "hex"),
      bsv.Opcode.OP_DUP,
      bsv.Opcode.OP_INVERT,
      bsv.Opcode.OP_TOALTSTACK,
      bsv.Opcode.OP_AND,
      bsv.Opcode.OP_SWAP,
      bsv.Opcode.OP_FROMALTSTACK,
      bsv.Opcode.OP_AND,
      bsv.Opcode.OP_OR,
      bsv.Opcode.OP_FROMALTSTACK,
      bsv.Opcode.OP_CAT,
      // SWAP SIZE {4} EQUALVERIFY CAT              // check size of timestamp.
      bsv.Opcode.OP_SWAP,
      bsv.Opcode.OP_SIZE,
      bsv.Opcode.OP_4,
      bsv.Opcode.OP_EQUALVERIFY,
      bsv.Opcode.OP_CAT,
      // FROMALTSTACK CAT                           // attach target
      bsv.Opcode.OP_FROMALTSTACK,
      bsv.Opcode.OP_CAT,
      // SWAP SIZE {4} EQUALVERIFY CAT             // check size of nonce. Boost
      // POW string is constructed.
      bsv.Opcode.OP_SWAP,
      bsv.Opcode.OP_SIZE,
      bsv.Opcode.OP_4,
      bsv.Opcode.OP_EQUALVERIFY,
      bsv.Opcode.OP_CAT,
      // Take hash of work string and ensure that it is positive and minimally
      // encoded.
      bsv.Opcode.OP_HASH256,
      ...BoostPowJobModel.ensure_positive(),
      bsv.Opcode.OP_FROMALTSTACK,
      ...BoostPowJobModel.expand_target(),
      ...BoostPowJobModel.ensure_positive(),
      // check that the hash of the Boost POW string is less than the target
      bsv.Opcode.OP_LESSTHAN,
      bsv.Opcode.OP_VERIFY,
      // check that the given address matches the pubkey and check signature.
      // DUP HASH160 FROMALTSTACK EQUALVERIFY CHECKSIG
      bsv.Opcode.OP_DUP,
      bsv.Opcode.OP_HASH160,
      bsv.Opcode.OP_FROMALTSTACK,
      bsv.Opcode.OP_EQUALVERIFY,
      bsv.Opcode.OP_CHECKSIG,
    ];
  }
  /*
  expand_target - transforms the uint32 exponential (compact) format for the
  difficulty target into the full uint256 value.
  */
  static expand_target() {
    return [
      bsv.Opcode.OP_SIZE,
      bsv.Opcode.OP_4,
      bsv.Opcode.OP_EQUALVERIFY,
      bsv.Opcode.OP_3,
      bsv.Opcode.OP_SPLIT,
      bsv.Opcode.OP_DUP,
      bsv.Opcode.OP_BIN2NUM,
      bsv.Opcode.OP_3,
      Buffer.from('21', 'hex'),
      bsv.Opcode.OP_WITHIN,
      bsv.Opcode.OP_VERIFY,
      bsv.Opcode.OP_TOALTSTACK,
      bsv.Opcode.OP_DUP,
      bsv.Opcode.OP_BIN2NUM,
      bsv.Opcode.OP_0,
      bsv.Opcode.OP_GREATERTHAN,
      bsv.Opcode.OP_VERIFY,
      Buffer.from('0000000000000000000000000000000000000000000000000000000000',
                  'hex'),
      bsv.Opcode.OP_CAT,
      bsv.Opcode.OP_FROMALTSTACK,
      bsv.Opcode.OP_3,
      bsv.Opcode.OP_SUB,
      bsv.Opcode.OP_8,
      bsv.Opcode.OP_MUL,
      bsv.Opcode.OP_RSHIFT,
    ];
  }
  /*
  Numbers in Bitcoin script are in little endian and the last bit is a sign bit.
  However, the target and the hash digest are both supposed to be positive
  numbers. Thus, we have to attach an extra byte of zeros to numbers if they
  would be treated as negative in Bitcoin script.
   */
  static ensure_positive() {
    return [
      Buffer.from('00', 'hex'), bsv.Opcode.OP_CAT, bsv.Opcode.OP_BIN2NUM
    ];
  }
  // reverse endianness. Cuz why not?
  static reverse32() {
    return [
      bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_1,
      bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT,
      bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_1,
      bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT,
      bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_1,
      bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT,
      bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_1,
      bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT,
      bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_1,
      bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT,
      bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_1,
      bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT,
      bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_1,
      bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT,
      bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_1,
      bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT,
      bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_1,
      bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT,
      bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_1,
      bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT,
      bsv.Opcode.OP_1,     bsv.Opcode.OP_SPLIT, bsv.Opcode.OP_SWAP,
      bsv.Opcode.OP_CAT,   bsv.Opcode.OP_SWAP,  bsv.Opcode.OP_CAT,
      bsv.Opcode.OP_SWAP,  bsv.Opcode.OP_CAT,   bsv.Opcode.OP_SWAP,
      bsv.Opcode.OP_CAT,   bsv.Opcode.OP_SWAP,  bsv.Opcode.OP_CAT,
      bsv.Opcode.OP_SWAP,  bsv.Opcode.OP_CAT,   bsv.Opcode.OP_SWAP,
      bsv.Opcode.OP_CAT,   bsv.Opcode.OP_SWAP,  bsv.Opcode.OP_CAT,
      bsv.Opcode.OP_SWAP,  bsv.Opcode.OP_CAT,   bsv.Opcode.OP_SWAP,
      bsv.Opcode.OP_CAT,   bsv.Opcode.OP_SWAP,  bsv.Opcode.OP_CAT,
      bsv.Opcode.OP_SWAP,  bsv.Opcode.OP_CAT,   bsv.Opcode.OP_SWAP,
      bsv.Opcode.OP_CAT,   bsv.Opcode.OP_SWAP,  bsv.Opcode.OP_CAT,
      bsv.Opcode.OP_SWAP,  bsv.Opcode.OP_CAT,   bsv.Opcode.OP_SWAP,
      bsv.Opcode.OP_CAT,   bsv.Opcode.OP_SWAP,  bsv.Opcode.OP_CAT,
      bsv.Opcode.OP_SWAP,  bsv.Opcode.OP_CAT,   bsv.Opcode.OP_SWAP,
      bsv.Opcode.OP_CAT,   bsv.Opcode.OP_SWAP,  bsv.Opcode.OP_CAT,
      bsv.Opcode.OP_SWAP,  bsv.Opcode.OP_CAT,   bsv.Opcode.OP_SWAP,
      bsv.Opcode.OP_CAT,   bsv.Opcode.OP_SWAP,  bsv.Opcode.OP_CAT,
      bsv.Opcode.OP_SWAP,  bsv.Opcode.OP_CAT,   bsv.Opcode.OP_SWAP,
      bsv.Opcode.OP_CAT,   bsv.Opcode.OP_SWAP,  bsv.Opcode.OP_CAT,
      bsv.Opcode.OP_SWAP,  bsv.Opcode.OP_CAT,   bsv.Opcode.OP_SWAP,
      bsv.Opcode.OP_CAT,   bsv.Opcode.OP_SWAP,  bsv.Opcode.OP_CAT,
      bsv.Opcode.OP_SWAP,  bsv.Opcode.OP_CAT,   bsv.Opcode.OP_SWAP,
      bsv.Opcode.OP_CAT,
    ];
  }
}
exports.BoostPowJobModel = BoostPowJobModel;
