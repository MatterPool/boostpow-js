"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bytes = void 0;
const boost_utils_1 = require("../boost-utils");
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
}
exports.Bytes = Bytes;
