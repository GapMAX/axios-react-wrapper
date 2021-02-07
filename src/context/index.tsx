import React, {
  PropsWithChildren
} from "react";
import { CurlContext } from "./CurlContext";
import { curl, CurlConfigs } from "../utils";
import {
  AxiosResponse
} from "axios"

type ResType = (value: AxiosResponse<any> | PromiseLike<AxiosResponse<any>>) => void;
type RejType = (reason?: any) => void;

export interface CurlProviderProps {
  auth : () => boolean,
  responseHandle : (response : AxiosResponse, res : ResType, rej : RejType) => void,
  errorHandle : (error : any, rej : RejType) => any,
  configs? : CurlConfigs
}

export default function CurlProvider(props : PropsWithChildren<CurlProviderProps>){
  const {
    children, auth, responseHandle, errorHandle, configs
  } = props;

  curl.initCurl(configs);

  const {
    request,
    get,
    post,
  } = curl;
  
  curl.request = (config) => new Promise((res, rej) => {
    request(config)
      .then(response => responseHandle(response, res, rej))
      .catch(error => errorHandle(error, rej));
  })

  curl.get = (url, params, config) => new Promise((res, rej) => {
    get(url, params, config)
      .then(response => responseHandle(response, res, rej))
      .catch(error => errorHandle(error, rej));
  })

  curl.post = (url, data, config) => new Promise((res, rej) => {
    post(url, data, config)
      .then(response => responseHandle(response, res, rej))
      .catch(error => errorHandle(error, rej));
  })

  return (
    <CurlContext.Provider value={{auth, curl}}>
      {children}
    </CurlContext.Provider>
  )
}

export * from "./CurlContext";