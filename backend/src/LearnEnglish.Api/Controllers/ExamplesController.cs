using LearnEnglish.Api.Contracts;
using LearnEnglish.Application;
using LearnEnglish.Application.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace LearnEnglish.Api.Controllers;

[ApiController]
[Route("api/v1/examples")]
public sealed class ExamplesController(IExampleGenerationService exampleGenerationService) : ControllerBase
{
    [HttpPost("generate")]
    [ProducesResponseType(typeof(GenerateExamplesResult), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(object), StatusCodes.Status502BadGateway)]
    public async Task<IActionResult> Generate(
        [FromBody] GenerateExamplesRequest request,
        CancellationToken cancellationToken
    )
    {
        if (string.IsNullOrWhiteSpace(request.Word))
        {
            return BadRequest(new { error = "Word is required" });
        }

        var result = await exampleGenerationService.GenerateAsync(
            new GenerateExamplesInput(
                request.Word,
                request.Tone,
                request.Variations,
                request.IncludeTranslation
            ),
            cancellationToken
        );

        return Ok(result);
    }
}
