import { BoostSignalModel } from './boost-signal-model';
export declare class BoostSignalSummary {
    private boostSignals;
    private totalDifficulty_;
    constructor(boostSignals: BoostSignalModel[]);
    readonly totalDifficulty: number;
    readonly first: BoostSignalModel;
    readonly all: BoostSignalModel[];
    toString(): {
        totalDifficulty: number;
        first: any;
        all: any;
    };
    toObject(): {
        totalDifficulty: number;
        first: any;
        all: any;
    };
}
