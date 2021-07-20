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

  get hex(): string {
    return this.data.toString('hex');
  }

  get number(): number {
    return this.data.readUInt16LE();
  }

  get buffer(): Buffer {
    return this.data;
  }

  get string(): string {
    return this.hex;
  }
}
