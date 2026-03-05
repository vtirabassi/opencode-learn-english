namespace LearnEnglish.Application.UserData;

internal sealed class UserDataService(IUserDataStore store) : IUserDataService
{
    public Task<SettingsData> GetSettingsAsync(string userId, CancellationToken cancellationToken)
    {
        return GetOrDefaultAsync(
            userId,
            UserDataSection.Settings,
            new SettingsData("en-US", 15, false),
            cancellationToken
        );
    }

    public Task SaveSettingsAsync(
        string userId,
        SettingsData settings,
        CancellationToken cancellationToken
    )
    {
        if (string.IsNullOrWhiteSpace(settings.Locale))
        {
            throw new ArgumentException("Locale is required.", nameof(settings));
        }

        var normalized = settings with
        {
            Locale = settings.Locale.Trim(),
            DailyGoalMinutes = Math.Max(settings.DailyGoalMinutes, 1),
        };

        return store.WriteAsync(userId, UserDataSection.Settings, normalized, cancellationToken);
    }

    public async Task<IReadOnlyList<WordData>> GetWordsAsync(
        string userId,
        CancellationToken cancellationToken
    )
    {
        var words = await store.ReadAsync<List<WordData>>(userId, UserDataSection.Words, cancellationToken);
        return words ?? [];
    }

    public Task SaveWordsAsync(
        string userId,
        IReadOnlyList<WordData> words,
        CancellationToken cancellationToken
    )
    {
        return store.WriteAsync(userId, UserDataSection.Words, words, cancellationToken);
    }

    public async Task<IReadOnlyList<StudyNoteData>> GetNotesAsync(string userId, CancellationToken cancellationToken)
    {
        var notes = await store.ReadAsync<List<StudyNoteData>>(userId, UserDataSection.Notes, cancellationToken);
        if (notes is not null)
        {
            return notes;
        }

        // Migration: try reading legacy single-note format
        var legacy = await store.ReadAsync<LegacyStudyNoteData>(userId, UserDataSection.Notes, cancellationToken);
        if (legacy is not null)
        {
            var migrated = new List<StudyNoteData>
            {
                new(Guid.NewGuid().ToString(), legacy.Title, legacy.Markdown, legacy.UpdatedAt)
            };
            await store.WriteAsync(userId, UserDataSection.Notes, migrated, cancellationToken);
            return migrated;
        }

        return [];
    }

    public Task SaveNotesAsync(string userId, IReadOnlyList<StudyNoteData> notes, CancellationToken cancellationToken)
    {
        var normalized = notes.Select(note => note with
        {
            Id = string.IsNullOrWhiteSpace(note.Id) ? Guid.NewGuid().ToString() : note.Id,
            Title = note.Title?.Trim() ?? string.Empty,
            Markdown = note.Markdown ?? string.Empty,
            UpdatedAt = string.IsNullOrWhiteSpace(note.UpdatedAt)
                ? DateTime.UtcNow.ToString("O")
                : note.UpdatedAt,
        }).ToList();

        return store.WriteAsync(userId, UserDataSection.Notes, normalized, cancellationToken);
    }

    private sealed record LegacyStudyNoteData(string Title, string Markdown, string UpdatedAt);

    public async Task<IReadOnlyList<ReviewItemData>> GetReviewsAsync(
        string userId,
        CancellationToken cancellationToken
    )
    {
        var reviews = await store.ReadAsync<List<ReviewItemData>>(
            userId,
            UserDataSection.Reviews,
            cancellationToken
        );
        return reviews ?? [];
    }

    public Task SaveReviewsAsync(
        string userId,
        IReadOnlyList<ReviewItemData> reviews,
        CancellationToken cancellationToken
    )
    {
        return store.WriteAsync(userId, UserDataSection.Reviews, reviews, cancellationToken);
    }

    private async Task<T> GetOrDefaultAsync<T>(
        string userId,
        UserDataSection section,
        T fallback,
        CancellationToken cancellationToken
    )
    {
        var data = await store.ReadAsync<T>(userId, section, cancellationToken);
        return data ?? fallback;
    }
}
