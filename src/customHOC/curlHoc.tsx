import React, {
  forwardRef,
} from "react";
import {
  useCurl
} from "../customHooks/curlHook";

export const withCurl = (needAuth = true, setFetching = false) => (Com : any) => {
  return forwardRef((props, ref) => {
    const {
      curl,
      fetching
    } = useCurl(needAuth, setFetching);

    return (
      <>
        <Com
          curl={curl}
          fetching={fetching}
          ref={ref}
          {...props}
        />
      </>
    )
  })
}