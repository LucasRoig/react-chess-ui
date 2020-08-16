import Axios from "axios";

const baseUrl = "http://localhost:8080";
let token = null;

const getWithAuth = url => Axios.get(baseUrl + url, {
  headers: {
    "Authorization": token
  }
})

const postWithAuth = (url, body) => Axios.post(baseUrl + url, body, {
  headers: {
    "Authorization": token
  },
})

export default {
  get: url => {
    if (token) {
      return getWithAuth(url)
    } else {
      return Axios.get(baseUrl + url)
    }
  },
  post: (url, body) => {
    if (token) {
      return postWithAuth(url, body)
    } else {
      return Axios.post(baseUrl + url, body)
    }
  },
  delete: (url) => {
    return Axios.delete(baseUrl + url, {
      headers: {
        "Authorization": token
      }
    })
  },
  setToken: t => token = t
}
