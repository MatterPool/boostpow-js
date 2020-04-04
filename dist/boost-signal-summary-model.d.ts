import { BoostSignalModel } from './boost-signal-model';
export declare class BoostSignalSummary {
    private boostSignals;
    private totalDifficulty_;
    private lastSignalTime_;
    private recentSignalTime_;
    constructor(boostSignals: BoostSignalModel[]);
    static dedupSignalObjects(items: any[]): any[];
    readonly lastSignalTime: number;
    readonly recentSignalTime: number;
    readonly totalDifficulty: number;
    readonly totalEnergy: number;
    readonly entity: BoostSignalModel;
    readonly signals: BoostSignalModel[];
    toString(): {
        totalDifficulty: number;
        totalEnergy: number;
        entity: any;
        signals: any;
    };
    toObject(): {
        totalDifficulty: number;
        totalEnergy: number;
        entity: any;
        signals: any;
    };
}
