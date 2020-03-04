"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
        return new _1.BoostPowJob(_1.BoostPowJob.createBufferAndPad(params.content, 32), params.diff, params.category ? params.category : 0, _1.BoostPowJob.createBufferAndPad(params.tag, 20), _1.BoostPowJob.createBufferAndPad(params.metadata, 0), params.time ? params.time : ((new Date()).getTime() / 1000), params.unique ? params.unique : Math.round(Math.random() * 100000000));
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
}
exports.BoostPowJobModel = BoostPowJobModel;
