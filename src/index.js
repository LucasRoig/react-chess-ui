import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {createHashHistory} from 'history'
import HistoryProvider from "./services/HistoryProvider";
import ApiService from "./services/ApiService";

let history = createHashHistory();
HistoryProvider.setHistory(history);
let token = localStorage.getItem("token");
if (token) {
  ApiService.setToken(token)
  console.log("Token successfully loaded")
}
ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
