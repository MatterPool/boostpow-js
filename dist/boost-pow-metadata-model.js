"use strict";
Object.defineProperty(exports, "__esModule", {value : true});
exports.BoostPowMetadataModel = void 0;
const bsv = require("bsv");
const boost_utils_1 = require("./boost-utils");
class BoostPowMetadataModel {
  constructor(tag, minerPubKeyHash, extraNonce1, extraNonce2, userNonce,
              additionalData) {
    this.tag = tag;
    this.minerPubKeyHash = minerPubKeyHash;
    this.extraNonce1 = extraNonce1;
    this.extraNonce2 = extraNonce2;
    this.userNonce = userNonce;
    this.additionalData = additionalData;
  }
  static fromObject(params) {
    return new BoostPowMetadataModel(
        new Buffer(params.tag, 'hex'),
        new Buffer(params.minerPubKeyHash, 'hex'),
        boost_utils_1.BoostUtils.createBufferAndPad(params.extraNonce1, 4,
                                                    false),
        boost_utils_1.BoostUtils.createBufferAndPad(params.extraNonce2, 8,
                                                    false),
        boost_utils_1.BoostUtils.createBufferAndPad(params.userNonce, 4, false),
        new Buffer(params.additionalData, 'hex'));
  }
  static fromBuffer(params) {
    return new BoostPowMetadataModel(params.tag, params.minerPubKeyHash,
                                     params.extraNonce1, params.extraNonce2,
                                     params.userNonce, params.additionalData);
  }
  trimBufferString(str, trimLeadingNulls = true) {
    const content = Buffer.from(str, 'hex').toString('utf8');
    if (trimLeadingNulls) {
      return content.replace(/\0/g, '');
    } else {
      return content;
    }
  }
  getTag() { return this.tag; }
  getTagUtf8() {
    return this.trimBufferString(
        Buffer.from(this.tag).reverse().toString('hex'), true);
  }
  getTagString() { return this.getTagUtf8(); }
  getMinerPubKeyHash() { return this.minerPubKeyHash; }
  getMinerPubKeyHashUtf8() { return this.minerPubKeyHash.toString('hex'); }
  getUserNonce() { return this.userNonce; }
  getUserNonceUtf8() {
    return this.trimBufferString(
        Buffer.from(this.userNonce).reverse().toString('hex'), true);
  }
  getUserNonceNumber() { return this.userNonce.readUInt32LE(); }
  getExtraNonce1Number() {
    return parseInt(this.extraNonce1.toString('hex'), 16);
  }
  getExtraNonce1() { return this.extraNonce1; }
  getExtraNonce2Number() {
    return parseInt(this.extraNonce2.toString('hex'), 16);
  }
  getExtraNonce2() { return this.extraNonce2; }
  getAdditionalData() { return this.additionalData; }
  getAdditionalDataUtf8() {
    return this.trimBufferString(
        Buffer.from(this.additionalData).reverse().toString('hex'), true);
  }
  getAdditionalDataString() { return this.getAdditionalDataUtf8(); }
  toString() {
    return Buffer
        .concat([
          this.tag, this.minerPubKeyHash, this.extraNonce1, this.extraNonce2,
          this.userNonce, this.additionalData
        ])
        .toString('hex');
  }
  getCoinbaseString() { return this.toString(); }
  hash() {
    return bsv.crypto.Hash.sha256sha256(this.toBuffer())
        .reverse()
        .toString('hex');
  }
  hashAsBuffer() {
    return bsv.crypto.Hash.sha256sha256(this.toBuffer()).reverse();
  }
  toObject() {
    return {
      tag : (this.tag.toString('hex').match(/../g) || []).reverse().join(''),
      minerPubKeyHash :
          (this.minerPubKeyHash.toString('hex').match(/../g) || [])
              .reverse()
              .join(''),
      extraNonce1 : (this.extraNonce1.toString('hex').match(/../g) || [])
                        .reverse()
                        .join(''),
      extraNonce2 : (this.extraNonce2.toString('hex').match(/../g) || [])
                        .reverse()
                        .join(''),
      userNonce : (this.userNonce.toString('hex').match(/../g) || [])
                      .reverse()
                      .join(''),
      additionalData : (this.additionalData.toString('hex').match(/../g) || [])
                           .reverse()
                           .join(''),
    };
  }
  toBuffer() {
    return Buffer.concat([
      this.tag, this.minerPubKeyHash, this.extraNonce1, this.extraNonce2,
      this.userNonce, this.additionalData
    ]);
  }
  toHex() { return this.toBuffer().toString('hex'); }
  static fromString(str) { return BoostPowMetadataModel.fromHex(str); }
  static fromHex(str) {
    return new BoostPowMetadataModel(Buffer.from(str.substr(0, 40), 'hex'),
                                     Buffer.from(str.substr(40, 40), 'hex'),
                                     Buffer.from(str.substr(80, 8), 'hex'),
                                     Buffer.from(str.substr(88, 8), 'hex'),
                                     Buffer.from(str.substr(96, 8), 'hex'),
                                     Buffer.from(str.substr(104), 'hex'));
  }
}
exports.BoostPowMetadataModel = BoostPowMetadataModel;
