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
    hex() {
        return this.data.toString('hex');
    }
    number() {
        return this.data.readUInt32LE();
    }
    buffer() {
        return this.data;
    }
    string() {
        return boost_utils_1.BoostUtils.trimBufferString(this.data, true);
    }
}
exports.UInt32Little = UInt32Little;
