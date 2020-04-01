"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const boost_signal_model_1 = require("./boost-signal-model");
const boost_signal_summary_model_1 = require("./boost-signal-summary-model");
class BoostSignalRankerModel {
    constructor(boostSignals) {
        this.boostSignals = boostSignals;
        this.boostSignals.sort((a, b) => (a.difficulty() > b.difficulty()) ? -1 : 1);
    }
    ;
    get list() {
        return this.boostSignals;
    }
    group(field1) {
        if (!field1 || field1 === '') {
            field1 = 'usernonce';
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
    static fromSignals(signals) {
        return new BoostSignalRankerModel(signals);
    }
    static fromArray(items) {
        if (!items) {
            return new BoostSignalRankerModel([]);
        }
        let lister = [];
        for (const item of items) {
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
