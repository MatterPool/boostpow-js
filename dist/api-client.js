"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
const boost_pow_job_model_1 = require("./boost-pow-job-model");
const defaultOptions = {
    api_url: 'https://api.mattercloud.net',
    network: 'main',
    version_path: 'api/v3',
};
class APIClient {
    constructor(options) {
        this.options = defaultOptions;
        this.options = Object.assign({}, this.options, options);
        this.fullUrl = `${this.options.api_url}/${this.options.version_path}/${this.options.network}`;
    }
    // Populate api reqest header if it's set
    getHeaders() {
        if (this.options.api_key && this.options.api_key !== '') {
            return {
                api_key: this.options.api_key
            };
        }
        return {};
    }
    broadcastBoostJobProof(tx, callback) {
        return new Promise((resolve, reject) => {
            const boostJobProof = boost_pow_job_model_1.BoostPowJobModel.fromTransaction(tx);
            axios_1.default.post(this.fullUrl + `/merchants/tx/broadcast`, { rawtx: boostJobProof }, {
                headers: this.getHeaders()
            }).then((response) => {
                return this.resolveOrCallback(resolve, response, callback);
            }).catch((ex) => {
                console.log('ex', ex);
                if (ex.code === 404) {
                    return this.rejectOrCallback(reject, this.formatErrorResponse({
                        code: ex.code,
                        message: 'tx not found',
                        error: 'TX_NOT_FOUND'
                    }), callback);
                }
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback);
            });
        });
    }
    loadBoostJob(txid, callback) {
        return new Promise((resolve, reject) => {
            const re = /^[0-9A-Fa-f]+$/;
            if (!re.test(txid)) {
                return this.rejectOrCallback(reject, this.formatErrorResponse({
                    code: 422,
                    message: 'txid invalid',
                    error: 'TXID_INVALID'
                }), callback);
            }
            if (txid && txid.length !== 64) {
                return this.rejectOrCallback(reject, this.formatErrorResponse({
                    code: 422,
                    message: 'txid invalid',
                    error: 'TXID_INVALID'
                }), callback);
            }
            axios_1.default.get(this.fullUrl + `/tx/${txid}`, {
                headers: this.getHeaders()
            }).then((response) => {
                const job = boost_pow_job_model_1.BoostPowJobModel.fromRawTransaction(response.data.rawtx);
                if (!job) {
                    return this.rejectOrCallback(reject, this.formatErrorResponse({
                        code: 400,
                        message: 'tx is not a valid boost output',
                        error: 'TX_INVALID_BOOST_OUTPUT'
                    }), callback);
                }
                return this.resolveOrCallback(resolve, job, callback);
            }).catch((ex) => {
                console.log('ex', ex);
                if (ex.code === 404) {
                    return this.rejectOrCallback(reject, this.formatErrorResponse({
                        code: ex.code,
                        message: 'tx not found',
                        error: 'TX_NOT_FOUND'
                    }), callback);
                }
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback);
            });
        });
    }
    /**
     * Resolve a promise and/or invoke a callback
     * @param resolve Resolve function to call when done
     * @param data Data to pass forward
     * @param callback Invoke an optional callback first
     */
    resolveOrCallback(resolve, data, callback) {
        if (callback) {
            callback(data);
            return undefined;
        }
        if (resolve) {
            return resolve(data);
        }
        return new Promise((r, reject) => {
            return r(data);
        });
    }
    /**
    * Resolve a promise and/or invoke a callback
    * @param reject Reject function to call when done
    * @param data Data to pass forward
    * @param callback Invoke an optional callback first
    */
    rejectOrCallback(reject, err, callback) {
        if (callback) {
            callback(null, err);
            return;
        }
        if (reject) {
            return reject(err);
        }
        return new Promise((resolve, r) => {
            r(err);
        });
    }
    formatErrorResponse(r) {
        let getMessage = r && r.response && r.response.data ? r.response.data : r;
        return {
            success: getMessage.success ? getMessage.success : false,
            code: getMessage.code ? getMessage.code : -1,
            message: getMessage.message ? getMessage.message : '',
            error: getMessage.error ? getMessage.error : '',
        };
    }
}
exports.APIClient = APIClient;
