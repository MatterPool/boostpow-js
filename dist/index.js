"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const boost_pow_string_model_1 = require("./boost-pow-string-model");
const boost_pow_job_model_1 = require("./boost-pow-job-model");
const boost_pow_job_proof_model_1 = require("./boost-pow-job-proof-model");
const boost_pow_metadata_model_1 = require("./boost-pow-metadata-model");
const boost_pow_simple_miner_model_1 = require("./boost-pow-simple-miner-model");
const boost_utils_1 = require("./boost-utils");
const boost_graph_api_client_1 = require("./boost-graph-api-client");
const defaultOptions = {
    // boost_graph_api_url: 'https://graph.boostpow.com',
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
    get BoostPowSimpleMiner() {
        return boost_pow_simple_miner_model_1.BoostPowSimpleMinerModel;
    }
    loadBoostJob(txid, callback) {
        const apiClient = new boost_graph_api_client_1.BoostGraphApiClient(this.options);
        return apiClient.loadBoostJobByTxid(txid, callback);
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
            BoostPowSimpleMiner: boost_pow_simple_miner_model_1.BoostPowSimpleMinerModel,
            BoostUtils: boost_utils_1.BoostUtils,
        };
    }
}
catch (ex) {
    // Window is not defined, must be running in windowless env....
}
exports.BoostPowString = boost_pow_string_model_1.BoostPowStringModel;
exports.BoostPowJob = boost_pow_job_model_1.BoostPowJobModel;
exports.BoostPowJobProof = boost_pow_job_proof_model_1.BoostPowJobProofModel;
exports.BoostPowMetadata = boost_pow_metadata_model_1.BoostPowMetadataModel;
exports.BoostPowSimpleMiner = boost_pow_simple_miner_model_1.BoostPowSimpleMinerModel;
exports.BoostUtilsHelper = boost_utils_1.BoostUtils;
