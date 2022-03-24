"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UInt32Big = exports.InvalidUInt32Big = void 0;
const boost_utils_1 = require("../boost-utils");
class InvalidUInt32Big {
    constructor() {
        this.name = 'InvalidUInt32Big';
        this.message = 'Value must be between 0 and 4294967295';
    }
}
exports.InvalidUInt32Big = InvalidUInt32Big;
class UInt32Big {
    constructor(data) {
        this.data = data;
    }
    static fromNumber(num) {
        let data = Buffer.alloc(4);
        if (num > 4294967295 || num < 0) {
            throw new InvalidUInt32Big;
        }
        data.writeUInt32BE(num);
        return new UInt32Big(data);
    }
    static fromHex(hex) {
        if (hex.length != 8) {
            throw new InvalidUInt32Big();
        }
        let data = Buffer.from(hex, 'hex');
        if (data.length != 4) {
            throw new InvalidUInt32Big();
        }
        return new UInt32Big(data);
    }
    get hex() {
        return this.data.toString('hex');
    }
    get number() {
        return this.data.readUInt32BE();
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
exports.UInt32Big = UInt32Big;
