"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJobStatus = exports.submitJob = exports.rawSearch = exports.BoostSignalRanker = exports.BoostSignal = exports.BoostGraph = exports.BoostUtilsHelper = exports.BoostPowMetadata = exports.BoostPowJobProof = exports.BoostPowJob = exports.BoostPowString = exports.instance = exports.Graph = exports.BoostGraphClient = void 0;
const boost_pow_string_model_1 = require("./boost-pow-string-model");
const boost_pow_job_model_1 = require("./boost-pow-job-model");
const boost_pow_job_proof_model_1 = require("./boost-pow-job-proof-model");
const boost_pow_metadata_model_1 = require("./boost-pow-metadata-model");
const boost_utils_1 = require("./boost-utils");
const boost_graph_api_client_1 = require("./boost-graph-api-client");
const boost_signal_model_1 = require("./boost-signal-model");
const boost_signal_ranker_model_1 = require("./boost-signal-ranker-model");
/*
import { Bytes } from './fields/bytes'
import { Difficulty } from './fields/difficulty'
import { Digest20 } from './fields/digest20'
import { Digest32 } from './fields/digest32'
import { Int32Little } from './fields/int32Little'
import { UInt16Little } from './fields/uint16Little'
import { UInt32Big } from './fields/uint32Big'
import { UInt32Little } from './fields/uint32Little'
import { UInt64Big } from './uint64Big*/
const defaultOptions = {
    graph_api_url: 'https://graph.boostpow.com',
    // graph_api_url: 'http://localhost:3000',
    api_url: 'https://api.mattercloud.net',
    // api_url: 'http://localhost:3000',
    network: 'main',
    version_path: 'api/v3',
};
class BoostGraphClient {
    constructor(providedOptions) {
        this.options = Object.assign({}, defaultOptions, providedOptions);
    }
    get BoostPowString() {
        return boost_pow_string_model_1.BoostPowStringModel;
    }
    get BoostPowJob() {
        return boost_pow_job_model_1.BoostPowJobModel;
    }
    get BoostPowJobProof() {
        return boost_pow_job_proof_model_1.BoostPowJobProofModel;
    }
    get BoostPowMetadata() {
        return boost_pow_metadata_model_1.BoostPowMetadataModel;
    }
    get BoostPowSignal() {
        return boost_signal_model_1.BoostSignalModel;
    }
    get BoostUtilsHelper() {
        return exports.BoostUtilsHelper;
    }
    rawSearch(q, callback) {
        const apiClient = new boost_graph_api_client_1.BoostGraphApiClient(this.options);
        return apiClient.rawSearch(q, callback);
    }
    getBoostJobStatus(txid, callback) {
        const apiClient = new boost_graph_api_client_1.BoostGraphApiClient(this.options);
        return apiClient.getBoostJobStatus(txid, callback);
    }
    submitBoostJob(rawtx, callback) {
        const apiClient = new boost_graph_api_client_1.BoostGraphApiClient(this.options);
        return apiClient.submitBoostJob(rawtx, callback);
    }
    submitBatchBoostJobRequest(rawtx, params, callback) {
        const apiClient = new boost_graph_api_client_1.BoostGraphApiClient(this.options);
        return apiClient.submitBatchBoostJobRequest(rawtx, params, callback);
    }
    getBatchBoostJobRequestStatus(txid, callback) {
        const apiClient = new boost_graph_api_client_1.BoostGraphApiClient(this.options);
        return apiClient.getBatchBoostJobRequestStatus(txid, callback);
    }
    submitBoostSolution(params, callback) {
        const apiClient = new boost_graph_api_client_1.BoostGraphApiClient(this.options);
        return apiClient.submitBoostSolution(params, callback);
    }
    loadBoostJob(txid, callback) {
        const apiClient = new boost_graph_api_client_1.BoostGraphApiClient(this.options);
        return apiClient.loadBoostJob(txid, callback);
    }
    getBoostJobUtxos(scriptHash, callback) {
        const apiClient = new boost_graph_api_client_1.BoostGraphApiClient(this.options);
        return apiClient.getScriptUtxos(scriptHash, callback);
    }
    setOptions(newOptions) {
        this.options = Object.assign({}, this.options, newOptions);
    }
    static instance(newOptions) {
        const mergedOptions = Object.assign({}, defaultOptions, newOptions);
        return new BoostGraphClient(mergedOptions);
    }
}
exports.BoostGraphClient = BoostGraphClient;
function Graph(newOptions) {
    const mergedOptions = Object.assign({}, defaultOptions, newOptions);
    return new BoostGraphClient(mergedOptions);
}
exports.Graph = Graph;
function instance(newOptions) {
    const mergedOptions = Object.assign({}, defaultOptions, newOptions);
    return new BoostGraphClient(mergedOptions);
}
exports.instance = instance;
try {
    if (window) {
        window['Boost'] = {
            BoostGraph: new BoostGraphClient(),
            BoostPowString: boost_pow_string_model_1.BoostPowStringModel,
            BoostPowJob: boost_pow_job_model_1.BoostPowJobModel,
            BoostPowJobProof: boost_pow_job_proof_model_1.BoostPowJobProofModel,
            BoostPowMetadata: boost_pow_metadata_model_1.BoostPowMetadataModel,
            BoostSignal: boost_signal_model_1.BoostSignalModel,
            BoostSignalRanker: boost_signal_ranker_model_1.BoostSignalRankerModel,
            BoostUtils: boost_utils_1.BoostUtils,
        };
    }
}
catch (ex) {
    // Window is not defined, must be running in windowless env...
}
exports.BoostPowString = boost_pow_string_model_1.BoostPowStringModel;
exports.BoostPowJob = boost_pow_job_model_1.BoostPowJobModel;
exports.BoostPowJobProof = boost_pow_job_proof_model_1.BoostPowJobProofModel;
exports.BoostPowMetadata = boost_pow_metadata_model_1.BoostPowMetadataModel;
exports.BoostUtilsHelper = boost_utils_1.BoostUtils;
exports.BoostGraph = BoostGraphClient;
exports.BoostSignal = boost_signal_model_1.BoostSignalModel;
exports.BoostSignalRanker = boost_signal_ranker_model_1.BoostSignalRankerModel;
/*
export Bytes = Bytes
export let Difficulty = Difficulty
export let Digest20 = Digest20
export let Digest32 = Digest32
export let Int32Little = Int32Little
export let UInt16Little = UInt16Little
export let UInt32Big = UInt32Big
export let UInt32Little = UInt32Little
export let UInt64Big = UInt64Big*/
function rawSearchGraph(q, callback) {
    const apiClient = new boost_graph_api_client_1.BoostGraphApiClient(defaultOptions);
    return apiClient.rawSearch(q, callback);
}
exports.rawSearch = rawSearchGraph;
function submitBoostJobGraph(rawtx, callback) {
    const apiClient = new boost_graph_api_client_1.BoostGraphApiClient(defaultOptions);
    return apiClient.submitBoostJob(rawtx, callback);
}
exports.submitJob = submitBoostJobGraph;
function getBoostJobStatusGraph(txid, callback) {
    const apiClient = new boost_graph_api_client_1.BoostGraphApiClient(defaultOptions);
    return apiClient.getBoostJobStatus(txid, callback);
}
exports.getJobStatus = getBoostJobStatusGraph;
