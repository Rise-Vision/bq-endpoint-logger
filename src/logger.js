import {streamHeartbeatTableEntry} from "./bq-helper.js";

const heartbeatIntervalMS = 300000;

const heartbeatFields = [
  "endpointId",
  "scheduleId",
  "presentationId",
  "placeholderId",
  "componentId",
  "scheduleItemUrl",
  "eventApp",
];

const heartbeatFieldsError = `Expected heartbeat parameters ${heartbeatFields}`;

export const uptimeHeartbeat = (config = {})=>{
  if (!heartbeatFields.every(field=>typeof config[field] !== "undefined")) {
    return Promise.reject(Error(heartbeatFieldsError));
  }

  return streamHeartbeatTableEntry(config);
};

export const getHeartbeatIntervalMS = ()=>{
  return heartbeatIntervalMS;
}
