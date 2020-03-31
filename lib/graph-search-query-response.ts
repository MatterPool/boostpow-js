import { GraphSearchResultItem } from "./graph-search-result-item";
import { GraphSearchQuery } from './graph-search-query';

export interface GraphSearchQueryResponse {
    q: GraphSearchQuery,
    nextPaginationToken?: string,
    mined: GraphSearchResultItem[]
}
