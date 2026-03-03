namespace LearnEnglish.Application.UserData;

public enum UserDataSection
{
    Settings,
    Words,
    Notes,
    Reviews,
}

public interface IUserDataStore
{
    Task<T?> ReadAsync<T>(
        string userId,
        UserDataSection section,
        CancellationToken cancellationToken
    );

    Task WriteAsync<T>(
        string userId,
        UserDataSection section,
        T value,
        CancellationToken cancellationToken
    );
}

public interface IUserDataService
{
    Task<SettingsData> GetSettingsAsync(string userId, CancellationToken cancellationToken);
    Task SaveSettingsAsync(string userId, SettingsData settings, CancellationToken cancellationToken);

    Task<IReadOnlyList<WordData>> GetWordsAsync(string userId, CancellationToken cancellationToken);
    Task SaveWordsAsync(
        string userId,
        IReadOnlyList<WordData> words,
        CancellationToken cancellationToken
    );

    Task<StudyNoteData> GetNoteAsync(string userId, CancellationToken cancellationToken);
    Task SaveNoteAsync(string userId, StudyNoteData note, CancellationToken cancellationToken);

    Task<IReadOnlyList<ReviewItemData>> GetReviewsAsync(string userId, CancellationToken cancellationToken);
    Task SaveReviewsAsync(
        string userId,
        IReadOnlyList<ReviewItemData> reviews,
        CancellationToken cancellationToken
    );
}
