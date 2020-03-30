"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BoostPowStringHeaderModel {
    constructor(tag, minerPubKeyHash, extraNonce1, extraNonce2, userNonce, additionalData) {
        this.tag = tag;
        this.minerPubKeyHash = minerPubKeyHash;
        this.extraNonce1 = extraNonce1;
        this.extraNonce2 = extraNonce2;
        this.userNonce = userNonce;
        this.additionalData = additionalData;
    }
}
exports.BoostPowStringHeaderModel = BoostPowStringHeaderModel;
