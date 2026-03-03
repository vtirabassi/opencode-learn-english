using LearnEnglish.Api.Options;
using LearnEnglish.Application.UserData;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace LearnEnglish.Api.Controllers.UserData;

[Route("api/v1/words")]
public sealed class WordsController(
    IUserDataService userDataService,
    IOptions<AppDataOptions> appDataOptions
) : AppDataControllerBase(appDataOptions)
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<WordData>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var words = await userDataService.GetWordsAsync(UserId, cancellationToken);
        return Ok(words);
    }

    [HttpPut]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Put(
        [FromBody] IReadOnlyList<WordData> request,
        CancellationToken cancellationToken
    )
    {
        await userDataService.SaveWordsAsync(UserId, request, cancellationToken);
        return NoContent();
    }
}
