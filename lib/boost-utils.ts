 import * as bsv from 'bsv';

 export class BoostUtils {

    static getSha256(str, encoding: 'utf8' | 'hex' = 'utf8') {
        const hashed = Buffer.from(str, encoding);
        const h = bsv.crypto.Hash.sha256(hashed).toString('hex');
        return h;
    }

    static writeInt32LE(x: number): Buffer {
        if (x > 0x7fffffff) throw "number too big to be an int32.";
        if (x < -2147483648) throw "number too small to be an int32.";
        let b: Buffer = new Buffer(4);
        b.writeInt32LE(x);
        return b;
    }

    static writeUInt32LE(x: number): Buffer {
        if (x > 0xffffffff) throw "number too big to be a uint32."
        let b: Buffer = new Buffer(4);
        b.writeUInt32LE(x);
        return b;
    }

    static trimBufferString(str: Buffer, trimTrailingNulls = true): string {
        const content = str.toString('utf8');
        if (trimTrailingNulls) {
            return content.replace(/\0+$/g, '');
        } else {
            return content;
        }
    }

    static maxBits(): number {
      return 0x2100ffff;
    }

    static minBits(): number {
      return 0x03000001;
    }

    static unitBits(): number {
      return 0x1d00ffff;
    }

    /**
     * Returns the target difficulty for this block
     * @param {Number} bits
     * @returns {BN} An instance of BN with the decoded difficulty bits
     */
    public static getTargetDifficulty(bits: number): bsv.crypto.BN {
        var target = new bsv.crypto.BN(bits & 0xffffff);
        var mov = ((bits >>> 24) - 3);
        while (mov-- > 0) {
            target = target.mul(new bsv.crypto.BN(256));
        }
        return target;
    }

    // This function doesn't make much sense. It is a combinion of two functions
    // by Daniel and Attila which both purport to solve the same problem. They
    // each don't work quite right in different domains, but when they are
    // combined they result in a successful function. I don't really know why
    // it works this way, and it would be good if we had something simpler.

    // https://bitcoin.stackexchange.com/questions/30467/what-are-the-equations-to-convert-between-bits-and-difficulty
    /**
     * @link https://en.bitcoin.it/wiki/Difficulty
     * @return {Number}
     */
    static difficulty (bits: number): number {
        var difficulty1TargetBN = BoostUtils.getTargetDifficulty(BoostUtils.unitBits());
        var currentTargetBN = BoostUtils.getTargetDifficulty(bits);

        if (currentTargetBN.gt(difficulty1TargetBN)) {
          return parseFloat(difficulty1TargetBN.toString(10)) / parseFloat(currentTargetBN.toString(10));
        }

        var difficultyString = difficulty1TargetBN.mul(new bsv.crypto.BN(Math.pow(10, 8))).div(currentTargetBN).toString(10);
        var decimalPos = difficultyString.length - 8;
        difficultyString = difficultyString.slice(0, decimalPos) + '.' + difficultyString.slice(decimalPos);
        return parseFloat(difficultyString);
    }

    static difficulty2bits(difficulty: number): number {
        if (difficulty < 0) throw 'difficulty cannot be negative';
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

    static getTargetAsNumberBuffer(diff: any): any {
        const i = BoostUtils.difficulty2bits(diff);
        return Buffer.from(i.toString(16), 'hex').reverse();
    }

    // creates a buffer from a string with an optional parameter
    // to determine the total length. The buffer will be padded with
    // zeros to achieve this length.
    static stringToBuffer(str: string, length?: number): Buffer {
        if (!length) {
          return Buffer.from(str, 'utf8');
        }

        if (str.length > length) throw 'string is too big';
        let buf = Buffer.from(str, 'utf8');
        let pad = Buffer.alloc(length - str.length);
        return Buffer.concat([buf, pad]);
    }

    static generalPurposeBitsMask(): number {
      return 0xE0001FFF;
    }

    static generalPurposeBits(category: number): number {
      return (~generalPurposeBitsMask() & category >> 13);
    }

    static magicNumber(category: number): number {
      return (0x00001FFF & category) | ((0xE0000000 & category) >> 16);
    }

    static version(category: number): number {
      return generalPurposeBitsMask() & category;
    }

    static createBufferAndPad(buf: any, length: number, reverse = true): any {
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
        } else {
            if (buf.length > (length*2)) {
                throw new Error('The buffer is out of bounds: ' + length + ' bytes expected');
            }
            var re = /^([0-9A-Fa-f][0-9A-Fa-f])+$/g;
            if (!re.test(buf)) {
                throw 'not a hex string';
            } else {
                paddedBuf = Buffer.from(buf, 'hex');
            }
        }
        if (paddedBuf.byteLength < length) {
            const emptyBuffer = Buffer.alloc(length - paddedBuf.byteLength);
            emptyBuffer.fill(0);
            return reverse ? Buffer.concat([emptyBuffer, paddedBuf]).reverse() : Buffer.concat([paddedBuf, emptyBuffer]);
        } else {
            return reverse ? paddedBuf.reverse() : paddedBuf;
        }
    }
}
