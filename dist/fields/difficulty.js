"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Difficulty = void 0;
const boost_utils_1 = require("../boost-utils");
const uint32Little_1 = require("./uint32Little");
class Difficulty {
    constructor(diff) {
        this.diff = diff;
    }
    static fromBits(bits) {
        return new Difficulty(boost_utils_1.BoostUtils.difficulty(bits));
    }
    get number() {
        return this.diff;
    }
    get bits() {
        return boost_utils_1.BoostUtils.difficulty2bits(this.diff);
    }
    get buffer() {
        return uint32Little_1.UInt32Little.fromNumber(this.bits).buffer;
    }
    get hex() {
        return this.buffer.toString('hex');
    }
    get string() {
        return this.hex;
    }
    get target() {
        return boost_utils_1.BoostUtils.getTargetDifficulty(this.bits);
    }
}
exports.Difficulty = Difficulty;
