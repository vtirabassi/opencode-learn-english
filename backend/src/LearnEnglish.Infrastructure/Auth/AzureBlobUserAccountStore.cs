using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Azure.Storage.Blobs;
using LearnEnglish.Application.Auth;
using LearnEnglish.Infrastructure.Options;
using Microsoft.Extensions.Options;

namespace LearnEnglish.Infrastructure.Auth;

internal sealed class AzureBlobUserAccountStore(IOptions<AzureBlobOptions> options) : IUserAccountStore
{
    private static readonly JsonSerializerOptions JsonOptions = new(JsonSerializerDefaults.Web)
    {
        PropertyNameCaseInsensitive = true,
        WriteIndented = false,
    };

    private readonly AzureBlobOptions _options = options.Value;

    public async Task<UserAccountRecord?> FindByEmailAsync(
        string normalizedEmail,
        CancellationToken cancellationToken
    )
    {
        var container = await GetContainerClientAsync(cancellationToken);
        var blobClient = container.GetBlobClient(BuildBlobPath(normalizedEmail));

        if (!await blobClient.ExistsAsync(cancellationToken))
        {
            return null;
        }

        var response = await blobClient.DownloadContentAsync(cancellationToken);
        return response.Value.Content.ToObjectFromJson<UserAccountRecord>(JsonOptions);
    }

    public async Task CreateAsync(UserAccountRecord account, CancellationToken cancellationToken)
    {
        var container = await GetContainerClientAsync(cancellationToken);
        var blobClient = container.GetBlobClient(BuildBlobPath(account.NormalizedEmail));
        var payload = BinaryData.FromObjectAsJson(account, JsonOptions);
        await blobClient.UploadAsync(payload, overwrite: false, cancellationToken);
    }

    private async Task<BlobContainerClient> GetContainerClientAsync(CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(_options.ConnectionString))
        {
            throw new InvalidOperationException("AzureBlob:ConnectionString is required.");
        }

        var containerName = _options.ResolveUserAccountsContainerName();
        if (string.IsNullOrWhiteSpace(containerName))
        {
            throw new InvalidOperationException(
                "AzureBlob:UserAccountsContainerName (or AzureBlob:ContainerName) is required."
            );
        }

        var serviceClient = new BlobServiceClient(_options.ConnectionString);
        var containerClient = serviceClient.GetBlobContainerClient(containerName);
        await containerClient.CreateIfNotExistsAsync(cancellationToken: cancellationToken);
        return containerClient;
    }

    private static string BuildBlobPath(string normalizedEmail)
    {
        var hashBytes = SHA256.HashData(Encoding.UTF8.GetBytes(normalizedEmail));
        var hash = Convert.ToHexString(hashBytes).ToLowerInvariant();
        return $"auth/users/{hash}.json";
    }
}
