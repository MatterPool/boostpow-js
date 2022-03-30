import { Int32Little } from '../fields/int32Little';
import { UInt32Little } from '../fields/uint32Little';
import { UInt32Big } from '../fields/uint32Big';
import { Digest32 } from '../fields/digest32';
import { Bytes } from '../fields/bytes';
import { Difficulty } from '../fields/difficulty';
import { PowString } from './string';
export { PowString } from './string';
export declare class Puzzle {
    Category: Int32Little;
    Content: Digest32;
    Difficulty: Difficulty;
    MetaBegin: Bytes;
    MetaEnd: Bytes;
    Mask?: Int32Little | undefined;
    constructor(Category: Int32Little, Content: Digest32, Difficulty: Difficulty, MetaBegin: Bytes, MetaEnd: Bytes, Mask?: Int32Little | undefined);
}
export declare class Solution {
    Time: UInt32Little;
    ExtraNonce1: UInt32Big;
    ExtraNonce2: Bytes;
    Nonce: UInt32Little;
    GeneralPurposeBits?: Int32Little | undefined;
    constructor(Time: UInt32Little, ExtraNonce1: UInt32Big, ExtraNonce2: Bytes, Nonce: UInt32Little, GeneralPurposeBits?: Int32Little | undefined);
}
export declare function meta(p: Puzzle, x: Solution): Bytes;
export declare function pow_string(p: Puzzle, x: Solution): PowString | undefined;
export declare class Proof {
    Puzzle: Puzzle;
    Solution: Solution;
    constructor(Puzzle: Puzzle, Solution: Solution);
    metadata(): Bytes;
    string(): PowString | undefined;
    valid(): boolean;
}
