import axios from 'axios';
import { BoostPowJobModel } from './boost-pow-job-model';
export interface BoostClientApiClientOptions {
    api_url: string;
    api_key?: string;
    network: string;
    version_path: string;
}

const defaultOptions: BoostClientApiClientOptions = {
    api_url: 'https://api.mattercloud.net',   // api url
    network: 'main',                          // 'bsv'
    version_path: 'api/v3',                   // Leave as is
}
export class APIClient {
    options = defaultOptions;
    fullUrl;
    constructor(options: any) {
        this.options = Object.assign({}, this.options, options);
        this.fullUrl = `${this.options.api_url}/${this.options.version_path}/${this.options.network}`;
    }

    // Populate api reqest header if it's set
    getHeaders(): any {
        if (this.options.api_key && this.options.api_key !== '') {
            return {
                api_key: this.options.api_key
            };
        }
        return {};
    }

    loadBoostJob(txid: string, callback?: Function): Promise<BoostPowJobModel> {
        return new Promise((resolve, reject) => {
            if (!txid || /^(\s*)$/.test(txid)) {
                return this.rejectOrCallback(reject, this.formatErrorResponse({
                    code: 422,
                    message: 'txid required'
                }), callback)
            }
            axios.get(this.fullUrl + `/tx/${txid}`,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                console.log('response', response);
                const job =  BoostPowJobModel.fromRawTransaction(response.data.rawtx);
                return this.resolveOrCallback(resolve, job, callback);
                /*return this.rejectOrCallback(reject, this.formatErrorResponse({
                    message: 'Invalid Boost Job'
                }), callback)*/
            }).catch((ex) => {
                console.log('ex', ex);
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }
    /**
     * Resolve a promise and/or invoke a callback
     * @param resolve Resolve function to call when done
     * @param data Data to pass forward
     * @param callback Invoke an optional callback first
     */
    private resolveOrCallback(resolve?: Function, data?: any, callback?: Function) {
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
    private rejectOrCallback(reject?: Function, err?: any, callback?: Function) {
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
    private formatErrorResponse(r: any): any {
        let getMessage = r && r.response && r.response.data ? r.response.data : r.toString();
        return {
            success: getMessage.success ? getMessage.success : false,
            code: getMessage.code ? getMessage.code : -1,
            message: getMessage.message ? getMessage.message : '',
            error: getMessage.error ? getMessage.error : '',
        };
    }
}