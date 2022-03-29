"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Proof = exports.pow_string = exports.meta = exports.Solution = exports.Puzzle = void 0;
const bsv = require("bsv");
const bytes_1 = require("../fields/bytes");
const boost_utils_1 = require("../boost-utils");
const string_1 = require("./string");
var string_2 = require("./string");
Object.defineProperty(exports, "PowString", { enumerable: true, get: function () { return string_2.PowString; } });
// TODO the puzzle also needs to contain a Merkle branch but for Boost that is empty.
class Puzzle {
    constructor(Category, Content, Difficulty, MetaBegin, MetaEnd, Mask) {
        this.Category = Category;
        this.Content = Content;
        this.Difficulty = Difficulty;
        this.MetaBegin = MetaBegin;
        this.MetaEnd = MetaEnd;
        this.Mask = Mask;
    }
}
exports.Puzzle = Puzzle;
class Solution {
    constructor(Time, ExtraNonce1, ExtraNonce2, Nonce, GeneralPurposeBits) {
        this.Time = Time;
        this.ExtraNonce1 = ExtraNonce1;
        this.ExtraNonce2 = ExtraNonce2;
        this.Nonce = Nonce;
        this.GeneralPurposeBits = GeneralPurposeBits;
    }
}
exports.Solution = Solution;
function meta(p, x) {
    return new bytes_1.Bytes(Buffer.concat([
        p.MetaBegin.buffer,
        x.ExtraNonce1.buffer,
        x.ExtraNonce2.buffer,
        p.MetaEnd.buffer
    ]));
}
exports.meta = meta;
function pow_string(p, x) {
    var category;
    if (p.Mask) {
        var generalPurposeBits = x.GeneralPurposeBits;
        if (generalPurposeBits) {
            category = boost_utils_1.BoostUtils.writeUInt32LE((p.Category.number & p.Mask.number) |
                (generalPurposeBits.number & ~p.Mask.number));
        }
        else {
            return;
        }
    }
    else if (x.GeneralPurposeBits) {
        return;
    }
    else {
        category = p.Category.buffer;
    }
    const boostPowMetadataCoinbaseString = meta(p, x);
    const headerBuf = Buffer.concat([
        category,
        p.Content.buffer,
        boostPowMetadataCoinbaseString.hash256.buffer,
        x.Time.buffer,
        p.Difficulty.buffer,
        x.Nonce.buffer,
    ]);
    return new string_1.PowString(bsv.BlockHeader.fromBuffer(headerBuf));
}
exports.pow_string = pow_string;
// TODO the puzzle also needs to contain a Merkle branch but for Boost that is empty.
class Proof {
    constructor(Puzzle, Solution) {
        this.Puzzle = Puzzle;
        this.Solution = Solution;
    }
    metadata() {
        return meta(this.Puzzle, this.Solution);
    }
    string() {
        return pow_string(this.Puzzle, this.Solution);
    }
    valid() {
        let x = this.string();
        if (x) {
            return x.valid();
        }
        return false;
    }
}
exports.Proof = Proof;
