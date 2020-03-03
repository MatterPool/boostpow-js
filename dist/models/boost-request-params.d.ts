export interface BoostRequestParams {
    contentHash: string;
    target: string;
    category?: string;
    metadata?: any;
    user_additional_nonce?: number;
    user_additional_info?: string;
}
