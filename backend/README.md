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
    "AppDataContainerName": "learn-english-data",
    "UserAccountsContainerName": "learn-english-users-accounts"
  },
  "Auth": {
    "JwtSigningKey": "dev-only-change-this-signing-key-to-a-strong-secret",
    "Issuer": "LearnEnglish",
    "Audience": "LearnEnglish.Client",
    "AccessTokenMinutes": 720
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
- `AzureBlob__AppDataContainerName`
- `AzureBlob__UserAccountsContainerName`
- `Auth__JwtSigningKey`
- `Auth__Issuer`
- `Auth__Audience`
- `Auth__AccessTokenMinutes`

## App Data Endpoints

- `POST /api/v1/auth/register`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`
- `POST /api/v1/examples/generate`
- `GET/PUT /api/v1/settings`
- `GET/PUT /api/v1/words`
- `GET/PUT /api/v1/notes`
- `GET/PUT /api/v1/reviews`
