"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Int32Little = void 0;
const boost_utils_1 = require("../boost-utils");
class Int32Little {
    constructor(data) {
        this.data = data;
    }
    static fromNumber(num) {
        let data = Buffer.alloc(4);
        if (num <= 2147483647 && num >= -2147483648) {
            data.writeInt32LE(num);
        }
        return new Int32Little(data);
    }
    static fromHex(hex) {
        if (hex.length != 8) {
            return;
        }
        let data = Buffer.from(hex, 'hex');
        if (data.length != 4) {
            return;
        }
        return new Int32Little(data);
    }
    get buffer() {
        return this.data;
    }
    get hex() {
        return this.buffer.toString('hex');
    }
    get number() {
        return this.buffer.readInt32LE();
    }
    get string() {
        return this.utf8;
    }
    get utf8() {
        return boost_utils_1.BoostUtils.trimBufferString(this.buffer, true);
    }
}
exports.Int32Little = Int32Little;
