import {retry} from "./retry-fn.js";

let refreshDate = localStorage.getItem("bq-endpoint-logger-fetchdate");
let levelCache = localStorage.getItem("bq-endpoint-logger-level");
let serviceUrl = null;

const GCS_SERVICE_URL = "https://storage.googleapis.com/storage/v1/b/risevision-endpoint-loglevels/o/ENDPOINT_ID.json?alt=media";

const THROTTLE_MAX_5_MIN = 300000;

const recentlyFetched = ()=>new Date() - (refreshDate || 0) < THROTTLE_MAX_5_MIN;

export const setEndpointId = id=>{
  serviceUrl = GCS_SERVICE_URL.replace("ENDPOINT_ID", id);
};

let levelPromise = null;

export const getLogLevel = ()=>{
  if (levelPromise) {return levelPromise;}
  if (levelCache && recentlyFetched()) {return Promise.resolve(levelCache);}

  return levelPromise = levelPromise || retry(()=>fetch(serviceUrl))
  .then(resp=>{
    refreshDate = new Date();
    localStorage.setItem("bq-endpoint-logger-fetchdate", refreshDate);

    if (resp.status === 404) {
      return {logLevel: "ERROR"};
    }

    return resp.json();
  })
  .then(json=>{
    const level = json.logLevel || "ERROR";
    localStorage.setItem("bq-endpoint-logger-level", level);
    return level;
  })
  .catch(err=>{
    console.error(err);
    return levelCache || "ERROR";
  });
};

export const reset = ()=>{
  levelPromise = null;
  levelCache = null;
}
