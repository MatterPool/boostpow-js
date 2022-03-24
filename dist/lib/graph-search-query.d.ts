export interface GraphSearchQuery {
    contentutf8?: string;
    content?: string;
    contenthex?: string;
    tagutf8?: string;
    tag?: string;
    taghex?: string;
    categoryutf8?: string;
    category?: string;
    categoryhex?: string;
    usernoncehex?: string;
    additionaldatahex?: string;
    additionaldatautf8?: string;
    additionaldata?: string;
    limit?: number;
    createdTimeFrom?: number;
    createdTimeEnd?: number;
    minedTimeFrom?: number;
    minedTimeEnd?: number;
    boostPowString?: string;
    boostHash?: string;
    boostJobId?: string;
    boostJobProofId?: string;
    txid?: string;
    spentTxid?: string;
    unmined?: any;
    debug?: boolean;
    expanded?: boolean;
    be?: boolean;
    paginationToken?: string;
}
export declare class GraphSearchQueryString {
    static build(q: any): string;
}
