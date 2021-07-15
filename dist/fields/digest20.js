"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Digest20 = void 0;
const boost_utils_1 = require("../boost-utils");
class Digest20 {
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
exports.Digest20 = Digest20;
