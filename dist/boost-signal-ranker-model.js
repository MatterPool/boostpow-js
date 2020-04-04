"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const boost_signal_model_1 = require("./boost-signal-model");
const boost_signal_summary_model_1 = require("./boost-signal-summary-model");
class BoostSignalRankerModel {
    constructor(boostSignals) {
        this.boostSignals = boostSignals;
        this.lastSignalTime_ = 0;
        this.recentSignalTime_ = 0;
        this.totalDifficulty_ = 0;
        this.boostSignals.sort((a, b) => (a.difficulty() > b.difficulty()) ? -1 : 1);
        for (const signal of boostSignals) {
            this.totalDifficulty_ += signal.difficulty();
        }
        for (const sig of this.boostSignals) {
            if (!this.lastSignalTime_ || this.lastSignalTime_ >= sig.time()) {
                this.lastSignalTime_ = sig.time();
            }
            if (!this.recentSignalTime_ || this.recentSignalTime_ <= sig.time()) {
                this.recentSignalTime_ = sig.time();
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
            const itemKey = item.content(true);
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
    static fromArray(items) {
        //  todo add filter restriction
        if (!items) {
            return new BoostSignalRankerModel([]);
        }
        const dedupItems = BoostSignalRankerModel.dedupPlainObjects(items);
        let lister = [];
        for (const item of dedupItems) {
            if (!item || !item.boostPowString) {
                throw new Error('invalid boost pow string');
            }
            const signal = boost_signal_model_1.BoostSignalModel.fromHex(item.boostPowString, item.boostPowMetadata, item.boostJobId, item.boostJobProofId);
            if (!signal) {
                throw new Error('invalid signal creation');
            }
            lister.push(signal);
        }
        return new BoostSignalRankerModel(lister);
    }
}
exports.BoostSignalRankerModel = BoostSignalRankerModel;
