
import { BoostSignalModel } from './boost-signal-model';
import { BoostSignalSummary } from './boost-signal-summary-model';

export interface BoostSignalEntitySerialize {
    boosthash: string,
    content: string,
    contenthex: string,
    category: string,
    categoryhex: string,
    userNonce: string,
    userNoncehex: string,
    additionalData: string,
    additionalDatahex: string,
    tag: string,
    taghex: string,
    boostJobId: string,
    boostJobProofId: string,
    metadataHash: string,
    minerPubKeyHash: string,
    time: number,
    difficulty: number,
    energy: number,
};

export interface BoostSignalSummarySerialize {
    totalDifficulty: number;
    totalEnergy: number;
    recentSignalTime?: number;
    entity: BoostSignalEntitySerialize
    signals: any[]
};

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
            const itemKey = item.category(true) + item.content(true);
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

    get length(): number {
        return this.list.length;
    }
    groupByCategory(): BoostSignalSummary[] {
        return this.groupPrivate('category');
    }
    groupByContent(): BoostSignalSummary[] {
        return this.groupPrivate('content');
    }
    groupByTag(): BoostSignalSummary[] {
        return this.groupPrivate('tag');
    }
    groupByAdditionalData(): BoostSignalSummary[] {
        return this.groupPrivate('additionalData');
    }

    /**
     * Returns the Boost Rank for the list of transactions.
     *
     * Pass in an array of bsv.Transaction and get them ranked by boost!
     *
     * Pass in an array of txids/hashes and get back ranked by Boost
     *
     * @param txidsOrObjects ["txid1", { hash: "txid2" }, "txidn"]
     */
    rank(txidsOrObjects: any[] | Array<{ hash: string }>, debug?: boolean): Array<{ hash: string, boostpow: any}> {
        const grouped = this.groupByContent();
        const boostrank: any = [];
        const checkHashMap = new Map();

        // For fast lookup by hash whether it's a string or in the .hash property
        for (const item of txidsOrObjects) {
            const TXID_REGEX = new RegExp('^[0-9a-fA-F]{64}$');
            if (item['hash']) {
                checkHashMap.set(item['hash'], item);
                continue;
            }
            if (TXID_REGEX.test(item)) {
                checkHashMap.set(item, { hash: item });
            }
        }
        for (const item of grouped) {

            const hash = item.entity.content(true);
            const matched = checkHashMap.get(hash);
            if (matched) {
                if (!matched.hash) {
                    matched.hash = hash;
                }


                matched.boostpow = {
                    // ranker: this,
                    signals: this.serializeBoostSignals(item.signals, debug),
                    totalDifficulty: item.totalDifficulty,
                    lastSignalTime: item.lastSignalTime,
                    recentSignalTime: item.recentSignalTime
                }

                console.log('matched', matched);
                boostrank.push(matched);
            }
        }
        return boostrank;
    }
    public serializeBoostSignals(signals: any, debug?: boolean): Array<BoostSignalEntitySerialize> {
        const boostSignalSummaries: any = [];
        for (const item of signals) {
            boostSignalSummaries.push({
                boosthash: item.getBoostPowString().hash(),
                boostPowString: item.getBoostPowString().toString(),
                boostPowMetadata: item.getBoostMetadata().toString(),
                boostPowJobId: item.getBoostJobId(),
                boostPowJobProofId: item.getBoostJobProofId(),
                contenthex: item.content(true),
                category: item.category(),
                categoryhex: item.category(true),
                userNoncehex: item.userNonce(true),
                additionalData: item.additionalData(),
                additionalDatahex: item.additionalData(true),
                tag: item.tag(),
                taghex: item.tag(true),
                metadataHash: item.metadataHash(),
                minerPubKeyHash: item.minerPubKeyHash(),
                time: item.time(),
                difficulty: item.difficulty()
            });
        }
        return boostSignalSummaries;
    }
    private groupPrivate(field1: string): BoostSignalSummary[] {
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
}
