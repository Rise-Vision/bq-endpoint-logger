import {retry} from "./retry-fn.js";

let refreshDate = localStorage.getItem("bq-endpoint-logger-fetchdate");
let levelCache = localStorage.getItem("bq-endpoint-logger-level");
let serviceUrl = null;

const GCS_SERVICE_URL = "https://storage.googleapis.com/storage/v1/b/risevision-endpoint-loglevels/o/ENDPOINT_ID.json?alt=media";

const THROTTLE_MAX_5_MIN = 300000;

// if level does not exist (most common case) gcs 404s with "No such object"
const LOGLEVEL_NOT_PRESENT = "Loglevel file not present";

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

    if (resp.status === 404) {
      return Promise.reject(Error(LOGLEVEL_NOT_PRESENT));
    }

    return resp.json();
  })
  .then(json=>{
    const level = json.logLevel || "ERROR";
    localStorage.setItem("bq-endpoint-logger-level", level);
    localStorage.setItem("bq-endpoint-logger-fetchdate", refreshDate);
    return level;
  })
  .catch(err=>{
    const level = levelCache || "ERROR";

    if (err.message !== LOGLEVEL_NOT_PRESENT) {
      console.error(err);
    }

    return level;
  });
};

export const reset = ()=>{
  levelPromise = null;
  levelCache = null;
}
