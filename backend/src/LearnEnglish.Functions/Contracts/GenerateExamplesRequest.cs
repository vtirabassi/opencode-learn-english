namespace LearnEnglish.Functions.Contracts;

public sealed record GenerateExamplesRequest(
    string Word,
    string Tone = "neutral",
    int Variations = 2,
    bool IncludeTranslation = true
);
