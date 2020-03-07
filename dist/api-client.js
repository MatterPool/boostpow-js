"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultOptions = {
    api_url: 'https://api.matterpool.net',
    network: 'bsv',
    version_path: 'api/v1',
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
        let getMessage = r && r.response && r.response.data ? r.response.data : r.toString();
        return {
            success: getMessage.success ? getMessage.success : false,
            code: getMessage.code ? getMessage.code : -1,
            message: getMessage.message ? getMessage.message : '',
            error: getMessage.error ? getMessage.error : '',
        };
    }
}
exports.APIClient = APIClient;
