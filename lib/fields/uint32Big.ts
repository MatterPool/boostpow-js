import * as bsv from 'bsv';
import { BoostUtils } from '../boost-utils';

export class UInt32Big {
  constructor(
    private data: Buffer,
  ) {
  }

  static fromNumber(num: number): UInt32Big {
    let data = Buffer.alloc(4);
    if (num <= 4294967295 && num >= 0) {
      data.writeUInt32BE(num);
    }
    return new UInt32Big(data);
  }

  get hex(): string {
    return this.data.toString('hex');
  }

  get number(): number {
    return this.data.readUInt32BE();
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
