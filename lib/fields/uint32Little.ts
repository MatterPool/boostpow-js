import * as bsv from 'bsv';
import { BoostUtils } from '../boost-utils';

export class UInt32Little {
  constructor(
    private data: Buffer,
  ) {
  }

  static fromNumber(num: number): UInt32Little {
    let data = Buffer.alloc(4);
    if (num <= 4294967295 && num >= 0) {
      data.writeUInt32LE(num);
    }
    return new UInt32Little(data);
  }

  hex(): string {
    return this.data.toString('hex');
  }

  number(): number {
    return this.data.readUInt32LE();
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
