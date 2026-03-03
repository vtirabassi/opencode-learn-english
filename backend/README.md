# Learn English Backend

Target framework: `.NET 8` (`net8.0`) with Azure Functions (isolated worker).

## Projects

- `src/LearnEnglish.Functions` - Azure Functions HTTP entrypoints
- `src/LearnEnglish.Application` - business use cases and validation
- `src/LearnEnglish.Domain` - core domain models
- `src/LearnEnglish.Infrastructure` - OpenAI and Blob integration

## Run

```bash
cd backend/src/LearnEnglish.Functions
dotnet run
```

Local Functions HTTP base URL is typically `http://localhost:7071`.

## Configuration

For local development, set values in `src/LearnEnglish.Functions/appsettings.Development.json`:

```json
{
  "AzureBlob": {
    "ConnectionString": "UseDevelopmentStorage=true",
    "ContainerName": "learn-english-dev"
  },
  "AppData": {
    "DefaultUserId": "default-user"
  },
  "OpenAI": {
    "ApiKey": "your_key_here"
  }
}
```

For Azure, configure App Settings with `__` separators, for example:
- `OpenAI__ApiKey`
- `OpenAI__Model`
- `AzureBlob__ConnectionString`
- `AzureBlob__ContainerName`
- `AppData__DefaultUserId`

## App Data Endpoints

- `POST /api/v1/examples/generate`
- `GET/PUT /api/v1/settings`
- `GET/PUT /api/v1/words`
- `GET/PUT /api/v1/notes`
- `GET/PUT /api/v1/reviews`
