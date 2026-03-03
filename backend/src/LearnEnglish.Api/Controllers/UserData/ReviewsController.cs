using LearnEnglish.Api.Options;
using LearnEnglish.Application.UserData;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace LearnEnglish.Api.Controllers.UserData;

[Route("api/v1/reviews")]
public sealed class ReviewsController(
    IUserDataService userDataService,
    IOptions<AppDataOptions> appDataOptions
) : AppDataControllerBase(appDataOptions)
{
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<ReviewItemData>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var reviews = await userDataService.GetReviewsAsync(UserId, cancellationToken);
        return Ok(reviews);
    }

    [HttpPut]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Put(
        [FromBody] IReadOnlyList<ReviewItemData> request,
        CancellationToken cancellationToken
    )
    {
        await userDataService.SaveReviewsAsync(UserId, request, cancellationToken);
        return NoContent();
    }
}
