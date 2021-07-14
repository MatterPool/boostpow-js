import axios from 'axios';
import { BoostPowJobModel } from './boost-pow-job-model';
import * as bsv from 'bsv';
import { GraphSearchResultItem } from './graph-search-result-item';
import { GraphSearchQueryResponse } from './graph-search-query-response';
import { GraphSearchQuery, GraphSearchQueryString } from './graph-search-query';
import { BoostSignalRanker } from '.';
import { BoostSignalRankerModel } from './boost-signal-ranker-model';

export interface BoostClientApiClientOptions {
    graph_api_url: string;
    api_url: string;
    api_key?: string;
    network: string;
    version_path: string;
}

const defaultOptions: BoostClientApiClientOptions = {
    graph_api_url: 'https://graph.boostpow.com',
    api_url: 'https://api.mattercloud.net',   // api url
    network: 'main',                          // 'bsv'
    version_path: 'api/v3',                   // Leave as is
}

export interface BoostSignalSummarySerialize {
    totalDifficulty: number;
    totalEnergy: number;
    recentSignalTime?: number;
    entity: {
        boosthash: string,
        content: string,
        contenthex: string,
        category: string,
        categoryhex: string,
        userNonce: string,
        userNoncehex: string,
        additionalData: string,
        additionalDatahex: string,
        tag: string,
        taghex: string,
        boostJobId: string,
        boostJobProofId: string,
        metadataHash: string,
        minerPubKeyHash: string,
        time: number,
        difficulty: number,
        energy: number,
    },
    tags: {
        [key: string]: number
    }
    signals: any[]
};

export class BoostGraphApiClient {
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

    broadcastBoostJobProof(tx: bsv.Transaction, callback?: Function): Promise<BoostPowJobModel> {
        return new Promise((resolve, reject) => {
            const boostJobProof = BoostPowJobModel.fromTransaction(tx);

            axios.post(this.fullUrl + `/merchants/tx/broadcast`,
                { rawtx: boostJobProof},
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {


                return this.resolveOrCallback(resolve, response, callback);
            }).catch((ex) => {
                console.log('ex', ex);
                if (ex.code === 404) {
                    return this.rejectOrCallback(reject, this.formatErrorResponse({
                        code: ex.code,
                        message: 'tx not found',
                        error: 'TX_NOT_FOUND'
                    }), callback)
                }
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }

    getScriptUtxos(scriptHash: string, callback?: Function): Promise<BoostPowJobModel> {
        return new Promise((resolve, reject) => {
            axios.get(this.fullUrl + `/scripthash/${scriptHash}/utxo`,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.rejectOrCallback(resolve, response.data, callback)
            }).catch((ex) => {
                if (ex.code === 404) {
                    return this.rejectOrCallback(reject, this.formatErrorResponse({
                        code: ex.code,
                        message: 'scripthash not found',
                        error: 'SCRIPT_NOT_FOUND'
                    }), callback)
                }
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)

            })
        });
    }

    submitBoostJob(rawtx: string, callback?: Function): Promise<BoostPowJobModel> {
        return new Promise((resolve, reject) => {
            axios.post(this.options.graph_api_url + `/api/v1/main/boost/jobs`,
                {
                    rawtx: rawtx,
                },
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                if (ex.code === 404) {
                    return this.rejectOrCallback(reject, this.formatErrorResponse({
                        code: ex.code,
                        message: 'boost submit error',
                        error: 'BOOST_SUBMIT_ERROR'
                    }), callback)
                }
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }

    submitBatchBoostJobRequest(rawtx: string, params: { content?: string, tag?: string, diff?: number, numOutputs?: number }, callback?: Function): Promise<BoostPowJobModel> {
        return new Promise((resolve, reject) => {
            axios.post(this.options.graph_api_url + `/api/v1/main/service/pay`,
                {
                    ...params,
                    rawtx: rawtx,
                },
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                if (ex.code === 404) {
                    return this.rejectOrCallback(reject, this.formatErrorResponse({
                        code: ex.code,
                        message: 'boost submit error',
                        error: 'BOOST_SUBMIT_ERROR'
                    }), callback)
                }
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }
    getBatchBoostJobRequestStatus(txid: string, callback?: Function): Promise<any> {
        return new Promise((resolve, reject) => {
            axios.get(this.options.graph_api_url + `/api/v1/main/service/jobs/${txid}`,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                if (ex.code === 404) {
                    return this.rejectOrCallback(reject, this.formatErrorResponse({
                        code: ex.code,
                        message: 'boost job status error',
                        error: 'BOOST_JOB_STATUS_ERROR'
                    }), callback)
                }
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }

    submitBoostSolution(params: { txid: string, vout: number, time: number, nonce: number, extraNonce1: number, extraNonce2: string}, callback?: Function): Promise<BoostPowJobModel> {
        return new Promise((resolve, reject) => {
            axios.post(this.options.graph_api_url + `/api/v1/main/boost/submitsolution`,
                {
                    txid: params.txid,
                    vout: params.vout,
                    nonce: params.nonce,
                    extraNonce1: params.extraNonce1,
                    extraNonce2: params.extraNonce2,
                    time: params.time
                },
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                if (ex.status === 404) {
                    return this.rejectOrCallback(reject, this.formatErrorResponse({
                        code: ex.code,
                        message: 'boost submit solution error',
                        error: 'BOOST_SUBMIT_SOLUTION_ERROR'
                    }), callback)
                }
                if (ex.response && ex.response.status === 422) {
                    return this.rejectOrCallback(reject, this.formatErrorResponse({
                        code: ex.response.status,
                        message: ex.response.data.message, //'boost submit solution error',
                        error: ex.response.data.error, // 'BOOST_SUBMIT_SOLUTION_ERROR'
                    }), callback)
                }
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }

    getBoostJobStatus(txid: string, callback?: Function): Promise<{
        boostJob: BoostPowJobModel, redeemed: boolean, redeemedtxid?: string, redeemedvout?: number}> {
        return new Promise((resolve, reject) => {
            axios.get(this.options.graph_api_url + `/api/v1/main/boost/jobs/${txid}`,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                if (ex.code === 404) {
                    return this.rejectOrCallback(reject, this.formatErrorResponse({
                        code: ex.code,
                        message: 'boost job status error',
                        error: 'BOOST_JOB_STATUS_ERROR'
                    }), callback)
                }
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }

    static buildGraphSearchQueryResponse(response: any): GraphSearchQueryResponse {
        return {
            q: response.data.q,
            nextPaginationToken: response.data.nextPaginationToken,
            mined:  response.data.mined
        }
    }

    rawSearch(q?: GraphSearchQuery, callback?: Function): Promise<GraphSearchQueryResponse> {
        return new Promise((resolve, reject) => {
            let qString = '?';
            qString += GraphSearchQueryString.build(q);
            axios.get(this.options.graph_api_url + `/api/v1/main/boost/search${qString}`,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                const queryResponse = BoostGraphApiClient.buildGraphSearchQueryResponse(response);
                return this.resolveOrCallback(resolve, queryResponse, callback);
            }).catch((ex) => {
                if (ex.code === 404) {
                    return this.rejectOrCallback(reject, this.formatErrorResponse({
                        code: ex.code,
                        message: 'boost job status error',
                        error: 'BOOST_JOB_STATUS_ERROR'
                    }), callback)
                }
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)
            })
        });
    }

    loadBoostJob(txid: string, callback?: Function): Promise<BoostPowJobModel> {
        return new Promise((resolve, reject) => {
            const re = /^[0-9A-Fa-f]+$/;
            if (!re.test(txid)) {
                return this.rejectOrCallback(reject, this.formatErrorResponse({
                    code: 422,
                    message: 'txid invalid',
                    error: 'TXID_INVALID'
                }), callback)
            }
            if (txid && txid.length !== 64) {
                return this.rejectOrCallback(reject, this.formatErrorResponse({
                    code: 422,
                    message: 'txid invalid',
                    error: 'TXID_INVALID'
                }), callback)
            }
            axios.get(this.fullUrl + `/tx/${txid}`,
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                const jobs = BoostPowJobModel.fromTransactionGetAllOutputs(response.data.rawtx);
                if (!jobs || !jobs.length){
                    return this.rejectOrCallback(reject, this.formatErrorResponse({
                        code: 400,
                        message: 'tx is not a valid boost output',
                        error: 'TX_INVALID_BOOST_OUTPUT'
                    }), callback)
                }
                return this.resolveOrCallback(resolve, jobs, callback);
            }).catch((ex) => {
                if (ex.code === 404) {
                    return this.rejectOrCallback(reject, this.formatErrorResponse({
                        code: ex.code,
                        message: 'tx not found',
                        error: 'TX_NOT_FOUND'
                    }), callback)
                }
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

    createBoostJobs(params: { boost: {
        content: string,
        diff: number,
        // optional
        tag: string,
        type: string,
        metadata: string,
        unique: number,
     },
     pay: {
        // rawtx: string, // paying tx
        key: string,
        value: number,
        currency: 'satoshi' | undefined,
     }}, callback?: Function): Promise<BoostPowJobModel> {
        return new Promise((resolve, reject) => {
            const re = /^[0-9A-Fa-f]+$/;

            axios.post(this.fullUrl + `/boost/jobs`,
                {
                    hex: 'adsf'
                },
                {
                    headers: this.getHeaders()
                }
            ).then((response) => {
                return this.resolveOrCallback(resolve, response.data, callback);
            }).catch((ex) => {
                if (ex.code === 404) {
                    return this.rejectOrCallback(reject, this.formatErrorResponse({
                        code: ex.code,
                        message: 'boost submit error',
                        error: 'BOOST_SUBMIT_ERROR'
                    }), callback)
                }
                return this.rejectOrCallback(reject, this.formatErrorResponse(ex), callback)

            })
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
        let getMessage = r && r.response && r.response.data ? r.response.data : r;
        return {
            success: getMessage.success ? getMessage.success : false,
            code: getMessage.code ? getMessage.code : -1,
            message: getMessage.message ? getMessage.message : '',
            error: getMessage.error ? getMessage.error : '',
        };
    }
}
