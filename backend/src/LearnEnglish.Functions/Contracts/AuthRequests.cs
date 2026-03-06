namespace LearnEnglish.Functions.Contracts;

public sealed record AuthRequest(
    string Email,
    string Password
);
