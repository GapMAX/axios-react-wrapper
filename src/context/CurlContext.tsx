import {
  createContext
} from "react";
import {
  curlOperation
} from "../utils";

export interface ContextInterface {
  auth : () => boolean,
  curl : curlOperation
}

export const CurlContext = createContext<ContextInterface | undefined>(void 0);