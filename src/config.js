const SERVICE_URL = "https://www.googleapis.com/bigquery/v2/projects/endpoint-event-logs/datasets/DATASET_ID/tables/TABLE_ID/insertAll";

export const EVENTS_SERVICE_URL = SERVICE_URL.replace("DATASET_ID", "logs").replace("TABLE_ID", "eventLog");

export const HEARTBEAT_SERVICE_URL = SERVICE_URL.replace("DATASET_ID", "heartbeats").replace("TABLE_ID", "uptimeHeartbeats");

export const GRANT_URL = atob("aHR0cHM6Ly93d3cuZ29vZ2xlYXBpcy5jb20vb2F1dGgyL3YzL3Rva2VuP2NsaWVudF9pZD0xMDg4NTI3MTQ3MTA5LTZxMW8ydnRpaG4zNDI5MnBqdDRja2htaGNrMHJrMG83LmFwcHMuZ29vZ2xldXNlcmNvbnRlbnQuY29tJmNsaWVudF9zZWNyZXQ9bmxaeXJjUExnNm9Fd085ZjlXZm4yOVdoJnJlZnJlc2hfdG9rZW49MS94enQ0a3d6RTFIN1c5Vm5LQjhjQWFDeDZ6YjRFczRuS0VvcWFZSGRURDE1SWdPckpEdGR1bjZ6SzZYaUFUQ0tUJmdyYW50X3R5cGU9cmVmcmVzaF90b2tlbg==");

export const INSERT_SCHEMA = {
  kind: "bigquery#tableDataInsertAllRequest",
  skipInvalidRows: false,
  ignoreUnknownValues: false,
  rows: [{
    insertId: "",
    json: {},
  }],
};

export const EVENTS_SCHEMA = {
  event: "",
  display_id: "",
  viewer_version: "",
  event_details: "",
  ts: 0
};
