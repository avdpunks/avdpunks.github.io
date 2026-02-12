---
layout: post
title: "No SAS, No Stress: Access Blob Scripts in AVD Image Templates using Managed Identity"
description: "Learn how to use managed identities instead of SAS tokens for blob access in AVD Custom Image Templates, eliminating token expiration issues."
date: 2025-05-14
category: guide
tags:
  - AVD
  - Azure Image Builder
  - Custom Image Template
  - automation
  - Windows365
reading_time: "8 min read"
featured_image: "https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/image-1-1024x609.png"
source_url: "https://avdpunks.com/2025/05/14/no-sas-no-stress-access-blob-scripts-in-avd-image-templates-using-managed-identity/"
source_title: "AVDPunks Original Post"
---

What's the most annoying part of an automation? When a time-limited token has expired and you start troubleshooting what's going wrong. I also used the blob script links with a Shared Access Signatures (SAS) to access my files in my AVD Custom Image Templates configuration. But from now on I bring the blob script links at a higher level, without SAS token, instead the managed identity gets enough permission to the blob container to download the files.

## Prerequisites

First, you need to have followed the Microsoft documentation on how to use custom image templates to create custom images in Azure Virtual Desktop.

Second, you need an Azure storage account with a blob container for your custom script files. You must ensure that public network access is enabled in the network settings of the storage account.

![Storage Account networking settings ensure that public network access is activated](https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/image-1-1024x609.png)

> **Note:** There is no way to enable network access from selected virtual networks or via private endpoint connections, as the image creation service will not be able to connect to the storage account.

The access level of the blob container can be set to private (no anonymous access).

![Blob container access level can be set to private](https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/image-2.png)

Short list of what you need:
- Managed Identity
- Storage Account with a blob container and custom script file
- AVD Custom Image template you want to optimize

## Assign blob reader permission to the managed identity

1. Open your Azure Storage Account and select "Access Control (IAM)"

2. Click "+Add role assignment"

3. Search for "Storage Blob Data Reader" and select the role, then click "Next"

4. In the members tab select "Managed identity" and click on "+ Select members"

5. Select your subscription and "User Assigned Managed Identity", then search for your managed identity and click "Select"

6. Click "Review + assign" to assign the permission role to your managed identity

## Use blob script file without SAS token in a custom image template

1. Open the Custom image template blade and click "+ Add custom image template"

> **Note:** There is no way to change an existing custom image template, so we need to create a new template and import an existing template.

2. Enter a new template name and select "Yes" to import from an existing template

3. Proceed to step 5: Customization and click on "+ Add custom script"

4. Add the script name and the URI **without SAS token** from your custom script, then click "Save"

5. Click "Review + Create" and wait for the custom image template to be created

6. Select your newly created custom image template and click on "Start build"

## To check the live logs during the build process

1. Open your staging resource group from the list
2. Search for a temporary container instance and open this instance
3. Click on "Container" under "Settings" and then open "Logs" to view the live logs

> **Note:** If the build process has completed or failed, the log file is saved in the temporary storage account in the staging resource group.

## Conclusion

By replacing time-limited SAS tokens with a managed identity and proper RBAC permissions, you not only simplify your AVD image customization process but also significantly improve its security and maintainability.

This approach eliminates the hassle of token expiration and manual updates, allowing your automation to run more reliably and securely.

## Resources

- [Use custom image templates to create custom images - Microsoft Learn](https://learn.microsoft.com/en-us/azure/virtual-desktop/create-custom-image-templates)
- [Assign an Azure role for access to blob data - Microsoft Learn](https://learn.microsoft.com/en-us/azure/storage/blobs/assign-azure-role-data-access)
- [Azure built-in roles for Storage - Microsoft Learn](https://learn.microsoft.com/en-us/azure/role-based-access-control/built-in-roles/storage#storage-blob-data-reader)
