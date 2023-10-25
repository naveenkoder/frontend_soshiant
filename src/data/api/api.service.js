import axios from "axios";
import endpoints from "../../config.json";

export const APIManager = {
  get(endpoint, params, cancelToken) {
    let loginInfo = "";
    let token = "";
    try {
      loginInfo = JSON.parse(localStorage.login);
      token = `${loginInfo.username}:${loginInfo.password}`;
    } catch (error) {}
    
    const api = axios.create({
      baseURL: endpoints.baseURL,
      timeout: 5000,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authentication: token,
      },
    });
    return api.get(endpoint, { params, cancelToken });
  },
  post(endpoint, data, cancelToken) {
    let loginInfo = "";
    let token = "";
    try {
      loginInfo = JSON.parse(localStorage.login);
      token = `${loginInfo.username}:${loginInfo.password}`;
    } catch (error) {}

    const api = axios.create({
      baseURL: endpoints.baseURL,
      timeout: 5000,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authentication: token,
      },
    });
    return api.post(endpoint, data, { cancelToken });
  },
  put(endpoint, data, cancelToken) {
    let loginInfo = "";
    let token = "";
    try {
      loginInfo = JSON.parse(localStorage.login);
      token = `${loginInfo.username}:${loginInfo.password}`;
    } catch (error) {}

    const api = axios.create({
      baseURL: endpoints.baseURL,
      timeout: 5000,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authentication: token,
      },
    });
    return api.put(endpoint, data, { cancelToken });
  },
  delete(endpoint, data, cancelToken) {
    let loginInfo = "";
    let token = "";
    try {
      loginInfo = JSON.parse(localStorage.login);
      token = `${loginInfo.username}:${loginInfo.password}`;
    } catch (error) {}

    const api = axios.create({
      baseURL: endpoints.baseURL,
      timeout: 5000,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authentication: token,
      },
    });
    return api.delete(endpoint, { data, cancelToken });
  },
};

export default APIManager;
