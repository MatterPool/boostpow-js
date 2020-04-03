import { BoostSignalModel } from './boost-signal-model';
import { BoostSignalSummary } from './boost-signal-summary-model';
export declare class BoostSignalRankerModel {
    private boostSignals;
    private lastSignalTime_;
    private recentSignalTime_;
    private totalDifficulty_;
    private constructor();
    readonly lastSignalTime: number;
    readonly recentSignalTime: number;
    readonly first: BoostSignalSummary | null;
    readonly second: BoostSignalSummary | null;
    readonly third: BoostSignalSummary | null;
    readonly fourth: BoostSignalSummary | null;
    readonly last: BoostSignalSummary | null;
    readonly totalDifficulty: number;
    readonly totalEnergy: number;
    readonly list: BoostSignalSummary[];
    group(field1: string): BoostSignalSummary[];
    static dedupPlainObjects(items: any): any[];
    static dedupSignalObjects(items: any[]): any[];
    static fromSignals(signals: BoostSignalModel[]): BoostSignalRankerModel;
    static fromArray(items: any[]): BoostSignalRankerModel;
}
