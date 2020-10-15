import * as bsv from 'bsv';
import { BoostPowStringModel } from './boost-pow-string-model';
import { BoostPowJobProofModel } from './boost-pow-job-proof-model';
import { BoostPowMetadataModel } from './boost-pow-metadata-model';
import { BoostUtils } from './boost-utils';

export class BoostPowJobModel {
    private constructor(
        private content: Buffer,
        private difficulty: number,
        private category: Buffer,
        private tag: Buffer,
        private additionalData: Buffer,
        private userNonce: Buffer,
        // Optional tx information attached or not
        private txid?: string,
        private vout?: number,
        private value?: number,
    ) {
    }

    private trimBufferString(str: string, trimLeadingNulls = true): string {
        const content = Buffer.from(str, 'hex').toString('utf8');
        if (trimLeadingNulls) {
            return content.replace(/\0/g, '');
        } else {
            return content;
        }
    }

    getContentBuffer(): Buffer {
        return this.content;
    }

    getContentString(trimLeadingNulls = true): string {
        return this.trimBufferString(this.toObject().content, trimLeadingNulls);
    }

    getContentHex(): string {
        return (this.content.toString('hex').match(/../g) || []).reverse().join('');
    }

    getDiff(): number {
        return this.difficulty;
    }

    getCategoryBuffer(): Buffer {
        return this.category;
    }

    getCategoryNumber(): number {
        return parseInt(this.getCategoryHex(), 16);
    }

    getCategoryHex(): string {
        return (this.category.toString('hex').match(/../g) || []).reverse().join('');
    }

    getCategoryString(trimLeadingNulls = true): string {
        return this.trimBufferString(this.toObject().category, trimLeadingNulls);
    }

    getTagString(trimLeadingNulls = true): string {
        return this.trimBufferString(this.toObject().tag, trimLeadingNulls);
    }

    getTagHex(): string {
        return (this.tag.toString('hex').match(/../g) || []).reverse().join('');
    }

    getTagBuffer(): Buffer {
        return this.tag;
    }

    getAdditionalDataString(trimLeadingNulls = true): string {
        return this.trimBufferString(this.toObject().additionalData, trimLeadingNulls);
    }

    getAdditionalDataHex(): string {
        return (this.additionalData.toString('hex').match(/../g) || []).reverse().join('');
    }

    getAdditionalDataBuffer(): Buffer {
        return this.additionalData;
    }

    getUserNonce(): number {
        return parseInt(this.toObject().userNonce, 16);
    }

    getUserNonceNumber(): number {
        return parseInt(this.getUserNonceHex(), 16);
    }

    getUserNonceBuffer(): Buffer {
        return this.userNonce;
    }

    getUserNonceHex(): string {
        return (this.userNonce.toString('hex').match(/../g) || []).reverse().join('');
    }

    static fromObject(params: {
        content: string,
        diff: number,
        category?: string,
        tag?: string,
        additionalData?: string,
        userNonce?: string,
    }): BoostPowJobModel {

        if (params.content && params.content.length > 64) {
            throw new Error('content too large. Max 32 bytes.')
        }
        if (params.diff <= 0 || isNaN(params.diff) || (typeof params.diff !== 'number')) {
            throw new Error('diff must be a number starting at 1. Max 4 bytes.')
        }
        if (params.category && params.category.length > 8) {
            throw new Error('category too large. Max 4 bytes.')
        }
        if (params.tag && params.tag.length > 40) {
            throw new Error('tag too large. Max 20 bytes.')
        }
        if (params.userNonce && params.userNonce.length > 8) {
            throw new Error('userNonce too large. Max 4 bytes.')
        }
        if (params.additionalData && params.additionalData.length > 64) {
            throw new Error('additionalData too large. Max 32 bytes.')
        }
        return new BoostPowJobModel(
            BoostUtils.createBufferAndPad(params.content, 32),
            params.diff,
            BoostUtils.createBufferAndPad(params.category, 4),
            BoostUtils.createBufferAndPad(params.tag, 20),
            BoostUtils.createBufferAndPad(params.additionalData, 32),
            BoostUtils.createBufferAndPad(params.userNonce, 4)
        );
    }

    getBits(): number {
        return BoostPowJobModel.difficulty2bits(this.difficulty);
    }

    bits(): number {
        return BoostPowJobModel.difficulty2bits(this.difficulty);
    }

    public static hexBitsToDifficulty(hexBits: string): number {
        let targetHex = (hexBits.match(/../g) || []).join('');
        let targetInt = parseInt(targetHex, 16);
        return BoostPowJobModel.getDifficulty(targetInt);
    }

    getBitsHex(): string {
        return this.getTargetAsNumberHex();
    }

    toObject () {
        return {
            content: (this.content.toString('hex').match(/../g) || []).reverse().join(''),
            diff: this.difficulty,
            category: (this.category.toString('hex').match(/../g) || []).reverse().join(''),
            tag: (this.tag.toString('hex').match(/../g) || []).reverse().join(''),
            additionalData: (this.additionalData.toString('hex').match(/../g) || []).reverse().join(''),
            userNonce: (this.userNonce.toString('hex').match(/../g) || []).reverse().join(''),
        };
    }

    public static difficulty2bits(difficulty) {
        if (difficulty < 0) throw 'difficulty cannot be negative';
        if (!isFinite(difficulty)) {
            throw 'difficulty cannot be infinite';
        }
        for (var shiftBytes = 1; true; shiftBytes++) {
            var word = (0x00ffff * Math.pow(0x100, shiftBytes)) / difficulty;
            if (word >= 0xffff) break;
        }
        word &= 0xffffff; // convert to int < 0xffffff
        var size = 0x1d - shiftBytes;
        // the 0x00800000 bit denotes the sign, so if it is already set, divide the
        // mantissa by 0x100 and increase the size by a byte
        if (word & 0x800000) {
            word >>= 8;
            size++;
        }
        if ((word & ~0x007fffff) != 0) throw 'the \'bits\' \'word\' is out of bounds';
        if (size > 0xff) throw 'the \'bits\' \'size\' is out of bounds';
        var bits = (size << 24) | word;
        return bits;
    }

    getTargetAsNumberHex(): any {
        const i = BoostPowJobModel.difficulty2bits(this.difficulty);
        return Buffer.from(i.toString(16), 'hex').toString('hex');
    }

    getTargetAsNumberBuffer(): any {
        const i = BoostPowJobModel.difficulty2bits(this.difficulty);
        return Buffer.from(i.toString(16), 'hex').reverse();
    }

    getId(): string{
        return this.getScriptHash();
    }

    toHex(): string {
        return this.toScript(true);
    }

    toScript(isHex: boolean = false): bsv.Script {
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
        for (const op of BoostPowJobModel.scriptOperations()) {
            buildOut.add(op);
        }

        for (let i = 0; i < buildOut.chunks.length ; i++) {
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

    /**
     * Returns the target difficulty for this block
     * @param {Number} bits
     * @returns {BN} An instance of BN with the decoded difficulty bits
     */
    public static getTargetDifficulty(bits) {
        var target = new bsv.crypto.BN(bits & 0xffffff)
        var mov = 8 * ((bits >>> 24) - 3)
        while (mov-- > 0) {
            target = target.mul(new bsv.crypto.BN(2))
        }
        return target
    }

    // https://bitcoin.stackexchange.com/questions/30467/what-are-the-equations-to-convert-between-bits-and-difficulty
    /**
     * @link https://en.bitcoin.it/wiki/Difficulty
     * @return {Number}
     */
     static getDifficulty (bits) {
        var GENESIS_BITS = 0x1d00ffff;
        var difficulty1TargetBN = BoostPowJobModel.getTargetDifficulty(GENESIS_BITS).mul(new bsv.crypto.BN(Math.pow(10, 8)))
        var currentTargetBN = BoostPowJobModel.getTargetDifficulty(bits)
        var difficultyString = difficulty1TargetBN.div(currentTargetBN).toString(10);
        var decimalPos = difficultyString.length - 8
        difficultyString = difficultyString.slice(0, decimalPos) + '.' + difficultyString.slice(decimalPos)
        return parseFloat(difficultyString)
    }

    getDifficulty(): number {
        return this.difficulty;
    }

    static remainingOperationsMatchExactly(remainingChunks, start: number): boolean {
        let i = 0;
        const expectedOps = BoostPowJobModel.scriptOperations();
        if (expectedOps.length !== (remainingChunks.length - 8)) {
            console.log('length does not match', expectedOps[i].length, remainingChunks.length);
            return false;
        }
        while (i < (remainingChunks.length - 8)) {
            // console.log(' i < ', remainingChunks.length, expectedOps[i], remainingChunks[start + i]);
            if (
                (
                    // If it's a buffer, then ensure the value matches expect length
                    remainingChunks[start + i].buf && (remainingChunks[start + i].len === expectedOps[i].length)
                )
                ||
                (
                    remainingChunks[start + i].buf === undefined &&
                    expectedOps[i] === remainingChunks[start + i].opcodenum
                )
            ) {
                i++;
            } else {
                return false;
            }
        }
        return true;
    }

    static fromHex(asm: string, txid?: string, vout?: number, value?: number): BoostPowJobModel {
        const script = new bsv.Script(asm);
        let category;
        let content;
        let diff;
        let tag;
        let additionalData;
        let userNonce;
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
            script.chunks[5].buf &&
            script.chunks[5].len === 20 &&

            // User Nonce
            script.chunks[6].buf &&
            script.chunks[6].len === 4 &&

            // Additional Data
            script.chunks[7].buf &&
            script.chunks[7].len === 32  &&

            BoostPowJobModel.remainingOperationsMatchExactly(script.chunks, 8)

        ) {
            category = script.chunks[2].buf;
            content = script.chunks[3].buf;
            let targetHex = (script.chunks[4].buf.toString('hex').match(/../g) || []).reverse().join('');
            let targetInt = parseInt(targetHex, 16);
            diff = BoostPowJobModel.getDifficulty(targetInt);

            tag = script.chunks[5].buf;
            //tag = (script.chunks[5].buf.toString('hex').match(/../g) || []).reverse().join('');

            userNonce = script.chunks[6].buf;
            //userNonce = (script.chunks[6].buf.toString('hex').match(/../g) || []).reverse().join('');
            additionalData = script.chunks[7].buf;
            //additionalData = (script.chunks[7].buf.toString('hex').match(/../g) || []).reverse().join('');

            return new BoostPowJobModel(
                content,
                diff,
                category,
                tag,
                additionalData,
                userNonce,
                txid,
                vout,
                value
            );
        }
        throw new Error('Not valid Boost Output');
    }

    static fromASM(asm: string, txid?: string, vout?: number, value?: number): BoostPowJobModel {
        const script = new bsv.Script.fromASM(asm);
        let category;
        let content;
        let diff;
        let tag;
        let additionalData;
        let userNonce;
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
            script.chunks[5].buf &&
            script.chunks[5].len === 20 &&

            // User Nonce
            script.chunks[6].buf &&
            script.chunks[6].len === 4 &&

            // Additional Data
            script.chunks[7].buf &&
            script.chunks[7].len === 32  &&

            BoostPowJobModel.remainingOperationsMatchExactly(script.chunks, 8)

        ) {
            category = script.chunks[2].buf;
            content = script.chunks[3].buf;
            let targetHex = (script.chunks[4].buf.toString('hex').match(/../g) || []).reverse().join('');
            let targetInt = parseInt(targetHex, 16);
            diff = BoostPowJobModel.getDifficulty(targetInt);

            tag = script.chunks[5].buf;
            //tag = (script.chunks[5].buf.toString('hex').match(/../g) || []).reverse().join('');

            userNonce = script.chunks[6].buf;
            //userNonce = (script.chunks[6].buf.toString('hex').match(/../g) || []).reverse().join('');
            additionalData = script.chunks[7].buf;
            //additionalData = (script.chunks[7].buf.toString('hex').match(/../g) || []).reverse().join('');

            return new BoostPowJobModel(
                content,
                diff,
                category,
                tag,
                additionalData,
                userNonce,
                txid,
                vout,
                value
            );
        }
        throw new Error('Not valid Boost Output');
    }

    toASM(): string {
        const makeHex = this.toHex();
        const makeAsm = new bsv.Script(makeHex);
        return makeAsm.toASM();
    }

    static fromASM4(str: string, txid?: string, vout?: number, value?: number): BoostPowJobModel {
        return BoostPowJobModel.fromHex(str, txid, vout, value);
    }

    static fromASM2(str: string, txid?: string, vout?: number, value?: number): BoostPowJobModel {
        return BoostPowJobModel.fromHex(str, txid, vout, value);
    }

    toString(): string {
        const makeHex = this.toHex();
        const makeAsm = new bsv.Script(makeHex);
        return makeAsm.toString();
    }

    static fromString(str: string, txid?: string, vout?: number, value?: number): BoostPowJobModel {
        return BoostPowJobModel.fromHex(str, txid, vout, value);
    }

    static fromScript(script: bsv.Script, txid?: string, vout?: number, value?: number): BoostPowJobModel {
        return BoostPowJobModel.fromHex(script, txid, vout, value);
    }

    // Optional attached information if available
    getTxOutpoint(): {txid?: string, vout?: number, value?: number} {
        return {
            txid: this.txid,
            vout: this.vout,
            value: this.value,
        }
    }
    // Optional attached information if available
    getTxid(): string | undefined {
        return this.txid;
    }
    // Optional attached information if available
    getVout(): number | undefined {
        return this.vout;
    }

    // Optional attached information if available
    getValue(): number | undefined {
        return this.value;
    }

    getScriptHash(): string {
        const hex = this.toHex();
        const buffer = Buffer.from(hex, 'hex');
        return bsv.crypto.Hash.sha256(buffer).reverse().toString('hex');
    }

    static fromTransaction(tx: bsv.Transaction): BoostPowJobModel | undefined {
        if (!tx) {
            return undefined;
        }
        let o = 0;
        for (const out of tx.outputs) {
            if (out.script && out.script.chunks[0].buf && out.script.chunks[0].buf.toString('hex') === Buffer.from('boostpow', 'utf8').toString('hex')) {
                return BoostPowJobModel.fromScript(out.script, tx.hash, o, out.satoshis);
            }
            o++;
        }
        return undefined;
    }

    static fromTransactions(tx: bsv.Transaction): BoostPowJobModel[] {
        if (!tx) {
            return [];
        }
        const boostJobs: BoostPowJobModel[] = [];
        let o = 0;
        for (const out of tx.outputs) {
            if (out.script && out.script.chunks[0].buf && out.script.chunks[0].buf.toString('hex') === Buffer.from('boostpow', 'utf8').toString('hex')) {
                boostJobs.push(BoostPowJobModel.fromScript(out.script, tx.hash, o, out.satoshis));
            }
            o++;
        }
        return boostJobs;
    }

    static fromRawTransaction(rawtx: string): BoostPowJobModel | undefined {
        if (!rawtx || rawtx === '') {
            return undefined;
        }
        const tx = new bsv.Transaction(rawtx);
        return BoostPowJobModel.fromTransaction(tx);
    }

    /**
     * Create a transaction fragment that can be modified to redeem the boost job
     *
     * @param boostPowJob Boost Job to redeem
     * @param boostPowJobProof Boost job proof to use to redeem
     * @param privateKey The private key string of the minerPubKeyHash
     */
    static createRedeemTransaction(boostPowJob: BoostPowJobModel, boostPowJobProof: BoostPowJobProofModel, privateKeyStr: string, receiveAddressStr: string): bsv.Transaction | null {
        const boostPowString = BoostPowJobModel.tryValidateJobProof(boostPowJob, boostPowJobProof);
        if (!boostPowString) {
            throw new Error('createRedeemTransaction: Invalid Job Proof');
        }
        if (!boostPowJob.getTxid() ||
            (boostPowJob.getVout() === undefined ||  boostPowJob.getVout() === null ) ||
            !boostPowJob.getValue()) {
            throw new Error('createRedeemTransaction: Boost Pow Job requires txid, vout, and value');
        }
        let tx = new bsv.Transaction();
        tx.addInput(
          new bsv.Transaction.Input({
            output: new bsv.Transaction.Output({
              script: boostPowJob.toScript(),
              satoshis: boostPowJob.getValue()
            }),
            prevTxId: boostPowJob.getTxid(),
            outputIndex: boostPowJob.getVout(),
            script: bsv.Script.empty()
          })
        );
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
           .add(
              Buffer.concat([
              signature.toBuffer(),
              Buffer.from([sigtype & 0xff])
              ])
           )
           .add(privKey.toPublicKey().toBuffer())
           .add(boostPowJobProof.getNonce())
           .add(boostPowJobProof.getTime())
           .add(boostPowJobProof.getExtraNonce2())
           .add(boostPowJobProof.getExtraNonce1())
           .add(boostPowJobProof.getMinerPubKeyHash());

        tx.inputs[0].setScript(unlockingScript);
        return tx;
    }

    static createBoostPowMetadata(boostPowJob: BoostPowJobModel, boostPowJobProof: BoostPowJobProofModel): BoostPowMetadataModel {
        return BoostPowMetadataModel.fromBuffer({
            tag: boostPowJob.getTagBuffer(),
            minerPubKeyHash: boostPowJobProof.getMinerPubKeyHash(),
            extraNonce1: boostPowJobProof.getExtraNonce1(),
            extraNonce2: boostPowJobProof.getExtraNonce2(),
            userNonce: boostPowJob.getUserNonceBuffer(),
            additionalData: boostPowJob.getAdditionalDataBuffer(),
        });
    }

    static tryValidateJobProof(boostPowJob: BoostPowJobModel, boostPowJobProof: BoostPowJobProofModel, debug: boolean = false): null | { boostPowString: BoostPowStringModel | null, boostPowMetadata: BoostPowMetadataModel | null } {
        const boostPowMetadataCoinbaseString = BoostPowJobModel.createBoostPowMetadata(boostPowJob, boostPowJobProof);
        if (debug) {
            console.log('BoostPowString.tryValidateJobProof')
            console.log('category', boostPowJob.getCategoryBuffer().toString('hex'), boostPowJob.getCategoryBuffer().byteLength);
            console.log('content', boostPowJob.getContentBuffer().toString('hex'), boostPowJob.getContentBuffer().byteLength);
            console.log('boostPowMetadataCoinbaseString', boostPowMetadataCoinbaseString.toBuffer().reverse().toString('hex'), boostPowMetadataCoinbaseString, boostPowMetadataCoinbaseString.hash());
            console.log('time', boostPowJobProof.getTime().toString('hex'), boostPowJobProof.getTime().byteLength);
            console.log('target', boostPowJob.getTargetAsNumberBuffer().toString('hex'), boostPowJob.getTargetAsNumberBuffer().byteLength);
            console.log('nonce', boostPowJobProof.getNonce().toString('hex'), boostPowJobProof.getNonce().byteLength)
            console.log('userNonce', boostPowJob.getUserNonceBuffer().toString('hex'), boostPowJob.getUserNonceBuffer().byteLength);
        }

        const headerBuf = Buffer.concat([
            boostPowJob.getCategoryBuffer(),
            boostPowJob.getContentBuffer(),
            boostPowMetadataCoinbaseString.hashAsBuffer().reverse(),
            boostPowJobProof.getTime(),
            boostPowJob.getTargetAsNumberBuffer(),
            boostPowJobProof.getNonce(),
        ]);
        const blockHeader = bsv.BlockHeader.fromBuffer(headerBuf);
        if (debug) {
            console.log('boostHeader candidate', headerBuf.toString('hex'), blockHeader);
        }
        if (blockHeader.validProofOfWork()) {
            if (debug) {
                console.log('BoostPowString.tryValidateJobProof is valid')
            }
            return {
                boostPowString: new BoostPowStringModel(blockHeader),
                boostPowMetadata: boostPowMetadataCoinbaseString,
            }
        }
        if (debug) {
            console.log('BoostPowString.tryValidateJobProof is invalid')
        }
        return null;
    }
    static loopOperation(loopIterations: number, generateFragmentInvoker: Function) {
        let concatOps = [];
        for (let i = 0; i < loopIterations; i++) {
            concatOps = concatOps.concat(generateFragmentInvoker());
        }
        return concatOps;
    }

    static scriptOperations() {
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
            Buffer.from('21', 'hex'),   // actually 33, but in hex
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