import { BoostPowJobModel } from './boost-pow-job-model';
import * as bsv from 'bsv';
export interface BoostClientApiClientOptions {
    graph_api_url: string;
    api_url: string;
    api_key?: string;
    network: string;
    version_path: string;
}
export declare class BoostGraphApiClient {
    options: BoostClientApiClientOptions;
    fullUrl: any;
    constructor(options: any);
    getHeaders(): any;
    broadcastBoostJobProof(tx: bsv.Transaction, callback?: Function): Promise<BoostPowJobModel>;
    findAllByContent(content: string, fromTime?: number, toTime?: number, callback?: Function): Promise<BoostPowJobModel>;
    getScriptUtxos(scriptHash: string, callback?: Function): Promise<BoostPowJobModel>;
    submitBoostJob(rawtx: string, callback?: Function): Promise<BoostPowJobModel>;
    getBoostJobStatus(txid: string, callback?: Function): Promise<{
        boostJob: BoostPowJobModel;
        redeemed: boolean;
        redeemedtxid?: string;
        redeemedvout?: number;
    }>;
    search(q: {}, callback?: Function): Promise<any>;
    createBoostJob(params: {
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
    loadBoostJob(txid: string, callback?: Function): Promise<BoostPowJobModel>;
    /**
     * Resolve a promise and/or invoke a callback
     * @param resolve Resolve function to call when done
     * @param data Data to pass forward
     * @param callback Invoke an optional callback first
     */
    private resolveOrCallback;
    /**
    * Resolve a promise and/or invoke a callback
    * @param reject Reject function to call when done
    * @param data Data to pass forward
    * @param callback Invoke an optional callback first
    */
    private rejectOrCallback;
    private formatErrorResponse;
}
