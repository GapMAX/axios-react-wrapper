import { AxiosRequestConfig, AxiosResponse, AxiosInstance } from "axios";
export declare type RequestInterceptors = (request: AxiosRequestConfig) => AxiosRequestConfig;
export declare type ResponseInterceptors = (response: AxiosResponse) => AxiosResponse;
export declare type UploadProgressType = (percent: number) => any;
export interface CurlConfigs extends AxiosRequestConfig {
    requestInterceptors?: RequestInterceptors;
    requestErrorInterceptors?: RequestInterceptors;
    responseInterceptors?: ResponseInterceptors;
    responseErrorInterceptors?: ResponseInterceptors;
    withCredentials?: boolean;
    timeout?: number;
    baseUrl?: string;
}
export declare class Curl {
    requestInterceptors: RequestInterceptors;
    ins: AxiosInstance;
    missions: Array<Promise<AxiosResponse<any>>>;
    constructor(configs?: CurlConfigs);
    get: (url: string, params?: object | undefined, config?: AxiosRequestConfig | undefined) => Promise<AxiosResponse<any>>;
    post: (url: string, data?: object | undefined, config?: AxiosRequestConfig | undefined) => Promise<AxiosResponse<any>>;
    put: (url: string, data?: object | undefined, config?: AxiosRequestConfig | undefined) => Promise<AxiosResponse<any>>;
    delete: (url: string, config?: AxiosRequestConfig | undefined) => Promise<AxiosResponse<any>>;
    request: (config: AxiosRequestConfig) => Promise<AxiosResponse<any>>;
    download: (url: string, data?: object | undefined, config?: AxiosRequestConfig | undefined) => void;
    ajaxDownload: (url: string, data?: object | undefined, config?: AxiosRequestConfig | undefined) => void;
    upload: (url: string, data?: object | undefined, config?: AxiosRequestConfig | undefined, uploadProgress?: UploadProgressType | undefined) => Promise<AxiosResponse<any>>;
    createLink: (url: string, data?: object | undefined, config?: AxiosRequestConfig | undefined) => Promise<string>;
}
export declare class curlOperation {
    private curlInt;
    constructor();
    initCurl: (configs?: CurlConfigs | undefined) => void;
    get request(): (config: AxiosRequestConfig) => Promise<AxiosResponse<any>>;
    set request(value: (config: AxiosRequestConfig) => Promise<AxiosResponse<any>>);
    get get(): (url: string, params?: object | undefined, config?: AxiosRequestConfig | undefined) => Promise<AxiosResponse<any>>;
    set get(value: (url: string, params?: object | undefined, config?: AxiosRequestConfig | undefined) => Promise<AxiosResponse<any>>);
    get post(): (url: string, data?: object | undefined, config?: AxiosRequestConfig | undefined) => Promise<AxiosResponse<any>>;
    set post(value: (url: string, data?: object | undefined, config?: AxiosRequestConfig | undefined) => Promise<AxiosResponse<any>>);
    get put(): (url: string, data?: object | undefined, config?: AxiosRequestConfig | undefined) => Promise<AxiosResponse<any>>;
    set put(value: (url: string, data?: object | undefined, config?: AxiosRequestConfig | undefined) => Promise<AxiosResponse<any>>);
    get delete(): (url: string, config?: AxiosRequestConfig | undefined) => Promise<AxiosResponse<any>>;
    set delete(value: (url: string, config?: AxiosRequestConfig | undefined) => Promise<AxiosResponse<any>>);
    get download(): (url: string, data?: object | undefined, config?: AxiosRequestConfig | undefined) => void;
    set download(value: (url: string, data?: object | undefined, config?: AxiosRequestConfig | undefined) => void);
    set ajaxDownload(value: (url: string, data?: object | undefined, config?: AxiosRequestConfig | undefined) => void);
    get ajaxDownload(): (url: string, data?: object | undefined, config?: AxiosRequestConfig | undefined) => void;
    get upload(): (url: string, data?: object | undefined, config?: AxiosRequestConfig | undefined, uploadProgress?: UploadProgressType | undefined) => Promise<AxiosResponse<any>>;
    set upload(value: (url: string, data?: object | undefined, config?: AxiosRequestConfig | undefined, uploadProgress?: UploadProgressType | undefined) => Promise<AxiosResponse<any>>);
    get createLink(): (url: string, data?: object | undefined, config?: AxiosRequestConfig | undefined) => Promise<string>;
    set createLink(value: (url: string, data?: object | undefined, config?: AxiosRequestConfig | undefined) => Promise<string>);
    getCurl: () => Curl;
}
export declare const curl: curlOperation;
