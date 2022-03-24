import { BoostSignalModel } from './boost-signal-model';
import { BoostSignalSummary } from './boost-signal-summary-model';
export interface BoostSignalEntitySerialize {
    boosthash: string;
    content: string;
    contenthex: string;
    category: string;
    categoryhex: string;
    userNonce: string;
    userNoncehex: string;
    additionalData: string;
    additionalDatahex: string;
    tag: string;
    taghex: string;
    boostJobId: string;
    boostJobProofId: string;
    metadataHash: string;
    minerPubKeyHash: string;
    time: number;
    difficulty: number;
    energy: number;
}
export interface BoostSignalSummarySerialize {
    totalDifficulty: number;
    totalEnergy: number;
    recentSignalTime?: number;
    entity: BoostSignalEntitySerialize;
    signals: any[];
}
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
    /**
     * Returns the Boost Rank for the list of transactions.
     *
     * Pass in an array of bsv.Transaction and get them ranked by boost!
     *
     * Pass in an array of txids/hashes and get back ranked by Boost
     *
     * @param txidsOrObjects ["txid1", { hash: "txid2" }, "txidn"]
     */
    rank(txidsOrObjects: any[] | Array<{
        hash: string;
    }>, debug?: boolean): Array<{
        hash: string;
        boostpow: any;
    }>;
    serializeBoostSignals(signals: any, debug?: boolean): Array<BoostSignalEntitySerialize>;
    private groupPrivate;
    static dedupPlainObjects(items: any): any[];
    static dedupSignalObjects(items: any[]): any[];
    static fromSignals(signals: BoostSignalModel[]): BoostSignalRankerModel;
}
