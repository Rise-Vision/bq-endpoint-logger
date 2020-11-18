import {uptimeHeartbeat} from "./logger.js";

describe("Logger Heartbeats", ()=>{ // eslint-disable-line max-lines-per-function
  before(()=>{
    window.setTimeoutOrig = window.setTimeout;
    window.console.errorOrig = window.console.error;
    window.fetchOrig = window.fetch;
  });

  afterEach(()=>{
    window.setTimeout = window.setTimeoutOrig;
    window.console.error = window.console.errorOrig;
    window.fetch = window.fetchOrig;
  });

  it("streams to heartbeat table", ()=>{
    let fetchedUrls = [];
    let fetchedBodies = [];

    window.fetch = (url, config = {})=>{
      fetchedUrls.push(url);
      fetchedBodies.push(config.body);
      return Promise.resolve({json(){return {}}});
    };

    const testFieldValue = "test-field-val";
    const config = {
      "endpointId": testFieldValue,
      "scheduleId": testFieldValue,
      "presentationId": testFieldValue,
      "placeholderId": testFieldValue,
      "componentId": testFieldValue,
      "scheduleItemUrl": testFieldValue,
      "eventApp": testFieldValue
    };

    // library client would call heartbeat as a setInterval argument
    return uptimeHeartbeat(config)
    .then(()=>{
      assert(fetchedUrls.some(url=>url.includes("/insertAll")));
      assert(fetchedBodies.some(body=>body.includes(testFieldValue)));
    });
  });
});
