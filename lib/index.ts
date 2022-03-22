import { BoostPowStringModel } from './boost-pow-string-model'
import { BoostPowJobModel } from './boost-pow-job-model'
import { BoostPowJobProofModel } from './boost-pow-job-proof-model'
import { BoostPowMetadataModel } from './boost-pow-metadata-model'
import { BoostUtils } from './boost-utils'
import { BoostGraphApiClient } from './boost-graph-api-client'
import { BoostSignalModel } from './boost-signal-model'
import { BoostSignalRankerModel } from './boost-signal-ranker-model'
import { GraphSearchQuery } from './graph-search-query'

import { Bytes } from './fields/bytes'
import { Difficulty } from './fields/difficulty'
import { Digest20 } from './fields/digest20'
import { Digest32 } from './fields/digest32'
import { Int32Little } from './fields/int32Little'
import { UInt16Little } from './fields/uint16Little'
import { UInt32Little } from './fields/uint32Little'
import { UInt32Big } from './fields/uint32Big'
import { UInt64Big } from './fields/uint64Big'

const defaultOptions: any = {
  graph_api_url: 'https://graph.boostpow.com',
  // graph_api_url: 'http://localhost:3000',
  api_url: 'https://api.mattercloud.net',
  // api_url: 'http://localhost:3000',
  network: 'main',          // 'bsv'
  version_path: 'api/v3',  // Do not change
}

export class BoostGraphClient {
  options
  constructor(providedOptions?: any) {
    this.options = Object.assign({}, defaultOptions, providedOptions)
  }

  get BoostPowString() {
    return BoostPowStringModel
  }

  get BoostPowJob() {
    return BoostPowJobModel
  }

  get BoostPowJobProof() {
    return BoostPowJobProofModel
  }

  get BoostPowMetadata() {
    return BoostPowMetadataModel
  }

  get BoostPowSignal() {
    return BoostSignalModel
  }
  get BoostUtilsHelper() {
    return BoostUtilsHelper
  }

  rawSearch(q?: GraphSearchQuery, callback?: Function): Promise<any> {
    const apiClient = new BoostGraphApiClient(this.options)
    return apiClient.rawSearch(q, callback)
  }

  getBoostJobStatus(txid: string, callback?: Function): Promise<any> {
    const apiClient = new BoostGraphApiClient(this.options);
    return apiClient.getBoostJobStatus(txid, callback);
  }

  submitBoostJob(rawtx: string, callback?: Function): Promise<any> {
    const apiClient = new BoostGraphApiClient(this.options);
    return apiClient.submitBoostJob(rawtx, callback);
  }

  submitBatchBoostJobRequest(rawtx: string, params: { content?: string, tag?: string, diff?: number, numOutputs?: number }, callback?: Function): Promise<any> {
    const apiClient = new BoostGraphApiClient(this.options)
    return apiClient.submitBatchBoostJobRequest(rawtx, params, callback)
  }

  getBatchBoostJobRequestStatus(txid: string, callback?: Function): Promise<any> {
    const apiClient = new BoostGraphApiClient(this.options)
    return apiClient.getBatchBoostJobRequestStatus(txid, callback)
  }

  submitBoostSolution(params: { txid: string, vout: number, time: number, nonce: number, extraNonce1: number, extraNonce2: string}, callback?: Function): Promise<any> {
    const apiClient = new BoostGraphApiClient(this.options)
    return apiClient.submitBoostSolution(params, callback);
  }

  loadBoostJob(txid: string, callback?: Function): Promise<any> {
    const apiClient = new BoostGraphApiClient(this.options)
    return apiClient.loadBoostJob(txid, callback)
  }

  getBoostJobUtxos(scriptHash: string, callback?: Function): Promise<any> {
    const apiClient = new BoostGraphApiClient(this.options)
    return apiClient.getScriptUtxos(scriptHash, callback)
  }

  setOptions(newOptions) {
    this.options = Object.assign({}, this.options, newOptions)
  }

  static instance(newOptions?: any): BoostGraphClient {
    const mergedOptions = Object.assign({}, defaultOptions, newOptions)
    return new BoostGraphClient(mergedOptions);
  }
}

export function Graph(newOptions?: any): BoostGraphClient {
  const mergedOptions = Object.assign({}, defaultOptions, newOptions)
  return new BoostGraphClient(mergedOptions);
}

export function instance(newOptions?: any): BoostGraphClient {
  const mergedOptions = Object.assign({}, defaultOptions, newOptions)
  return new BoostGraphClient(mergedOptions)
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
    }
  }
}
catch (ex) {
  // Window is not defined, must be running in windowless env...
}

export let BoostPowString = BoostPowStringModel
export let BoostPowJob = BoostPowJobModel
export let BoostPowJobProof = BoostPowJobProofModel
export let BoostPowMetadata = BoostPowMetadataModel
export let BoostUtilsHelper = BoostUtils
export let BoostGraph = BoostGraphClient;
export let BoostSignal = BoostSignalModel
export let BoostSignalRanker = BoostSignalRankerModel

function rawSearchGraph(q?: GraphSearchQuery,callback?: Function): Promise<any> {
  const apiClient = new BoostGraphApiClient(defaultOptions)
  return apiClient.rawSearch(q,  callback)
}

export var rawSearch = rawSearchGraph

function submitBoostJobGraph(rawtx: string, callback?: Function): Promise<any> {
  const apiClient = new BoostGraphApiClient(defaultOptions)
  return apiClient.submitBoostJob(rawtx, callback)
}

export var submitJob = submitBoostJobGraph

function getBoostJobStatusGraph(txid: string, callback?: Function): Promise<any> {
  const apiClient = new BoostGraphApiClient(defaultOptions)
  return apiClient.getBoostJobStatus(txid, callback)
}
export var getJobStatus = getBoostJobStatusGraph
