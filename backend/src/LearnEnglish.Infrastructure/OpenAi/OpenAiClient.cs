using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using LearnEnglish.Application.Abstractions;
using LearnEnglish.Infrastructure.Options;
using Microsoft.Extensions.Options;

namespace LearnEnglish.Infrastructure.OpenAi;

internal sealed class OpenAiClient(HttpClient httpClient, IOptions<OpenAiOptions> options) : IOpenAiClient
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
    };

    private readonly OpenAiOptions _options = options.Value;

    public async Task<string> GenerateJsonResponseAsync(string prompt, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            throw new InvalidOperationException("OpenAI API key is missing.");
        }

        var payload = new
        {
            model = _options.Model,
            messages = new object[]
            {
                new
                {
                    role = "system",
                    content = "You are a helpful assistant that responds with valid JSON only.",
                },
                new
                {
                    role = "user",
                    content = prompt,
                },
            },
            temperature = _options.Temperature,
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, "chat/completions")
        {
            Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json"),
        };
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ApiKey);

        using var response = await httpClient.SendAsync(request, cancellationToken);
        var responseContent = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            throw new HttpRequestException(
                $"OpenAI request failed with status {(int)response.StatusCode}: {responseContent}"
            );
        }

        var completion = JsonSerializer.Deserialize<ChatCompletionResponse>(responseContent, JsonOptions);
        var content = completion?.Choices?.FirstOrDefault()?.Message?.Content;

        if (string.IsNullOrWhiteSpace(content))
        {
            throw new InvalidOperationException("OpenAI response did not contain content.");
        }

        return content;
    }

    private sealed class ChatCompletionResponse
    {
        public List<Choice>? Choices { get; set; }
    }

    private sealed class Choice
    {
        public Message? Message { get; set; }
    }

    private sealed class Message
    {
        public string? Content { get; set; }
    }
}
