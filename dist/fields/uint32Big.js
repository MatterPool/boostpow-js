"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UInt32Big = void 0;
const boost_utils_1 = require("../boost-utils");
class UInt32Big {
    constructor(data) {
        this.data = data;
    }
    static fromNumber(num) {
        let data = Buffer.alloc(4);
        if (num <= 4294967295 && num >= 0) {
            data.writeUInt32BE(num);
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
