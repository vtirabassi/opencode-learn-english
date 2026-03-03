namespace LearnEnglish.Api.Options;

public sealed class AppDataOptions
{
    public const string SectionName = "AppData";

    public string DefaultUserId { get; set; } = "default-user";
}
