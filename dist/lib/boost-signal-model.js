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
        if (boostPowString.metadataHash !==
            bsv.crypto.Hash.sha256sha256(boostPowMetadata.toBuffer()).reverse().toString('hex')) {
            throw new Error('Fatal: Invalid metadata for the pow string');
        }
    }
    get jobId() {
        return this.boostJobId;
    }
    get jobProofId() {
        return this.boostJobProofId;
    }
    get powString() {
        return this.boostPowString;
    }
    get metadata() {
        return this.boostPowMetadata;
    }
    get hash() {
        return this.boostPowString.hash;
    }
    get difficulty() {
        return this.boostPowString.difficulty;
    }
    get content() {
        return this.boostPowString.content;
    }
    get category() {
        return this.boostPowString.category;
    }
    get metadataHash() {
        return this.boostPowString.metadataHash;
    }
    get time() {
        return this.boostPowString.time;
    }
    get nonce() {
        return this.boostPowString.nonce;
    }
    get tag() {
        if (!this.boostPowMetadata) {
            return null;
        }
        return this.boostPowMetadata.tag;
    }
    get userNonce() {
        if (!this.boostPowMetadata) {
            return null;
        }
        return this.boostPowMetadata.userNonce;
    }
    get additionalData() {
        if (!this.boostPowMetadata) {
            return null;
        }
        return this.boostPowMetadata.additionalData;
    }
    get minerPubKeyHash() {
        if (!this.boostPowMetadata) {
            return null;
        }
        return this.boostPowMetadata.minerPubKeyHash;
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
