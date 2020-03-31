import { BoostPowStringModel } from "./boost-pow-string-model";
import { BoostPowMetadataModel } from "./boost-pow-metadata-model";
export interface GraphSearchResultItem {
    boostJobId?: string;
    boostPowString?: BoostPowStringModel;
    boostPowMetadata?: BoostPowMetadataModel;
}
