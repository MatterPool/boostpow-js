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
    hex() {
        return this.data.toString('hex');
    }
    number() {
        return this.data.readInt32LE();
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
exports.Int32Little = Int32Little;
