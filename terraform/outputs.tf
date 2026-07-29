# Resource Group
output "resource_group_name" {
  value       = data.azurerm_resource_group.rg.name
  description = "Resource group name"
}

# ACR
output "acr_login_server" {
  value       = azurerm_container_registry.acr.login_server
  description = "ACR login server URL — use this in your GitHub Actions workflow"
}

# AKS
output "aks_cluster_name" {
  value       = azurerm_kubernetes_cluster.k8s.name
  description = "AKS cluster name"
}

output "aks_host" {
  value       = azurerm_kubernetes_cluster.k8s.kube_config[0].host
  description = "AKS API server endpoint"
  sensitive   = true
}

# Key Vault
output "key_vault_uri" {
  value       = azurerm_key_vault.kv.vault_uri
  description = "Key Vault URI — needed for SecretProviderClass manifest"
}

output "key_vault_name" {
  value       = azurerm_key_vault.kv.name
  description = "Key Vault name"
}

# AKS CSI Driver Identity
output "aks_csi_identity_client_id" {
  value       = azurerm_kubernetes_cluster.k8s.key_vault_secrets_provider[0].secret_identity[0].client_id
  description = "Client ID of the CSI driver managed identity — needed for SecretProviderClass manifest"
}