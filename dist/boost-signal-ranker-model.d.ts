import { BoostSignalModel } from './boost-signal-model';
import { GraphSearchResultItem } from './graph-search-result-item';
import { BoostSignalSummary } from './boost-signal-summary-model';
export declare class BoostSignalRankerModel {
    private boostSignals;
    private constructor();
    readonly list: BoostSignalModel[];
    group(field1?: string): BoostSignalSummary[];
    static fromSignals(signals: BoostSignalModel[]): BoostSignalRankerModel;
    static fromArray(items: GraphSearchResultItem[]): BoostSignalRankerModel;
}
