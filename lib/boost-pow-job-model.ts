import * as bsv from 'bsv';
import { BoostPowStringModel } from './boost-pow-string-model';
import { BoostPowJobProofModel } from './boost-pow-job-proof-model';
import { BoostPowMetadataModel } from './boost-pow-metadata-model';
import { BoostUtils } from './boost-utils';

/**
 * Responsible for a Boost Job Proof.
 *
 * The Boost Pow String (also known as Boost Header) is derived from the locking and redeem transactions
 * BoostPowString = combined(BoostJob + BoostJobProof)
 *
 */
export class BoostPowJobModel {

    private constructor(
        private content: Buffer,
        private difficulty: number,
        private category: Buffer,
        private tag: Buffer,
        private metadata: Buffer,
        private unique: Buffer,
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
    getMetadataString(trimLeadingNulls = true): string {
        return this.trimBufferString(this.toObject().metadata, trimLeadingNulls);
    }
    getMetadataHex(): string {
        return (this.metadata.toString('hex').match(/../g) || []).reverse().join('');
    }
    getMetadataBuffer(): Buffer {
        return this.metadata;
    }
    getUnique(): number {
        return parseInt(this.toObject().unique, 16);
    }
    getUniqueBuffer(): Buffer {
        return this.unique;
    }
    getUniqueHex(): string {
        return (this.unique.toString('hex').match(/../g) || []).reverse().join('');
    }

    static fromObject(params: {
        content: string,
        diff: number,
        category?: string,
        tag?: string,
        metadata?: string,
        unique?: string,
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
        if (params.unique && params.unique.length > 16) {
            throw new Error('unique too large. Max 8 bytes.')
        }
        if (params.metadata && params.metadata.length > 64) {
            throw new Error('metadata too large. Max 32 bytes.')
        }
        return new BoostPowJobModel(
            BoostUtils.createBufferAndPad(params.content, 32),
            params.diff,
            BoostUtils.createBufferAndPad(params.category, 4),
            BoostUtils.createBufferAndPad(params.tag, 20),
            BoostUtils.createBufferAndPad(params.metadata, 32),
            BoostUtils.createBufferAndPad(params.unique, 8)
        );
    }

    toObject () {
        return {
            content: (this.content.toString('hex').match(/../g) || []).reverse().join(''),
            diff: this.difficulty,
            category: (this.category.toString('hex').match(/../g) || []).reverse().join(''),
            tag: (this.tag.toString('hex').match(/../g) || []).reverse().join(''),
            metadata: (this.metadata.toString('hex').match(/../g) || []).reverse().join(''),
            unique: (this.unique.toString('hex').match(/../g) || []).reverse().join(''),
        };
    }

    private static difficulty2bits(difficulty) {
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

    getTargetAsNumberBuffer(): any {
        const i = BoostPowJobModel.difficulty2bits(this.difficulty);
        return Buffer.from(i.toString(16), 'hex').reverse();
    }

    toHex(): string {
        let buildOut = bsv.Script();
        // Add Boost identifier
        buildOut.add(Buffer.from('boostv01').reverse());
        buildOut.add(bsv.Opcode.OP_DROP);

        // Add category 4 bytes
        // buildOut.add(this.getNumberHexBuffer(this.category, 4));
        buildOut.add(this.category);
        // Add content 32 bytes
        buildOut.add(this.content);

        // Add target bits
        buildOut.add(this.getTargetAsNumberBuffer());

        // Add tag 20 bytes
        buildOut.add(this.tag);

        // Add unique nonce 8 bytes
        // buildOut.add(this.getNumberHexBuffer(this.unique, 8));
        buildOut.add(this.unique);

        // Add 32 byte metadata
        buildOut.add(this.metadata);

        // Add the rest of the script
        for (const op of BoostPowJobModel.operations) {
            buildOut.add(op);
        }
        const hex = buildOut.toHex();
        const fromhex = bsv.Script.fromHex(hex);
        const hexIso = fromhex.toHex();
        if (hex != hexIso) {
            throw new Error('Not isomorphic');
        }
        return hexIso;
    }

    /**
     * Returns the target difficulty for this block
     * @param {Number} bits
     * @returns {BN} An instance of BN with the decoded difficulty bits
     */
    static getTargetDifficulty(bits) {
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

    static remainingOperationsMatchExactly(remainingChunks): boolean {
        if (74 !== remainingChunks.length) {
            return false;
        }
        return (
            remainingChunks[8].opcodenum === bsv.Opcode.OP_8 &&
            remainingChunks[9].opcodenum === bsv.Opcode.OP_PICK &&
            remainingChunks[10].opcodenum === bsv.Opcode.OP_SIZE &&
            remainingChunks[11].opcodenum === bsv.Opcode.OP_4 &&
            remainingChunks[12].opcodenum === bsv.Opcode.OP_EQUALVERIFY &&
            remainingChunks[13].opcodenum === bsv.Opcode.OP_6 &&
            remainingChunks[14].opcodenum === bsv.Opcode.OP_ROLL &&
            remainingChunks[15].opcodenum === bsv.Opcode.OP_DUP &&
            remainingChunks[16].opcodenum === bsv.Opcode.OP_TOALTSTACK &&
            remainingChunks[17].opcodenum === bsv.Opcode.OP_ROT &&
            remainingChunks[18].opcodenum === bsv.Opcode.OP_4 &&
            remainingChunks[19].opcodenum === bsv.Opcode.OP_PICK &&
            remainingChunks[20].opcodenum === bsv.Opcode.OP_SIZE &&
            remainingChunks[21].opcodenum === bsv.Opcode.OP_4 &&
            remainingChunks[22].opcodenum === bsv.Opcode.OP_EQUALVERIFY &&
            remainingChunks[23].opcodenum === bsv.Opcode.OP_3 &&
            remainingChunks[24].opcodenum === bsv.Opcode.OP_SPLIT &&
            remainingChunks[25].opcodenum === bsv.Opcode.OP_DUP &&
            remainingChunks[26].opcodenum === bsv.Opcode.OP_3 &&
            remainingChunks[27].opcodenum === bsv.Opcode.OP_GREATERTHANOREQUAL &&
            remainingChunks[28].opcodenum === bsv.Opcode.OP_VERIFY &&
            remainingChunks[29].opcodenum === bsv.Opcode.OP_DUP &&
            remainingChunks[30].buf &&
            remainingChunks[30].buf.length === 1 &&
            remainingChunks[30].buf.toString('hex') === '20' &&

            remainingChunks[31].opcodenum === bsv.Opcode.OP_LESSTHANOREQUAL &&
            remainingChunks[32].opcodenum === bsv.Opcode.OP_VERIFY &&
            remainingChunks[33].opcodenum === bsv.Opcode.OP_TOALTSTACK &&

            remainingChunks[34].buf &&
            remainingChunks[34].buf.length === 29 &&
            remainingChunks[34].buf.toString('hex') === '0000000000000000000000000000000000000000000000000000000000' &&

            remainingChunks[35].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[36].opcodenum === bsv.Opcode.OP_FROMALTSTACK &&
            remainingChunks[37].opcodenum === bsv.Opcode.OP_3 &&
            remainingChunks[38].opcodenum === bsv.Opcode.OP_SUB &&
            remainingChunks[39].opcodenum === bsv.Opcode.OP_RSHIFT &&

            remainingChunks[40].opcodenum === bsv.Opcode.OP_TOALTSTACK &&
            remainingChunks[41].opcodenum === bsv.Opcode.OP_7 &&
            remainingChunks[42].opcodenum === bsv.Opcode.OP_ROLL &&
            remainingChunks[43].opcodenum === bsv.Opcode.OP_SIZE &&
            remainingChunks[44].opcodenum === bsv.Opcode.OP_8 &&
            remainingChunks[45].opcodenum === bsv.Opcode.OP_EQUALVERIFY &&

            remainingChunks[46].opcodenum === bsv.Opcode.OP_4 &&
            remainingChunks[47].opcodenum === bsv.Opcode.OP_SPLIT &&
            remainingChunks[48].opcodenum === bsv.Opcode.OP_TOALTSTACK &&

            remainingChunks[49].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[50].opcodenum === bsv.Opcode.OP_ROT &&
            remainingChunks[51].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[52].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[53].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[54].opcodenum === bsv.Opcode.OP_HASH256 &&

            remainingChunks[55].opcodenum === bsv.Opcode.OP_SWAP &&
            remainingChunks[56].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[57].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[58].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[59].opcodenum === bsv.Opcode.OP_SWAP &&
            remainingChunks[60].opcodenum === bsv.Opcode.OP_CAT &&

            remainingChunks[61].opcodenum === bsv.Opcode.OP_FROMALTSTACK &&
            remainingChunks[62].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[63].opcodenum === bsv.Opcode.OP_FROMALTSTACK &&
            remainingChunks[64].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[65].opcodenum === bsv.Opcode.OP_HASH256 &&
            remainingChunks[66].opcodenum === bsv.Opcode.OP_FROMALTSTACK &&
            remainingChunks[67].opcodenum === bsv.Opcode.OP_LESSTHAN &&
            remainingChunks[68].opcodenum === bsv.Opcode.OP_VERIFY &&

            remainingChunks[69].opcodenum === bsv.Opcode.OP_DUP &&
            remainingChunks[70].opcodenum === bsv.Opcode.OP_HASH256 &&
            remainingChunks[71].opcodenum === bsv.Opcode.OP_FROMALTSTACK &&
            remainingChunks[72].opcodenum === bsv.Opcode.OP_EQUALVERIFY &&
            remainingChunks[73].opcodenum === bsv.Opcode.OP_CHECKSIG
        );
    }

    static fromHex(asm: string, txid?: string, vout?: number, value?: number): BoostPowJobModel {
        const script = new bsv.Script(asm);
        let category;
        let content;
        let diff;
        let tag;
        let metadata;
        let unique;

        if (
            // boostv01
            script.chunks[0].buf.reverse().toString('utf8') === 'boostv01' &&
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

            // Unique
            script.chunks[6].buf &&
            script.chunks[6].len === 8 &&

            // Metadata
            script.chunks[7].buf &&
            script.chunks[7].len === 32  &&

            BoostPowJobModel.remainingOperationsMatchExactly(script.chunks)

        ) {
            category = script.chunks[2].buf;
            content = script.chunks[3].buf;
            let targetHex = (script.chunks[4].buf.toString('hex').match(/../g) || []).reverse().join('');
            let targetInt = parseInt(targetHex, 16);
            diff = BoostPowJobModel.getDifficulty(targetInt);

            tag = script.chunks[5].buf;
            unique = script.chunks[6].buf;
            metadata = script.chunks[7].buf;

            return new BoostPowJobModel(
                content,
                diff,
                category,
                tag,
                metadata,
                unique,
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

    static fromASM(str: string, txid?: string, vout?: number, value?: number): BoostPowJobModel {
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
        console.log('scriptHash');
        const hex = this.toHex();
        const buffer = Buffer.from(hex, 'hex');
        const r = bsv.crypto.Hash.sha256(buffer).reverse().toString('hex');
        const r2 = bsv.crypto.Hash.sha256(buffer).toString('hex');

        console.log('get script', r, r2);
        return r;
    }

    static fromTransaction(tx: bsv.Transaction): BoostPowJobModel | undefined {
        if (!tx) {
            return undefined;
        }
        let o = 0;
        for (const out of tx.outputs) {
            if (out.script && out.script.chunks[0].buf && out.script.chunks[0].buf.toString('hex') === '31307674736f6f62') {
                return BoostPowJobModel.fromScript(out.script, tx.hash, o, out.satoshis);
            }
            o++;
        }
        return undefined;
    }

    static fromRawTransaction(rawtx: string): BoostPowJobModel | undefined {
        if (!rawtx || rawtx === '') {
            return undefined;
        }
        const tx = new bsv.Transaction(rawtx);
        return BoostPowJobModel.fromTransaction(tx);
    }

    static createBoostPowMetadata(boostPowJob: BoostPowJobModel, boostPowJobProof: BoostPowJobProofModel): BoostPowMetadataModel {
        const takeSecondHalf = boostPowJobProof.getMinerNonce().toString('hex').substr(8, 16);
        return BoostPowMetadataModel.fromBuffer({
            tag: boostPowJob.getTagBuffer(),
            minerAddress: boostPowJobProof.getMinerAddress(),
            unique: boostPowJob.getUniqueBuffer(),
            minerNonce: Buffer.from(takeSecondHalf, 'hex'), // boostPowJobProof.getMinerNonce(),
            metadata: boostPowJob.getMetadataBuffer(),
        });
    }

    static tryValidateJobProof(boostPowJob: BoostPowJobModel, boostPowJobProof: BoostPowJobProofModel, debug: boolean = false): BoostPowStringModel | null {
        const metadataHash = BoostPowJobModel.createBoostPowMetadata(boostPowJob, boostPowJobProof);
        if (debug) {
            console.log('BoostPowString.tryValidateJobProof')
            console.log('category', boostPowJob.getCategoryBuffer().toString('hex'), boostPowJob.getCategoryBuffer().byteLength);
            console.log('content', boostPowJob.getContentBuffer().toString('hex'), boostPowJob.getContentBuffer().byteLength);
            console.log('metadataHash', metadataHash, metadataHash.hash(),);
            console.log('time', boostPowJobProof.getTime().toString('hex'), boostPowJobProof.getTime().byteLength);
            console.log('target', boostPowJob.getTargetAsNumberBuffer().toString('hex'), boostPowJob.getTargetAsNumberBuffer().byteLength);
            console.log('minerNonce', boostPowJobProof.getMinerNonce().toString('hex'), boostPowJobProof.getMinerNonce().byteLength)
            console.log('unique', boostPowJob.getUniqueBuffer().toString('hex'), boostPowJob.getUniqueBuffer().byteLength);
        }
        const takeFirstHalf = boostPowJobProof.getMinerNonce().toString('hex').substr(0, 8);
        const headerBuf = Buffer.concat([
            boostPowJob.getCategoryBuffer(),
            boostPowJob.getContentBuffer(),
            metadataHash.hashAsBuffer(),
            // Buffer.from('0e60651a9934e8f0decd1c5fde39309e48fca0cd1c84a21ddfde95033762d86c', 'hex').reverse(), // metadataHash.hashAsBuffer(),
            boostPowJobProof.getTime(),
            boostPowJob.getTargetAsNumberBuffer(),
            Buffer.from(takeFirstHalf, 'hex')
        ]);
        const blockHeader = bsv.BlockHeader.fromBuffer(headerBuf);
        if (debug) {
            console.log('boostHeader candidate', headerBuf.toString('hex'), blockHeader);
        }
        if (blockHeader.validProofOfWork()) {
            if (debug) {
                console.log('BoostPowString.tryValidateJobProof is valid')
            }
            return new BoostPowStringModel(blockHeader);
        }
        if (debug) {
            console.log('BoostPowString.tryValidateJobProof is invalid')
        }
        return null;
    }
    // Start of Boost Output after push datas
    static operations = [
        // BEGIN
        // {8} PICK SIZE {4} EQUALVERIFY              // check size of timestamp
        bsv.Opcode.OP_8,
        bsv.Opcode.OP_PICK,
        bsv.Opcode.OP_SIZE,
        bsv.Opcode.OP_4,
        bsv.Opcode.OP_EQUALVERIFY,

        // {6} ROLL DUP TOALTSTACK ROT                // copy miner’s address to alt stack
        bsv.Opcode.OP_6,
        bsv.Opcode.OP_ROLL,
        bsv.Opcode.OP_DUP,
        bsv.Opcode.OP_TOALTSTACK,
        bsv.Opcode.OP_ROT,

        // {4} PICK expand_target TOALTSTACK          // target to alt stack.
        bsv.Opcode.OP_4,
        bsv.Opcode.OP_PICK,

        // Expand Target
        bsv.Opcode.OP_SIZE,
        bsv.Opcode.OP_4,
        bsv.Opcode.OP_EQUALVERIFY,
        bsv.Opcode.OP_3,
        bsv.Opcode.OP_SPLIT,
        bsv.Opcode.OP_DUP,
        bsv.Opcode.OP_3,
        bsv.Opcode.OP_GREATERTHANOREQUAL,
        bsv.Opcode.OP_VERIFY,
        bsv.Opcode.OP_DUP,
        1,
        32,
        bsv.Opcode.OP_LESSTHANOREQUAL,
        bsv.Opcode.OP_VERIFY,
        bsv.Opcode.OP_TOALTSTACK,
        Buffer.from('0000000000000000000000000000000000000000000000000000000000', 'hex'),
        bsv.Opcode.OP_CAT,
        bsv.Opcode.OP_FROMALTSTACK,
        bsv.Opcode.OP_3,
        bsv.Opcode.OP_SUB,
        bsv.Opcode.OP_RSHIFT,
       // Expand target end

        bsv.Opcode.OP_TOALTSTACK,

        // {7} ROLL SIZE {8} EQUALVERIFY              // check miner nonce size
        bsv.Opcode.OP_7,
        bsv.Opcode.OP_ROLL,
        bsv.Opcode.OP_SIZE,
        bsv.Opcode.OP_8,
        bsv.Opcode.OP_EQUALVERIFY,

        // {4} SPLIT TOALTSTACK                       // split miner nonce and keep half
        bsv.Opcode.OP_4,
        bsv.Opcode.OP_SPLIT,
        bsv.Opcode.OP_TOALTSTACK,

        // CAT ROT CAT CAT CAT HASH256                // create abstract page and hash it.
        bsv.Opcode.OP_CAT,
        bsv.Opcode.OP_ROT,
        bsv.Opcode.OP_CAT,
        bsv.Opcode.OP_CAT,
        bsv.Opcode.OP_CAT,
        bsv.Opcode.OP_HASH256,

        // SWAP CAT CAT CAT SWAP CAT                  // attach merkle_root and timestamp.
        bsv.Opcode.OP_SWAP,
        bsv.Opcode.OP_CAT,
        bsv.Opcode.OP_CAT,
        bsv.Opcode.OP_CAT,
        bsv.Opcode.OP_SWAP,
        bsv.Opcode.OP_CAT,

        // FROMALTSTACK CAT FROMALTSTACK CAT          // attach target and nonce
        bsv.Opcode.OP_FROMALTSTACK,
        bsv.Opcode.OP_CAT,
        bsv.Opcode.OP_FROMALTSTACK,
        bsv.Opcode.OP_CAT,

        // check that the hash of the title is less than the target
        // HASH256 FROMALTSTACK LESSTHAN VERIFY
        bsv.Opcode.OP_HASH256,
        bsv.Opcode.OP_FROMALTSTACK,
        bsv.Opcode.OP_LESSTHAN,
        bsv.Opcode.OP_VERIFY,

        // check that the given address matches the pubkey and check signature.
        // DUP HASH256 FROMALTSTACK EQUALVERIFY CHECKSIG
        bsv.Opcode.OP_DUP,
        bsv.Opcode.OP_HASH256,
        bsv.Opcode.OP_FROMALTSTACK,
        bsv.Opcode.OP_EQUALVERIFY,
        bsv.Opcode.OP_CHECKSIG,
     ];

}