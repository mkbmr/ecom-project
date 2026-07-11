#!/bin/bash
export RESOURCE_GROUP="maisonaura-rg2"
export LOCATION="southeastasia"
export ACR_NAME="maisonauraacr2"
export AKS_CLUSTER="maisonaura-aks"
export POSTGRES_SERVER="maisonaura-db2"
export KEYVAULT_NAME="maisonaura-kv2"
export ENVIRONMENT="maisonaura-env2"

# Dynamic values fetched from Azure
export ACR_LOGIN_SERVER=$(az acr show --name $ACR_NAME --query loginServer --output tsv)
export POSTGRES_HOST=$(az postgres flexible-server show --resource-group $RESOURCE_GROUP --name $POSTGRES_SERVER --query fullyQualifiedDomainName --output tsv 2>/dev/null)
export IDENTITY_CLIENT_ID=$(az aks show --resource-group $RESOURCE_GROUP --name $AKS_CLUSTER --query "addonProfiles.azureKeyvaultSecretsProvider.identity.clientId" --output tsv 2>/dev/null)
export TENANT_ID=$(az account show --query tenantId --output tsv)
export SUBSCRIPTION_ID=$(az account show --query id --output tsv)

echo "✅ Variables set:"
echo "  RESOURCE_GROUP:    $RESOURCE_GROUP"
echo "  ACR_LOGIN_SERVER:  $ACR_LOGIN_SERVER"
echo "  KEYVAULT_NAME:     $KEYVAULT_NAME"
echo "  AKS_CLUSTER:       $AKS_CLUSTER"
echo "  POSTGRES_HOST:     $POSTGRES_HOST"
