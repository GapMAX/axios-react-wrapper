import { PropsWithChildren } from "react";
import { CurlConfigs } from "../utils";
import { AxiosResponse } from "axios";
declare type ResType = (value: AxiosResponse<any> | PromiseLike<AxiosResponse<any>>) => void;
declare type RejType = (reason?: any) => void;
export interface CurlProviderProps {
    auth: () => boolean;
    responseHandle: (response: AxiosResponse, res: ResType, rej: RejType) => void;
    errorHandle: (error: any, rej: RejType) => any;
    configs?: CurlConfigs;
}
export default function CurlProvider(props: PropsWithChildren<CurlProviderProps>): JSX.Element;
export * from "./CurlContext";
