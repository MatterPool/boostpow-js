"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Digest32 = void 0;
const boost_utils_1 = require("../boost-utils");
const BN = require('bn.js');
class Digest32 {
    constructor(data) {
        this.data = data;
    }
    static fromHex(x) {
        return new Digest32(new Buffer(x, 'hex').reverse());
    }
    // reverse because of a horrible convention that exists in Bitcoin
    // which got started due to stupid a bug long ago.
    hex() {
        return new Buffer(this.data).reverse().toString('hex');
    }
    number() {
        return new BN(this.hex(), 'hex', 'be');
    }
    buffer() {
        return this.data;
    }
    string() {
        return this.utf8();
    }
    utf8() {
        return boost_utils_1.BoostUtils.trimBufferString(this.data, true);
    }
}
exports.Digest32 = Digest32;
