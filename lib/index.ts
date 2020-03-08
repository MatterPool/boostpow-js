import { BoostPowStringModel } from './boost-pow-string-model';
import { BoostPowJobModel } from './boost-pow-job-model';
import { BoostPowJobProofModel } from './boost-pow-job-proof-model';
import { BoostPowMetadataModel } from './boost-pow-metadata-model';
import { BoostPowSimpleMinerModel } from './boost-pow-simple-miner-model';
import { BoostUtils } from './boost-utils';
import { BoostGraphApiClient } from './boost-graph-api-client';

const defaultOptions: any = {
  // boost_graph_api_url: 'https://graph.boostpow.com',
  api_url: 'https://api.mattercloud.net',
  // api_url: 'http://localhost:3000',
  network: 'main',          // 'bsv'
  version_path: 'api/v3',  // Do not change
}

export class BoostGraphApi {
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
    const apiClient = new BoostGraphApiClient(this.options);
    return apiClient.loadBoostJob(txid, callback);
  }

  getScriptUtxos(scriptHash: string, callback?: Function): Promise<any> {
    const apiClient = new BoostGraphApiClient(this.options);
    return apiClient.getScriptUtxos(scriptHash, callback);
  }

  setOptions(newOptions) {
    this.options = Object.assign({}, this.options, newOptions);
  }

  static instance(newOptions?: any): BoostGraphApi {
    const mergedOptions = Object.assign({}, defaultOptions, newOptions);
    return new BoostGraphApi(mergedOptions);
  }
}

export function Client(newOptions?: any): BoostGraphApi {
  const mergedOptions = Object.assign({}, defaultOptions, newOptions);
  return new BoostGraphApi(mergedOptions);
}

export function instance(newOptions?: any): BoostGraphApi {
  const mergedOptions = Object.assign({}, defaultOptions, newOptions);
  return new BoostGraphApi(mergedOptions);
}

try {
  if (window) {
    window['Boost'] = {
      BoostGraphApi: new BoostGraphApi(),
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


