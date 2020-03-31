import { BoostPowStringModel } from "./boost-pow-string-model";
import { BoostPowMetadataModel } from "./boost-pow-metadata-model";

export interface GraphSearchResultItem {
    boostJobId?: string;
    boostJobProofId?: string;
    boostPowString?: string;
    boostPowMetadata?: string;
}