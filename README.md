## BQ Endpoint Logger

This library is meant to be used to standardize logging across all endpoints. It
should facilitate a consistent table schema, uptime semantics, and cost analysis
via standardized fields for GCS request.

### Development

#### Test

```
npm test
```

#### E2E

Start a local webserver, load e2e.html?componentId=[random#] from localhost, confirm record in events table contains correct componentId

This can be automated if we decide to set up an e2e monitoring job.
