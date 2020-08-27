import React, { Component, lazy, Suspense } from 'react';
import { Redirect, Route, Switch, Router } from 'react-router-dom'
import { withRouter } from "react-router";
import './App.css';

import NavBar from './components/NavBar';
import {LIST_DATABASE, LOGIN} from "./Routes";
import HistoryProvider from "./services/HistoryProvider";
import {connect} from "react-redux";

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
              <Route exact path={LIST_DATABASE}>
                {this.props.isAuthenticated ? <DatabaseList/> : <Redirect to={LOGIN}/> }
              </Route>
              <Route exact path="/game" component={GameView} />
              <Route exact path="/game/:id">
                {this.props.isAuthenticated ? <GameView/> : <Redirect to={LOGIN}/> }
              </Route>
              <Route path="/database/:id">
                {this.props.isAuthenticated ? <DatabaseDetails/> : <Redirect to={LOGIN}/> }
              </Route>
              <Route path={LOGIN}>
                {this.props.isAuthenticated ? <Redirect to={LIST_DATABASE}/> : <LoginPage/>}
              </Route>
              <Route path="/training/:id">
                {this.props.isAuthenticated ? <TrainingView/> : <Redirect to={LOGIN}/> }
              </Route>
            </Switch>
          </Suspense>
        </main>
        </Router>
      </div>
    );
  }
}

function mapStateToProps (state) {
  return {
    isAuthenticated: state.auth.isAuthenticated
  }
}

export default connect(mapStateToProps)(App);
