import {GRANT_URL} from "./config.js";

let refreshDate = 0;
let refreshToken = "";

export const getToken = ()=>{
  if (new Date() - refreshDate < (60 * 60 - 20) * 1000) {
    return Promise.resolve(refreshToken);
  }

  return fetch(GRANT_URL, {method: "POST"})
  .then(resp=>resp.json())
  .then(json=>{
    refreshDate = new Date() || refreshDate;
    return refreshToken = json.access_token || refreshToken;
  })
  .catch(console.error);
};
