using System.Security.Cryptography;

namespace LearnEnglish.Application.Auth;

internal sealed class AuthService(
    IUserAccountStore userAccountStore,
    IAuthTokenService authTokenService
) : IAuthService
{
    public async Task<AuthResponse> RegisterAsync(
        string email,
        string password,
        CancellationToken cancellationToken
    )
    {
        var normalizedEmail = NormalizeEmail(email);
        ValidatePassword(password);

        var existing = await userAccountStore.FindByEmailAsync(normalizedEmail, cancellationToken);
        if (existing is not null)
        {
            throw new ArgumentException("Email already exists.");
        }

        var now = DateTime.UtcNow.ToString("O");
        var account = new UserAccountRecord(
            UserId: Guid.NewGuid().ToString("N"),
            Email: email.Trim(),
            NormalizedEmail: normalizedEmail,
            PasswordHash: HashPassword(password),
            CreatedAt: now,
            UpdatedAt: now
        );

        await userAccountStore.CreateAsync(account, cancellationToken);

        var user = new AuthUser(account.UserId, account.Email);
        return new AuthResponse(authTokenService.CreateToken(user), user);
    }

    public async Task<AuthResponse> LoginAsync(
        string email,
        string password,
        CancellationToken cancellationToken
    )
    {
        var normalizedEmail = NormalizeEmail(email);
        var account = await userAccountStore.FindByEmailAsync(normalizedEmail, cancellationToken);

        if (account is null || !VerifyPassword(password, account.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password.");
        }

        var user = new AuthUser(account.UserId, account.Email);
        return new AuthResponse(authTokenService.CreateToken(user), user);
    }

    public Task<AuthUser> GetCurrentUserAsync(string accessToken, CancellationToken cancellationToken)
    {
        _ = cancellationToken;
        return Task.FromResult(authTokenService.ValidateToken(accessToken));
    }

    private static string NormalizeEmail(string email)
    {
        if (string.IsNullOrWhiteSpace(email))
        {
            throw new ArgumentException("Email is required.");
        }

        return email.Trim().ToLowerInvariant();
    }

    private static void ValidatePassword(string password)
    {
        if (string.IsNullOrWhiteSpace(password))
        {
            throw new ArgumentException("Password is required.");
        }

        if (password.Length < 8)
        {
            throw new ArgumentException("Password must be at least 8 characters.");
        }
    }

    private static string HashPassword(string password)
    {
        const int iterations = 100_000;
        var salt = RandomNumberGenerator.GetBytes(16);
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            password,
            salt,
            iterations,
            HashAlgorithmName.SHA256,
            32
        );
        return $"{iterations}.{Convert.ToBase64String(salt)}.{Convert.ToBase64String(hash)}";
    }

    private static bool VerifyPassword(string password, string encodedHash)
    {
        if (string.IsNullOrWhiteSpace(password) || string.IsNullOrWhiteSpace(encodedHash))
        {
            return false;
        }

        var parts = encodedHash.Split('.', 3, StringSplitOptions.TrimEntries);
        if (parts.Length != 3 || !int.TryParse(parts[0], out var iterations))
        {
            return false;
        }

        try
        {
            var salt = Convert.FromBase64String(parts[1]);
            var expectedHash = Convert.FromBase64String(parts[2]);
            var actualHash = Rfc2898DeriveBytes.Pbkdf2(
                password,
                salt,
                iterations,
                HashAlgorithmName.SHA256,
                expectedHash.Length
            );
            return CryptographicOperations.FixedTimeEquals(actualHash, expectedHash);
        }
        catch (FormatException)
        {
            return false;
        }
    }
}
