import * as bsv from 'bsv';
import { BoostUtils } from '../boost-utils';

export class Digest20 {
  constructor(
    private data: Buffer,
  ) {
  }

  get hex(): string {
    return new Buffer(this.data).toString('hex');
  }

  get buffer(): Buffer {
    return this.data;
  }

  get string(): string {
    return this.utf8;
  }

  get utf8(): string {
    return BoostUtils.trimBufferString(this.data, true);
  }
}
