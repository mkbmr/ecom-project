# Provider
variable "subscription_id" {
  type        = string
  description = "Azure subscription ID to deploy into"
}

variable "tenant_id" {
  type        = string
  description = "Azure AD tenant ID"
}

# Resource Group
variable "resource_group_name" {
  type        = string
  description = "Name of the existing resource group to deploy into"
}

# ACR
variable "acr_name" {
  type        = string
  description = "Name of the Azure Container Registry"
}

# AKS
variable "aks_cluster_name" {
  type        = string
  description = "maisonaura2-aks"
}

variable "node_vm_size" {
  type        = string
  description = "VM size for the AKS default node pool"
  default     = "Standard_D2as_v4"
}

variable "node_count" {
  type        = number
  description = "Number of nodes in the default node pool"
  default     = 1
}

variable "aks_ssh_public_key" {
  type        = string
  description = "SSH public key for the AKS Linux node pool admin user (must match the key already on the live cluster to avoid forced replacement)"
}

# Key Vault
variable "key_vault_name" {
  type        = string
  description = "Name of the Key Vault (must be globally unique, 3-24 chars, alphanumeric + hyphens)"
}

variable "key_permissions" {
  type        = list(string)
  description = "Key permissions granted to the Terraform runner"
  default     = ["Get", "List"]
}

variable "secret_permissions" {
  type        = list(string)
  description = "Secret permissions granted to the Terraform runner"
  default     = ["Get", "List", "Set", "Delete", "Purge", "Recover"]
}

variable "kv_secrets" {
  type        = map(string)
  description = "Secrets to store in Key Vault"
  sensitive   = true
}