"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoostUtils = void 0;
const bsv = require("bsv");
class BoostUtils {
    static getSha256(str, encoding = 'utf8') {
        const hashed = Buffer.from(str, encoding);
        const h = bsv.crypto.Hash.sha256(hashed).toString('hex');
        return h;
    }
    static writeInt32LE(x) {
        if (x > 0x7fffffff)
            throw "number too big to be an int32.";
        if (x < -2147483648)
            throw "number too small to be an int32.";
        let b = new Buffer(4);
        b.writeInt32LE(x);
        return b;
    }
    static writeUInt32LE(x) {
        if (x > 0xffffffff)
            throw "number too big to be a uint32.";
        let b = new Buffer(4);
        b.writeUInt32LE(x);
        return b;
    }
    static maxBits() {
        return 0x2100ffff;
    }
    static minBits() {
        return 0x03000001;
    }
    static unitBits() {
        return 0x1d00ffff;
    }
    /**
     * Returns the target difficulty for this block
     * @param {Number} bits
     * @returns {BN} An instance of BN with the decoded difficulty bits
     */
    static getTargetDifficulty(bits) {
        var target = new bsv.crypto.BN(bits & 0xffffff);
        var mov = ((bits >>> 24) - 3);
        while (mov-- > 0) {
            target = target.mul(new bsv.crypto.BN(256));
        }
        return target;
    }
    // Daniel -- there are two difficulty functions below. The one that is
    // uncommented is Attila's and the commented one is mine. They both
    // cause different difficulty tests to fail. We need to make a version
    // of this function that works for everything. 
    // https://bitcoin.stackexchange.com/questions/30467/what-are-the-equations-to-convert-between-bits-and-difficulty
    /**
     * @link https://en.bitcoin.it/wiki/Difficulty
     * @return {Number}
     */
    static difficulty(bits) {
        var difficulty1TargetBN = BoostUtils.getTargetDifficulty(BoostUtils.unitBits()).mul(new bsv.crypto.BN(Math.pow(10, 8)));
        var currentTargetBN = BoostUtils.getTargetDifficulty(bits);
        var difficultyString = difficulty1TargetBN.div(currentTargetBN).toString(10);
        var decimalPos = difficultyString.length - 8;
        difficultyString = difficultyString.slice(0, decimalPos) + '.' + difficultyString.slice(decimalPos);
        return parseFloat(difficultyString);
    }
    /*
    static difficulty (bits: number): number {
        return parseFloat(BoostUtils.getTargetDifficulty(BoostUtils.unitBits()).toString(10)) /
          parseFloat(BoostUtils.getTargetDifficulty(bits).toString(10));
    }*/
    static difficulty2bits(difficulty) {
        if (difficulty < 0)
            throw 'difficulty cannot be negative';
        if (!isFinite(difficulty)) {
            throw 'difficulty cannot be infinite';
        }
        var absolute = parseFloat(BoostUtils.getTargetDifficulty(BoostUtils.unitBits()).toString(10)) / difficulty;
        var exponent = 0;
        while (absolute > 1) {
            absolute /= 256;
            exponent++;
        }
        if (exponent < 3) {
            return BoostUtils.minBits();
        }
        if (exponent > 32) {
            return BoostUtils.maxBits();
        }
        let word = Math.trunc(16777216 * absolute) & 0xffffff;
        if (word & 0x800000) {
            word >>= 8;
            exponent++;
        }
        return (exponent << 24) | word;
    }
    static getTargetAsNumberBuffer(diff) {
        const i = BoostUtils.difficulty2bits(diff);
        return Buffer.from(i.toString(16), 'hex').reverse();
    }
    // creates a buffer from a string with an optional parameter
    // to determine the total length. The buffer will be padded with
    // zeros to achieve this length.
    static stringToBuffer(str, length) {
        if (!length) {
            return Buffer.from(str, 'utf8');
        }
        if (str.length > length)
            throw 'string is too big';
        let buf = Buffer.from(str, 'utf8');
        let pad = Buffer.alloc(length - str.length);
        return Buffer.concat([buf, pad]);
    }
    static createBufferAndPad(buf, length, reverse = true) {
        if (!buf) {
            const emptyBuffer = Buffer.alloc(length);
            emptyBuffer.fill(0);
            return emptyBuffer;
        }
        let paddedBuf;
        if ((typeof buf).toString() === 'buffer') {
            if (buf.byteLength > length) {
                throw new Error('The buffer is out of bounds: ' + length + ' bytes or small expected');
            }
            paddedBuf = buf;
        }
        else {
            if (buf.length > (length * 2)) {
                throw new Error('The buffer is out of bounds: ' + length + ' bytes expected');
            }
            var re = /^([0-9A-Fa-f][0-9A-Fa-f])+$/g;
            if (!re.test(buf)) {
                throw 'not a hex string';
            }
            else {
                paddedBuf = Buffer.from(buf, 'hex');
            }
        }
        if (paddedBuf.byteLength < length) {
            const emptyBuffer = Buffer.alloc(length - paddedBuf.byteLength);
            emptyBuffer.fill(0);
            return reverse ? Buffer.concat([emptyBuffer, paddedBuf]).reverse() : Buffer.concat([paddedBuf, emptyBuffer]);
        }
        else {
            return reverse ? paddedBuf.reverse() : paddedBuf;
        }
    }
}
exports.BoostUtils = BoostUtils;
