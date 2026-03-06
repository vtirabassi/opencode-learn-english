using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LearnEnglish.Application.Auth;
using LearnEnglish.Infrastructure.Options;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace LearnEnglish.Infrastructure.Auth;

internal sealed class JwtAuthTokenService(IOptions<AuthOptions> options) : IAuthTokenService
{
    private readonly AuthOptions _options = options.Value;

    public string CreateToken(AuthUser user)
    {
        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(GetSigningKeyBytes()),
            SecurityAlgorithms.HmacSha256
        );

        var now = DateTime.UtcNow;
        var token = new JwtSecurityToken(
            issuer: _options.Issuer,
            audience: _options.Audience,
            claims:
            [
                new Claim(JwtRegisteredClaimNames.Sub, user.UserId),
                new Claim(JwtRegisteredClaimNames.Email, user.Email),
            ],
            notBefore: now,
            expires: now.AddMinutes(Math.Max(_options.AccessTokenMinutes, 5)),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public AuthUser ValidateToken(string token)
    {
        var principal = new JwtSecurityTokenHandler().ValidateToken(
            token,
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidIssuer = _options.Issuer,
                ValidateAudience = true,
                ValidAudience = _options.Audience,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.FromMinutes(1),
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(GetSigningKeyBytes()),
            },
            out _
        );

        var userId = principal.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
        var email = principal.FindFirst(JwtRegisteredClaimNames.Email)?.Value;

        if (string.IsNullOrWhiteSpace(userId) || string.IsNullOrWhiteSpace(email))
        {
            throw new UnauthorizedAccessException("Invalid authentication token.");
        }

        return new AuthUser(userId, email);
    }

    private byte[] GetSigningKeyBytes()
    {
        if (string.IsNullOrWhiteSpace(_options.JwtSigningKey))
        {
            throw new InvalidOperationException("Auth:JwtSigningKey is required.");
        }

        return Encoding.UTF8.GetBytes(_options.JwtSigningKey);
    }
}
