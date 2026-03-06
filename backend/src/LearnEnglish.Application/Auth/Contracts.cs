namespace LearnEnglish.Application.Auth;

public sealed record AuthUser(
    string UserId,
    string Email
);

public sealed record AuthResponse(
    string AccessToken,
    AuthUser User
);

public interface IUserAccountStore
{
    Task<UserAccountRecord?> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken);
    Task CreateAsync(UserAccountRecord account, CancellationToken cancellationToken);
}

public sealed record UserAccountRecord(
    string UserId,
    string Email,
    string NormalizedEmail,
    string PasswordHash,
    string CreatedAt,
    string UpdatedAt
);

public interface IAuthTokenService
{
    string CreateToken(AuthUser user);
    AuthUser ValidateToken(string token);
}

public interface IAuthService
{
    Task<AuthResponse> RegisterAsync(
        string email,
        string password,
        CancellationToken cancellationToken
    );

    Task<AuthResponse> LoginAsync(
        string email,
        string password,
        CancellationToken cancellationToken
    );

    Task<AuthUser> GetCurrentUserAsync(string accessToken, CancellationToken cancellationToken);
}
