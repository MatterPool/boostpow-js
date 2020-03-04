import * as bsv from 'bsv';
import { BoostPowJob } from '.';

export class BoostPowJobModel {

    private constructor(
        private content: Buffer,
        private diff: number,
        private category: number,
        private tag: Buffer,
        private metadata: Buffer,
        private time: number,
        private unique: number,
    ) {

    }

    id(): string {
        return '';
    }

    static fromObject(params: {
        content: string,
        diff: number,
        category?: number,
        tag?: string,
        metadata?: string,
        time?: number,
        unique?: number,
    }): BoostPowJobModel {

        return new BoostPowJob(
            BoostPowJob.createBufferAndPad(params.content, 32),
            params.diff,
            params.category ? params.category : 0,
            BoostPowJob.createBufferAndPad(params.tag, 20),
            BoostPowJob.createBufferAndPad(params.metadata, 0),
            params.time ? params.time : ((new Date()).getTime() / 1000),
            params.unique ? params.unique : Math.round(Math.random() * 100000000)
        );
    }

    static createBufferAndPad(buf: any, length: number): any {
        if (!buf) {
            const emptyBuffer = new Buffer(length);
            emptyBuffer.fill(0);
            return emptyBuffer;
        }
        let paddedBuf;
        if ((typeof buf).toString() === 'buffer') {
            paddedBuf = buf;
        } else {
            var re = /^[0-9A-Fa-f]+$/g;
            if (!re.test(buf)) {
                paddedBuf = Buffer.from(buf);
            } else {
                paddedBuf = Buffer.from(buf, 'hex');
            }
        }
        if (paddedBuf.byteLength < length) {
            const emptyBuffer = new Buffer(length - paddedBuf.byteLength);
            emptyBuffer.fill(0);
            return Buffer.concat([paddedBuf, emptyBuffer]);
        } else {
            return paddedBuf;
        }
    }

    toObject () {
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