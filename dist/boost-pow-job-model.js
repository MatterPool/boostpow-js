"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoostPowJobModel = void 0;
const bsv = require("bsv");
const int32Little_1 = require("./fields/int32Little");
const uint32Little_1 = require("./fields/uint32Little");
const uint16Little_1 = require("./fields/uint16Little");
const digest32_1 = require("./fields/digest32");
const bytes_1 = require("./fields/bytes");
const boost_pow_string_model_1 = require("./boost-pow-string-model");
const boost_pow_metadata_model_1 = require("./boost-pow-metadata-model");
const boost_utils_1 = require("./boost-utils");
class BoostPowJobModel {
    constructor(Content, difficulty, Category, Tag, AdditionalData, UserNonce, useGeneralPurposeBits, 
    // Optional tx information attached or not
    txid, vout, value) {
        this.Content = Content;
        this.difficulty = difficulty;
        this.Category = Category;
        this.Tag = Tag;
        this.AdditionalData = AdditionalData;
        this.UserNonce = UserNonce;
        this.useGeneralPurposeBits = useGeneralPurposeBits;
        this.txid = txid;
        this.vout = vout;
        this.value = value;
    }
    get category() {
        return this.Category;
    }
    get magicNumber() {
        return uint16Little_1.UInt16Little.fromNumber(boost_utils_1.BoostUtils.magicNumber(this.category.number));
    }
    get content() {
        return this.Content;
    }
    getDiff() {
        return this.difficulty;
    }
    get tag() {
        return this.Tag;
    }
    get additionalData() {
        return this.AdditionalData;
    }
    get userNonce() {
        return this.UserNonce;
    }
    static fromObject(params) {
        if (params.content && params.content.length > 64) {
            throw new Error('content too large. Max 32 bytes.');
        }
        if (params.diff <= 0 || isNaN(params.diff) || (typeof params.diff !== 'number')) {
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
        if (!params.userNonce) {
            let getRandomInt = (max) => {
                return Math.floor(Math.random() * max);
            };
            let tempBuffer = Buffer.from([getRandomInt(0xff), getRandomInt(0xff), getRandomInt(0xff), getRandomInt(0xff)]);
            params.userNonce = tempBuffer.toString('hex');
        }
        return new BoostPowJobModel(new digest32_1.Digest32(boost_utils_1.BoostUtils.createBufferAndPad(params.content, 32)), params.diff, new int32Little_1.Int32Little(boost_utils_1.BoostUtils.createBufferAndPad(params.category, 4, false)), new bytes_1.Bytes(params.tag ? new Buffer(params.tag, 'hex') : new Buffer(0)), new bytes_1.Bytes(params.additionalData ? new Buffer(params.additionalData, 'hex') : new Buffer(0)), 
        // TODO: if userNonce is not provided, it should be generated randomly, not defaulted to zero.
        new uint32Little_1.UInt32Little(boost_utils_1.BoostUtils.createBufferAndPad(params.userNonce, 4, false)), params.useGeneralPurposeBits ? params.useGeneralPurposeBits : false);
    }
    getBits() {
        return boost_utils_1.BoostUtils.difficulty2bits(this.difficulty);
    }
    bits() {
        return boost_utils_1.BoostUtils.difficulty2bits(this.difficulty);
    }
    static hexBitsToDifficulty(hexBits) {
        let targetHex = (hexBits.match(/../g) || []).join('');
        let targetInt = parseInt(targetHex, 16);
        return boost_utils_1.BoostUtils.difficulty(targetInt);
    }
    getBitsHex() {
        return this.getTargetAsNumberHex();
    }
    toObject() {
        return {
            content: this.content.hex,
            diff: this.difficulty,
            category: this.category.hex,
            tag: this.tag.hex,
            additionalData: this.additionalData.hex,
            userNonce: this.userNonce.hex,
            useGeneralPurposeBits: this.useGeneralPurposeBits
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
    getId() {
        return this.getScriptHash();
    }
    toHex() {
        return this.toScript().toHex();
    }
    toOpCode(num) {
        if (num.length == 1) {
            if (num[0] >= 1 && num[0] <= 16) {
                return bsv.Opcode.OP_1 + (num[0] - 1);
            }
            if (num[0] == 0x81) {
                return bsv.Opcode.OP_1NEGATE;
            }
        }
        return num;
    }
    static fromOpCode(chunk) {
        if (chunk.opcodenum >= bsv.Opcode.OP_1 && chunk.opcodenum <= bsv.Opcode.OP_16) {
            return Buffer.from([(chunk.opcodenum - bsv.Opcode.OP_1) + 1]);
        }
        else if (chunk.opcodenum == bsv.Opcode.OP_1NEGATE) {
            return Buffer.from([0x81]);
        }
        else {
            return chunk.buf;
        }
    }
    toScript() {
        let buildOut = bsv.Script();
        buildOut.add(this.toOpCode(Buffer.from('boostpow', 'utf8')));
        buildOut.add(bsv.Opcode.OP_DROP);
        buildOut.add(this.toOpCode(this.category.buffer));
        buildOut.add(this.toOpCode(this.content.buffer));
        buildOut.add(this.toOpCode(this.getTargetAsNumberBuffer()));
        buildOut.add(this.toOpCode(this.tag.buffer));
        buildOut.add(this.toOpCode(this.userNonce.buffer));
        buildOut.add(this.toOpCode(this.additionalData.buffer));
        // Add the rest of the script
        for (const op of BoostPowJobModel.scriptOperations(this.useGeneralPurposeBits)) {
            buildOut.add(op);
        }
        // Return script
        return buildOut;
    }
    getDifficulty() {
        return this.difficulty;
    }
    static remainingOperationsMatchExactly(remainingChunks, start, expectedOps) {
        let i = 0;
        if ((remainingChunks.length - start) !== expectedOps.length) {
            return false;
        }
        while (i < (remainingChunks.length - start)) {
            // console.log(' i < ', remainingChunks.length, expectedOps[i], remainingChunks[i]);
            if ((
            // If it's a buffer, then ensure the value matches expect length
            remainingChunks[start + i].buf && (remainingChunks[start + i].len === expectedOps[i].length))
                ||
                    (remainingChunks[start + i].buf === undefined &&
                        expectedOps[i] === remainingChunks[start + i].opcodenum)) {
                i++;
            }
            else {
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
            script.chunks[2].buf &&
            script.chunks[2].opcodenum === 4 &&
            // Content
            script.chunks[3].buf &&
            script.chunks[3].len === 32 &&
            // Target
            script.chunks[4].buf &&
            script.chunks[4].len === 4 &&
            // Tag
            ((script.chunks[5].buf &&
                script.chunks[5].len <= 20) || (script.chunks[5].opcodenum >= bsv.Opcode.OP_1 && script.chunks[5].opcodenum <= bsv.Opcode.OP_16)) &&
            // User Nonce
            script.chunks[6].buf &&
            script.chunks[6].len === 4 &&
            // Additional Data
            (script.chunks[7].buf || (script.chunks[7].opcodenum >= bsv.Opcode.OP_1 && script.chunks[7].opcodenum <= bsv.Opcode.OP_16))) {
            if (BoostPowJobModel.remainingOperationsMatchExactly(script.chunks, 8, BoostPowJobModel.scriptOperationsV1NoASICBoost())) {
                useGeneralPurposeBits = false;
            }
            else if (BoostPowJobModel.remainingOperationsMatchExactly(script.chunks, 8, BoostPowJobModel.scriptOperationsV2ASICBoost())) {
                useGeneralPurposeBits = true;
            }
            else
                throw new Error('Not valid Boost Output');
            category = new int32Little_1.Int32Little(this.fromOpCode(script.chunks[2]));
            content = new digest32_1.Digest32(this.fromOpCode(script.chunks[3]));
            let targetHex = (this.fromOpCode(script.chunks[4]).toString('hex').match(/../g) || []).reverse().join('');
            let targetInt = parseInt(targetHex, 16);
            diff = boost_utils_1.BoostUtils.difficulty(targetInt);
            tag = new bytes_1.Bytes(this.fromOpCode(script.chunks[5]));
            //tag = (script.chunks[5].buf.toString('hex').match(/../g) || []).reverse().join('');
            userNonce = new uint32Little_1.UInt32Little(this.fromOpCode(script.chunks[6]));
            //userNonce = (script.chunks[6].buf.toString('hex').match(/../g) || []).reverse().join('');
            additionalData = new bytes_1.Bytes(this.fromOpCode(script.chunks[7]));
            //additionalData = (script.chunks[7].buf.toString('hex').match(/../g) || []).reverse().join('');
            return new BoostPowJobModel(content, diff, category, tag, additionalData, userNonce, useGeneralPurposeBits, txid, vout, value);
        }
        throw new Error('Not valid Boost Output');
    }
    static fromHex(asm, txid, vout, value) {
        return BoostPowJobModel.readScript(new bsv.Script(asm), txid, vout, value);
    }
    static fromASM(asm, txid, vout, value) {
        return BoostPowJobModel.readScript(new bsv.Script.fromASM(asm), txid, vout, value);
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
            txid: this.txid,
            vout: this.vout,
            value: this.value,
        };
    }
    // Optional attached information if available
    getTxid() {
        return this.txid;
    }
    // Optional attached information if available
    getVout() {
        return this.vout;
    }
    // Optional attached information if available
    getValue() {
        return this.value;
    }
    getScriptHash() {
        const hex = this.toHex();
        const buffer = Buffer.from(hex, 'hex');
        return bsv.crypto.Hash.sha256(buffer).reverse().toString('hex');
    }
    static fromTransaction(tx, vout = 0) {
        if (!tx) {
            return undefined;
        }
        if (vout > tx.outputs.length - 1 || vout < 0 || vout === undefined || vout === null) {
            return undefined;
        }
        if (tx.outputs[vout].script && tx.outputs[vout].script.chunks[0].buf && tx.outputs[vout].script.chunks[0].buf.toString('hex') === Buffer.from('boostpow', 'utf8').toString('hex')) {
            return BoostPowJobModel.fromScript(tx.outputs[vout].script, tx.hash, vout, tx.outputs[vout].satoshis);
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
            if (out.script && out.script.chunks[0].buf && out.script.chunks[0].buf.toString('hex') === Buffer.from('boostpow', 'utf8').toString('hex')) {
                boostJobs.push(BoostPowJobModel.fromScript(out.script, tx.hash, o, out.satoshis));
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
    static createRedeemTransaction(boostPowJob, boostPowJobProof, privateKeyStr, receiveAddressStr) {
        const boostPowString = BoostPowJobModel.tryValidateJobProof(boostPowJob, boostPowJobProof);
        if (!boostPowString) {
            throw new Error('createRedeemTransaction: Invalid Job Proof');
        }
        if (!boostPowJob.getTxid() ||
            (boostPowJob.getVout() === undefined || boostPowJob.getVout() === null) ||
            !boostPowJob.getValue()) {
            throw new Error('createRedeemTransaction: Boost Pow Job requires txid, vout, and value');
        }
        let tx = new bsv.Transaction();
        tx.addInput(new bsv.Transaction.Input({
            output: new bsv.Transaction.Output({
                script: boostPowJob.toScript(),
                satoshis: boostPowJob.getValue()
            }),
            prevTxId: boostPowJob.getTxid(),
            outputIndex: boostPowJob.getVout(),
            script: bsv.Script.empty()
        }));
        const privKey = new bsv.PrivateKey(privateKeyStr);
        const sigtype = bsv.crypto.Signature.SIGHASH_ALL | bsv.crypto.Signature.SIGHASH_FORKID;
        const flags = bsv.Script.Interpreter.SCRIPT_VERIFY_MINIMALDATA | bsv.Script.Interpreter.SCRIPT_ENABLE_SIGHASH_FORKID | bsv.Script.Interpreter.SCRIPT_ENABLE_MAGNETIC_OPCODES | bsv.Script.Interpreter.SCRIPT_ENABLE_MONOLITH_OPCODES;
        const receiveSats = boostPowJob.getValue() !== undefined ? boostPowJob.getValue() : 0;
        tx.addOutput(new bsv.Transaction.Output({
            script: bsv.Script(new bsv.Address(receiveAddressStr)),
            satoshis: receiveSats ? receiveSats - 517 : 0 //subtract miner fee
        }));
        const signature = bsv.Transaction.sighash.sign(tx, privKey, sigtype, 0, tx.inputs[0].output.script, new bsv.crypto.BN(tx.inputs[0].output.satoshis), flags);
        const unlockingScript = new bsv.Script({});
        unlockingScript
            .add(Buffer.concat([
            signature.toBuffer(),
            Buffer.from([sigtype & 0xff])
        ]))
            .add(privKey.toPublicKey().toBuffer())
            .add(boostPowJobProof.nonce.buffer)
            .add(boostPowJobProof.time.buffer)
            .add(boostPowJobProof.extraNonce2.buffer)
            .add(boostPowJobProof.extraNonce1.buffer)
            .add(boostPowJobProof.minerPubKeyHash.buffer);
        tx.inputs[0].setScript(unlockingScript);
        return tx;
    }
    static createBoostPowMetadata(boostPowJob, boostPowJobProof) {
        return boost_pow_metadata_model_1.BoostPowMetadataModel.fromBuffer({
            tag: boostPowJob.tag.buffer,
            minerPubKeyHash: boostPowJobProof.minerPubKeyHash.buffer,
            extraNonce1: boostPowJobProof.extraNonce1.buffer,
            extraNonce2: boostPowJobProof.extraNonce2.buffer,
            userNonce: boostPowJob.userNonce.buffer,
            additionalData: boostPowJob.additionalData.buffer,
        });
    }
    static tryValidateJobProof(boostPowJob, boostPowJobProof) {
        var category;
        if (boostPowJob.useGeneralPurposeBits) {
            var generalPurposeBits = boostPowJobProof.generalPurposeBits;
            if (generalPurposeBits) {
                category = boost_utils_1.BoostUtils.writeUInt32LE((boostPowJob.category.number & boost_utils_1.BoostUtils.generalPurposeBitsMask()) |
                    (generalPurposeBits.number & ~boost_utils_1.BoostUtils.generalPurposeBitsMask()));
            }
            else {
                return null;
            }
        }
        else if (boostPowJobProof.generalPurposeBits) {
            return null;
        }
        else {
            category = boostPowJob.category.buffer;
        }
        const boostPowMetadataCoinbaseString = BoostPowJobModel.createBoostPowMetadata(boostPowJob, boostPowJobProof);
        const headerBuf = Buffer.concat([
            category,
            boostPowJob.content.buffer,
            boostPowMetadataCoinbaseString.hash.buffer,
            boostPowJobProof.time.buffer,
            boostPowJob.getTargetAsNumberBuffer(),
            boostPowJobProof.nonce.buffer,
        ]);
        const blockHeader = bsv.BlockHeader.fromBuffer(headerBuf);
        if (blockHeader.validProofOfWork()) {
            return {
                boostPowString: new boost_pow_string_model_1.BoostPowStringModel(blockHeader),
                boostPowMetadata: boostPowMetadataCoinbaseString,
            };
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
            // {5} ROLL DUP TOALTSTACK CAT                // copy mining pool’s pubkey hash to alt stack. A copy remains on the stack.
            bsv.Opcode.OP_5,
            bsv.Opcode.OP_ROLL,
            bsv.Opcode.OP_DUP,
            bsv.Opcode.OP_TOALTSTACK,
            bsv.Opcode.OP_CAT,
            // {2} PICK TOALTSTACK                         // copy target and push to altstack.
            bsv.Opcode.OP_2,
            bsv.Opcode.OP_PICK,
            bsv.Opcode.OP_TOALTSTACK,
            // {5} ROLL SIZE {4} EQUALVERIFY CAT          // check size of extra_nonce_1
            bsv.Opcode.OP_5,
            bsv.Opcode.OP_ROLL,
            bsv.Opcode.OP_SIZE,
            bsv.Opcode.OP_4,
            bsv.Opcode.OP_EQUALVERIFY,
            bsv.Opcode.OP_CAT,
            // {5} ROLL SIZE {8} EQUALVERIFY CAT          // check size of extra_nonce_2
            bsv.Opcode.OP_5,
            bsv.Opcode.OP_ROLL,
            bsv.Opcode.OP_SIZE,
            bsv.Opcode.OP_8,
            bsv.Opcode.OP_EQUALVERIFY,
            bsv.Opcode.OP_CAT,
            // SWAP CAT HASH256                           // create metadata string and hash it.
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
            // SWAP SIZE {4} EQUALVERIFY CAT             // check size of nonce. Boost POW string is constructed.
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_SIZE,
            bsv.Opcode.OP_4,
            bsv.Opcode.OP_EQUALVERIFY,
            bsv.Opcode.OP_CAT,
            // Take hash of work string and ensure that it is positive and minimally encoded.
            bsv.Opcode.OP_HASH256, ...BoostPowJobModel.ensure_positive(),
            bsv.Opcode.OP_FROMALTSTACK, ...BoostPowJobModel.expand_target(), ...BoostPowJobModel.ensure_positive(),
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
            // {5} ROLL DUP TOALTSTACK CAT                // copy mining pool’s pubkey hash to alt stack. A copy remains on the stack.
            bsv.Opcode.OP_5,
            bsv.Opcode.OP_ROLL,
            bsv.Opcode.OP_DUP,
            bsv.Opcode.OP_TOALTSTACK,
            bsv.Opcode.OP_CAT,
            // {2} PICK TOALTSTACK                         // copy target and push to altstack.
            bsv.Opcode.OP_2,
            bsv.Opcode.OP_PICK,
            bsv.Opcode.OP_TOALTSTACK,
            // {6} ROLL SIZE {4} EQUALVERIFY CAT          // check size of extra_nonce_1
            bsv.Opcode.OP_6,
            bsv.Opcode.OP_ROLL,
            bsv.Opcode.OP_SIZE,
            bsv.Opcode.OP_4,
            bsv.Opcode.OP_EQUALVERIFY,
            bsv.Opcode.OP_CAT,
            // {6} ROLL SIZE {8} EQUALVERIFY CAT          // check size of extra_nonce_2
            bsv.Opcode.OP_6,
            bsv.Opcode.OP_ROLL,
            bsv.Opcode.OP_SIZE,
            bsv.Opcode.OP_8,
            bsv.Opcode.OP_EQUALVERIFY,
            bsv.Opcode.OP_CAT,
            // SWAP CAT HASH256                           // create metadata string and hash it.
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_HASH256,
            // SWAP TOALTSTACK CAT CAT                    // target and content + merkleroot to altstack.
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
            // SWAP SIZE {4} EQUALVERIFY CAT             // check size of nonce. Boost POW string is constructed.
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_SIZE,
            bsv.Opcode.OP_4,
            bsv.Opcode.OP_EQUALVERIFY,
            bsv.Opcode.OP_CAT,
            // Take hash of work string and ensure that it is positive and minimally encoded.
            bsv.Opcode.OP_HASH256, ...BoostPowJobModel.ensure_positive(),
            bsv.Opcode.OP_FROMALTSTACK, ...BoostPowJobModel.expand_target(), ...BoostPowJobModel.ensure_positive(),
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
    expand_target - transforms the uint32 exponential (compact) format for the difficulty target into the full uint256 value.
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
            Buffer.from('0000000000000000000000000000000000000000000000000000000000', 'hex'),
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
    Numbers in Bitcoin script are in little endian and the last bit is a sign bit. However, the target and the hash digest are both supposed to be positive numbers. Thus, we have to attach an extra byte of zeros to numbers if they would be treated as negative in Bitcoin script.
     */
    static ensure_positive() {
        return [
            Buffer.from('00', 'hex'),
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_BIN2NUM
        ];
    }
    // reverse endianness. Cuz why not?
    static reverse32() {
        return [
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_1,
            bsv.Opcode.OP_SPLIT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
            bsv.Opcode.OP_SWAP,
            bsv.Opcode.OP_CAT,
        ];
    }
}
exports.BoostPowJobModel = BoostPowJobModel;
