# Azure Functions Time Series Storage

**_Azure Functions Time Series Storage_** is a time series data storage implemented Node.js, Azure Functions and Azure storage account (Blob Storage, Queue Storage).

**_Azure Functions Time Series Storage_** enables storing time series data of multiple types and querying it with HTTP API using 

## Quickstart

TODO

## Features

### Data Types

- Data types can be defined with JSON files (see [Data types](#data-types)).
- Data type definitions are used in the following:
    - Schemas are used to validate the incoming data.
    - Schemas are used to parse data from the storage.

### Data Ingestion

- Data can be ingested with the following ways:
    - Queue Storage
- The incoming data is stored as gzipped CSV files in Blob Storage.
- The stored blobs use a hierarchical namespace:
    - `type=<dataType>`
    - `tag=<tag>` (OPTIONAL)
    - `year=<year>`
    - `month=<month>`
    - `day=<day>`
    - `hour=<hour>` (OPTIONAL)
    - `minute=<minute>` (OPTIONAL)
    - Example: `type=TestType/tag=TestTag/year=2023/month=7/day=25/hour=15/minute=19/data.csv.gz`

### HTTP API

#### Query Data

- TODO: Query data types
- TODO: Query data (with filters)

#### Manage Data Types

TODO

## Ingestion

### Queue Trigger

```json
{
    "type": "TestType",
    "tag": "TestTag",
    "data": [
        ["2023-07-25T15:15:19.123Z", 123, "first"],
        ["2023-07-25T15:21:20.321Z", 321, "second"]
    ]
}
```

## Configuration

### Environment Variables

| Key | Description | Required | Default |
| ----- | ----- | :-----: | ----- |
| `STORAGE_CONNECTION` | Storage account connection string | &check; | - |
| `STORAGE_DATA_CONTAINER` | Blob Storage data container name | - | `data` |
| `STORAGE_CONFIGURATION_CONTAINER` | Blob Storage configuration container name | - | `configuration` |
| `STORAGE_INGESTION_QUEUE` | Queue Storage ingestion queue name | - | `ingestion` |

### Data Types

Data type configurations are stored in a separate Blob Storage container from the actual time series data.

```json
{
    "useTags": true,
    "timestampPrecision": "minute",
    "dataFileName": "data",
    "schema": [
        { "key": "ts", "type": "timestamp", "isTimestamp": true },
        { "key": "value", "type": "number", "isRequired": true },
        { "key": "data", "type": "string", "isRequired": false }
    ]
}
```

Data type configuration version is stored as blob metadata.
