import {streamHeartbeatTableEntry, streamEventsTableEntry} from "./bq-helper.js";
import {resetToken} from "./token.js";
import {setEndpointId, getLogLevel} from "./log-level.js";

const heartbeatIntervalMS = 300000;

const initMandatoryFields = [
  "endpointId",
  "endpointType",
  "endpointUrl",
  "scheduleId"
];

const infoMandatoryFields = [
  "eventApp",
  "eventDetails"
];

const heartbeatMandatoryFields = [
  "eventApp"
];

const gcsFileRequestParameters = [
  "endpointId",
  "endpointType",
  "scheduleId"
];

const initFieldsError = `Expected init parameters ${initMandatoryFields}`;
const heartbeatFieldsError = `Expected heartbeat parameters ${heartbeatMandatoryFields}`;
const infoFieldsError = `Expected info parameters ${infoMandatoryFields}`;

export const init = (initConfig = {})=>{
  if (!initMandatoryFields.every(field=>typeof initConfig[field] !== "undefined")) {
    throw Error(initFieldsError);
  }

  resetToken();
  setEndpointId(initConfig.endpointId);

  return {
    getHeartbeatIntervalMS() {
      return heartbeatIntervalMS;
    },
    uptimeHeartbeat(config = {}) {
      if (!heartbeatMandatoryFields.every(field=>typeof config[field] !== "undefined")) {
        return Promise.reject(Error(heartbeatFieldsError));
      }

      return streamHeartbeatTableEntry({
        ...config,
        endpointId: initConfig.endpointId,
        scheduleId: initConfig.scheduleId
      });
    },
    info(config = {}) {
      if (!infoMandatoryFields.every(field=>typeof config[field] !== "undefined")) {
        return Promise.reject(Error(infoFieldsError));
      }

      return getLogLevel()
      .then(level=>level === "INFO" ?
        streamEventsTableEntry({...config, ...initConfig}) :
        Promise.resolve())
      .catch(console.error);
    },
    getRiseFileRequestParameters() {
      return gcsFileRequestParameters;
    }
  };
};
