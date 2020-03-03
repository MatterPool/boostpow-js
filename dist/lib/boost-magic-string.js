"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const boost_header_model_1 = require("./boost-header-model");
class BoostMagicString {
    constructor(boostheader) {
        // If a BoostHeaderModel can be constructed, then the POW is valid (it was already validated at constructor)
        this._boostheader = boostheader;
        // But let's check the Pow again, because we can.
        if (!this._boostheader.validProofOfWork()) {
            throw new Error('INVALID_POW');
        }
    }
    hash() {
        return this._boostheader.hash();
    }
    static fromBuffer(buf) {
        return new BoostMagicString(boost_header_model_1.BoostHeaderModel.fromBuffer(buf));
    }
    static fromString(str) {
        return new BoostMagicString(boost_header_model_1.BoostHeaderModel.fromString(str));
    }
    static fromObject(obj) {
        return new BoostMagicString(boost_header_model_1.BoostHeaderModel.fromObject(obj));
    }
    toBuffer() {
        return this._boostheader.toBuffer();
    }
    toString() {
        return this._boostheader.toString();
    }
    toObject() {
        return this._boostheader.toObject();
    }
}
exports.BoostMagicString = BoostMagicString;
