import { BoostSignalModel } from './boost-signal-model';
import { BoostSignalSummary } from './boost-signal-summary-model';
export declare class BoostSignalRankerModel {
    private boostSignals;
    private lastSignalTime_;
    private recentSignalTime_;
    private totalDifficulty_;
    private constructor();
    get lastSignalTime(): number;
    get recentSignalTime(): number;
    get first(): BoostSignalSummary | null;
    get second(): BoostSignalSummary | null;
    get third(): BoostSignalSummary | null;
    get fourth(): BoostSignalSummary | null;
    get last(): BoostSignalSummary | null;
    get totalDifficulty(): number;
    get totalEnergy(): number;
    get list(): BoostSignalSummary[];
    get length(): number;
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
