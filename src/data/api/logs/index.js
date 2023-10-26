import endpoints from "./endpoints.json";
import APIManager from "../api.service";
import { AxiosResponse, CancelToken } from "axios";

/**
 * @typedef Response
 * @property {string} unique_id
 * @property {string} time
 * @property {string} route
 * @property {number} user_id
 * @property {string} period
 */

/**
* @param {CancelToken} cancelToken
* @returns {Promise<Response[]>}
*/


export async function saveClientLogs({ unique_id,time,route,username,period }, cancelToken) {
  const response = await APIManager.post(
    endpoints.logs,
    { 
      action: "save_client_logs",
      unique_id,
      time,
      route,
      username,
      period
    },
    cancelToken      
  );
  try 
  {
    console.log('responce', response)
  } catch (error) {      
    console.error(error);
  }
}