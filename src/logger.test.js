import {init} from "./logger.js";
import {reset} from "./log-level.js";

describe("Logger", ()=>{ // eslint-disable-line max-lines-per-function
  const initConfig = {
    "endpointId": "test-endpoint-id",
    "endpointType": "test-endpoint-type",
    "endpointUrl": "test-endpoint-url",
    "scheduleId": "test-schedule-id"
  };

  describe("Logger Heartbeats (integration)", ()=>{
    before(()=>{
      window.setTimeoutOrig = window.setTimeout;
      window.fetchOrig = window.fetch;
    });

    afterEach(()=>{
      window.setTimeout = window.setTimeoutOrig;
      window.fetch = window.fetchOrig;
    });

    it("streams to heartbeat table", ()=>{
      window.setTimeout = (fn, ms)=>{
        return window.setTimeoutOrig(fn, ms / 50);
      };

      const logger = init(initConfig);
      // library client would call heartbeat as a setInterval argument
      return logger.uptimeHeartbeat({eventApp: "test-event-app"})
      .then(json=>assert.equal(json.kind, "bigquery#tableDataInsertAllResponse"));
    });
  });

  describe("Logger INFO", ()=>{
    it("doesn't log INFO level by default", ()=>{
      let fetchedUrls = [];

      window.fetch = url=>{
        fetchedUrls.push(url);
        return Promise.resolve({json(){return {}}});
      };

      const logger = init(initConfig);
      return logger.info({
        eventApp: "test-event-app",
        eventDetails: "test-event-details"
      })
      .then(assert(!fetchedUrls.some(url=>url.includes("bigquery"))));
    })

    it("logs INFO level when loglevel is INFO", ()=>{
      let fetchedUrls = [];

      window.fetch = url=>{
        fetchedUrls.push(url);
        return Promise.resolve({json(){return {logLevel: "INFO"}}});
      };

      const logger = init(initConfig);
      reset();
      return logger.info({
        eventApp: "test-event-app",
        eventDetails: "test-event-details"
      })
      .then(()=>assert(fetchedUrls.some(url=>url.includes("eventLog/insertAll"))));
    });
  });
});
