import React, { Component, lazy, Suspense } from 'react';
import { Redirect, Route, Switch, Router } from 'react-router-dom'
import { withRouter } from "react-router";
import './App.css';

import NavBar from './components/NavBar';
import {LIST_DATABASE, LOGIN} from "./Routes";
import HistoryProvider from "./services/HistoryProvider";

const GameView = withRouter(
  lazy(() => import('./GameView/GameView'))
)
const TrainingView = withRouter(
  lazy(() => import('./GameView/TrainingView'))
)
const DatabaseList = withRouter(
  lazy(() => import('./database/DatabaseList'))
)

const DatabaseDetails = withRouter(
  lazy(() => import('./database/DatabaseDetails'))
)

const LoginPage = withRouter(
  lazy(() => import("./auth/LoginPage"))
)

class App extends Component {
  databases = ["Caro-Kann", "Gambit Dame"]
  render() {
    return (
      <div className="App">
      <Router history={HistoryProvider.getHistory()}>
        <NavBar />
        <main className="container">
          <Suspense fallback={<div>Loading</div>}>
            <Switch>
              <Redirect from="/" exact to={LIST_DATABASE} />
              <Route exact path={LIST_DATABASE} component={DatabaseList} />
              <Route exact path="/game" component={GameView} />
              <Route exact path="/game/:id" component={GameView} />
              <Route path="/database/:id" component={DatabaseDetails} />
              <Route path={LOGIN} component={LoginPage} />
              <Route path="/training/:id" component={TrainingView} />
            </Switch>
          </Suspense>
        </main>
        </Router>
      </div>
    );
  }
}

export default App;
