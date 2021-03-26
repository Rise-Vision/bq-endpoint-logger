import {EVENTS_SERVICE_URL, HEARTBEAT_SERVICE_URL, INSERT_SCHEMA} from "./config.js";

import {getToken} from "./token.js";
import {retry} from "./retry-fn.js";

const streamTableEntry = (fields = {}, url)=>{
  const insertData = {...INSERT_SCHEMA};
  fields.timestamp = "AUTO";
  insertData.rows[0].json = fields;

  const body = JSON.stringify(insertData);

  return getToken().then(token=>retry(()=>fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body
  })))
  .then(resp=>resp.json())
  .then(json=>json.error ?
    Promise.reject(Error(json.error.message)) :
    json.insertErrors && json.insertErrors[0] ?
    Promise.reject(Error(JSON.stringify(json.insertErrors[0].errors[0]))) :
    json)
  .catch(console.error);
};

export const streamEventsTableEntry = fields=>{
  return streamTableEntry(fields, EVENTS_SERVICE_URL);
};

export const streamHeartbeatTableEntry = fields=>{
  return streamTableEntry(fields, HEARTBEAT_SERVICE_URL);
};
