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

    public Task<StudyNoteData> GetNoteAsync(string userId, CancellationToken cancellationToken)
    {
        var defaultNote = new StudyNoteData("Study Journal", string.Empty, DateTime.UtcNow.ToString("O"));
        return GetOrDefaultAsync(userId, UserDataSection.Notes, defaultNote, cancellationToken);
    }

    public Task SaveNoteAsync(string userId, StudyNoteData note, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(note.Title))
        {
            throw new ArgumentException("Note title is required.", nameof(note));
        }

        var normalized = note with
        {
            Title = note.Title.Trim(),
            Markdown = note.Markdown ?? string.Empty,
            UpdatedAt = string.IsNullOrWhiteSpace(note.UpdatedAt)
                ? DateTime.UtcNow.ToString("O")
                : note.UpdatedAt,
        };

        return store.WriteAsync(userId, UserDataSection.Notes, normalized, cancellationToken);
    }

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
