import { GraphSearchResultItem } from "./graph-search-result-item";
export interface GraphSearchQueryResponse {
    q: {
        contentutf8?: string;
        contenthex?: string;
        tagutf8?: string;
        taghex?: string;
        categoryutf8?: string;
        categoryhex?: string;
        usernonceutf8?: string;
        usernoncehex?: string;
        group?: 'contentutf8' | 'contenthex' | 'tagutf8' | 'taghex' | 'categoryutf8' | 'categoryhex' | 'usernonceutf8' | 'usernoncehex';
        limit?: number;
        createdTimeFrom?: number;
        createdTimeEnd?: number;
        minedTimeFrom?: number;
        minedTimeEnd?: number;
        paginationToken?: string;
    };
    minedCountThisPage: number;
    nextPaginationToken?: string;
    mined: Array<GraphSearchResultItem>;
}
