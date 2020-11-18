import {streamEventsTableEntry, streamHeartbeatTableEntry} from "./bq-helper.js";

describe("BQ Helper", ()=>{ // eslint-disable-line max-lines-per-function
  before(()=>{
    window.setTimeoutOrig = window.setTimeout;
    window.console.errorOrig = window.console.error;
  });

  afterEach(()=>{
    window.setTimeout = window.setTimeoutOrig;
    window.console.error = window.console.errorOrig;
  });

  it("requests token and streams to bigquery", ()=>{
    const access_token = "abc123";

    let fetchedUrls = [];
    let fetchedUsingtoken = "";

    window.fetch = (url, config = {})=>{
      fetchedUrls.push(url);
      fetchedUsingtoken = config.headers && config.headers.Authorization.split(" ")[1];
      return Promise.resolve({json(){return {access_token}}});
    };

    return streamEventsTableEntry({})
    .then(()=>{
      assert(fetchedUrls.some(url=>url.includes("grant_type=refresh_token")));
      assert(fetchedUrls.some(url=>url.includes("/insertAll")));
      assert.equal(fetchedUsingtoken, access_token);
    });
  });

  it("retries but doesn't catch final error", ()=>{
    let errors = [];
    window.console.error = msg=>{
      errors.push(msg);
      window.console.errorOrig(msg);
    };

    window.setTimeout = (fn, ms)=>{
      return window.setTimeoutOrig(fn, ms / 50);
    };

    const mockErrorMessage = "test-error";
    window.fetch = ()=>Promise.reject(Error(mockErrorMessage));

    return streamHeartbeatTableEntry({})
    .then(()=>Promise.reject(Error("helper should have rejected")))
    .catch(err=>assert.equal(err.message, mockErrorMessage))
    .then(()=>assert(errors.some(msg=>msg.includes("retries remaining"))));
  });
});
