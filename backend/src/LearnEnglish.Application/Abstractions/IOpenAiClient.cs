namespace LearnEnglish.Application.Abstractions;

public interface IOpenAiClient
{
    Task<string> GenerateJsonResponseAsync(string prompt, CancellationToken cancellationToken);
}
