export interface BoostClientApiClientOptions {
    api_url: string;
    api_key?: string;
    network: string;
    version_path: string;
}
export declare class APIClient {
    options: BoostClientApiClientOptions;
    fullUrl: any;
    constructor(options: any);
    getHeaders(): any;
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
