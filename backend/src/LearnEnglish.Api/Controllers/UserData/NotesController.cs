using LearnEnglish.Api.Options;
using LearnEnglish.Application.UserData;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace LearnEnglish.Api.Controllers.UserData;

[Route("api/v1/notes")]
public sealed class NotesController(
    IUserDataService userDataService,
    IOptions<AppDataOptions> appDataOptions
) : AppDataControllerBase(appDataOptions)
{
    [HttpGet]
    [ProducesResponseType(typeof(StudyNoteData), StatusCodes.Status200OK)]
    public async Task<IActionResult> Get(CancellationToken cancellationToken)
    {
        var note = await userDataService.GetNoteAsync(UserId, cancellationToken);
        return Ok(note);
    }

    [HttpPut]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> Put(
        [FromBody] StudyNoteData request,
        CancellationToken cancellationToken
    )
    {
        await userDataService.SaveNoteAsync(UserId, request, cancellationToken);
        return NoContent();
    }
}
