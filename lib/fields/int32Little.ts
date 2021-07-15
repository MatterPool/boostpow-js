import * as bsv from 'bsv';
import { BoostUtils } from '../boost-utils';

export class Int32Little {
  constructor(
    private data: Buffer,
  ) {
  }

  static fromNumber(num: number): Int32Little {
    let data = Buffer.alloc(4);
    if (num <= 2147483647 && num >= -2147483648) {
      data.writeInt32LE(num);
    }
    return new Int32Little(data);
  }

  hex(): string {
    return this.data.toString('hex');
  }

  number(): number {
    return this.data.readInt32LE();
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
