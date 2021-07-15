"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoostSignalModel = void 0;
const bsv = require("bsv");
class BoostSignalModel {
    constructor(boostPowString, boostPowMetadata, boostJobId, boostJobProofId) {
        this.boostPowString = boostPowString;
        this.boostPowMetadata = boostPowMetadata;
        this.boostJobId = boostJobId;
        this.boostJobProofId = boostJobProofId;
        if (!boostPowMetadata) {
            // No metadata, that's OKAY! We just have a valid Pow String but know nothing of tag, userNonce, additionalData, etc
            // But that's okay and this is still a valid signal, but missing the metadata
            return;
        }
        // On the other hand if the metadata is provided, then we will strictly check that they belong together!
        // Validate the proof of work here matches the metadataHash because we trust no one!
        //
        if (boostPowString.metadataHash() !==
            bsv.crypto.Hash.sha256sha256(boostPowMetadata.toBuffer()).reverse().toString('hex')) {
            throw new Error('Fatal: Invalid metadata for the pow string');
        }
    }
    ;
    getBoostJobId() {
        return this.boostJobId;
    }
    getBoostJobProofId() {
        return this.boostJobProofId;
    }
    getBoostPowString() {
        return this.boostPowString;
    }
    getBoostMetadata() {
        return this.boostPowMetadata;
    }
    hash() {
        return this.boostPowString.hash();
    }
    difficulty() {
        return this.boostPowString.difficulty();
    }
    energy() {
        return this.difficulty();
    }
    content() {
        return this.boostPowString.content();
    }
    category() {
        return this.boostPowString.category();
    }
    metadataHash() {
        return this.boostPowString.metadataHash();
    }
    time() {
        return this.boostPowString.time();
    }
    nonce() {
        return this.boostPowString.nonce();
    }
    tag(hex) {
        if (!this.boostPowMetadata) {
            return null;
        }
        if (hex) {
            return this.boostPowMetadata.getTag().toString('hex');
        }
        return this.boostPowMetadata.getTagUtf8();
    }
    userNonce() {
        if (!this.boostPowMetadata) {
            return null;
        }
        return this.boostPowMetadata.userNonce();
    }
    additionalData(hex) {
        if (!this.boostPowMetadata) {
            return null;
        }
        if (hex) {
            return this.boostPowMetadata.getAdditionalData().toString('hex');
        }
        return this.boostPowMetadata.getAdditionalDataUtf8();
    }
    minerPubKeyHash() {
        if (!this.boostPowMetadata) {
            return null;
        }
        return this.boostPowMetadata.getMinerPubKeyHash().toString('hex');
    }
    toString() {
        let str = this.boostPowString.toString();
        if (this.boostPowMetadata) {
            str += this.boostPowMetadata;
        }
        return str;
    }
    toObject() {
        return {
            boostJobId: this.boostJobId,
            boostJobProofId: this.boostJobProofId,
            boostPowString: this.boostPowString.toString(),
            boostPowMetadata: this.boostPowMetadata ? this.boostPowMetadata.toString() : null,
        };
    }
}
exports.BoostSignalModel = BoostSignalModel;
