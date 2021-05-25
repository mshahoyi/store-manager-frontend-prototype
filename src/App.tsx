import React from "react";
import "./App.css";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import Stores from "./scenes/Stores";
import StoreUpsert from "./scenes/StoreUpsert";
import StoreMain from "./scenes/StoreMain";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={Stores} />
          <Route path="/upsert-store/:id?" component={StoreUpsert} />
          <Route path="/store/:id" component={StoreMain} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
