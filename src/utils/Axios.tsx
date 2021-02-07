import axios, {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosInstance
} from "axios";
import qs from "query-string";

const iframeTag = "iframe-download-form-container";
function createIframe(){
  let iframe : HTMLIFrameElement | null = document.getElementById(iframeTag) as (HTMLIFrameElement | null);
  if(!iframe){
    iframe = document.createElement("iframe");
    iframe.id = iframeTag;
    iframe.name = iframeTag;
    iframe.style.display = "none";
    document.body.appendChild(iframe);
  }
}

function postDownload(url : string, params = {}){
  if(Array.isArray(params) || typeof params !== "object") return false;
  var form = document.createElement("form");
  createIframe()
  form.action = url;
  form.method = "post";
  form.style.display = "none";
  form.target = iframeTag;
  document.body.appendChild(form);
  Object.keys(params).forEach(key => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = key;
    input.value = params[key as keyof typeof params] || "";
    form.appendChild(input);
  })
  form.submit();
  document.body.removeChild(form);
}
function getDownload(url : string, params = {}){
  if(Array.isArray(params) || typeof params !== "object") return false;
  createIframe();
  params = qs.stringify(params);
  if(!/\?/.test(url)){
    url = url + "?";
    url = `${url}${params}`;
  }else{
    url = `${url}&${params}`;
  }
  var elink = document.createElement('a');
  elink.download = "#";
  elink.style.display = 'none';
  elink.href = url;
  elink.target = iframeTag;
  document.body.appendChild(elink);
  elink.click();
  document.body.removeChild(elink);
}

export type RequestInterceptors = (request : AxiosRequestConfig) => AxiosRequestConfig;
export type ResponseInterceptors = (response : AxiosResponse) => AxiosResponse;
export type UploadProgressType = (percent : number) => any

export interface CurlConfigs extends AxiosRequestConfig {
  requestInterceptors? : RequestInterceptors,
  requestErrorInterceptors? : RequestInterceptors,
  responseInterceptors? : ResponseInterceptors,
  responseErrorInterceptors? : ResponseInterceptors,
  withCredentials? : boolean,
  timeout? : number,
  baseUrl? : string
}

export class Curl {
  requestInterceptors : RequestInterceptors;
  ins : AxiosInstance;
  missions : Array<Promise<AxiosResponse<any>>>;
  constructor(configs : CurlConfigs = {}) {
    const {
      requestInterceptors   = (c) => c,
      requestErrorInterceptors = (e) => Promise.reject(e),
      responseInterceptors  = (res) => res,
      responseErrorInterceptors  = (e) => Promise.reject(e),
      withCredentials       = true,
      timeout               = 5000,
      baseUrl               = "",
      ...rest
    } = configs;
    this.requestInterceptors = requestInterceptors;
    this.ins = axios.create({
      baseURL: baseUrl,
      ...rest
    });
    this.ins.defaults.withCredentials = withCredentials;
    this.ins.defaults.timeout = timeout;
    this.ins.interceptors.request.use(requestInterceptors, requestErrorInterceptors)
    this.ins.interceptors.response.use(responseInterceptors, responseErrorInterceptors);
    this.missions = [];
  }

  get = (url : string, params? : object, config? : AxiosRequestConfig) => {
    if (!config)
      config = {};
    if (params)
      config.params = params;
    const mission = this.ins.get(url, config);
    this.missions.push(mission);
    return mission;
  }

  post = (url : string, data? : object, config? : AxiosRequestConfig) => {
    const mission = this.ins.post(url, data, config);
    this.missions.push(mission);
    return mission;
  }

  put = (url : string, data? : object, config? : AxiosRequestConfig) => {
    const mission = this.ins.put(url, data, config);
    this.missions.push(mission);
    return mission;
  }

  delete = (url : string, config? : AxiosRequestConfig) => {
    const mission = this.ins.delete(url, config);
    this.missions.push(mission);
    return mission;
  }

  request = (config : AxiosRequestConfig) => {
    const mission = this.ins.request(config);
    this.missions.push(mission);
    return mission;
  }

  download = (url : string, data? : object, config? : AxiosRequestConfig) => {
    config || (config = {});
    config.method || (config.method = "get");
    const request = this.requestInterceptors({url});
    if (config.method === "post")
      postDownload(request.url as string, data);
    else
      getDownload(request.url as string, data);
  }

  ajaxDownload = (url : string, data? : object, config? : AxiosRequestConfig) => {
    config || (config = {});
    config.url = url;
    config.responseType = "blob";
    config.method || (config.method = "get");
    if (config.method === "post")
      config.data = data;
    else
      config.params = data;
    this.ins.request(config).then(response => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const disposition = response.headers["content-disposition"];
      let fileNameReg = /filename\*=UTF-8''(.*)/;
      const result = fileNameReg.exec(disposition);
      let fileName = result && decodeURIComponent(result[1]);
      if (!fileName) {
        fileNameReg = /filename="(.*)"/;
        const result = fileNameReg.exec(disposition);
        fileName = (result && result[1]) || "download";
      }
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  }

  upload = (url : string, data? : object, config? : AxiosRequestConfig, uploadProgress? : UploadProgressType) => {
    config || (config = {});
    config.headers || (config.headers = { "Content-Type" : "multipart/form-data" });
    config.onUploadProgress = (e) => {
      if (e.lengthComputable) {
        uploadProgress && uploadProgress(e.loaded / e.total)
      }
    }
    return this.post(url, data, config)
  }

  createLink = (url : string, data? : object, config? : AxiosRequestConfig) => {
    config || (config = {});
    config.url = url;
    config.responseType = "blob";
    config.method || (config.method = "post");
    if (config.method === "post")
      config.data = data;
    else
      config.params = data;
    const self = this;
    return new Promise<string>((res, rej) => {
      self.ins.request(config as AxiosRequestConfig).then(response => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        res(url);
      }).catch(e => {
        rej(e);
      })
    })
  }
}

export class curlOperation {
  private curlInt : Curl;

  constructor(){
    this.curlInt = new Curl();
  }
  
  initCurl = (configs? : CurlConfigs) => {
    this.curlInt = new Curl(configs);
  }

  get request() {
    return this.getCurl().request;
  }

  set request(value){
    this.getCurl().request = value;
  }

  get get(){
    return this.getCurl().get;
  }

  set get(value){
    this.getCurl().get = value;
  }

  get post(){
    return this.getCurl().post;
  }

  set post(value){
    this.getCurl().post = value;
  }

  get put(){
    return this.getCurl().put;
  }

  set put(value){
    this.getCurl().put = value;
  }

  get delete(){
    return this.getCurl().delete;
  }

  set delete(value){
    this.getCurl().delete = value;
  }

  get download(){
    return this.getCurl().download;
  }

  set download(value){
    this.getCurl().download = value;
  }

  set ajaxDownload(value){
    this.getCurl().ajaxDownload = value;
  }

  get ajaxDownload(){
    return this.getCurl().ajaxDownload;
  }

  get upload(){
    return this.getCurl().upload;
  }

  set upload(value){
    this.getCurl().upload = value;
  }

  get createLink(){
    return this.getCurl().createLink;
  }

  set createLink(value){
    this.getCurl().createLink = value;
  }

  getCurl = () => {
    if(!this.curlInt){
      console.warn("Please use initCurl before getCurl.")
    }
    return this.curlInt;
  }
}

export const curl = new curlOperation();