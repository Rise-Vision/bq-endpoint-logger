import {streamHeartbeatTableEntry, streamEventsTableEntry} from "./bq-helper.js";
import {resetToken} from "./token.js";
import {setEndpointId, getLogLevel} from "./log-level.js";

const heartbeatIntervalMS = 300000;

const levels = [
  "DEBUG", "INFO", "WARNING", "ERROR"
];

const mandatoryFields = {
  "INIT": [
    "endpointId",
    "endpointType",
    "endpointUrl",
    "scheduleId"
  ],
  "DEBUG": [
    "eventApp", "eventDetails"
  ],
  "INFO": [
    "eventApp", "eventDetails"
  ],
  "WARNING": [
    "eventApp", "eventDetails"
  ],
  "ERROR": [
    "eventApp", "eventErrorCode"
  ],
  "IMPORTANT": [
    "eventApp", "eventDetails"
  ],
  "HEARTBEAT": [
    "eventApp"
  ]
};

const gcsFileRequestParameters = [
  "endpointId",
  "endpointType",
  "scheduleId"
];

const fieldsError = type=>{
  return `Expected ${type} parameters ${mandatoryFields[type]}`;
}

const recordLogType = (type = "INFO", config)=>{
  if (!mandatoryFields[type].every(field=>typeof config[field] !== "undefined")) {
    return Promise.reject(Error(fieldsError(type)));
  }

  return getLogLevel()
    .then(level=>type === "IMPORTANT" || levels.indexOf(type) >= levels.indexOf(level) ?
      streamEventsTableEntry(config) :
      Promise.resolve())
    .catch(console.error);
}

export const init = (initConfig = {})=>{
  if (!mandatoryFields.INIT.every(field=>typeof initConfig[field] !== "undefined")) {
    throw Error(fieldsError("INIT"));
  }

  resetToken();
  setEndpointId(initConfig.endpointId);

  return {
    getHeartbeatIntervalMS() {
      return heartbeatIntervalMS;
    },
    uptimeHeartbeat(config = {}) {
      if (!mandatoryFields.HEARTBEAT.every(field=>typeof config[field] !== "undefined")) {
        return Promise.reject(Error(fieldsError("HEARTBEAT")));
      }

      return streamHeartbeatTableEntry({
        ...config,
        endpointId: initConfig.endpointId,
        scheduleId: initConfig.scheduleId
      });
    },
    info(config = {}) {
      return recordLogType("INFO", {...config, ...initConfig});
    },
    error(config = {}) {
      return recordLogType("ERROR", {...config, ...initConfig});
    },
    warning(config = {}) {
      return recordLogType("WARNING", {...config, ...initConfig});
    },
    debug(config = {}) {
      return recordLogType("DEBUG", {...config, ...initConfig});
    },
    important(config = {}) {
      return recordLogType("IMPORTANT", {...config, ...initConfig});
    },
    getRiseFileRequestParameters() {
      return gcsFileRequestParameters;
    }
  };
};
