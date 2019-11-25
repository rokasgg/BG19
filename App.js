import React from "react";
import { Provider } from "react-redux";
import Router from "./navigation/router";
import store from "./redux/store";
//Zdrastvite
class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <Router />
      </Provider>
    );
  }
}

export default App;
