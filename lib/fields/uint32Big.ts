import * as bsv from 'bsv'
import { BoostUtils } from '../boost-utils'

export class InvalidUInt32Big implements Error {
  name = 'InvalidUInt32Big' 
  message = 'Value must be between 0 and 4294967295'
}

export class UInt32Big {
  constructor(
    private data: Buffer,
  ) {
  }

  static fromNumber(num: number): UInt32Big {
    let data = Buffer.alloc(4)
    if (num > 4294967295 || num < 0) {
      throw new InvalidUInt32Big
    }
    data.writeUInt32BE(num)
    return new UInt32Big(data)
  }

  static fromHex(hex: string): UInt32Big {
    if (hex.length != 8) {
      throw new InvalidUInt32Big()
    }

    let data = Buffer.from(hex, 'hex');
    if (data.length != 4) {
      throw new InvalidUInt32Big()
    }

    return new UInt32Big(data)
  }

  get hex(): string {
    return this.data.toString('hex')
  }

  get number(): number {
    return this.data.readUInt32BE()
  }

  get buffer(): Buffer {
    return this.data
  }

  get string(): string {
    return this.utf8
  }

  get utf8(): string {
    return BoostUtils.trimBufferString(this.data, true)
  }
}
