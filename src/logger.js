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
    "eventApp",
    "eventAppVersion"
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
  if (typeof config !== "object") {return Promise.reject(Error(fieldsError(type)))}

  if (!mandatoryFields[type].every(field=>config[field])) {
    return Promise.reject(Error(fieldsError(type)));
  }

  return getLogLevel()
    .then(level=>type === "IMPORTANT" || levels.indexOf(type) >= levels.indexOf(level) ?
      streamEventsTableEntry({eventSeverity: type, ...config}) :
      Promise.resolve());
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
      if (typeof config !== "object") {return Promise.reject(Error(fieldsError("HEARTBEAT")))}

      if (!mandatoryFields.HEARTBEAT.every(field=>config[field])) {
        return Promise.reject(Error(fieldsError("HEARTBEAT")));
      }

      return streamHeartbeatTableEntry({
        endpointId: initConfig.endpointId,
        endpointType: initConfig.endpointType,
        scheduleId: initConfig.scheduleId,
        ...config
      });
    },
    info(config = {}) {
      return recordLogType("INFO", {...initConfig, ...config});
    },
    error(config = {}) {
      return recordLogType("ERROR", {...initConfig, ...config});
    },
    warning(config = {}) {
      return recordLogType("WARNING", {...initConfig, ...config});
    },
    debug(config = {}) {
      return recordLogType("DEBUG", {...initConfig, ...config});
    },
    important(config = {}) {
      return recordLogType("IMPORTANT", {...initConfig, ...config});
    },
    getRiseFileRequestParameters() {
      return gcsFileRequestParameters;
    }
  };
};
