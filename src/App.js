import React, { Component, lazy, Suspense } from 'react';
// import logo from './logo.svg';
import { Redirect, Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import { withRouter } from "react-router";
import './App.css';

import NavBar from './components/NavBar';

// import DatabaseList from './database/DatabaseList';
//import GameView from './GameView/GameView';

const GameView = withRouter(
  lazy(() => import('./GameView/GameView'))
)

const DatabaseList = withRouter(
  lazy(() => import('./database/DatabaseList'))
)

const DatabaseDetails = withRouter(
  lazy(() => import('./database/DatabaseDetails'))
)

class App extends Component {
  databases = ["Caro-Kann", "Gambit Dame"]
  render() {
    return (
      <div className="App">
      <Router>
        <NavBar />
        <main className="container">
          <Suspense fallback={<div>Loading</div>}>
          
            <Switch>
              <Redirect from="/" exact to="/database" />
              <Route exact path="/database" component={DatabaseList} />
              <Route exact path="/game" component={GameView} />
              <Route path="/database/:id" component={DatabaseDetails} />
            </Switch>
          </Suspense>
        </main>
        </Router>
      </div>
    );
  }
}

export default App;
