
import { BoostSignalModel } from './boost-signal-model';
import { GraphSearchResultItem } from './graph-search-result-item';
import { BoostSignalSummary } from './boost-signal-summary-model';

export class BoostSignalRankerModel {
    private constructor(
        private boostSignals: BoostSignalModel[],
    ) {
        this.boostSignals.sort((a, b) => (a.difficulty() > b.difficulty()) ? -1 : 1);
    };

    get list(): BoostSignalModel[] {
        return this.boostSignals;
    }

    group(field1?: string): BoostSignalSummary[] {
        if (!field1 || field1 === '') {
            field1 = 'usernonce';
        }
        const groups: any = {}
        for (const item of this.boostSignals) {
            if (!groups[item[field1]()]) {
                groups[item[field1]()] = [];
            }
            groups[item[field1]()].push(item);
        }
        const resultList: BoostSignalSummary[] = [];
        for (const groupedKey in groups) {
            if (!groups.hasOwnProperty(groupedKey)) {
                continue;
            }
            resultList.push(new BoostSignalSummary(groups[groupedKey]));
        }
        resultList.sort((a, b) => (a.totalDifficulty > b.totalDifficulty) ? -1 : 1);
        return resultList;
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