import React from "react";
import {
  CurlProvider
} from "../src";
import TestComponent from "./TestComponent";

export default function App(props){
  const responseHandle = (response, res, rej) => {
    res(response.data);
  }

  const errorHandle = (error, rej) => {
    rej(error);
  }

  return (
    <CurlProvider
      auth={() => true}
      responseHandle={responseHandle}
      errorHandle={errorHandle}
    >
      <TestComponent/>
    </CurlProvider>
  )
}