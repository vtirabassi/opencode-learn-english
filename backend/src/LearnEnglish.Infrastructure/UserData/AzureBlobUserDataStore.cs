using System.Text.Json;
using Azure.Storage.Blobs;
using LearnEnglish.Application.UserData;
using LearnEnglish.Infrastructure.Options;
using Microsoft.Extensions.Options;

namespace LearnEnglish.Infrastructure.UserData;

internal sealed class AzureBlobUserDataStore(IOptions<AzureBlobOptions> options) : IUserDataStore
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        PropertyNameCaseInsensitive = true,
        WriteIndented = false,
    };

    private readonly AzureBlobOptions _options = options.Value;

    public async Task<T?> ReadAsync<T>(
        string userId,
        UserDataSection section,
        CancellationToken cancellationToken
    )
    {
        var container = await GetContainerClientAsync(cancellationToken);
        var blobClient = container.GetBlobClient(BuildBlobPath(userId, section));

        if (!await blobClient.ExistsAsync(cancellationToken))
        {
            return default;
        }

        var response = await blobClient.DownloadContentAsync(cancellationToken);
        return response.Value.Content.ToObjectFromJson<T>(JsonOptions);
    }

    public async Task WriteAsync<T>(
        string userId,
        UserDataSection section,
        T value,
        CancellationToken cancellationToken
    )
    {
        var container = await GetContainerClientAsync(cancellationToken);
        var blobClient = container.GetBlobClient(BuildBlobPath(userId, section));
        var data = BinaryData.FromObjectAsJson(value, JsonOptions);

        await blobClient.UploadAsync(data, overwrite: true, cancellationToken);
    }

    private async Task<BlobContainerClient> GetContainerClientAsync(CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.ConnectionString))
        {
            throw new InvalidOperationException("AzureBlob:ConnectionString is required.");
        }

        if (string.IsNullOrWhiteSpace(_options.ContainerName))
        {
            throw new InvalidOperationException("AzureBlob:ContainerName is required.");
        }

        var serviceClient = new BlobServiceClient(_options.ConnectionString);
        var containerClient = serviceClient.GetBlobContainerClient(_options.ContainerName);
        await containerClient.CreateIfNotExistsAsync(cancellationToken: cancellationToken);
        return containerClient;
    }

    private static string BuildBlobPath(string userId, UserDataSection section)
    {
        var normalizedUserId = string.IsNullOrWhiteSpace(userId) ? "default-user" : userId.Trim();
        return section switch
        {
            UserDataSection.Settings => $"users/{normalizedUserId}/settings.json",
            UserDataSection.Words => $"users/{normalizedUserId}/words.json",
            UserDataSection.Notes => $"users/{normalizedUserId}/notes.json",
            UserDataSection.Reviews => $"users/{normalizedUserId}/reviews.json",
            _ => throw new ArgumentOutOfRangeException(nameof(section), section, null),
        };
    }
}
