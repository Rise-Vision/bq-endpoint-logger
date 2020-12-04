import {GRANT_URL} from "./config.js";
import {retry} from "./retry-fn.js";

let refreshDate = 0;
let tokenPromise = null;

export const getToken = ()=>{
  if (new Date() - refreshDate > (60 * 60 - 20) * 1000) {
    tokenPromise = null;
  }

  return tokenPromise = tokenPromise ||
  retry(()=>fetch(GRANT_URL, {method: "POST"}))
  .then(resp=>resp.json())
  .then(json=>{
    refreshDate = new Date() || refreshDate;
    return json.access_token;
  })
  .catch(console.error);
};

export const resetToken = ()=>{refreshDate = 0};
