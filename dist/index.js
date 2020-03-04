"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const boost_pow_string_model_1 = require("./boost-pow-string-model");
const boost_pow_job_1 = require("./boost-pow-job");
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
            BoostPowJob: boost_pow_job_1.BoostPowJobModel
        };
    }
}
catch (ex) {
    // Window is not defined, must be running in windowless env....
}
exports.BoostPowString = boost_pow_string_model_1.BoostPowStringModel;
exports.BoostPowJob = boost_pow_job_1.BoostPowJobModel;
