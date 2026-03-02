namespace LearnEnglish.Application;

public sealed record GenerateExamplesInput(
    string Word,
    string Tone = "neutral",
    int Variations = 2,
    bool IncludeTranslation = true
);

public sealed record GenerateExamplesResult(
    IReadOnlyList<GeneratedExampleDto> Examples
);

public sealed record GeneratedExampleDto(
    string Sentence,
    string? Translation,
    string Tone
);
