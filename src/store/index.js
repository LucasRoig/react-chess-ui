import {applyMiddleware, combineReducers, createStore} from "redux";
import {composeWithDevTools} from "redux-devtools-extension";
import thunk from "redux-thunk";
import {authReducer} from "./AuthReducer";

const rootReducer = combineReducers({
    auth: authReducer
});

const composeEnhancers = composeWithDevTools({trace: true})
const store = createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));

export default store;