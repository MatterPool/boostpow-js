
import { BoostSignalModel } from './boost-signal-model';
import { BoostSignalSummary } from './boost-signal-summary-model';

export class BoostSignalRankerModel {
    private lastSignalTime_ = 0;
    private recentSignalTime_ = 0;
    private totalDifficulty_ = 0;

    private constructor(
        private boostSignals: BoostSignalModel[],
    ) {
        this.boostSignals.sort((a, b) => (a.difficulty() > b.difficulty()) ? -1 : 1);

        for (const signal of boostSignals) {
            this.totalDifficulty_ += signal.difficulty();
        }
        for (const sig of this.boostSignals) {
            if (!this.lastSignalTime_ || this.lastSignalTime_ >= sig.time()) {
                this.lastSignalTime_ = sig.time();
            }
            if (!this.recentSignalTime_ || this.recentSignalTime_ <= sig.time()) {
                this.recentSignalTime_ = sig.time();
            }
        }
    };
    get lastSignalTime(): number {
        return this.lastSignalTime_;
    }
    get recentSignalTime(): number {
        return this.recentSignalTime_;
    }
    get first(): BoostSignalSummary | null {
        const sigs = this.list;
        return sigs && sigs.length ? sigs[0] : null;
    }

    get second(): BoostSignalSummary | null {
        const sigs = this.list;
        return sigs && sigs.length && sigs[1] ? sigs[1] : null;
    }

    get third(): BoostSignalSummary | null {
        const sigs = this.list;
        return sigs && sigs.length && sigs[2] ? sigs[2] : null;
    }

    get fourth(): BoostSignalSummary | null {
        const sigs = this.list;
        return sigs && sigs.length && sigs[3] ? sigs[3] : null;
    }

    get last(): BoostSignalSummary | null {
        const sigs = this.list;
        return sigs && sigs.length && sigs[sigs.length - 1] ? sigs[sigs.length - 1] : null;
    }

    get totalDifficulty() {
        return this.totalDifficulty_;
    }
    get totalEnergy() {
        return this.totalDifficulty_;
    }
    get list(): BoostSignalSummary[] {
        const groups: any = {}
        for (const item of this.boostSignals) {
            const itemKey = item.content(true) + item.category(true);
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

    static dedupPlainObjects(items: any): any[] {
        const dedupMap = {};
        const newList: any = [];
        for (const item of items) {
            if (!item.boostPowString || dedupMap[item.boostPowString]) {
                continue;
            }
            dedupMap[item.boostPowString] = true;
            newList.push(item);
        }
       return newList;
    }
    static dedupSignalObjects(items: any[]): any[] {
        const dedupMap = {};
        const newList: any = [];
        for (const item of items) {
            if (dedupMap[item.getBoostPowString().toString()]) {
                continue;
            }
            dedupMap[item.getBoostPowString().toString()] = true;
            newList.push(item);
        }
       return newList;
    }

    static fromSignals(signals: BoostSignalModel[]): BoostSignalRankerModel {
        return new BoostSignalRankerModel(BoostSignalRankerModel.dedupSignalObjects(signals));
    }

    static fromArray(items: any[]): BoostSignalRankerModel {

        if (!items) {
            return new BoostSignalRankerModel([]);
        }
        const dedupItems = BoostSignalRankerModel.dedupPlainObjects(items);

        let lister: BoostSignalModel[] = [];
        for (const item of dedupItems) {
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