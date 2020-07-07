import { BoostSignalModel } from './boost-signal-model';
export declare class BoostSignalSummary {
    private boostSignals;
    private totalDifficulty_;
    private lastSignalTime_;
    private recentSignalTime_;
    constructor(boostSignals: BoostSignalModel[]);
    static dedupSignalObjects(items: any[]): any[];
    get lastSignalTime(): number;
    get recentSignalTime(): number;
    get totalDifficulty(): number;
    get totalEnergy(): number;
    get entity(): BoostSignalModel;
    get signals(): BoostSignalModel[];
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
