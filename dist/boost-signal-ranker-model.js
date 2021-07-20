"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoostSignalRankerModel = void 0;
const boost_signal_summary_model_1 = require("./boost-signal-summary-model");
;
;
class BoostSignalRankerModel {
    constructor(boostSignals) {
        this.boostSignals = boostSignals;
        this.lastSignalTime_ = 0;
        this.recentSignalTime_ = 0;
        this.totalDifficulty_ = 0;
        this.boostSignals.sort((a, b) => (a.difficulty > b.difficulty) ? -1 : 1);
        for (const signal of boostSignals) {
            this.totalDifficulty_ += signal.difficulty;
        }
        for (const sig of this.boostSignals) {
            if (!this.lastSignalTime_ || this.lastSignalTime_ >= sig.time.number) {
                this.lastSignalTime_ = sig.time.number;
            }
            if (!this.recentSignalTime_ || this.recentSignalTime_ <= sig.time.number) {
                this.recentSignalTime_ = sig.time.number;
            }
        }
    }
    ;
    get lastSignalTime() {
        return this.lastSignalTime_;
    }
    get recentSignalTime() {
        return this.recentSignalTime_;
    }
    get first() {
        const sigs = this.list;
        return sigs && sigs.length ? sigs[0] : null;
    }
    get second() {
        const sigs = this.list;
        return sigs && sigs.length && sigs[1] ? sigs[1] : null;
    }
    get third() {
        const sigs = this.list;
        return sigs && sigs.length && sigs[2] ? sigs[2] : null;
    }
    get fourth() {
        const sigs = this.list;
        return sigs && sigs.length && sigs[3] ? sigs[3] : null;
    }
    get last() {
        const sigs = this.list;
        return sigs && sigs.length && sigs[sigs.length - 1] ? sigs[sigs.length - 1] : null;
    }
    get totalDifficulty() {
        return this.totalDifficulty_;
    }
    get totalEnergy() {
        return this.totalDifficulty_;
    }
    get list() {
        const groups = {};
        for (const item of this.boostSignals) {
            const itemKey = item.category.hex + item.content.hex;
            if (!groups[itemKey]) {
                groups[itemKey] = [];
            }
            groups[itemKey].push(item);
        }
        const resultList = [];
        for (const groupedKey in groups) {
            if (!groups.hasOwnProperty(groupedKey)) {
                continue;
            }
            resultList.push(new boost_signal_summary_model_1.BoostSignalSummary(groups[groupedKey]));
        }
        resultList.sort((a, b) => (a.totalDifficulty > b.totalDifficulty) ? -1 : 1);
        return resultList;
    }
    get length() {
        return this.list.length;
    }
    groupByCategory() {
        return this.groupPrivate('category');
    }
    groupByContent() {
        return this.groupPrivate('content');
    }
    groupByTag() {
        return this.groupPrivate('tag');
    }
    groupByAdditionalData() {
        return this.groupPrivate('additionalData');
    }
    /**
     * Returns the Boost Rank for the list of transactions.
     *
     * Pass in an array of bsv.Transaction and get them ranked by boost!
     *
     * Pass in an array of txids/hashes and get back ranked by Boost
     *
     * @param txidsOrObjects ["txid1", { hash: "txid2" }, "txidn"]
     */
    rank(txidsOrObjects, debug) {
        const grouped = this.groupByContent();
        const boostrank = [];
        const checkHashMap = new Map();
        // For fast lookup by hash whether it's a string or in the .hash property
        for (const item of txidsOrObjects) {
            const TXID_REGEX = new RegExp('^[0-9a-fA-F]{64}$');
            if (item['hash']) {
                checkHashMap.set(item['hash'], item);
                continue;
            }
            if (TXID_REGEX.test(item)) {
                checkHashMap.set(item, { hash: item });
            }
        }
        for (const item of grouped) {
            const hash = item.entity.content.hex;
            const matched = checkHashMap.get(hash);
            if (matched) {
                if (!matched.hash) {
                    matched.hash = hash;
                }
                matched.boostpow = {
                    // ranker: this,
                    signals: this.serializeBoostSignals(item.signals, debug),
                    totalDifficulty: item.totalDifficulty,
                    lastSignalTime: item.lastSignalTime,
                    recentSignalTime: item.recentSignalTime
                };
                console.log('matched', matched);
                boostrank.push(matched);
            }
        }
        return boostrank;
    }
    serializeBoostSignals(signals, debug) {
        const boostSignalSummaries = [];
        for (const item of signals) {
            boostSignalSummaries.push({
                boosthash: item.getBoostPowString().hash(),
                boostPowString: item.getBoostPowString().toString(),
                boostPowMetadata: item.getBoostMetadata().toString(),
                boostPowJobId: item.getBoostJobId(),
                boostPowJobProofId: item.getBoostJobProofId(),
                contenthex: item.content(true),
                category: item.category(),
                categoryhex: item.category(true),
                userNoncehex: item.userNonce(true),
                additionalData: item.additionalData(),
                additionalDatahex: item.additionalData(true),
                tag: item.tag(),
                taghex: item.tag(true),
                metadataHash: item.metadataHash(),
                minerPubKeyHash: item.minerPubKeyHash(),
                time: item.time(),
                difficulty: item.difficulty()
            });
        }
        return boostSignalSummaries;
    }
    groupPrivate(field1) {
        if (!field1 || field1 === '') {
            throw new Error('invalid arg');
        }
        const groups = {};
        for (const item of this.boostSignals) {
            if (!groups[item[field1]()]) {
                groups[item[field1]()] = [];
            }
            groups[item[field1]()].push(item);
        }
        const resultList = [];
        for (const groupedKey in groups) {
            if (!groups.hasOwnProperty(groupedKey)) {
                continue;
            }
            resultList.push(new boost_signal_summary_model_1.BoostSignalSummary(groups[groupedKey]));
        }
        resultList.sort((a, b) => (a.totalDifficulty > b.totalDifficulty) ? -1 : 1);
        return resultList;
    }
    static dedupPlainObjects(items) {
        const dedupMap = {};
        const newList = [];
        for (const item of items) {
            if (!item.boostPowString || dedupMap[item.boostPowString]) {
                continue;
            }
            dedupMap[item.boostPowString] = true;
            newList.push(item);
        }
        return newList;
    }
    static dedupSignalObjects(items) {
        const dedupMap = {};
        const newList = [];
        for (const item of items) {
            if (dedupMap[item.getBoostPowString().toString()]) {
                continue;
            }
            dedupMap[item.getBoostPowString().toString()] = true;
            newList.push(item);
        }
        return newList;
    }
    static fromSignals(signals) {
        return new BoostSignalRankerModel(BoostSignalRankerModel.dedupSignalObjects(signals));
    }
}
exports.BoostSignalRankerModel = BoostSignalRankerModel;
