import { Map } from "immutable";
import { AxiosResponse, AxiosRequestConfig } from "axios";
declare type MissionType = Promise<AxiosResponse<any>>;
declare type CurlRequestType<T> = (url: string, params?: object, configs?: AxiosRequestConfig, symbol?: SymbolType) => T;
declare type SymbolType = Symbol | string;
export interface ComponentCurlInterface {
    request: (config: AxiosRequestConfig, symbol?: SymbolType) => MissionType;
    get: CurlRequestType<MissionType>;
    post: CurlRequestType<MissionType>;
    download: CurlRequestType<void>;
    ajaxDownload: CurlRequestType<void>;
    upload: (url: string, params?: object, configs?: AxiosRequestConfig, uploadProgress?: (percent: number) => void, symbol?: SymbolType) => MissionType;
    createLink: CurlRequestType<Promise<any>>;
}
export declare const useCurl: (needAuth?: boolean, fetchingStatus?: boolean) => {
    curl: ComponentCurlInterface;
    fetching: Map<MissionType, boolean>;
};
export {};
