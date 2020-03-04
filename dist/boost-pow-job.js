"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bsv = require("bsv");
const _1 = require(".");
class BoostPowJobModel {
    constructor(content, diff, category, tag, metadata, time, unique) {
        this.content = content;
        this.diff = diff;
        this.category = category;
        this.tag = tag;
        this.metadata = metadata;
        this.time = time;
        this.unique = unique;
    }
    id() {
        return '';
    }
    static fromObject(params) {
        return new _1.BoostPowJob(_1.BoostPowJob.createBufferAndPad(params.content, 32), params.diff, params.category ? params.category : 0, _1.BoostPowJob.createBufferAndPad(params.tag, 20), _1.BoostPowJob.createBufferAndPad(params.metadata, 32), params.time ? params.time : ((new Date()).getTime() / 1000), params.unique ? params.unique : Math.round(Math.random() * 100000000));
    }
    static createBufferAndPad(buf, length) {
        if (!buf) {
            const emptyBuffer = new Buffer(length);
            emptyBuffer.fill(0);
            return emptyBuffer;
        }
        let paddedBuf;
        if ((typeof buf).toString() === 'buffer') {
            paddedBuf = buf;
        }
        else {
            var re = /^[0-9A-Fa-f]+$/g;
            if (!re.test(buf)) {
                paddedBuf = Buffer.from(buf);
            }
            else {
                paddedBuf = Buffer.from(buf, 'hex');
            }
        }
        if (paddedBuf.byteLength < length) {
            const emptyBuffer = new Buffer(length - paddedBuf.byteLength);
            emptyBuffer.fill(0);
            return Buffer.concat([paddedBuf, emptyBuffer]);
        }
        else {
            return paddedBuf;
        }
    }
    toObject() {
        return {
            content: this.content.toString('hex'),
            diff: this.diff,
            category: this.category,
            tag: this.tag.toString('hex'),
            metadata: this.metadata.toString('hex'),
            time: this.time,
            unique: this.unique
        };
    }
    getBufferHex(field) {
        return field.toString('hex');
    }
    getNumberHex(v) {
        return Buffer.from(v.toString(16), 'hex').toString('hex');
    }
    getTarget() {
        return '08';
    }
    expandTarget() {
        /*
        SIZE {4} EQUALVERIFY {3} SPLIT
DUP {3} GREATERTHANOREQUAL VERIFY
DUP {32} LESSTHANOREQUAL VERIFY
TOALTSTACK
{0x0000000000000000000000000000000000000000000000000000000000} CAT
FROMALTSTACK {3} SUB RSHIFT
        */
        let str = `
        OP_SIZE OP_4 OP_EQUALVERIFY OP_3 OP_SPLIT
        OP_DUP OP_3 OP_GREATERTHANOREQUAL OP_VERIFY
        OP_DUP OP_PUSHDATA1 32 OP_LESSTHANOREQUAL OP_VERIFY
        OP_TOALTSTACK
        0000000000000000000000000000000000000000000000000000000000 OP_CAT
        OP_FROMALTSTACK OP_3 OP_SUB OP_RSHIFT
        `;
        str = str.replace(/\r\n|\n|\r/gm, '');
        str = str.replace(/\s\s+/g, ' ');
        return str;
    }
    toScriptASM() {
        let str = `
        OP_4 ${this.getNumberHex(this.category)} OP_32 ${this.getBufferHex(this.content)} OP_4 ${this.getTarget()}
        OP_20 ${this.getBufferHex(this.tag)} OP_8 ${this.getNumberHex(this.unique)} OP_32 ${this.getBufferHex(this.metadata)}
        OP_8 OP_PICK OP_SIZE OP_4 OP_EQUALVERIFY
        OP_6 OP_ROLL OP_DUP OP_TOALTSTACK OP_ROT
        OP_4 OP_PICK ${this.expandTarget()} OP_TOALTSTACK
        OP_7 OP_ROLL OP_SIZE OP_8 OP_EQUALVERIFY
        OP_4 OP_SPLIT OP_TOALTSTACK
        OP_CAT OP_ROT OP_CAT OP_CAT OP_CAT OP_HASH256
        OP_SWAP OP_CAT OP_CAT OP_CAT OP_SWAP OP_CAT
        OP_FROMALTSTACK OP_CAT OP_FROMALTSTACK OP_CAT
        OP_HASH256 OP_FROMALTSTACK OP_LESSTHAN OP_VERIFY
        OP_DUP OP_HASH256 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG
        `;
        str = str.replace(/\r\n|\n|\r/gm, '');
        str = str.replace(/\s\s+/g, ' ');
        console.log('str', str);
        var script = bsv.Script.fromASM(str);
        return script.toASM();
        /*
        const i = push(4){version}                           // should be 1
        push(32){content_hash}
        push(4){target}
        push(<=20){tag}
        push(8){user_additional_nonce}
        push{additional_data}
        {8} PICK SIZE {4} EQUALVERIFY              // check size of timestamp
        {6} ROLL DUP TOALTSTACK ROT                // copy miner’s address to alt stack
        {4} PICK expand_target TOALTSTACK          // target to alt stack.
        {7} ROLL SIZE {8} EQUALVERIFY              // check miner nonce size
        {4} SPLIT TOALTSTACK                       // split miner nonce and keep half
        CAT ROT CAT CAT CAT HASH256                // create abstract page and hash it.
        SWAP CAT CAT CAT SWAP CAT                  // attach merkle_root and timestamp.
        FROMALTSTACK CAT FROMALTSTACK CAT          // attach target and nonce
        // check that the hash of the title is less than the target
        HASH256 FROMALTSTACK LESSTHAN VERIFY
        // check that the given address matches the pubkey and check signature.
        DUP HASH256 FROMALTSTACK EQUALVERIFY CHECKSIG
        */
    }
}
exports.BoostPowJobModel = BoostPowJobModel;
