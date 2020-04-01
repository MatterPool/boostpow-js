import { BoostSignalModel } from './boost-signal-model';
export declare class BoostSignalSummary {
    private boostSignals;
    private totalDifficulty_;
    constructor(boostSignals: BoostSignalModel[]);
    readonly totalDifficulty: number;
    readonly entity: BoostSignalModel;
    readonly signals: BoostSignalModel[];
    toString(): {
        totalDifficulty: number;
        first: any;
        signals: any;
    };
    toObject(): {
        totalDifficulty: number;
        first: any;
        signals: any;
    };
}
