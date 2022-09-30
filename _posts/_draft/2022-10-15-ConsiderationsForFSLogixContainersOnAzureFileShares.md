---
layout: post
title:  "Considerations for FSLogix Containers on Azure File Shares"
date:   2022-10-15 14:00:00 +0100
categories: AVD
tags: [AVD,AzureFileShare,Azure]
---
# Considerations for FSLogix Containers on Azure File Shares

![This image shows the AVDPunk Header](/assets/img/2022-08-26/2022-08-26-000.png)

## Table of contents
1. [Introduction](#Introduction)
2. [What are Azure File Shares handles?](#What-are-Azure-File-Shares-handles?)
3. [Conclusion](#Conclusion)

## Introduction

## Why are IOPS so important?


## What are Azure File Shares handles?

Get Handles via PowerShell

$cntxt= New-AzStorageContext -StorageAccountName <acctName> -StorageAccountKey <key>
$fileshare = Get-AzStorageFileHandle -Context $cntxt -ShareName <share> -Recursive 
$fileshare | Sort-Object ClientIP,OpenTime 

https://docs.microsoft.com/en-us/azure/storage/files/storage-files-scale-targets

## Conclusion
