namespace LearnEnglish.Infrastructure.Options;

public sealed class AuthOptions
{
    public const string SectionName = "Auth";

    public string JwtSigningKey { get; set; } = string.Empty;
    public string Issuer { get; set; } = "LearnEnglish";
    public string Audience { get; set; } = "LearnEnglish.Client";
    public int AccessTokenMinutes { get; set; } = 720;
}
