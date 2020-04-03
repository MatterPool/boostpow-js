"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BoostSignalSummary {
    constructor(boostSignals) {
        this.boostSignals = boostSignals;
        this.totalDifficulty_ = 0;
        if (!boostSignals.length) {
            throw new Error('invalid arg');
        }
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
