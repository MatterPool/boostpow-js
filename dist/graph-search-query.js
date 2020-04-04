"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class GraphSearchQueryString {
    static build(q) {
        function normalize(elem) {
            if (!Array.isArray(elem)) {
                return elem + '&';
            }
            if (Array.isArray(elem)) {
                if (elem.length === 0) {
                    return '' + '&';
                }
                if (elem.length === 1) {
                    return elem[0] + '&';
                }
                return JSON.stringify(elem) + '&';
            }
        }
        if (!q) {
            return '';
        }
        let str = '';
        if (q.contentutf8 || q.content) {
            str += 'contentutf8=' + normalize(q.contentutf8 || q.content);
        }
        if (q.contenthex) {
            str += 'contenthex=' + normalize(q.contenthex);
        }
        if (q.tagutf8 || q.tag) {
            str += 'tagutf8=' + normalize(q.tagutf8 || q.tag);
        }
        if (q.taghex) {
            str += 'taghex=' + normalize(q.taghex);
        }
        if (q.categoryutf8 || q.category) {
            str += 'categoryutf8=' + normalize(q.categoryutf8 || q.category);
        }
        if (q.categoryhex) {
            str += 'categoryhex=' + normalize(q.categoryhex);
        }
        if (q.usernonceutf8) {
            str += 'usernonceutf8=' + normalize(q.usernonceutf8);
        }
        if (q.usernoncehex) {
            str += 'usernoncehex=' + normalize(q.usernoncehex);
        }
        if (q.additionaldatautf8 || q.additionaldata) {
            str += 'additionaldatautf8=' + normalize(q.additionaldatautf8 || q.additionaldata);
        }
        if (q.additionaldatahex) {
            str += 'additionaldatahex=' + normalize(q.additionaldatahex);
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
exports.GraphSearchQueryString = GraphSearchQueryString;
