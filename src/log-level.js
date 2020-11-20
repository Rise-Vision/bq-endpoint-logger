import {retry} from "./retry-fn.js";

let refreshDate = localStorage.getItem("bq-endpoint-logger-fetchdate");
let level = localStorage.getItem("bq-endpoint-logger-level");
let serviceUrl = null;

const GCS_SERVICE_URL = "https://storage.googleapis.com/storage/v1/b/risevision-endpoint-loglevels/o/ENDPOINT_ID.json?alt=media";

const THROTTLE_MAX_5_MIN = 300000;

const recentlyFetched = ()=>new Date() - (refreshDate || 0) < THROTTLE_MAX_5_MIN;

export const setEndpointId = id=>{
  serviceUrl = GCS_SERVICE_URL.replace("ENDPOINT_ID", id);
};

export const getLogLevel = ()=>{
  if (level && recentlyFetched()) {return Promise.resolve(level);}

  return retry(()=>fetch(serviceUrl))
  .then(resp=>{
    refreshDate = new Date();
    return resp.json();
  })
  .then(json=>{
    level = json.logLevel || "ERROR";
    localStorage.setItem("bq-endpoint-logger-level", level);
    localStorage.setItem("bq-endpoint-logger-fetchdate", refreshDate);
    return level;
  })
  .catch(err=>{
    console.error(err);
    return Promise.resolve(level || "ERROR");
  });
};

export const resetLevel = ()=>{
  level = null;
}
