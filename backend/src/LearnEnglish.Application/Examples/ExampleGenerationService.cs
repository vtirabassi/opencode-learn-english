using System.Text.Json;
using LearnEnglish.Application.Abstractions;

namespace LearnEnglish.Application.Examples;

internal sealed class ExampleGenerationService(IOpenAiClient openAiClient) : IExampleGenerationService
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    public async Task<GenerateExamplesResult> GenerateAsync(
        GenerateExamplesInput input,
        CancellationToken cancellationToken
    )
    {
        var normalizedInput = Normalize(input);
        var prompt = BuildPrompt(normalizedInput);
        var jsonResponse = await openAiClient.GenerateJsonResponseAsync(prompt, cancellationToken);

        var parsed = JsonSerializer.Deserialize<List<GeneratedExampleDto>>(jsonResponse, JsonOptions);
        if (parsed is null)
        {
            throw new InvalidOperationException("OpenAI response could not be parsed.");
        }

        var examples = parsed
            .Where(item => !string.IsNullOrWhiteSpace(item.Sentence))
            .Select(item => new GeneratedExampleDto(
                item.Sentence.Trim(),
                string.IsNullOrWhiteSpace(item.Translation) ? null : item.Translation.Trim(),
                NormalizeTone(item.Tone)
            ))
            .ToList();

        if (examples.Count == 0)
        {
            throw new InvalidOperationException("No valid examples were returned by OpenAI.");
        }

        return new GenerateExamplesResult(examples);
    }

    private static GenerateExamplesInput Normalize(GenerateExamplesInput input)
    {
        if (string.IsNullOrWhiteSpace(input.Word))
        {
            throw new ArgumentException("Word is required.", nameof(input.Word));
        }

        var tone = NormalizeTone(input.Tone);
        var variations = Math.Clamp(input.Variations, 1, 5);

        return input with
        {
            Word = input.Word.Trim(),
            Tone = tone,
            Variations = variations,
        };
    }

    private static string BuildPrompt(GenerateExamplesInput input)
    {
        return string.Join(
            "\n",
            [
                $"You are an English tutor. Create {input.Variations} B1/B2 sentences using the word \"{input.Word}\".",
                $"Tone: {input.Tone}. Sentences must be natural and concise.",
                $"Return JSON only as an array of objects with fields: sentence, tone, translation{(input.IncludeTranslation ? string.Empty : " (translation can be null)")}.",
                "If translation is provided, write it in Brazilian Portuguese. Use the word exactly as provided.",
            ]
        );
    }

    private static string NormalizeTone(string? tone)
    {
        var normalized = (tone ?? "neutral").Trim().ToLowerInvariant();
        return normalized switch
        {
            "formal" => "formal",
            "informal" => "informal",
            _ => "neutral",
        };
    }
}
