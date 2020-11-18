import {uptimeHeartbeat} from "./logger.js";
import {resetToken} from "./token.js";

describe("Logger Heartbeats (integration)", ()=>{
  it("streams to heartbeat table", ()=>{
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

    resetToken();
    // library client would call heartbeat as a setInterval argument
    return uptimeHeartbeat(config)
    .then(json=>assert.equal(json.kind, "bigquery#tableDataInsertAllResponse"));
  });
});
