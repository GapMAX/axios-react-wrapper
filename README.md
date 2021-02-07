# axios-react-wrapper

## Installing

Using npm:

```bash
$ npm install -S axios-react-wrapper
```

##### 1. CurlProvider
Wrap your root component with CurlProvider

```
import React from "react";
import {
  CurlProvider
} from "../src";
import TestComponent from "./TestComponent";

export default function App(props){
  // You can unify response handle here. 
  const responseHandle = (response, res, rej) => {
    const {
      message,
      rows
    } = response.data;
    alert(message);
    // Just resolve needed data
    res(rows);
  }

  // You can unify response error handle here. 
  const errorHandle = (error, rej) => {
    rej(error);
  }

  return (
    <CurlProvider
      //auth method(return true will send request while return false won't send request)
      auth={() => true}
      responseHandle={responseHandle}
      errorHandle={errorHandle}
    >
      <TestComponent/>
    </CurlProvider>
  )
}
```


##### 2. useCurl(needAuth = true, needFetchingState = false)
```
function TestComponent(){
  const {
    curl,
    fetching
  } = useCurl(true, true);

  const mission = useRef();

  useEffect(() => {
    mission.current = curl.get(url, params, axiosRequestConfig);
    mission.current
      .then(res => {
        //do something
      })
  }, []);

  const isFetching = fetching.get(mission.current);

  return (
    <div>
      hello world.<br/>
      isFetching: {isFetching}
    </div>
  )
}
```

##### 3. withCurl(needAuth = true, needFetchingState = false)
```
class TestComponent extends Component{
  constructor(props){
    super(props);
    this.curl = props.curl;
    this.mission = void 0;
  }

  componentDidMount = () => {
    this.mission = this.curl.get(url, params, axiosRequestConfig);
    this.mission
      .then(res => {
        //do somthing
      })
  }

  render(){
    const {
      fetching
    } = this.props;
    const isFetching = fetching.get(this.mission);

    return (
      <div>
        hello world.<br/>
        isFetching : {isFetching}
      </div>
    )
  }
}

export default withCurl(true, true)(TestComponent);
```