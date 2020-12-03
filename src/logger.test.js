import {init} from "./logger.js";
import {reset} from "./log-level.js";

describe("Logger", ()=>{ // eslint-disable-line max-lines-per-function
  const initConfig = {
    "endpointId": "test-endpoint-id",
    "endpointType": "test-endpoint-type",
    "endpointUrl": "test-endpoint-url",
    "scheduleId": "test-schedule-id"
  };

  beforeEach(reset);

  describe("Init", ()=>{
    it("requires endpointId", ()=>{
      assert.throws(()=>init({}), /endpointId/)
    });
  });

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

  describe("Logger INFO", ()=>{ // eslint-disable-line max-lines-per-function
    it("includes endpointId from init fields", ()=>{
      let fetchedUrls = [];
      let loggedData = {};

      window.fetch = (url, data)=>{
        fetchedUrls.push(url);
        loggedData = data;
        return Promise.resolve({json(){return {logLevel: "INFO"}}});
      };

      const logger = init(initConfig);
      return logger.info({
        eventApp: "test-event-app",
        eventDetails: "test-event-details"
      })
      .then(()=>assert(fetchedUrls.some(url=>url.includes("eventLog/insertAll"))))
      .then(()=>assert(loggedData.body.includes("test-endpoint-id")));
    });

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
      .then(()=>assert(!fetchedUrls.some(url=>url.includes("eventLog/insertAll"))));
    });

    it("logs INFO level when loglevel is INFO", ()=>{
      let fetchedUrls = [];

      window.fetch = url=>{
        fetchedUrls.push(url);
        return Promise.resolve({json(){return {logLevel: "INFO"}}});
      };

      const logger = init(initConfig);
      return logger.info({
        eventApp: "test-event-app",
        eventDetails: "test-event-details"
      })
      .then(()=>assert(fetchedUrls.some(url=>url.includes("eventLog/insertAll"))));
    });

    it("logs INFO level when loglevel is DEBUG", ()=>{
      let fetchedUrls = [];

      window.fetch = url=>{
        fetchedUrls.push(url);
        return Promise.resolve({json(){return {logLevel: "DEBUG"}}});
      };

      const logger = init(initConfig);
      return logger.info({
        eventApp: "test-event-app",
        eventDetails: "test-event-details"
      })
      .then(()=>assert(fetchedUrls.some(url=>url.includes("eventLog/insertAll"))));
    });
  });

  describe("Logger ERROR", ()=>{ // eslint-disable-line max-lines-per-function
    it("logs with default log level", ()=>{
      let fetchedUrls = [];

      window.fetch = url=>{
        fetchedUrls.push(url);
        return Promise.resolve({json(){return {}}});
      };

      const logger = init(initConfig);
      return logger.error({
        eventApp: "test-event-app",
        eventErrorCode: "test-error-code"
      })
      .then(()=>assert(fetchedUrls.some(url=>url.includes("eventLog/insertAll"))));
    })
  });
});
