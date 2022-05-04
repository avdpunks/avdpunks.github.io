---
layout: post
title:  "Hi Siri start my engineering demo"
date:   2022-05-04 12:00:00 +0100
categories: AVD
tags: [AVD,HPC,Automation]
---

![This image shows the AVDPunk Header](/assets/img/2022-05-01/2022-05-01-000.png)

# Hi Siri start my engineering demo

## Table of contents
1. [Introduction](#Introduction)
2. [Automation and workflow](#Automation-and-workflow)
3. [The runbook](#The-runbook)
4. [On the iPhone](#On-the-iPhone)
5. [Conclusion](#Conclusion)


## Introduction

It's just another day in the office...and a small coffee break, lunch date or *(add your break of choise)* ends in a highly valuable discussion. But wait, isn't there a customer demo waiting... No need to rush!

It can be so easy: **"Hi Siri start my engineering demo"**

In this blog post, I will show you an easy way how you can start or shutdown virtual machines or perform any tasks in the Azure with your Siri (Sorry Cortana 😋).

## Automation and workflow

As an automation tool I will use an Azure Automation PowerShell Runbook and enable a webhook for it. You can also use an Azure Function if you are fancy to. Make sure you copy the webhook url after creating it, you will not be able to view that later.

![2022-03-01-000.png](/assets/img/2022-05-01/2022-05-01-001.png)

In the runbook we get all virtual machines with a specific tag, in my case **HiSiri** with the value **enabled**. 

![2022-03-01-000.png](/assets/img/2022-05-01/2022-05-01-002.png)

*Note: This was a personal project, please consider security options if adopting it! Working with a voice assistent, sharing webhooks and automating stuff might bring security concerns😉*

## The runbook
This runbook is non-destructive but as always test before copy & paste!

```
Param  
(  
    [Parameter (Mandatory = $false)]  
    [object] $webhookData  
)  

# If runbook was called from webhook, webhookData will not be null.
if ($webhookData) { 

    Write-Output "Logging into Azure subscription using Az cmdlets..."
        
    $connectionName = "AzureRunAsConnection"
    try
    {
        # Get the connection "AzureRunAsConnection "
        $servicePrincipalConnection=Get-AutomationConnection -Name $connectionName         

        Add-AzAccount `
            -ServicePrincipal `
            -TenantId $servicePrincipalConnection.TenantId `
            -ApplicationId $servicePrincipalConnection.ApplicationId `
            -CertificateThumbprint $servicePrincipalConnection.CertificateThumbprint 
        
        Write-Output "Successfully logged into Azure subscription using Az cmdlets..."
    }

    catch {
        if (!$servicePrincipalConnection)
        {
            $ErrorMessage = "Connection $connectionName not found."
            throw $ErrorMessage
        } else{
            Write-Error -Message $_.Exception
            throw $_.Exception
        }
    }

    Write-Output "Hello Azure I am connected now"

	# Get tagged VMs
	$TaggedVMs = Get-AzVM -Status | Where-Object {($_.tags.HiSiri -eq 'enabled')}
	# Write-Output = "$TaggedVMs"

	foreach ($TaggedVM in $TaggedVMs){
		if ($TaggedVM.PowerState -ne 'VM running') {
				Start-AzVM -Name $TaggedVM.Name -ResourceGroupName $TaggedVM.ResourceGroupName
				Write-Warning "Siri started VM $($TaggedVM.Name)"
		}
		else {
			Write-Warning "Hey... there is nothing to do for me"
		}
	}
}
```

## On the iPhone / iOS device

On my iPhone I created a simple Siri shortcut to call Azure webhook directly.
1. Go to **Shortcuts** and click the **plus** sign to add new. Click on **Add Action** and find **URL**. Here you need paste the URL of you **Azure webhook**.

2. As a second Action, add Get Contents of **URL**. This is connected to the first action, and it will only be available after you add the URL. Here is where we configure how our webhook is triggered. Click Show More, select Method POST.

Here is a snip of the configuration (replace $URL with your webhook URL)

![2022-03-01-000.png](/assets/img/2022-05-01/2022-05-01-003.png)

## Conclusion

Building this microhack was fun and highlights how easy you can automate tasks in the cloud. And we all know how important this is.

For all the pre-sales engineers you can now spend another couple of minutes at the coffee bar 😉!

Stay tuned for more!

## Resources
- [Microsoft Docs | Automation webhooks](https://docs.microsoft.com/en-us/azure/automation/automation-webhooks)