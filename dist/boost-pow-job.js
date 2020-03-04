"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bsv = require("bsv");
const _1 = require(".");
class BoostPowJobModel {
    constructor(content, diff, category, tag, metadata, unique) {
        this.content = content;
        this.diff = diff;
        this.category = category;
        this.tag = tag;
        this.metadata = metadata;
        this.unique = unique;
    }
    id() {
        return '';
    }
    static fromObject(params) {
        return new _1.BoostPowJob(_1.BoostPowJob.createBufferAndPad(params.content, 32), params.diff, params.category ? params.category : 0, _1.BoostPowJob.createBufferAndPad(params.tag, 20), _1.BoostPowJob.createBufferAndPad(params.metadata, 32), params.unique ? params.unique : 0);
    }
    static createBufferAndPad(buf, length) {
        if (!buf) {
            const emptyBuffer = new Buffer(length);
            emptyBuffer.fill(0);
            return emptyBuffer;
        }
        let paddedBuf;
        if ((typeof buf).toString() === 'buffer') {
            paddedBuf = buf;
        }
        else {
            var re = /^[0-9A-Fa-f]+$/g;
            if (!re.test(buf)) {
                paddedBuf = Buffer.from(buf);
            }
            else {
                paddedBuf = Buffer.from(buf, 'hex');
            }
        }
        if (paddedBuf.byteLength < length) {
            const emptyBuffer = new Buffer(length - paddedBuf.byteLength);
            emptyBuffer.fill(0);
            return Buffer.concat([emptyBuffer, paddedBuf]);
        }
        else {
            return paddedBuf;
        }
    }
    toObject() {
        return {
            content: this.content.toString('hex'),
            diff: this.diff,
            category: this.category,
            tag: this.tag.toString('hex'),
            metadata: this.metadata.toString('hex'),
            unique: this.unique
        };
    }
    static difficulty2bits(difficulty) {
        if (difficulty < 0)
            throw 'difficulty cannot be negative';
        if (!isFinite(difficulty)) {
            console.log('difficulty2bits difficulty is INFINITE', difficulty);
            throw 'difficulty cannot be infinite';
        }
        for (var shiftBytes = 1; true; shiftBytes++) {
            var word = (0x00ffff * Math.pow(0x100, shiftBytes)) / difficulty;
            if (word >= 0xffff)
                break;
        }
        word &= 0xffffff; // convert to int < 0xffffff
        var size = 0x1d - shiftBytes;
        // the 0x00800000 bit denotes the sign, so if it is already set, divide the
        // mantissa by 0x100 and increase the size by a byte
        if (word & 0x800000) {
            word >>= 8;
            size++;
        }
        if ((word & ~0x007fffff) != 0)
            throw 'the \'bits\' \'word\' is out of bounds';
        if (size > 0xff)
            throw 'the \'bits\' \'size\' is out of bounds';
        var bits = (size << 24) | word;
        return bits;
    }
    getNumberHexBuffer(v, length) {
        return _1.BoostPowJob.createBufferAndPad(v.toString(16).padStart(2, '0'), length);
    }
    getTargetAsNumberBuffer() {
        const i = BoostPowJobModel.difficulty2bits(this.diff);
        return Buffer.from(i.toString(16), 'hex');
    }
    toHex() {
        let buildOut = bsv.Script();
        // Add category 4 bytes
        buildOut.add(this.getNumberHexBuffer(this.category, 4));
        // Add content 32 bytes
        buildOut.add(this.content);
        // Add target bits
        buildOut.add(this.getTargetAsNumberBuffer());
        // Add tag 20 bytes
        buildOut.add(this.tag);
        // Add unique nonce 8 bytes
        buildOut.add(this.getNumberHexBuffer(this.unique, 8));
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
        var target = new bsv.crypto.BN(bits & 0xffffff);
        var mov = 8 * ((bits >>> 24) - 3);
        while (mov-- > 0) {
            target = target.mul(new bsv.crypto.BN(2));
        }
        return target;
    }
    // https://bitcoin.stackexchange.com/questions/30467/what-are-the-equations-to-convert-between-bits-and-difficulty
    /**
     * @link https://en.bitcoin.it/wiki/Difficulty
     * @return {Number}
     */
    static getDifficulty(bits) {
        var GENESIS_BITS = 0x1d00ffff;
        var difficulty1TargetBN = BoostPowJobModel.getTargetDifficulty(GENESIS_BITS).mul(new bsv.crypto.BN(Math.pow(10, 8)));
        var currentTargetBN = BoostPowJobModel.getTargetDifficulty(bits);
        var difficultyString = difficulty1TargetBN.div(currentTargetBN).toString(10);
        var decimalPos = difficultyString.length - 8;
        difficultyString = difficultyString.slice(0, decimalPos) + '.' + difficultyString.slice(decimalPos);
        return parseFloat(difficultyString);
    }
    static remainingOperationsMatchExactly(remainingChunks) {
        if (72 !== remainingChunks.length) {
            return false;
        }
        return (remainingChunks[6].opcodenum === bsv.Opcode.OP_8 &&
            remainingChunks[7].opcodenum === bsv.Opcode.OP_PICK &&
            remainingChunks[8].opcodenum === bsv.Opcode.OP_SIZE &&
            remainingChunks[9].opcodenum === bsv.Opcode.OP_4 &&
            remainingChunks[10].opcodenum === bsv.Opcode.OP_EQUALVERIFY &&
            remainingChunks[11].opcodenum === bsv.Opcode.OP_6 &&
            remainingChunks[12].opcodenum === bsv.Opcode.OP_ROLL &&
            remainingChunks[13].opcodenum === bsv.Opcode.OP_DUP &&
            remainingChunks[14].opcodenum === bsv.Opcode.OP_TOALTSTACK &&
            remainingChunks[15].opcodenum === bsv.Opcode.OP_ROT &&
            remainingChunks[16].opcodenum === bsv.Opcode.OP_4 &&
            remainingChunks[17].opcodenum === bsv.Opcode.OP_PICK &&
            remainingChunks[18].opcodenum === bsv.Opcode.OP_SIZE &&
            remainingChunks[19].opcodenum === bsv.Opcode.OP_4 &&
            remainingChunks[20].opcodenum === bsv.Opcode.OP_EQUALVERIFY &&
            remainingChunks[21].opcodenum === bsv.Opcode.OP_3 &&
            remainingChunks[22].opcodenum === bsv.Opcode.OP_SPLIT &&
            remainingChunks[23].opcodenum === bsv.Opcode.OP_DUP &&
            remainingChunks[24].opcodenum === bsv.Opcode.OP_3 &&
            remainingChunks[25].opcodenum === bsv.Opcode.OP_GREATERTHANOREQUAL &&
            remainingChunks[26].opcodenum === bsv.Opcode.OP_VERIFY &&
            remainingChunks[27].opcodenum === bsv.Opcode.OP_DUP &&
            remainingChunks[28].buf &&
            remainingChunks[28].buf.length === 1 &&
            remainingChunks[28].buf.toString('hex') === '20' &&
            remainingChunks[29].opcodenum === bsv.Opcode.OP_LESSTHANOREQUAL &&
            remainingChunks[30].opcodenum === bsv.Opcode.OP_VERIFY &&
            remainingChunks[31].opcodenum === bsv.Opcode.OP_TOALTSTACK &&
            remainingChunks[32].buf &&
            remainingChunks[32].buf.length === 29 &&
            remainingChunks[32].buf.toString('hex') === '0000000000000000000000000000000000000000000000000000000000' &&
            remainingChunks[33].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[34].opcodenum === bsv.Opcode.OP_FROMALTSTACK &&
            remainingChunks[35].opcodenum === bsv.Opcode.OP_3 &&
            remainingChunks[36].opcodenum === bsv.Opcode.OP_SUB &&
            remainingChunks[37].opcodenum === bsv.Opcode.OP_RSHIFT &&
            remainingChunks[38].opcodenum === bsv.Opcode.OP_TOALTSTACK &&
            remainingChunks[39].opcodenum === bsv.Opcode.OP_7 &&
            remainingChunks[40].opcodenum === bsv.Opcode.OP_ROLL &&
            remainingChunks[41].opcodenum === bsv.Opcode.OP_SIZE &&
            remainingChunks[42].opcodenum === bsv.Opcode.OP_8 &&
            remainingChunks[43].opcodenum === bsv.Opcode.OP_EQUALVERIFY &&
            remainingChunks[44].opcodenum === bsv.Opcode.OP_4 &&
            remainingChunks[45].opcodenum === bsv.Opcode.OP_SPLIT &&
            remainingChunks[46].opcodenum === bsv.Opcode.OP_TOALTSTACK &&
            remainingChunks[47].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[48].opcodenum === bsv.Opcode.OP_ROT &&
            remainingChunks[49].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[50].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[51].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[52].opcodenum === bsv.Opcode.OP_HASH256 &&
            remainingChunks[53].opcodenum === bsv.Opcode.OP_SWAP &&
            remainingChunks[54].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[55].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[56].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[57].opcodenum === bsv.Opcode.OP_SWAP &&
            remainingChunks[58].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[59].opcodenum === bsv.Opcode.OP_FROMALTSTACK &&
            remainingChunks[60].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[61].opcodenum === bsv.Opcode.OP_FROMALTSTACK &&
            remainingChunks[62].opcodenum === bsv.Opcode.OP_CAT &&
            remainingChunks[63].opcodenum === bsv.Opcode.OP_HASH256 &&
            remainingChunks[64].opcodenum === bsv.Opcode.OP_FROMALTSTACK &&
            remainingChunks[65].opcodenum === bsv.Opcode.OP_LESSTHAN &&
            remainingChunks[66].opcodenum === bsv.Opcode.OP_VERIFY &&
            remainingChunks[67].opcodenum === bsv.Opcode.OP_DUP &&
            remainingChunks[68].opcodenum === bsv.Opcode.OP_HASH256 &&
            remainingChunks[69].opcodenum === bsv.Opcode.OP_FROMALTSTACK &&
            remainingChunks[70].opcodenum === bsv.Opcode.OP_EQUALVERIFY &&
            remainingChunks[71].opcodenum === bsv.Opcode.OP_CHECKSIG);
    }
    static fromHex(asm) {
        const script = new bsv.Script(asm);
        let category;
        let content;
        let diff;
        let tag;
        let metadata;
        let unique;
        if (
        // Category
        script.chunks[0].buf &&
            script.chunks[0].opcodenum === 4 &&
            // Content
            script.chunks[1].buf &&
            script.chunks[1].len === 32 &&
            // Target
            script.chunks[2].buf &&
            script.chunks[2].len === 4 &&
            // Tag
            script.chunks[3].buf &&
            script.chunks[3].len === 20 &&
            // Unique
            script.chunks[4].buf &&
            script.chunks[4].len === 8 &&
            // Metadata
            script.chunks[5].buf &&
            script.chunks[5].len === 32 &&
            BoostPowJobModel.remainingOperationsMatchExactly(script.chunks)) {
            category = script.chunks[0].buf.toString('hex');
            category = parseInt(category, 16);
            content = script.chunks[1].buf.toString('hex');
            let targetHex = script.chunks[2].buf.toString('hex');
            tag = script.chunks[3].buf.toString('hex');
            unique = script.chunks[4].buf.toString('hex');
            unique = parseInt(unique, 16);
            metadata = script.chunks[5].buf.toString('hex');
            let targetInt = parseInt(targetHex, 16);
            diff = BoostPowJobModel.getDifficulty(targetInt);
            return BoostPowJobModel.fromObject({
                category: category,
                content: content,
                diff: diff,
                tag: tag,
                metadata: metadata,
                unique: unique
            });
        }
        throw new Error('Not valid Boost Output');
    }
    toASM() {
        const makeHex = this.toHex();
        const makeAsm = new bsv.Script(makeHex);
        return makeAsm.toASM();
    }
    static fromASM(asm) {
        const makeAsm = new bsv.Script(asm);
        return BoostPowJobModel.fromHex(makeAsm.toHex());
    }
    toString() {
        const makeHex = this.toHex();
        return (new bsv.Script(makeHex)).toString();
    }
    static fromString(str) {
        const make = new bsv.Script(str);
        return BoostPowJobModel.fromHex(make.toHex());
    }
}
// Start of Boost Output after push datas
BoostPowJobModel.operations = [
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
exports.BoostPowJobModel = BoostPowJobModel;
