import React from "react";
import "./App.css";
import LinkList from "./components/LinkList";
import CreateLink from "./components/CreateLink";
import Header from "./components/Header";
import Login from "./components/Login";
import Search from "./components/Search";
import { Switch, Route,Redirect } from "react-router";
import { Router } from "react-router-dom";
import history from "./history";

function App() {
  return (
    <Router history={history}>
      <div className="center w85">
        <Header />
        <div className="ph3 pv1 background-gray">
          <Switch>
          <Route exact path='/' render={() => <Redirect to='/new/1' />} />
          <Route exact path='/create' component={CreateLink} />
          <Route exact path='/login' component={Login} />
          <Route exact path='/search' component={Search} />
          <Route exact path='/top' component={LinkList} />
          <Route exact path='/new/:page' component={LinkList} />
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;
