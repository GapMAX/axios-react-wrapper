import { useRef, useEffect, useState, useContext } from "react";
import { CurlContext, ContextInterface } from "../context";
import {
  Map
} from "immutable";
import {
	AxiosResponse,
	AxiosRequestConfig
} from "axios";

type MissionType = Promise<AxiosResponse<any>>;

type CurlRequestType<T> = (url : string, params? : object, configs? : AxiosRequestConfig, symbol? : SymbolType) => T;

type SymbolType = Symbol | string;

export interface ComponentCurlInterface {
  request : (config : AxiosRequestConfig, symbol? : SymbolType) => MissionType,
  get : CurlRequestType<MissionType>,
  post : CurlRequestType<MissionType>,
	download : CurlRequestType<void>,
	ajaxDownload : CurlRequestType<void>,
  upload : (url : string, params? : object, configs? : AxiosRequestConfig, uploadProgress? : (percent : number) => void, symbol? : SymbolType) => MissionType,
  createLink : CurlRequestType<Promise<any>>
}

const flags : any = {};

export const useCurl = (needAuth = true, fetchingStatus = false) => {
	const [state, setState] = useState<{fetching : Map<MissionType, boolean>}>({
		fetching : Map()
	});
	const isMounted = useRef(true);
	const { auth = () => true, curl } = useContext(CurlContext) as ContextInterface;
	const authentication = needAuth ? auth : () => true;

	const resResponse = (response : any, res : any, rej : any) => {
		if (!isMounted.current) {
			rej();
			return;
		}
		if(!response){
			res();
      return;
		}
		res(response);
	};

	const errorHandle = (error : any, rej : any) => {
		if (!isMounted.current) {
			rej();
			return;
		}
		rej(error);
	};

	const Break = () => {
		const result = !isMounted.current || !authentication();
		return result;
	};

	const resetFetching = (name : MissionType) => {
		setState(state => {
			const { fetching } = state;
			const newFetching = fetching.delete(name);
			return {
				fetching : newFetching
			};
		})
	}

	const autoRegister = (mission : MissionType) => {
		setTimeout(() => {
			if(fetchingStatus){
				if (Break()) {
					return mission;
				}

				setState(state => {
					const { fetching } = state;
					const newFetching = fetching.set(mission, !!mission);
					return {
						fetching : newFetching
					};
				});
				Promise.all([mission])
					.then(res => {
						if (Break()) {
							return;
						}
						resetFetching(mission);
					}).catch(e => {
						if (Break()) {
							return;
						}
						resetFetching(mission);
					})
			}
		})
		return mission;
	}

	const resolveHandle = (res : any, rej : any, symbol? : SymbolType, flag? : number) => (response : AxiosResponse<any> | string) => {
		if(flag && flag !== flags[symbol as any]){
			rej();
			return;
		}
		return resResponse(response, res, rej);
	}

	const rejectHandle = (rej : any, symbol? : SymbolType, flag? : number) => (error : any) => {
		if(flag && flag !== flags[symbol as any]){
			rej();
			return;
		}
		return errorHandle(error, rej);
	}

	const curlRef = useRef<ComponentCurlInterface>({
		request : (config, symbol) => autoRegister(new Promise((res, rej) => {
			if (Break()){
				rej();
				return;
			}
			let flag : number;
			if(symbol){
				flag = new Date().getTime();
				flags[symbol as any] = flag; 
			}
			curl.request(config)
				.then(resolveHandle(res, rej, symbol, flag!))
				.catch(rejectHandle(rej, symbol, flag!));
		})),
		get: (url, params, config, symbol) => autoRegister(new Promise((res, rej) => {
			if (Break()) {
				rej();
				return;
			}
			let flag : number;
			if(symbol){
				flag = new Date().getTime();
				flags[symbol as any] = flag; 
			}
			curl.get(url, params, config)
				.then(resolveHandle(res, rej, symbol, flag!))
				.catch(rejectHandle(rej, symbol, flag!));
		})),
		post: (url, data, config, symbol) => {
			const mission = autoRegister(new Promise((res, rej) => {
				if (Break()) {
					rej();
					return;
				}
				let flag : number;
				if(symbol){
					flag = new Date().getTime();
					flags[symbol as any] = flag; 
				}
				curl.post(url, data, config)
					.then(resolveHandle(res, rej, symbol, flag!))
					.catch(rejectHandle(rej, symbol, flag!));
			}))
			return mission;
		},
		download: (url, data, config) => new Promise((res, rej) => {
			if (!authentication()) {
				rej();
				return;
			}
			curl.download(url, data, config)
				//.then(response => resResponse(response, res, rej))
				//.catch(error => errorHandle(error, rej))
		}),
		ajaxDownload : (url, data, config) => new Promise((res, rej) => {
			if(!authentication()){
				rej();
				return;
			}
			curl.ajaxDownload(url, data, config);
		}),
		upload : (url, data, config = {}, uploadProgress, symbol) => autoRegister(new Promise((res, rej) => {
				if(Break()){
					rej();
					return;
				}
				let flag : number;
				if(symbol){
					flag = new Date().getTime();
					flags[symbol as any] = flag; 
				}
				curl.upload(url, data, config, uploadProgress)
					.then(resolveHandle(res, rej, symbol, flag!))
					.catch(rejectHandle(rej, symbol, flag!));
			})),
		createLink : (url, data, config, symbol) => autoRegister(new Promise((res, rej) => {
				if(Break()){
					rej();
					return;
				}
				let flag : number;
				if(symbol){
					flag = new Date().getTime();
					flags[symbol as any] = flag; 
				}
				curl.createLink(url, data, config)
					.then(resolveHandle(res, rej, symbol, flag!))
					.catch(rejectHandle(rej, symbol, flag!));
			}))
	});

	useEffect(() => {
		return () => { isMounted.current = false; };
	}, []);

	return {
		curl : curlRef.current,
		fetching : state.fetching,
	};
};
