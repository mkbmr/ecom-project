# ============================================
# GENERAL
# ============================================
variable "resource_group_name" {
  description = "Name of the Azure Resource Group"
  type        = string
  default     = "maisonaura-rg2"
}

variable "location" {
  description = "Azure region to deploy resources"
  type        = string
  default     = "southeastasia"
}

# ============================================
# ACR
# ============================================
variable "acr_name" {
  description = "Name of Azure Container Registry (globally unique, alphanumeric only)"
  type        = string
  default     = "maisonauraacr2"
}

# ============================================
# POSTGRESQL
# ============================================
variable "postgres_server_name" {
  description = "Name of PostgreSQL Flexible Server (globally unique)"
  type        = string
  default     = "maisonaura-db2"
}

variable "postgres_admin_user" {
  description = "PostgreSQL administrator username"
  type        = string
  default     = "pgadmin"
}

variable "postgres_admin_password" {
  description = "PostgreSQL administrator password"
  type        = string
  sensitive   = true
}

# ============================================
# AKS
# ============================================
variable "aks_cluster_name" {
  description = "Name of the AKS cluster"
  type        = string
  default     = "maisonaura-aks"
}

# ============================================
# KEY VAULT
# ============================================
variable "key_vault_name" {
  description = "Name of Azure Key Vault (globally unique)"
  type        = string
  default     = "maisonaura-kv2"
}

# ============================================
# APPLICATION SECRETS
# ============================================
variable "jwt_secret" {
  description = "JWT signing secret for authentication"
  type        = string
  sensitive   = true
}

variable "stripe_secret_key" {
  description = "Stripe secret key (sk_test_... or sk_live_...)"
  type        = string
  sensitive   = true
}

variable "stripe_webhook_secret" {
  description = "Stripe webhook signing secret (whsec_...)"
  type        = string
  sensitive   = true
}