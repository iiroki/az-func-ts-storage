# Azure Functions Time Series Storage

**_Azure Functions Time Series Storage_** (`az-func-ts-stroage`) is a simple time series data storage
implemented with Node.js, Azure Functions and Azure storage account (Blob Storage, Queue Storage).

Main features of **_Azure Functions Time Series Storage_** include:
- Data type definitions with schema validation
    - (TODO) HTTP API for modifying data types
- Data ingestion with Azure Queue Storage or HTTP API
- HTTP API for querying data, tags and configurations (data types)
- Hierarchical Azure Blob Storage directory structure
- Data blobs use gzip to save storage space.

A detailed description of the features can be found under [Features](#features).

**Content of this README:**
- [Quickstart](#quickstart)
- [Features](#features)
- [Configuration](#configuration)

## Quickstart

1. Create Azure storage account for Blob and Queue Storage.
    - [Create Azure Storage account](https://learn.microsoft.com/en-us/azure/storage/common/storage-account-create)
    - Use [Azurite](https://hub.docker.com/_/microsoft-azure-storage-azurite) to emulate Azure storage account.
2. Fill the configuration to `local.settings.json` (create if needed) in the project root.
    - See [Configuration](#configuration) for the required variables.
3. Install npm packages: `npm i`
4. Start the application: `npm start`

## Features

### Data Types

- Data types can be defined with JSON files.
    - The JSON files of data type definitions are stored in another container in the same Storage account as data.
    - See [Data Type Configuration](#data-type-configuration) for the schema.
- Data type definitions are used in the following:
    - Schemas are used to validate the incoming data and parse the data during reading.
    - Whether the data should be stored per tag (easier to query data from a specific tag).
    - Define the timestamp precision used in data blob paths (= divide data to blobs per day or per hour).

### Data Ingestion

TODO

#### Data Ingestion JSON Format

The same format is used by both Queue Storage and HTTP API data ingestion:

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

**NOTE**  
The tuples inside `data` must respect the data type schema definition, otherwise a validation error is raised!

### HTTP

#### Data API

- TODO: Query data types

#### Tag API

TODO

#### Ingestion API

TODO

## Configuration

Use `local.settings.json` to define the configuration.

| Key | Description | Required | Default |
| ----- | ----- | :-----: | ----- |
| `STORAGE_CONNECTION` | Storage account connection string | &check; | - |
| `STORAGE_DATA_CONTAINER` | Blob Storage data container name | - | `data` |
| `STORAGE_CONFIGURATION_CONTAINER` | Blob Storage configuration container name | - | `configuration` |
| `STORAGE_INGESTION_QUEUE` | Queue Storage ingestion queue name | - | `ingestion` |

A well-known connection string that can be used when emulating Azure Storage account with Azurite:
```
DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;QueueEndpoint=http://127.0.0.1:10001/devstoreaccount1;TableEndpoint=http://127.0.0.1:10002/devstoreaccount1;
```

### Data Type Configuration

| Key | Description | Required | Default |
| ----- | ----- | :-----: | ----- |
| `useTags` | Whether to separate data per tag. | - | `false` |
| `blobPathTimestamp` | Blob Storage path timestamp precision, either `day` or `hour`. | - | `day` |
| `schema` | Data type schema definition, see below. | &check; | - |
| `schema.key` | Key of the value | &check; | - |
| `schema.type` | Type of the value (`int`, `float`, `string` or `timestamp`) | &check; | - |
| `schema.isTimestamp`* | Timestamp of the value | - | `false` |
| `schema.isRequired` | Is the value required | - | `true` |

**\*** = Used to define the data blob to which the incoming value should be stored.
There can only be one value marked as the timestamp and its type must be `timestamp`.

For example, a data type named `Example` can be defined with `Example.json`:
```json
{
    "useTags": true,
    "blobPathTimestamp": "hour",
    "schema": [
        { "key": "ts", "type": "timestamp", "isTimestamp": true },
        { "key": "value", "type": "number", "isRequired": true },
        { "key": "data", "type": "string", "isRequired": false }
    ]
}
```

Data type configuration version is stored as blob metadata. (TODO)
