
import { BoostSignalModel } from './boost-signal-model';
import { GraphSearchResultItem } from './graph-search-result-item';

export class BoostSignalRankerModel {
    private constructor(
        private boostSignals: BoostSignalModel[],
    ) {
        this.boostSignals.sort((a, b) => (a.difficulty() > b.difficulty()) ? -1 : 1);
    };

    get list(): BoostSignalModel[] {
        return this.boostSignals;
    }

    get groupBy(): BoostSignalModel[] {
        return this.boostSignals;
    }

    static fromSignals(signals: BoostSignalModel[]): BoostSignalRankerModel {
        return new BoostSignalRankerModel(signals);
    }

    static fromArray(items: GraphSearchResultItem[]): BoostSignalRankerModel {
        if (!items) {
            return new BoostSignalRankerModel([]);
        }
        let lister: BoostSignalModel[] = [];
        for (const item of items) {
            if (!item || !item.boostPowString) {
                throw new Error('invalid boost pow string');
            }
            const signal = BoostSignalModel.fromHex(item.boostPowString, item.boostPowMetadata, item.boostJobId, item.boostJobProofId);
            if (!signal) {
                throw new Error('invalid signal creation');
            }
            lister.push(signal);
        }
        return new BoostSignalRankerModel(lister);
    }
}