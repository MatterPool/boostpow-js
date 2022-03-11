"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UInt32Little = void 0;
const boost_utils_1 = require("../boost-utils");
class UInt32Little {
    constructor(data) {
        this.data = data;
    }
    static fromNumber(num) {
        let data = Buffer.alloc(4);
        if (num <= 4294967295 && num >= 0) {
            data.writeUInt32LE(num);
        }
        return new UInt32Little(data);
    }
    static fromHex(hex) {
        if (hex.length != 8) {
            return;
        }
        let data = Buffer.from(hex, 'hex');
        if (data.length != 4) {
            return;
        }
        return new UInt32Little(data);
    }
    get hex() {
        return this.data.toString('hex');
    }
    get number() {
        return this.data.readUInt32LE();
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
exports.UInt32Little = UInt32Little;
