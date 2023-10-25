import endpoints from "./endpoints.json";
import APIManager from "../api.service";
import { AxiosResponse, CancelToken } from "axios";
/**
 * @typedef Response
 * @property {number} id
 * @property {string} name
 * @property {string} unique_id
 * @property {number} parent
 * @property {number} create_time
 * @property {number} modified_time
 * @property {string} unit
 * @property {string} period
 * @property {number} is_active
 * @property {number} is_deleted
 */

/**
 * @param {CancelToken} cancelToken
 * @returns {Promise<Response[]>}
 */
export async function getMenuItem(cancelToken) {
  const response = await APIManager.get(
    endpoints.routes,
    { action: "get_menu" },
    cancelToken
  );
  const data = response.data.filter((item) => {
    const grandChildren = findDescendants(item.id, response.data);
    if (grandChildren.length === 0) return String(item.is_active) === "1";
    return grandChildren.some((i) => {
      return String(i.is_active) === "1"
    });
  });
  return data.sort((a, b) => Number(a.sort) - Number(b.sort));
}
export async function getAccessItem(cancelToken) {
  const response = await APIManager.post(
    endpoints.routesAccess,
    { action: "get_by_username" },
    cancelToken
  );
  try {
    const access = response.data.access.map(Number).concat(["0"]);
    const expire = Number(response.data.expireTime);
    return {
      access,
      expire,
    };
  } catch (error) {
    return {
      access: [],
      expire: 0,
    };
    console.error(error);
    console.error(response);
  }
}

function findDescendants(id, routes, processedNodes = {}) {
  const descendants = [];
  for (const route of routes) {
    if (
      String(route.parent) === String(id) &&
      !processedNodes[route.id]
    ) {
      descendants.push(route);
      processedNodes[route.id] = true;
      descendants.push(...findDescendants(route.id, routes, processedNodes));
    }
  }
  return descendants;
}

// function findDescendants(id, routes) {
//   const descendants = [];
//   for (const route of routes) {
//     if (route.parent.toString() === id.toString()) {
//       descendants.push(route);
//       descendants.push(...findDescendants(route.id, routes));
//     }
//   }
//   return descendants;
// }
