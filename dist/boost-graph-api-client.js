"use strict";
Object.defineProperty(exports, "__esModule", {value : true});
exports.BoostGraphApiClient = void 0;
const axios_1 = require("axios");
const boost_pow_job_model_1 = require("./boost-pow-job-model");
const graph_search_query_1 = require("./graph-search-query");
const defaultOptions = {
  graph_api_url : 'https://graph.boostpow.com',
  api_url : 'https://api.mattercloud.net',
  network : 'main',
  version_path : 'api/v3',
};
;
class BoostGraphApiClient {
  constructor(options) {
    this.options = defaultOptions;
    this.options = Object.assign({}, this.options, options);
    this.fullUrl = `${this.options.api_url}/${this.options.version_path}/${
        this.options.network}`;
  }
  // Populate api reqest header if it's set
  getHeaders() {
    if (this.options.api_key && this.options.api_key !== '') {
      return {api_key : this.options.api_key};
    }
    return {};
  }
  broadcastBoostJobProof(tx, callback) {
    return new Promise((resolve, reject) => {
      const boostJobProof =
          boost_pow_job_model_1.BoostPowJobModel.fromTransaction(tx);
      axios_1.default
          .post(this.fullUrl + `/merchants/tx/broadcast`,
                {rawtx : boostJobProof}, {headers : this.getHeaders()})
          .then((response) => {
            return this.resolveOrCallback(resolve, response, callback);
          })
          .catch((ex) => {
            console.log('ex', ex);
            if (ex.code === 404) {
              return this.rejectOrCallback(reject, this.formatErrorResponse({
                code : ex.code,
                message : 'tx not found',
                error : 'TX_NOT_FOUND'
              }),
                                           callback);
            }
            return this.rejectOrCallback(reject, this.formatErrorResponse(ex),
                                         callback);
          });
    });
  }
  getScriptUtxos(scriptHash, callback) {
    return new Promise((resolve, reject) => {
      axios_1.default
          .get(this.fullUrl + `/scripthash/${scriptHash}/utxo`,
               {headers : this.getHeaders()})
          .then((response) => {
            return this.rejectOrCallback(resolve, response.data, callback);
          })
          .catch((ex) => {
            if (ex.code === 404) {
              return this.rejectOrCallback(reject, this.formatErrorResponse({
                code : ex.code,
                message : 'scripthash not found',
                error : 'SCRIPT_NOT_FOUND'
              }),
                                           callback);
            }
            return this.rejectOrCallback(reject, this.formatErrorResponse(ex),
                                         callback);
          });
    });
  }
  submitBoostJob(rawtx, callback) {
    return new Promise((resolve, reject) => {
      axios_1.default
          .post(this.options.graph_api_url + `/api/v1/main/boost/jobs`, {
            rawtx : rawtx,
          },
                {headers : this.getHeaders()})
          .then((response) => {
            return this.resolveOrCallback(resolve, response.data, callback);
          })
          .catch((ex) => {
            if (ex.code === 404) {
              return this.rejectOrCallback(reject, this.formatErrorResponse({
                code : ex.code,
                message : 'boost submit error',
                error : 'BOOST_SUBMIT_ERROR'
              }),
                                           callback);
            }
            return this.rejectOrCallback(reject, this.formatErrorResponse(ex),
                                         callback);
          });
    });
  }
  submitBatchBoostJobRequest(rawtx, params, callback) {
    return new Promise((resolve, reject) => {
      axios_1.default
          .post(this.options.graph_api_url + `/api/v1/main/service/pay`,
                Object.assign(Object.assign({}, params), {rawtx : rawtx}),
                {headers : this.getHeaders()})
          .then((response) => {
            return this.resolveOrCallback(resolve, response.data, callback);
          })
          .catch((ex) => {
            if (ex.code === 404) {
              return this.rejectOrCallback(reject, this.formatErrorResponse({
                code : ex.code,
                message : 'boost submit error',
                error : 'BOOST_SUBMIT_ERROR'
              }),
                                           callback);
            }
            return this.rejectOrCallback(reject, this.formatErrorResponse(ex),
                                         callback);
          });
    });
  }
  getBatchBoostJobRequestStatus(txid, callback) {
    return new Promise((resolve, reject) => {
      axios_1.default
          .get(this.options.graph_api_url + `/api/v1/main/service/jobs/${txid}`,
               {headers : this.getHeaders()})
          .then((response) => {
            return this.resolveOrCallback(resolve, response.data, callback);
          })
          .catch((ex) => {
            if (ex.code === 404) {
              return this.rejectOrCallback(reject, this.formatErrorResponse({
                code : ex.code,
                message : 'boost job status error',
                error : 'BOOST_JOB_STATUS_ERROR'
              }),
                                           callback);
            }
            return this.rejectOrCallback(reject, this.formatErrorResponse(ex),
                                         callback);
          });
    });
  }
  submitBoostSolution(params, callback) {
    return new Promise((resolve, reject) => {
      axios_1.default
          .post(this.options.graph_api_url +
                    `/api/v1/main/boost/submitsolution`,
                {
                  txid : params.txid,
                  vout : params.vout,
                  nonce : params.nonce,
                  extraNonce1 : params.extraNonce1,
                  extraNonce2 : params.extraNonce2,
                  time : params.time
                },
                {headers : this.getHeaders()})
          .then((response) => {
            return this.resolveOrCallback(resolve, response.data, callback);
          })
          .catch((ex) => {
            if (ex.status === 404) {
              return this.rejectOrCallback(reject, this.formatErrorResponse({
                code : ex.code,
                message : 'boost submit solution error',
                error : 'BOOST_SUBMIT_SOLUTION_ERROR'
              }),
                                           callback);
            }
            if (ex.response && ex.response.status === 422) {
              return this.rejectOrCallback(reject, this.formatErrorResponse({
                code : ex.response.status,
                message : ex.response.data.message,
                error : ex.response.data.error,
              }),
                                           callback);
            }
            return this.rejectOrCallback(reject, this.formatErrorResponse(ex),
                                         callback);
          });
    });
  }
  getBoostJobStatus(txid, callback) {
    return new Promise((resolve, reject) => {
      axios_1.default
          .get(this.options.graph_api_url + `/api/v1/main/boost/jobs/${txid}`,
               {headers : this.getHeaders()})
          .then((response) => {
            return this.resolveOrCallback(resolve, response.data, callback);
          })
          .catch((ex) => {
            if (ex.code === 404) {
              return this.rejectOrCallback(reject, this.formatErrorResponse({
                code : ex.code,
                message : 'boost job status error',
                error : 'BOOST_JOB_STATUS_ERROR'
              }),
                                           callback);
            }
            return this.rejectOrCallback(reject, this.formatErrorResponse(ex),
                                         callback);
          });
    });
  }
  static buildGraphSearchQueryResponse(response) {
    return {
      q : response.data.q,
      nextPaginationToken : response.data.nextPaginationToken,
      mined : response.data.mined
    };
  }
  rawSearch(q, callback) {
    return new Promise((resolve, reject) => {
      let qString = '?';
      qString += graph_search_query_1.GraphSearchQueryString.build(q);
      axios_1.default
          .get(this.options.graph_api_url +
                   `/api/v1/main/boost/search${qString}`,
               {headers : this.getHeaders()})
          .then((response) => {
            const queryResponse =
                BoostGraphApiClient.buildGraphSearchQueryResponse(response);
            return this.resolveOrCallback(resolve, queryResponse, callback);
          })
          .catch((ex) => {
            if (ex.code === 404) {
              return this.rejectOrCallback(reject, this.formatErrorResponse({
                code : ex.code,
                message : 'boost job status error',
                error : 'BOOST_JOB_STATUS_ERROR'
              }),
                                           callback);
            }
            return this.rejectOrCallback(reject, this.formatErrorResponse(ex),
                                         callback);
          });
    });
  }
  loadBoostJob(txid, callback) {
    return new Promise((resolve, reject) => {
      const re = /^[0-9A-Fa-f]+$/;
      if (!re.test(txid)) {
        return this.rejectOrCallback(
            reject,
            this.formatErrorResponse(
                {code : 422, message : 'txid invalid', error : 'TXID_INVALID'}),
            callback);
      }
      if (txid && txid.length !== 64) {
        return this.rejectOrCallback(
            reject,
            this.formatErrorResponse(
                {code : 422, message : 'txid invalid', error : 'TXID_INVALID'}),
            callback);
      }
      axios_1.default
          .get(this.fullUrl + `/tx/${txid}`, {headers : this.getHeaders()})
          .then((response) => {
            const jobs = boost_pow_job_model_1.BoostPowJobModel
                             .fromTransactionGetAllOutputs(response.data.rawtx);
            if (!jobs || !jobs.length) {
              return this.rejectOrCallback(reject, this.formatErrorResponse({
                code : 400,
                message : 'tx is not a valid boost output',
                error : 'TX_INVALID_BOOST_OUTPUT'
              }),
                                           callback);
            }
            return this.resolveOrCallback(resolve, jobs, callback);
          })
          .catch((ex) => {
            if (ex.code === 404) {
              return this.rejectOrCallback(reject, this.formatErrorResponse({
                code : ex.code,
                message : 'tx not found',
                error : 'TX_NOT_FOUND'
              }),
                                           callback);
            }
            return this.rejectOrCallback(reject, this.formatErrorResponse(ex),
                                         callback);
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
    return new Promise((r, reject) => { return r(data); });
  }
  createBoostJobs(params, callback) {
    return new Promise((resolve, reject) => {
      const re = /^[0-9A-Fa-f]+$/;
      axios_1.default
          .post(this.fullUrl + `/boost/jobs`, {hex : 'adsf'},
                {headers : this.getHeaders()})
          .then((response) => {
            return this.resolveOrCallback(resolve, response.data, callback);
          })
          .catch((ex) => {
            if (ex.code === 404) {
              return this.rejectOrCallback(reject, this.formatErrorResponse({
                code : ex.code,
                message : 'boost submit error',
                error : 'BOOST_SUBMIT_ERROR'
              }),
                                           callback);
            }
            return this.rejectOrCallback(reject, this.formatErrorResponse(ex),
                                         callback);
          });
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
    return new Promise((resolve, r) => { r(err); });
  }
  formatErrorResponse(r) {
    let getMessage = r && r.response && r.response.data ? r.response.data : r;
    return {
      success : getMessage.success ? getMessage.success : false,
      code : getMessage.code ? getMessage.code : -1,
      message : getMessage.message ? getMessage.message : '',
      error : getMessage.error ? getMessage.error : '',
    };
  }
}
exports.BoostGraphApiClient = BoostGraphApiClient;
