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
var bytes_1 = require("./fields/bytes");
Object.defineProperty(exports, "Bytes", { enumerable: true, get: function () { return bytes_1.Bytes; } });
var difficulty_1 = require("./fields/difficulty");
Object.defineProperty(exports, "Difficulty", { enumerable: true, get: function () { return difficulty_1.Difficulty; } });
var digest20_1 = require("./fields/digest20");
Object.defineProperty(exports, "Digest20", { enumerable: true, get: function () { return digest20_1.Digest20; } });
var digest32_1 = require("./fields/digest32");
Object.defineProperty(exports, "Digest32", { enumerable: true, get: function () { return digest32_1.Digest32; } });
var int32Little_1 = require("./fields/int32Little");
Object.defineProperty(exports, "Int32Little", { enumerable: true, get: function () { return int32Little_1.Int32Little; } });
var uint16Little_1 = require("./fields/uint16Little");
Object.defineProperty(exports, "UInt16Little", { enumerable: true, get: function () { return uint16Little_1.UInt16Little; } });
var uint32Little_1 = require("./fields/uint32Little");
Object.defineProperty(exports, "UInt32Little", { enumerable: true, get: function () { return uint32Little_1.UInt32Little; } });
var uint32Big_1 = require("./fields/uint32Big");
Object.defineProperty(exports, "UInt32Big", { enumerable: true, get: function () { return uint32Big_1.UInt32Big; } });
var uint64Big_1 = require("./fields/uint64Big");
Object.defineProperty(exports, "UInt64Big", { enumerable: true, get: function () { return uint64Big_1.UInt64Big; } });
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
