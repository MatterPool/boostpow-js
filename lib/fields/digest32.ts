import * as bsv from 'bsv';
import { BoostUtils } from '../boost-utils';

const BN = require('bn.js');

export class Digest32 {
  constructor(
    private data: Buffer,
  ) {
  }

  static fromHex(x: string): Digest32 {
    return new Digest32(new Buffer(x, 'hex').reverse());
  }

  // reverse because of a horrible convention that exists in Bitcoin
  // which got started due to stupid a bug long ago.
  hex(): string {
    return new Buffer(this.data).reverse().toString('hex');
  }

  number() {
    return new BN(this.hex(), 'hex', 'be');
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
