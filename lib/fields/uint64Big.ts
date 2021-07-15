import * as bsv from 'bsv';
import { BoostUtils } from '../boost-utils';

export class UInt64Big {
  constructor(
    private data: Buffer,
  ) {
  }

  hex(): string {
    return this.data.toString('hex');
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
