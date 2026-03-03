using LearnEnglish.Api.Options;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace LearnEnglish.Api.Controllers.UserData;

[ApiController]
public abstract class AppDataControllerBase(IOptions<AppDataOptions> appDataOptions) : ControllerBase
{
    protected string UserId => string.IsNullOrWhiteSpace(appDataOptions.Value.DefaultUserId)
        ? "default-user"
        : appDataOptions.Value.DefaultUserId.Trim();
}
