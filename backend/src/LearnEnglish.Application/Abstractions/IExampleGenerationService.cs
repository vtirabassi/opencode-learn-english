namespace LearnEnglish.Application.Abstractions;

public interface IExampleGenerationService
{
    Task<GenerateExamplesResult> GenerateAsync(GenerateExamplesInput input, CancellationToken cancellationToken);
}
