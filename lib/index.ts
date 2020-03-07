import { BoostPowStringModel } from './boost-pow-string-model';
import { BoostPowJobModel } from './boost-pow-job-model';
import { BoostPowJobProofModel } from './boost-pow-job-proof-model';
import { BoostPowMetadataModel } from './boost-pow-metadata-model';
import { BoostPowSimpleMinerModel } from './boost-pow-simple-miner-model';
import { BoostUtils } from './boost-utils';
import { APIClient } from './api-client';

const defaultOptions: any = {
  api_url: 'https://api.mattercloud.net',
  network: 'main',          // 'bsv'
  version_path: 'api/v3',  // Do not change
}

export class BoostClient {
  options;
  constructor(providedOptions?: any) {
    this.options = Object.assign({}, defaultOptions, providedOptions);
  }

  get BoostPowString() {
    return BoostPowStringModel;
  }

  get BoostPowJob() {
    return BoostPowJobModel;
  }

  get BoostPowJobProof() {
    return BoostPowJobProofModel;
  }

  get BoostPowMetadata() {
    return BoostPowMetadataModel;
  }

  get BoostPowSimpleMiner() {
    return BoostPowSimpleMinerModel;
  }

  loadBoostJob(txid: string, callback?: Function): Promise<any> {
    const apiClient = new APIClient(this.options);
    return apiClient.loadBoostJob(txid, callback);
  }

  setOptions(newOptions) {
    this.options = Object.assign({}, this.options, newOptions);
  }

  static instance(newOptions?: any): BoostClient {
    const mergedOptions = Object.assign({}, defaultOptions, newOptions);
    return new BoostClient(mergedOptions);
  }
}

export function Client(newOptions?: any): BoostClient {
  const mergedOptions = Object.assign({}, defaultOptions, newOptions);
  return new BoostClient(mergedOptions);
}

try {
  if (window) {
    window['Boost'] = {
      Client: new BoostClient(),
      BoostPowString: BoostPowStringModel,
      BoostPowJob: BoostPowJobModel,
      BoostPowJobProof: BoostPowJobProofModel,
      BoostPowMetadata: BoostPowMetadataModel,
      BoostPowSimpleMiner: BoostPowSimpleMinerModel,
      BoostUtils: BoostUtils,
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
export var BoostPowSimpleMiner = BoostPowSimpleMinerModel;
export var BoostUtilsHelper = BoostUtils;


