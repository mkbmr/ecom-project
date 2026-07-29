data "azurerm_client_config" "current" {}

# Resource Group - referencing existing, not creating
data "azurerm_resource_group" "rg" {
  name = var.resource_group_name
}

# Azure Container Registry
resource "azurerm_container_registry" "acr" {
  name                = var.acr_name
  resource_group_name = data.azurerm_resource_group.rg.name
  location            = data.azurerm_resource_group.rg.location
  sku                 = "Basic"
  admin_enabled       = false
}

# AKS Cluster
resource "azurerm_kubernetes_cluster" "k8s" {
  name                = var.aks_cluster_name
  location            = data.azurerm_resource_group.rg.location
  resource_group_name = data.azurerm_resource_group.rg.name
  dns_prefix          = "maisonaura-maisonaura-rg2-3559b1"
  oidc_issuer_enabled = true

  identity {
    type = "SystemAssigned"
  }

  default_node_pool {
    name       = "nodepool1"
    vm_size    = var.node_vm_size
    node_count = var.node_count

    upgrade_settings {
      max_surge = "10%"
    }
  }

  linux_profile {
    admin_username = "azureuser"
    ssh_key {
      key_data = var.aks_ssh_public_key
    }
  }

  key_vault_secrets_provider {
    secret_rotation_enabled = true
  }

  network_profile {
    network_plugin      = "azure"
    network_plugin_mode = "overlay"
    load_balancer_sku   = "standard"
  }
}

# Allow AKS kubelet to pull images from ACR
resource "azurerm_role_assignment" "aks_acr_pull" {
  scope                = azurerm_container_registry.acr.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_kubernetes_cluster.k8s.kubelet_identity[0].object_id
}

# Key Vault
resource "azurerm_key_vault" "kv" {
  name                       = var.key_vault_name
  location                   = data.azurerm_resource_group.rg.location
  resource_group_name        = data.azurerm_resource_group.rg.name
  tenant_id                  = data.azurerm_client_config.current.tenant_id
  sku_name                   = "standard"
  soft_delete_retention_days = 7
}

# Grant the Terraform runner access to manage Key Vault secrets
resource "azurerm_key_vault_access_policy" "runner" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = data.azurerm_client_config.current.object_id

  key_permissions    = var.key_permissions
  secret_permissions = var.secret_permissions
}

# Grant AKS managed identity access to read secrets from Key Vault
resource "azurerm_key_vault_access_policy" "aks_kv_access" {
  key_vault_id = azurerm_key_vault.kv.id
  tenant_id    = data.azurerm_client_config.current.tenant_id
  object_id    = azurerm_kubernetes_cluster.k8s.key_vault_secrets_provider[0].secret_identity[0].object_id

  secret_permissions = ["Get", "List"]
}

# Key Vault Secrets
resource "azurerm_key_vault_secret" "secrets" {
  for_each     = toset(nonsensitive(keys(var.kv_secrets)))
  name         = each.value
  value        = var.kv_secrets[each.value]
  key_vault_id = azurerm_key_vault.kv.id

  depends_on = [azurerm_key_vault_access_policy.runner]
}