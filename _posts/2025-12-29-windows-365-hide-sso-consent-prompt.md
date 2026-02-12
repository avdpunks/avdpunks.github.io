---
layout: post
title: "Windows 365 Frontline Shared: How to Hide the Single Sign-On Consent Prompt"
description: "Learn how to hide the SSO consent prompt for Windows 365 Frontline Shared Mode by configuring Entra ID Single Sign-On, dynamic device groups, and Microsoft Graph PowerShell."
date: 2025-12-29
category: guide
tags:
  - Windows365
  - Frontline Shared
  - SSO
  - AVD
reading_time: "8 min read"
source_url: "https://avdpunks.com/2025/12/29/windows-365-frontline-shared-how-to-hide-the-single-sign-on-consent-prompt/"
source_title: "AVDPunks Original Post"
---

Windows 365 Frontline in Shared Mode means users connect to a pool of Cloud PCs rather than a dedicated virtual machine. Each time they sign in, they may be connected to a different Cloud PC from the pool. Because of this non-persistent, shared experience, it becomes even more important to hide the Single Sign-On consent prompt to streamline the login flow.

## Requirements

You must meet the following requirements to disable the Single Sign-On consent prompt:

- Your Entra-ID user must be one of the following Entra ID roles: Application Administrator or Cloud Application Administrator
- Install and import the Microsoft Graph PowerShell SDK modules

```powershell
# Install the required PS Modules
Install-Module Microsoft.Graph.Authentication
Install-Module Microsoft.Graph.Applications

# Import the required Modules
Import-Module Microsoft.Graph.Authentication
Import-Module Microsoft.Graph.Applications
```

- Enable Microsoft Entra ID Single Sign-On in your Windows 365 provisioning policy

## Create an Entra ID Dynamic Device Group

1. Go to entra.microsoft.com, open Groups, and click **New group**
2. Enter your preferred group name for all Windows 365 Cloud PC devices, and select **Dynamic Device** as the membership type
3. Define the dynamic membership rule: `device.displayName -startsWith "CPC-"`
4. Copy the Device Group Object ID for the next steps

## Hide the Single Sign-On consent prompt via PowerShell

Open a PowerShell prompt and run the following commands:

```powershell
# Variables
$GroupDisplayName = "Your Entra ID Group Name"
$GroupId = "Your Entra ID Object ID"
$WindowsCloudLoginId = "270efc09-cd0d-444b-a71f-39af4910ec45"
```

Connect to Microsoft Graph:

```powershell
Connect-MgGraph -Scopes "Application.Read.All","Application-RemoteDesktopConfig.ReadWrite.All"
```

Enable Microsoft Entra authentication for RDP:

```powershell
$WCLspId = (Get-MgServicePrincipal -Filter "AppId eq '$WindowsCloudLoginId'").Id

If ((Get-MgServicePrincipalRemoteDesktopSecurityConfiguration -ServicePrincipalId $WCLspId) -ne $true) {
    Update-MgServicePrincipalRemoteDesktopSecurityConfiguration -ServicePrincipalId $WCLspId -IsRemoteDesktopProtocolEnabled
}
```

Configure the RDP SSO Target Device Group:

```powershell
$tdg = New-Object -TypeName Microsoft.Graph.PowerShell.Models.MicrosoftGraphTargetDeviceGroup
$tdg.Id = $GroupId
$tdg.DisplayName = $GroupDisplayName 

New-MgServicePrincipalRemoteDesktopSecurityConfigurationTargetDeviceGroup -ServicePrincipalId $WCLspId -BodyParameter $tdg
```

Verify the configuration:

```powershell
Get-MgServicePrincipalRemoteDesktopSecurityConfigurationTargetDeviceGroup -ServicePrincipalId $WCLspId 
```

## Conclusion

By combining Microsoft Entra ID Single Sign-On with a targeted dynamic device group and the appropriate Microsoft Graph PowerShell configuration, you can fully suppress the SSO consent prompt for Windows 365 Cloud PCs.

This streamlined setup ensures that users connect faster and more seamlessly, without unnecessary authentication interruptions.

## Resources

- [Create or Edit a Dynamic Membership Group - Microsoft Learn](https://learn.microsoft.com/en-us/entra/identity/users/groups-create-rule)
- [Configure single sign-on for Windows 365 - Microsoft Learn](https://learn.microsoft.com/en-us/windows-365/enterprise/configure-single-sign-on)
- [Configure single sign-on for Azure Virtual Desktop - Microsoft Learn](https://learn.microsoft.com/en-us/azure/virtual-desktop/configure-single-sign-on)
