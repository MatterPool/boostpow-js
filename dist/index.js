"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const boost_pow_string_model_1 = require("./boost-pow-string-model");
const boost_pow_job_model_1 = require("./boost-pow-job-model");
const boost_pow_job_proof_model_1 = require("./boost-pow-job-proof-model");
const boost_pow_metadata_model_1 = require("./boost-pow-metadata-model");
const boost_pow_simple_miner_model_1 = require("./boost-pow-simple-miner-model");
const defaultOptions = {
    api_url: 'https://api.matterpool.io',
    network: 'bsv',
    version_path: 'api/v1',
};
class BoostClient {
    constructor(providedOptions) {
        this.options = Object.assign({}, defaultOptions, providedOptions);
    }
    get BoostPowString() {
        return boost_pow_string_model_1.BoostPowStringModel;
    }
    setOptions(newOptions) {
        this.options = Object.assign({}, this.options, newOptions);
    }
    static instance(newOptions) {
        const mergedOptions = Object.assign({}, defaultOptions, newOptions);
        return new BoostClient(mergedOptions);
    }
}
exports.BoostClient = BoostClient;
function instance(newOptions) {
    const mergedOptions = Object.assign({}, defaultOptions, newOptions);
    return new BoostClient(mergedOptions);
}
exports.instance = instance;
try {
    if (window) {
        window['Boost'] = {
            Service: new BoostClient(),
            BoostPowString: boost_pow_string_model_1.BoostPowStringModel,
            BoostPowJob: boost_pow_job_model_1.BoostPowJobModel,
            BoostPowJobProof: boost_pow_job_proof_model_1.BoostPowJobProofModel,
            BoostPowMetadata: boost_pow_metadata_model_1.BoostPowMetadataModel,
            BoostPowSimpleMiner: boost_pow_simple_miner_model_1.BoostPowSimpleMinerModel,
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
