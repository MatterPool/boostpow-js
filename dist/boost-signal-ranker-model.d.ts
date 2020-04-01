import { BoostSignalModel } from './boost-signal-model';
import { BoostSignalSummary } from './boost-signal-summary-model';
export declare class BoostSignalRankerModel {
    private boostSignals;
    private constructor();
    readonly first: BoostSignalSummary | null;
    readonly list: BoostSignalSummary[];
    group(field1: string): BoostSignalSummary[];
    static fromSignals(signals: BoostSignalModel[]): BoostSignalRankerModel;
    static fromArray(items: any[]): BoostSignalRankerModel;
}
