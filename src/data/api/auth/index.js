import APIManager from "../api.service";
import endpoints from "./endpoints.json";
/**
 * @param {number} routeId
 * @param {CancelToken} cancelToken
 * @returns {Promise<AxiosResponse<string | false, any>>}
 */
export async function loginRequest(username, password, cancelToken) {
  const response = await APIManager.post(
    endpoints.authentication,
    {
      action: "get_token",
      username,
      password,
    },
    cancelToken
  );

  if (response.status === 200) {
    setLocalToken(username, response.data.token, true);
    return response.data.token;
  } else {
    return false;
  }
}
/**
 * @param {number} routeId
 * @param {CancelToken} cancelToken
 * @returns {Promise<AxiosResponse<boolean, any>>}
 */
export async function checkTokenRequest(token, username, cancelToken) {
  const response = await APIManager.post(
    endpoints.authentication,
    {
      action: "check_token",
      token,
      username,
    },
    cancelToken
  );

  return response.status === 200;
}

/**
 *
 * @returns {{"status":boolean,"username":string,"password":string}}
 */
export function getLocalToken() {
  try {
    const loginData = JSON.parse(localStorage.login);
    const now = Date.now();
    const expireLimit = (loginData.loginTime || 0) + 43200 * 1000; // milliseconds 12 hours
    // const expireLimit = (loginData.loginTime || 0) + 43200 * 1; // milliseconds 12 hours
    if (expireLimit < now) throw new Error("expire");
    return loginData;
  } catch (_) {
    console.log("token expired: " + _);
    return {
      status: false,
      username: "",
      password: "",
      loginTime: 0,
    };
  }
}
export function setLocalToken(username, password, status) {
  try {
    localStorage.login = JSON.stringify({
      username,
      password,
      status,
      loginTime: Date.now(),
    });
    return true;
  } catch (_) {
    return false;
  }
}

export function removeToken() {
  setLocalToken("", "", false);
}
