namespace LearnEnglish.Application.UserData;

public sealed record SettingsData(
    string Locale,
    int DailyGoalMinutes,
    bool ShowTranslationsByDefault
);

public sealed record ReviewStateData(
    int Stage,
    string? LastReviewedAt,
    string NextReviewAt,
    double Ease,
    int Streak
);

public sealed record ExampleData(
    string Id,
    string Sentence,
    string? Translation,
    string Tone,
    string Source
);

public sealed record WordData(
    string Id,
    string Term,
    string? Translation,
    string? PartOfSpeech,
    string? Difficulty,
    string CreatedAt,
    IReadOnlyList<ExampleData> Examples
);

public sealed record StudyNoteData(
    string Id,
    string Title,
    string Markdown,
    string UpdatedAt
);

public sealed record ReviewItemData(
    string WordId,
    string ExampleId,
    ReviewStateData Review
);
