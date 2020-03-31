export interface GraphSearchQuery {
    contentutf8?: string;
    contenthex?: string;
    tagutf8?: string;
    taghex?: string;
    categoryutf8?: string;
    categoryhex?: string;
    usernonceutf8?: string;
    usernoncehex?: string;
    additionaldatahex?: string;
    additionaldatautf8?: string;
    limit?: number;
    createdTimeFrom?: number;
    createdTimeEnd?: number;
    minedTimeFrom?: number;
    minedTimeEnd?: number;
    paginationToken?: string;
}
export declare class GraphSearchQueryString {
    static build(q: any): string;
}
