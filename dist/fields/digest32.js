"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Digest32 = void 0;
const bsv = require("bsv");
const boost_utils_1 = require("../boost-utils");
class Digest32 {
    constructor(data) {
        this.data = data;
    }
    static fromHex(x) {
        return new Digest32(new Buffer(x, 'hex').reverse());
    }
    // reverse because of a horrible convention that exists in Bitcoin
    // which got started due to stupid a bug long ago.
    get hex() {
        return new Buffer(this.data).reverse().toString('hex');
    }
    get number() {
        return new bsv.crypto.BN(this.hex, 'hex', 'be');
    }
    get buffer() {
        return this.data;
    }
    get string() {
        return this.utf8;
    }
    get utf8() {
        return boost_utils_1.BoostUtils.trimBufferString(this.data, true);
    }
}
exports.Digest32 = Digest32;
