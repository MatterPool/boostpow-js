
export interface GraphSearchQuery {
    contentutf8?: string,
    contenthex?: string,
    tagutf8?: string,
    taghex?: string,
    categoryutf8?: string,
    categoryhex?: string,
    usernonceutf8?: string,
    usernoncehex?: string,
    additionaldatahex?: string,
    additionaldatautf8?: string,
    limit?: number
    createdTimeFrom?: number,
    createdTimeEnd?: number,
    minedTimeFrom?: number,
    minedTimeEnd?: number,
    paginationToken?: string, // token to use to paginate for everything after
}
export class GraphSearchQueryString {
    static build(q) {
        let str = '';
        if (q.contentutf8) {
            str += 'contentutf8=' + q.contentutf8 + '&';
        }
        if (q.contenthex) {
            str += 'contenthex=' + q.contenthex + '&';
        }
        if (q.tagutf8) {
            str += 'tagutf8=' + q.tagutf8 + '&';
        }
        if (q.taghex) {
            str += 'taghex=' + q.taghex + '&';
        }
        if (q.categoryutf8) {
            str += 'categoryutf8=' + q.categoryutf8 + '&';
        }
        if (q.categoryhex) {
            str += 'categoryhex=' + q.categoryhex + '&';
        }
        if (q.usernonceutf8) {
            str += 'usernonceutf8=' + q.usernonceutf8 + '&';
        }
        if (q.usernoncehex) {
            str += 'usernoncehex=' + q.usernoncehex + '&';
        }
        if (q.additionaldatautf8) {
            str += 'additionaldatautf8=' + q.additionaldatautf8 + '&';
        }
        if (q.additionaldatahex) {
            str += 'additionaldatahex=' + q.additionaldatahex + '&';
        }
        if (q.minedTimeStart) {
            str += 'minedTimeStart=' + q.minedTimeStart + '&';
        }
        if (q.minedTimeEnd) {
            str += 'minedTimeEnd=' + q.minedTimeEnd + '&';
        }
        return str;
    }
}