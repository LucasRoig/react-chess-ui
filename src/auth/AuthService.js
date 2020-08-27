import ApiService from "../services/ApiService";
import t from "tcomb";
import HistoryProvider from "../services/HistoryProvider";
import {LIST_DATABASE} from "../Routes";
import store from "../store";
import {loginSuccessAction} from "../store/AuthReducer";

const LoginRequest = t.struct({
  email: t.String,
  password: t.String
}, "LoginRequest")

const LoginResponse = t.struct({
  token: t.String
}, "LoginResponse")

const SignUpRequest = t.struct({
  email: t.String,
  password: t.String,
  username: t.String
})
const SignUpResponse = t.struct({
  token: t.String,
  user: t.Object
})
export default {
  login: ({email, password, handleInvalidCredentials}) => {
    const request = LoginRequest({email, password});
      ApiService.post("/login", request).then(res => {
        if (res.status === 401 || res.status === 403) {
          handleInvalidCredentials();
        } else if (res.status === 200) {
          let response = LoginResponse(res.data)
          store.dispatch(loginSuccessAction(response.token));
          HistoryProvider.getHistory().push(LIST_DATABASE)
        } else {
          throw res
        }
      })
  },
  signUp: ({email, password, username, handleError}) => {
    const request = SignUpRequest({email, password, username});
    ApiService.post("/user/signup", request).then(res => {
      console.log(res.status);
      if (res.status === 200 || res.status === 201) {
        const response = SignUpResponse(res.data);
        store.dispatch(loginSuccessAction(response.token));
        HistoryProvider.getHistory().push(LIST_DATABASE)
      } else {
        handleError();
      }
    }).catch(e => {
      handleError();
    })
  }
}

