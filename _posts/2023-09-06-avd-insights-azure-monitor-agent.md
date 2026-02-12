---
layout: post
title: "Next-Level AVD Insights: Leveraging Azure Monitor Agent's Advanced Capabilities"
description: "Learn how to enable AVD Insights using Azure Monitor Agent (AMA) via Azure Portal and PowerShell, including migration guidance from legacy agents."
date: 2023-09-06
category: guide
tags:
  - AVD
  - Azure Monitor
reading_time: "12 min read"
featured_image: "https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/2024/02/2023-08-31-100.png"
source_url: "https://avdpunks.com/2023/09/06/next-level-avd-insights-leveraging-azure-monitor-agents-advanced-capabilities/"
source_title: "AVDPunks Original Post"
---

## Introduction

The current AVD Insights are based on Azure Log Analytics workspaces that use multiple agents such as Monitoring Dependency Agent or Microsoft Monitoring Agent (MMA) to collect monitoring data from session hosts.

AVD Insights visualizes these AVD platform log entries, session hosts event logs and performance data in charts and tables. The idea behind it is to improve troubleshooting to solve problems faster and get a complete overview of the entire AVD environment.

On August 31, 2024, Microsoft retired the Log Analytics agent. This means we need to move all virtual machines to Azure Monitor Agent by that date, which includes Azure Virtual Desktop Session Hosts and AVD Insights.

This blog post describes how to enable AVD Insight with Azure Monitor Agent (AMA).

## Understanding the Function of Azure Monitor Agent

![Diagram of AVD Insights with Azure Monitor](https://avdpunksco24ce0ba4dc.blob.core.windows.net/blobavdpunksco24ce0ba4dc/wp-content/uploads/2024/02/2023-08-31-100.png)

Azure Monitor Agent serves as a bridge between AVD deployments and Azure Monitor, enabling administrators to gain real-time insights into the performance and health of their virtual desktop environments.

Azure Monitor Agent uses **data collection rules** that allow you to specify the specific data you want each agent to collect. These rules allow you to comprehensively manage data collection settings and create different, customized configurations for specific groups of machines.

Related to AVD, Windows event logs, such as FSLogix logs, are captured from session hosts along with performance counters such as processor information, memory, or terminal services. Additionally, some information comes from the AVD platform itself.

## Enabling AVD Insights Using Azure Monitor Agent

### Requirements

You need a Log Analytics Workspace to collect all log entries and performance counters.

```powershell
$ResourceGroupName = "YourResourceGroupName"
$LogWorkspaceName  = "YourLogAnalyticsWorkspaceName"
$Location = "YourRegion"
New-AzOperationalInsightsWorkspace -Location $Location -Name $LogWorkspaceName -ResourceGroupName $ResourceGroupName
```

Another requirement is enabling managed identity on Azure virtual machines.

### How to enable AVD Insight via Azure Portal

1. Open Azure Virtual Desktop Blade and navigate to **Host Pools**, select the host pool you want to enable
2. Under Monitoring, select **Insights**
3. Click **Open Configuration Workbook**
4. On the Resources diagnostics Settings tab, select your Log Analytics workspace
5. Switch to the **Session Host Data Settings** tab
6. Create a data collection rule by selecting your Log Analytics Workspace and DCR resource group, then click **Create data collection rule**
7. Select the DCR rule (microsoft-avdi-westeurope)
8. Add system managed identity to all session hosts
9. Click **Deploy Association** to bind all session hosts to the data collection rule
10. Install the Azure Monitor Agent on all session hosts with **Add extension**

### How to enable AVD Insight via PowerShell

```powershell
# Variables
$ResourceGroupName = "YourResourceGroupName"
$LogWorkspaceName = "YourLogAnalyticWorkspaceName"
$HostPoolName = "YourHostPoolName"
$WorkspaceName = "YourWorkspaceName"
$Location = "YourRegion"
$LogWorkspaceId = (Get-AzOperationalInsightsWorkspace -Name $LogWorkspaceName -ResourceGroupName $ResourceGroupName).ResourceId

# Enable AVDInsights for the AVD Host Pool
$log = @()
$log += New-AzDiagnosticSettingLogSettingsObject -Enabled $true -CategoryGroup allLogs 
New-AzDiagnosticSetting -Name "AVDInsights" -ResourceId (Get-AzWvdHostPool -Name $HostPoolName -ResourceGroupName $ResourceGroupName).Id -WorkspaceId $LogWorkspaceId -Log $log -Verbose

# Enable AVDInsights for the AVD Workspace
$log = @()
$log += New-AzDiagnosticSettingLogSettingsObject -Enabled $true -CategoryGroup allLogs 
New-AzDiagnosticSetting -Name "AVDInsights" -ResourceId (Get-AzWvdWorkspace -Name $WorkspaceName -ResourceGroupName $ResourceGroupName).Id -WorkspaceId $LogWorkspaceId -Log $log -Verbose
```

> **Note:** The DataCollectionRule must be named as `microsoft-avdi-"AzureRegion"`, e.g. "microsoft-avdi-westeurope".

## Validating Azure Monitor Data for AVD Insights

To verify that the Azure Monitor data is now saved, open the AVD Insight configuration workbook again and open the **Generated Data** tab. Select your information (Subscription, Resource Group, and Host Pool) to see if any data has been generated.

## Conclusion

I recommend enabling AVD Insight from a troubleshooting perspective to learn more about your entire AVD environment. With AVD Insights, you can see round-trip time & bandwidth in graphs, time to connect for each user, and much more.

One agent less and so much more! 😉

## Resources

- [Insights Glossary - Microsoft Learn](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights-glossary)
- [AVD Insight - Microsoft Learn](https://learn.microsoft.com/en-us/azure/virtual-desktop/insights)
