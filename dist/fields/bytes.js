"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bytes = void 0;
const boost_utils_1 = require("../boost-utils");
class Bytes {
    constructor(data) {
        this.data = data;
    }
    hex() {
        return new Buffer(this.data).toString('hex');
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
exports.Bytes = Bytes;
