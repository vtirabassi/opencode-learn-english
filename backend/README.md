# Learn English Backend

Target framework: `.NET 8` (`net8.0`).

## Projects

- `src/LearnEnglish.Api` - ASP.NET Core API (`/api/v1/examples/generate`)
- `src/LearnEnglish.Application` - business use cases and validation
- `src/LearnEnglish.Domain` - core domain models
- `src/LearnEnglish.Infrastructure` - OpenAI integration

## Run

```bash
cd src/LearnEnglish.Api
dotnet run --urls http://localhost:5050
```

## Configuration

Set OpenAI key in `src/LearnEnglish.Api/appsettings.Development.json`:

```json
{
  "OpenAI": {
    "ApiKey": "your_key_here"
  }
}
```
