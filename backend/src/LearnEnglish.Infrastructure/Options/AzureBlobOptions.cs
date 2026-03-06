namespace LearnEnglish.Infrastructure.Options;

public sealed class AzureBlobOptions
{
    public const string SectionName = "AzureBlob";

    public string ConnectionString { get; set; } = string.Empty;
    public string ContainerName { get; set; } = "learn-english-data";
    public string AppDataContainerName { get; set; } = "learn-english-data";
    public string UserAccountsContainerName { get; set; } = "learn-english-users-accounts";

    public string ResolveAppDataContainerName()
    {
        if (!string.IsNullOrWhiteSpace(AppDataContainerName))
        {
            return AppDataContainerName;
        }

        return ContainerName;
    }

    public string ResolveUserAccountsContainerName()
    {
        if (!string.IsNullOrWhiteSpace(UserAccountsContainerName))
        {
            return UserAccountsContainerName;
        }

        return ContainerName;
    }
}
