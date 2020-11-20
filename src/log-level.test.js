import {getLogLevel, resetLevel} from "./log-level.js";

describe("Log Level", ()=>{ // eslint-disable-line max-lines-per-function
  before(()=>{
    window.setTimeoutOrig = window.setTimeout;
    window.fetchOrig = window.fetch;
  });

  afterEach(()=>{
    window.setTimeout = window.setTimeoutOrig;
    window.fetch = window.fetchOrig;
    resetLevel();
  });

  it("retrieves log level", ()=>{
    window.fetch = ()=>{
      return Promise.resolve({json(){return {logLevel: "INFO"}}});
    };

    return getLogLevel()
    .then(level=>assert.equal(level, "INFO"));
  });

  it("doesn't fetch when recently retrieved", ()=>{
    let secondAttempt = false;

    window.fetch = ()=>{
      return Promise.resolve({json(){return {logLevel: "INFO"}}});
    };

    return getLogLevel()
    .then(()=>{
      window.fetch = ()=>{
        return Promise.reject(Error("test-error"));
      };

      window.setTimeout = (fn, ms)=>{
        secondAttempt = true;
        return window.setTimeoutOrig(fn, ms / 50);
      };

      return getLogLevel()
    })
    .then(level=>{
      assert.equal(level, "INFO");
      assert.equal(secondAttempt, false);
    });
  });

  it("returns default ERROR level when level cannot be retrieved", ()=>{
    window.setTimeout = (fn, ms)=>window.setTimeoutOrig(fn, ms / 50);

    window.fetch = ()=>{
      return Promise.reject(Error("test-error"));
    };

    return getLogLevel()
    .then(level=>assert.equal(level, "ERROR"));
  });
});
