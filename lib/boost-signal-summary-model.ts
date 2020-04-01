import { BoostSignalModel } from './boost-signal-model';

export class BoostSignalSummary{
    private totalDifficulty_ = 0;
    constructor(private boostSignals: BoostSignalModel[]) {
        if (!boostSignals.length) {
            throw new Error('invalid arg');
        }
        for (const signal of boostSignals) {
            this.totalDifficulty_ += signal.difficulty();
        }
    }
    get totalDifficulty() {
        return this.totalDifficulty_;
    }
    get first(): BoostSignalModel {
        return this.boostSignals[0];
    }
    get all(): BoostSignalModel[] {
        return this.boostSignals;
    }
    toString() {
        return this.toObject();
    }
    toObject() {
        const i: any = [];
        for (const item of this.boostSignals) {
            i.push(item.toObject());
        }
        return {
            totalDifficulty: this.totalDifficulty,
            first: this.boostSignals[0].toObject(),
            all: i
        }
    }
}