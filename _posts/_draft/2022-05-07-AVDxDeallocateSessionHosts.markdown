---
layout: post
title:  "Azure Virtual Desktop x RemoteApp Default File Associations"
date:   2022-05-08 10:00:00 +0100
categories: AVD
tags: [AVD,Automation]
---
# Azure Virtual Desktop (#AVD) x De-allocate stopped VMs

![This image shows the AVDPunk Header](/assets/img/2022-03-15/2022-03-15-001.png)

## Table of contents
1. [Introduction](#Introduction)
2. [Automation and worklof](#automation-and-workflow)
3. [Shutdown on disconnect](#shutdown-on-disconnect)
4. [Option I](#option-i)
5. [Option II](#option-ii)
6. [Conclusion](#Conclusion)

## Introduction

## Automation and workflow

## Shutdown on disconnect

## Option I

## Option II

```
Param  
(  
    [Parameter (Mandatory = $false)]  
    [object] $WebhookData  
)  
 
# If runbook was called from Webhook, WebhookData will not be null.  
if ($WebhookData){ 

    Write-Output "Logging into Azure subscription using a Managed Identity..."
    
    # Ensures you do not inherit an AzContext in your runbook
    Disable-AzContextAutosave -Scope Process

    # Connect to Azure with system-assigned managed identity
    $AzureContext = (Connect-AzAccount -Identity).context

    # Set and store context
    $AzureContext = Set-AzContext -SubscriptionName $AzureContext.Subscription -DefaultProfile $AzureContext   
   
    Write-Output "Successfully logged into Azure subscription using a Managed Identity..."

    $tags = @{
        managed = 'true'
        avd = 'true'
    }

	$VMs = Get-AzVM -Status | Where-Object {($_.tags.managed -eq $tags.managed)}  

	foreach ($vm in $VMs){
		if($vm.PowerState -eq 'VM stopped'){
			Write-Warning "PowerStates for VM: $($vm.Name) is: $($vm.PowerState) initiate de-allocation for cost optimization"
			Stop-AzVM -Name $vm.Name -ResourceGroupName $vm.ResourceGroupName -Confirm:$false -Force
		}
		else{
			Write-Warning "No Action required"
		}
	}
}
```

## Conclusion