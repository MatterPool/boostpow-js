import * as bsv from 'bsv';
import { BoostUtils } from '../boost-utils';

export class Digest20 {
  constructor(
    private data: Buffer,
  ) {
  }

  hex(): string {
    return new Buffer(this.data).toString('hex');
  }

  buffer(): Buffer {
    return this.data;
  }

  string(): string {
    return this.utf8();
  }

  utf8(): string {
    return BoostUtils.trimBufferString(this.data, true);
  }
}
