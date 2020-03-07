import { BoostPowStringModel } from './boost-pow-string-model';
import { BoostPowJobModel } from './boost-pow-job-model';
import { BoostPowJobProofModel } from './boost-pow-job-proof-model';
import { BoostPowMetadataModel } from './boost-pow-metadata-model';

const defaultOptions: any = {
  api_url: 'https://api.matterpool.io',
  network: 'bsv',          // 'bsv'
  version_path: 'api/v1',  // Do not change
}

export class BoostClient {
  options;
  constructor(providedOptions?: any) {
    this.options = Object.assign({}, defaultOptions, providedOptions);
  }

  get BoostPowString() {
    return BoostPowStringModel;
  }

  setOptions(newOptions) {
    this.options = Object.assign({}, this.options, newOptions);
  }

  static instance(newOptions?: any): BoostClient {
    const mergedOptions = Object.assign({}, defaultOptions, newOptions);
    return new BoostClient(mergedOptions);
  }
}

export function instance(newOptions?: any): BoostClient {
  const mergedOptions = Object.assign({}, defaultOptions, newOptions);
  return new BoostClient(mergedOptions);
}

try {
  if (window) {
    window['Boost'] = {
      Service: new BoostClient(),
      BoostPowString: BoostPowStringModel,
      BoostPowJob: BoostPowJobModel,
      BoostPowJobProof: BoostPowJobProofModel,
      BoostPowMetadata: BoostPowMetadataModel,
    };
  }
}
catch (ex) {
  // Window is not defined, must be running in windowless env....
}

export var BoostPowString = BoostPowStringModel;
export var BoostPowJob = BoostPowJobModel;
export var BoostPowJobProof = BoostPowJobProofModel;
export var BoostPowMetadata = BoostPowMetadataModel;

