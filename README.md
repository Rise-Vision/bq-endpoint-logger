# BQ Endpoint Logger

This library is meant to be used to standardize logging across all [endpoints]. It
should facilitate a consistent table schema, uptime semantics, and cost analysis
via standardized fields for GCS request.

## Usage

### Common JS library

```
npm install https://github.com/Rise-Vision/bq-endpoint-logger.git
```

This will install locally and generate an es5 compabtible build via `prepare`
run script.

Then use Browserify / Webpack bundling to resolve the `require` calls.

### HTML Import

```
import {init} from [source]
```

Source could be local or a deployed web source (not currently deployed).

## Development

### Test

```
npm test
```

### E2E

Run the build, then start a local webserver and load e2e.html?componentId=[random#] from localhost to verify fields in events table and heartbeat table.

This can be automated if we decide to set up an e2e monitoring job.

[endpoints]: https://docs.google.com/document/d/1HVifXE3h-O-HkzvDEdmMV6adtU0nD4BxGXFMokl9J74/edit#heading=h.dj6j05799f24
