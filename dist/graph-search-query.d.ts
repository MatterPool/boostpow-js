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
    usernonceutf8?: string;
    usernonce?: string;
    usernoncehex?: string;
    additionaldatahex?: string;
    additionaldata?: string;
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
