import {EVENTS_SERVICE_URL, HEARTBEAT_SERVICE_URL, INSERT_SCHEMA} from "./config.js";

import {getToken} from "./token.js";
import {retry} from "./retry-fn.js";

const streamTableEntry = (fields = {}, url)=>{
  const insertData = {...INSERT_SCHEMA};
  fields.timestamp = new Date().toISOString();
  insertData.rows[0].json = fields;

  return getToken().then(token=>retry(()=>fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(insertData)
  })));
};

export const streamEventsTableEntry = fields=>{
  return streamTableEntry(fields, EVENTS_SERVICE_URL);
};

export const streamHeartbeatTableEntry = fields=>{
  return streamTableEntry(fields, HEARTBEAT_SERVICE_URL);
};
