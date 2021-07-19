import * as bsv from 'bsv';
import { BoostUtils } from '../boost-utils';

export class UInt16Little {
  constructor(
    private data: Buffer,
  ) {
  }

  static fromNumber(num: number): UInt16Little {
    let data = Buffer.alloc(2);
    if (num <= 65536 && num >= 0) {
      data.writeUInt16LE(num);
    }
    return new UInt16Little(data);
  }

  hex(): string {
    return this.data.toString('hex');
  }

  number(): number {
    return this.data.readUInt16LE();
  }

  buffer(): Buffer {
    return this.data;
  }

  string(): string {
    return this.hex();
  }
}
