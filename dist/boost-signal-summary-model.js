"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoostSignalSummary = void 0;
class BoostSignalSummary {
    constructor(boostSignals) {
        this.boostSignals = boostSignals;
        this.totalDifficulty_ = 0;
        this.boostSignals = BoostSignalSummary.dedupSignalObjects(boostSignals);
        if (!this.boostSignals.length) {
            throw new Error('invalid arg');
        }
        for (const signal of this.boostSignals) {
            this.totalDifficulty_ += signal.difficulty();
        }
        this.boostSignals.sort((a, b) => (a.difficulty() > b.difficulty()) ? -1 : 1);
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
    get lastSignalTime() {
        return this.lastSignalTime_;
    }
    get recentSignalTime() {
        return this.recentSignalTime_;
    }
    get totalDifficulty() {
        return this.totalDifficulty_;
    }
    get totalEnergy() {
        return this.totalDifficulty_;
    }
    get entity() {
        return this.boostSignals[0];
    }
    get signals() {
        return this.boostSignals;
    }
    toString() {
        return this.toObject();
    }
    toObject() {
        const i = [];
        for (const item of this.boostSignals) {
            i.push(item.toObject());
        }
        return {
            totalDifficulty: this.totalDifficulty,
            totalEnergy: this.totalEnergy,
            entity: this.boostSignals[0].toObject(),
            signals: i
        };
    }
}
exports.BoostSignalSummary = BoostSignalSummary;
