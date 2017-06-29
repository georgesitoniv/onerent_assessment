import "./styles/styles";
import React from "react";
import ReactDOM from "react-dom";
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reducers from "./reducers";
import injectTapEventPlugin from "react-tap-event-plugin";
import thunkMiddleware from "redux-thunk";
import App from "./components/App";

const createStoreWithMiddleware = applyMiddleware(
  thunkMiddleware
)(createStore);

injectTapEventPlugin();

const Root = () =>{
  return(
    <Provider store={createStoreWithMiddleware(reducers)}>
      <App/>
    </Provider>
  );
}

ReactDOM.render(<Root/>, document.querySelector("#root"));
