import ApiService from "../services/ApiService";

export const LOGIN_SUCCESS = "LOGIN_SUCCESS"
export const LOGOUT_SUCCESS = "LOGOUT_SUCCESS"

let storage = JSON.parse(localStorage.getItem("auth")) || {};

if (storage.token) {
    ApiService.setToken(storage.token)
}

const initialState = {
    token: storage.token || "",
    isAuthenticated: Boolean(storage.token)
}

export function loginSuccessAction(token) {
    return {
        type: LOGIN_SUCCESS,
        payload : {
            token
        }
    }
}

export function logoutSuccessAction() {
    return {
        type: LOGOUT_SUCCESS
    }
}

export function authReducer(state = initialState, action) {
    switch (action.type) {
        case LOGIN_SUCCESS:
            localStorage.setItem("auth",JSON.stringify(action.payload));
            ApiService.setToken(action.payload.token);
            return {
                ...state,
                ...action.payload,
                isAuthenticated: true
            }
        case LOGOUT_SUCCESS:
            localStorage.removeItem("auth");
            ApiService.setToken(null);
            return {
                ...state,
                token: "",
                isAuthenticated: false,
            }
        default:
            return state;
    }
}