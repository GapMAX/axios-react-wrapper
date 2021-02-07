/// <reference types="react" />
import { curlOperation } from "../utils";
export interface ContextInterface {
    auth: () => boolean;
    curl: curlOperation;
}
export declare const CurlContext: import("react").Context<ContextInterface | undefined>;
