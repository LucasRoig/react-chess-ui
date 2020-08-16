import ApiService from "../services/ApiService";
import t from "tcomb";
import HistoryProvider from "../services/HistoryProvider";
import {LIST_DATABASE} from "../Routes";

const LoginRequest = t.struct({
  email: t.String,
  password: t.String
}, "LoginRequest")

const LoginResponse = t.struct({
  token: t.String
}, "LoginResponse")

export default {
  login: ({email, password, handleInvalidCredentials}) => {
    const request = LoginRequest({email, password});
      ApiService.post("/login", request).then(res => {
        if (res.status === 401 || res.status === 403) {
          handleInvalidCredentials();
        } else if (res.status === 200) {
          let response = LoginResponse(res.data)
          ApiService.setToken(response.token);
          localStorage.setItem("token", response.token)
          HistoryProvider.getHistory().push(LIST_DATABASE)
        } else {
          throw res
        }
      })
  }
}
