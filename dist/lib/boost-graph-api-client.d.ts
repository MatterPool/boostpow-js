import { BoostPowJobModel } from './boost-pow-job-model';
import * as bsv from 'bsv';
import { GraphSearchQueryResponse } from './graph-search-query-response';
import { GraphSearchQuery } from './graph-search-query';
export interface BoostClientApiClientOptions {
    graph_api_url: string;
    api_url: string;
    api_key?: string;
    network: string;
    version_path: string;
}
export interface BoostSignalSummarySerialize {
    totalDifficulty: number;
    totalEnergy: number;
    recentSignalTime?: number;
    entity: {
        boosthash: string;
        content: string;
        contenthex: string;
        category: string;
        categoryhex: string;
        userNonce: string;
        userNoncehex: string;
        additionalData: string;
        additionalDatahex: string;
        tag: string;
        taghex: string;
        boostJobId: string;
        boostJobProofId: string;
        metadataHash: string;
        minerPubKeyHash: string;
        time: number;
        difficulty: number;
        energy: number;
    };
    tags: {
        [key: string]: number;
    };
    signals: any[];
}
export declare class BoostGraphApiClient {
    options: BoostClientApiClientOptions;
    fullUrl: any;
    constructor(options: any);
    getHeaders(): any;
    broadcastBoostJobProof(tx: bsv.Transaction, callback?: Function): Promise<BoostPowJobModel>;
    getScriptUtxos(scriptHash: string, callback?: Function): Promise<BoostPowJobModel>;
    submitBoostJob(rawtx: string, callback?: Function): Promise<BoostPowJobModel>;
    submitBatchBoostJobRequest(rawtx: string, params: {
        content?: string;
        tag?: string;
        diff?: number;
        numOutputs?: number;
    }, callback?: Function): Promise<BoostPowJobModel>;
    getBatchBoostJobRequestStatus(txid: string, callback?: Function): Promise<any>;
    submitBoostSolution(params: {
        txid: string;
        vout: number;
        time: number;
        nonce: number;
        extraNonce1: number;
        extraNonce2: string;
    }, callback?: Function): Promise<BoostPowJobModel>;
    getBoostJobStatus(txid: string, callback?: Function): Promise<{
        boostJob: BoostPowJobModel;
        redeemed: boolean;
        redeemedtxid?: string;
        redeemedvout?: number;
    }>;
    static buildGraphSearchQueryResponse(response: any): GraphSearchQueryResponse;
    rawSearch(q?: GraphSearchQuery, callback?: Function): Promise<GraphSearchQueryResponse>;
    loadBoostJob(txid: string, callback?: Function): Promise<BoostPowJobModel>;
    /**
     * Resolve a promise and/or invoke a callback
     * @param resolve Resolve function to call when done
     * @param data Data to pass forward
     * @param callback Invoke an optional callback first
     */
    private resolveOrCallback;
    createBoostJobs(params: {
        boost: {
            content: string;
            diff: number;
            tag: string;
            type: string;
            metadata: string;
            unique: number;
        };
        pay: {
            key: string;
            value: number;
            currency: 'satoshi' | undefined;
        };
    }, callback?: Function): Promise<BoostPowJobModel>;
    /**
    * Resolve a promise and/or invoke a callback
    * @param reject Reject function to call when done
    * @param data Data to pass forward
    * @param callback Invoke an optional callback first
    */
    private rejectOrCallback;
    private formatErrorResponse;
}
