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
    readonly length: number;
    groupByCategory(): BoostSignalSummary[];
    groupByContent(): BoostSignalSummary[];
    groupByTag(): BoostSignalSummary[];
    groupByAdditionalData(): BoostSignalSummary[];
    private groupPrivate;
    static dedupPlainObjects(items: any): any[];
    static dedupSignalObjects(items: any[]): any[];
    static fromSignals(signals: BoostSignalModel[]): BoostSignalRankerModel;
    static fromArray(items: Array<{
        boostPowString: string;
        boostPowMetadata: string;
        boostJobId: string;
        boostJobProofId: string;
    }>): BoostSignalRankerModel;
}
