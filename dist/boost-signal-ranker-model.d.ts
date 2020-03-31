import { BoostSignalModel } from './boost-signal-model';
import { GraphSearchResultItem } from './graph-search-result-item';
export declare class BoostSignalRankerModel {
    private boostSignals;
    private constructor();
    readonly list: BoostSignalModel[];
    readonly groupBy: BoostSignalModel[];
    static fromSignals(signals: BoostSignalModel[]): BoostSignalRankerModel;
    static fromArray(items: GraphSearchResultItem[]): BoostSignalRankerModel;
}
