using LearnEnglish.Api.Options;
using LearnEnglish.Application.UserData;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace LearnEnglish.Api.Controllers.UserData;

[Route("api/v1/settings")]
public sealed class SettingsController(
    IUserDataService userDataService,
    IOptions<AppDataOptions> appDataOptions
) : AppDataControllerBase(appDataOptions)
{
    [HttpGet]
    [ProducesResponseType(typeof(SettingsData), StatusCodes.Status200OK)]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var settings = await userDataService.GetSettingsAsync(UserId, cancellationToken);
        return Ok(settings);
    }

    [HttpPut]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Put(
        [FromBody] SettingsData request,
        CancellationToken cancellationToken
    )
    {
        await userDataService.SaveSettingsAsync(UserId, request, cancellationToken);
        return NoContent();
    }
}
