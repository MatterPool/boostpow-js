
import { BoostSignalModel } from './boost-signal-model';
import { GraphSearchResultItem } from './graph-search-result-item';
import { BoostSignalSummary } from './boost-signal-summary-model';

export class BoostSignalRankerModel {
    private constructor(
        private boostSignals: BoostSignalModel[],
    ) {
        this.boostSignals.sort((a, b) => (a.difficulty() > b.difficulty()) ? -1 : 1);
    };

    get first(): BoostSignalSummary | null {
        const sigs = this.list;
        return sigs && sigs.length ? sigs[0] : null;
    }

    get list(): BoostSignalSummary[] {
        const groups: any = {}
        for (const item of this.boostSignals) {
            const itemKey = item.content(true) + item.category(true) + item.tag(true) + item.additionalData(true);
            if (!groups[itemKey]) {
                groups[itemKey] = [];
            }
            groups[itemKey].push(item);
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

    group(field1: string): BoostSignalSummary[] {
        if (!field1 || field1 === '') {
            throw new Error('invalid arg');
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

    static fromArray(items: any[]): BoostSignalRankerModel {

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