"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bytes = void 0;
const bsv = require("bsv");
const boost_utils_1 = require("../boost-utils");
const digest32_1 = require("./digest32");
class Bytes {
    constructor(data) {
        this.data = data;
    }
    get buffer() {
        return this.data;
    }
    get hex() {
        return new Buffer(this.buffer).toString('hex');
    }
    get string() {
        return this.utf8;
    }
    get utf8() {
        return boost_utils_1.BoostUtils.trimBufferString(this.buffer, true);
    }
    get hash256() {
        return new digest32_1.Digest32(bsv.crypto.Hash.sha256sha256(this.buffer));
    }
}
exports.Bytes = Bytes;
