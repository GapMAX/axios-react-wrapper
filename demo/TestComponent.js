import React, {
  Component,
} from "react";
import {
  withCurl,
  createSymbol
} from "../src";

const symbol1 = createSymbol("hello");

class TestComponent extends Component{
  constructor(props){
    super(props);
    this.mission = void 0;
    this.curl = props.curl;
  }

  handleClick = () => {
    this.curl.ajaxDownload("/", {}, {
      method : "post"
    });
  }

  render = () => {
    return (
      <div onClick={this.handleClick}>
        hello world.
      </div>
    )
  }
}

export default withCurl()(TestComponent);

// export default function TestComponent(props){
//   const {
//     curl,
//     fetching
//   } = useCurl(true, true);
//   const mission = useRef();

//   useEffect(() => {
//     mission.current = curl.get("/", {}, {}, symbol1);
//     mission.current.then(res => {
//       console.log(res);
//     })
//   }, [curl]);

//   const state = fetching.get(mission.current);

//   console.log(state);

//   return (
//     <div>
//       Hello world.
//     </div>
//   )
// }