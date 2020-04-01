import { BoostPowStringModel } from './boost-pow-string-model';
import { BoostPowJobModel } from './boost-pow-job-model';
import { BoostPowJobProofModel } from './boost-pow-job-proof-model';
import { BoostPowMetadataModel } from './boost-pow-metadata-model';
import { BoostUtils } from './boost-utils';
import { BoostGraphApiClient } from './boost-graph-api-client';
import { BoostSignalModel } from './boost-signal-model';
import { BoostSignalRankerModel } from './boost-signal-ranker-model';
import { GraphSearchQuery } from './graph-search-query';

const defaultOptions: any = {
  graph_api_url: 'https://graph2.boostpow.com',
  // graph_api_url: 'http://localhost:3000',
  api_url: 'https://api.mattercloud.net',
  // api_url: 'http://localhost:3000',
  network: 'main',          // 'bsv'
  version_path: 'api/v3',  // Do not change
}

export class BoostGraphClient {
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

  get BoostPowSignal() {
    return BoostSignalModel;
  }
  get BoostUtilsHelper() {
    return BoostUtilsHelper;
  }

  rawSearch(q?: GraphSearchQuery, callback?: Function): Promise<any> {
    const apiClient = new BoostGraphApiClient(this.options);
    return apiClient.rawSearch(q, callback);
  }

  search(q?: GraphSearchQuery, callback?: Function): Promise<any> {
    const apiClient = new BoostGraphApiClient(this.options);
    return apiClient.search(q, callback);
  }

  getBoostJobStatus(txid: string, callback?: Function): Promise<any> {
    const apiClient = new BoostGraphApiClient(this.options);
    return apiClient.getBoostJobStatus(txid, callback);
  }

  submitBoostJob(rawtx: string, callback?: Function): Promise<any> {
    const apiClient = new BoostGraphApiClient(this.options);
    return apiClient.submitBoostJob(rawtx, callback);
  }

  submitBoostSolution(params: { txid: string, vout: number, time: number, nonce: number, extraNonce1: number, extraNonce2: string}, callback?: Function): Promise<any> {
    const apiClient = new BoostGraphApiClient(this.options);
    return apiClient.submitBoostSolution(params, callback);
  }

  loadBoostJob(txid: string, callback?: Function): Promise<any> {
    const apiClient = new BoostGraphApiClient(this.options);
    return apiClient.loadBoostJob(txid, callback);
  }

  getBoostJobUtxos(scriptHash: string, callback?: Function): Promise<any> {
    const apiClient = new BoostGraphApiClient(this.options);
    return apiClient.getScriptUtxos(scriptHash, callback);
  }

  setOptions(newOptions) {
    this.options = Object.assign({}, this.options, newOptions);
  }

  static instance(newOptions?: any): BoostGraphClient {
    const mergedOptions = Object.assign({}, defaultOptions, newOptions);
    return new BoostGraphClient(mergedOptions);
  }
}

export function Graph(newOptions?: any): BoostGraphClient {
  const mergedOptions = Object.assign({}, defaultOptions, newOptions);
  return new BoostGraphClient(mergedOptions);
}

export function instance(newOptions?: any): BoostGraphClient {
  const mergedOptions = Object.assign({}, defaultOptions, newOptions);
  return new BoostGraphClient(mergedOptions);
}

try {
  if (window) {
    window['Boost'] = {
      BoostGraph: new BoostGraphClient(),
      BoostPowString: BoostPowStringModel,
      BoostPowJob: BoostPowJobModel,
      BoostPowJobProof: BoostPowJobProofModel,
      BoostPowMetadata: BoostPowMetadataModel,
      BoostSignal: BoostSignalModel,
      BoostSignalRanker: BoostSignalRankerModel,
      BoostUtils: BoostUtils,
    };
  }
}
catch (ex) {
  // Window is not defined, must be running in windowless env...
}

export var BoostPowString = BoostPowStringModel;
export var BoostPowJob = BoostPowJobModel;
export var BoostPowJobProof = BoostPowJobProofModel;
export var BoostPowMetadata = BoostPowMetadataModel;
export var BoostUtilsHelper = BoostUtils;
export var BoostGraph = BoostGraphClient;
export var BoostSignal = BoostSignalModel;
export var BoostSignalRanker = BoostSignalRankerModel;


function searchGraph(q?: GraphSearchQuery,callback?: Function): Promise<any> {
  const apiClient = new BoostGraphApiClient(defaultOptions);
  return apiClient.search(q,  callback);
}

function rawSearchGraph(q?: GraphSearchQuery,callback?: Function): Promise<any> {
  const apiClient = new BoostGraphApiClient(defaultOptions);
  return apiClient.search(q,  callback);
}

export var search = searchGraph;
export var rawSearch = rawSearchGraph;

function submitBoostJobGraph(rawtx: string, callback?: Function): Promise<any> {
  const apiClient = new BoostGraphApiClient(defaultOptions);
  return apiClient.submitBoostJob(rawtx, callback);
}

export var submitJob = submitBoostJobGraph;

function getBoostJobStatusGraph(txid: string, callback?: Function): Promise<any> {
  const apiClient = new BoostGraphApiClient(defaultOptions);
  return apiClient.getBoostJobStatus(txid, callback);
}
export var getJobStatus = getBoostJobStatusGraph;
