# Maison Aura — Full-Stack E-Commerce on Azure Kubernetes

A full-stack luxury e-commerce platform built from scratch — React storefront, Node.js/Express API, PostgreSQL, Stripe payments — containerised with Docker and deployed to Azure Kubernetes Service (AKS) with images in Azure Container Registry and a managed Azure Postgres database.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 (Vite), React Router v7, Recharts |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL (local: 17, Azure Flexible Server: 15) |
| Payments | Stripe (Payment Intents + webhooks) |
| Auth | JWT (jsonwebtoken), bcrypt |
| Containerisation | Docker, Docker Compose, nginx (frontend serving + API proxy) |
| Cloud | Azure Kubernetes Service, Azure Container Registry, Azure Database for PostgreSQL |
| CI/CD | GitHub Actions (lint + npm audit → build → Trivy scan → push to ACR → deploy to AKS) |
| Styling | CSS (component-scoped), Google Fonts (Cinzel, Playfair Display) |

---

## Architecture

```
                        ┌─────────────────────────── AKS cluster ───────────────────────────┐
Browser ── http://<LB-IP> ──▶ frontend Service (LoadBalancer)                               │
                        │        │                                                          │
                        │        ▼                                                          │
                        │   frontend pod (nginx)                                            │
                        │     • serves React build                                          │
                        │     • proxies /api/* ──▶ backend Service (ClusterIP :5000)        │
                        │                              │                                    │
                        │   stripe-cli pod ────────────┤  forwards Stripe webhook events    │
                        │                              ▼                                    │
                        │                         backend pod (Express :5000)               │
                        └──────────────────────────────│────────────────────────────────────┘
                                                       ▼
                                    Azure Database for PostgreSQL (sslmode=require)
```

Locally, the same three containers run under Docker Compose, with the backend pointing at Postgres on the host machine.

---

## Project Structure

```
ecom-project/
  frontend/
    src/
      pages/            # routed pages (Collection, ProductDetail, login/register,
        admin/          #   admin tabs: Overview, Products, Customers, Atelier)
      component/        # Header, Footer, Layout, CartSidebar, admin charts
    Dockerfile          # multi-stage: Vite build → nginx
    nginx.conf          # SPA routing + /api proxy to backend
  backend/
    server.js           # Express API (all routes)
    db.js               # pg Pool (SSL in production)
    init.sql            # schema
    seed.sql            # sample products/variants
    Dockerfile
  k8s/
    backend-deployment.yaml    # Deployment + ClusterIP Service :5000
    frontend-deployment.yaml   # Deployment + LoadBalancer Service :80
    stripe-deployment.yaml     # stripe-cli webhook forwarder
  docker-compose.yml
```

---

## Features

**Customer**
- Browse collections, product detail pages with variants (colour / size / stock)
- Cart sidebar with Stripe Elements checkout (Payment Intents)
- Register / login (JWT), order history
- "Atelier Fitting" size automatically books a private fitting appointment

**Admin dashboard** (role-gated)
- Overview: revenue cards and charts (Recharts), top sellers, category split, recent orders
- Products: full CRUD including per-product variants and stock
- Customers: list with per-customer order history
- Atelier: manage fitting appointments (status + message to customer)

---

## Getting Started (local, Docker Compose)

Prereqs: Docker, a local PostgreSQL with the `maison_aura` database (`init.sql` + `seed.sql`), and Stripe test keys.

1. Create `backend/.env`:

```env
DB_USER=postgres
DB_PASSWORD=<your-password>
DB_HOST=localhost          # compose overrides this to host.docker.internal
DB_PORT=5432
DB_NAME=maison_aura
JWT_SECRET=<random-string>
PORT=5000
CORS_ORIGIN=http://localhost
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...   # from: stripe listen --print-secret
```

2. Create `frontend/.env`:

```env
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

3. Run:

```bash
export STRIPE_SECRET_KEY=sk_test_...   # used by the stripe-cli container
docker compose up --build
```

Frontend: http://localhost — the compose stack includes a `stripe-cli` container that forwards webhook events to the backend, so checkout works end-to-end locally.

---

## Cloud Deployment (Azure / AKS)

### 1. Provision

```bash
az group create --name maisonaura-rg2 --location southeastasia
az acr create -g maisonaura-rg2 -n maisonauraacr2 --sku Basic
az aks create -g maisonaura-rg2 -n maisonaura2-aks --node-count 1 \
  --node-vm-size Standard_B2s --generate-ssh-keys --attach-acr maisonauraacr2
az postgres flexible-server create -g maisonaura-rg2 -n maison-pg \
  --admin-user postgres --admin-password '<password>' \
  --sku-name Standard_B1ms --tier Burstable --storage-size 32 --version 15
az postgres flexible-server db create -g maisonaura-rg2 -s maison-pg -n maison_aura
```

### 2. Build & push images

```bash
az acr login --name maisonauraacr2
docker build -t maisonauraacr2.azurecr.io/backend:v1 ./backend && docker push maisonauraacr2.azurecr.io/backend:v1
docker build -t maisonauraacr2.azurecr.io/frontend:v1 ./frontend && docker push maisonauraacr2.azurecr.io/frontend:v1
```

### 3. Secrets

The backend reads individual `DB_*` variables (not a connection string) plus JWT and Stripe keys:

```bash
az aks get-credentials -g maisonaura-rg2 -n maisonaura2-aks

kubectl create secret generic db-secret \
  --from-literal=DB_USER=postgres \
  --from-literal=DB_PASSWORD='<password>' \
  --from-literal=DB_HOST=maison-pg.postgres.database.azure.com \
  --from-literal=DB_PORT=5432 \
  --from-literal=DB_NAME=maison_aura

kubectl create secret generic app-secret \
  --from-literal=JWT_SECRET='<random-string>' \
  --from-literal=CORS_ORIGIN='http://<frontend-external-ip>'

kubectl create secret generic stripe-secret \
  --from-literal=STRIPE_SECRET_KEY='sk_test_...' \
  --from-literal=STRIPE_WEBHOOK_SECRET='whsec_...'
```

### 4. Migrate data & deploy

```bash
# copy local DB to Azure Postgres
pg_dump -h localhost -U postgres -d maison_aura --no-owner --no-privileges --clean --if-exists -f dump.sql
psql "host=maison-pg.postgres.database.azure.com user=postgres dbname=maison_aura sslmode=require" -f dump.sql

kubectl apply -f k8s/
kubectl get svc frontend   # EXTERNAL-IP = the site URL
```

### 5. Verify

```bash
kubectl get pods                  # backend, frontend, stripe-cli all Running
kubectl logs deploy/stripe-cli    # "Ready! ... forwarding to http://backend:5000/api/webhook"
curl http://<external-ip>/api/products
```

---

## CI/CD (GitHub Actions)

Every push to `main` (except markdown-only changes) runs `.github/workflows/ci-cd.yml`:

```
push to main ──▶ lint ─────────────┐
                  │                ├──▶ build-and-push ──▶ deploy
             dependency-audit ─────┘         │                │
                  │                          │                └─ az aks get-credentials
                  │                          │                   kubectl apply -f k8s/
                  │                          │                   kubectl set image (new SHA tag)
                  │                          │                   kubectl rollout status
                  │                          └─ az acr login
                  │                             docker build backend:<sha> and frontend:<sha>
                  │                             Trivy scan both images (HIGH/CRITICAL → fail)
                  │                             docker push (only if scans pass)
                  └─ eslint (frontend) + node --check (backend)
```

**Security gates** — the pipeline blocks deployment on HIGH or CRITICAL CVEs at two layers:

1. **`npm audit`** (dependency-audit job) — scans the app's npm dependency tree against known advisories; backend is scanned with `--omit=dev` (only what ships in the image).
2. **Trivy** (build-and-push job) — scans the *built Docker images*, including the base OS layer, after `docker build` and before `docker push`, so a vulnerable image never reaches ACR. `ignore-unfixed: true` skips CVEs with no released patch (unactionable); if a fixed CVE ever blocks the pipeline legitimately, add it to a `.trivyignore` with a justification comment rather than removing the gate.

Trivy earned its place immediately: it flagged HIGH CVEs that `npm audit` couldn't see because they lived in the base images, not the app dependencies — a vulnerable `undici` vendored inside the base image's bundled npm (fixed by deleting npm from the final backend image; the runtime only needs `node`), and unpatched Alpine OS packages in `nginx:alpine` (fixed with `apk upgrade --no-cache` in the frontend Dockerfile).

**Image tagging** — images are tagged with the git commit SHA (`${{ github.sha }}`), not `v1`/`v2`. The tag is immutable and traceable back to the exact commit, and a new tag on every run guarantees `kubectl set image` actually triggers a rollout (reusing a tag like `latest` would be a no-op).

**Authentication** — the workflow logs in with a service principal (`maisonaura-github-cicd`) scoped to least privilege:

| Role | Scope |
|---|---|
| `AcrPush` | the ACR only |
| `Azure Kubernetes Service Cluster User Role` | the AKS cluster only |

One-time setup:

```bash
# create the SP and grant only what the pipeline needs
az ad sp create-for-rbac --name maisonaura-github-cicd --json-auth \
  --role AcrPush \
  --scopes $(az acr show -n maisonauraacr2 --query id -o tsv)
az role assignment create \
  --assignee <clientId> \
  --role "Azure Kubernetes Service Cluster User Role" \
  --scope $(az aks show -g maisonaura-rg2 -n maisonaura2-aks --query id -o tsv)
```

Save the full JSON output (`clientId`, `clientSecret`, `subscriptionId`, `tenantId`) as a GitHub **repository secret** named `AZURE_CREDENTIALS` (Settings → Secrets and variables → Actions). If the secret is missing or misnamed, `azure/login` fails with *"Ensure 'client-id' and 'tenant-id' are supplied"* — GitHub injects an empty string for unknown secrets rather than erroring.

---

## Pausing & Starting the Cluster (cost saving)

The two billable always-on resources are the AKS node and the Postgres server. Stop both between demos:

```bash
# stop (order doesn't matter)
az aks stop -g maisonaura-rg2 -n maisonaura2-aks
az postgres flexible-server stop -g maisonaura-rg2 -n maison-pg

# start again before a demo (~3–5 min each)
az postgres flexible-server start -g maisonaura-rg2 -n maison-pg
az aks start -g maisonaura-rg2 -n maisonaura2-aks

# verify
az aks show -g maisonaura-rg2 -n maisonaura2-aks --query powerState.code -o tsv   # Running
kubectl get pods                                                                    # all Running
kubectl get svc frontend                                                            # note EXTERNAL-IP
```

Notes:
- The frontend **LoadBalancer IP may change** after a restart — re-check `kubectl get svc frontend` and update `CORS_ORIGIN` in `app-secret` if it did.
- A stopped Postgres flexible server **auto-starts after 7 days** (Azure policy) — stop it again if you're pausing longer.
- Stopped AKS still bills for disks and the ACR (Basic ≈ $0.17/day); compute charges stop.

---

## Future Improvements

- **Monitoring & observability** — enable AKS Container Insights (`az aks enable-addons -a monitoring`) for pod/node metrics and logs in Log Analytics; longer-term, Prometheus + Grafana (Azure Managed Prometheus) with alerts on pod restarts, 5xx rates, and Postgres connections.
- **Cost management** — create an Azure Budget with email alerts (`az consumption budget`), review Cost Analysis weekly, and tag resources (`project=maisonaura`) so spend is attributable. Automate the stop/start schedule above with a cron-triggered GitHub Actions workflow.
- **TLS + ingress** — replace the LoadBalancer service with an ingress controller + cert-manager for HTTPS.
- **DB hardening** — restrict the Postgres firewall to the AKS egress IP instead of allow-all.
- **Automated secrets injection** — replace the manual `kubectl create secret` steps with Azure Key Vault + the Secrets Store CSI driver (addon already enabled on the cluster): a `SecretProviderClass` syncs vault secrets into the existing K8s Secrets, so deployments need no changes. Gotcha to handle: env-var secrets require a pod restart on rotation — only mounted files update live.

---

## Database Schema

Six tables (see `backend/init.sql`): `users`, `products`, `product_variants` (colour/size/stock per product), `orders`, `order_items`, `atelier_appointments`.

---

## API Routes

| Method & Path | Auth | Purpose |
|---|---|---|
| `GET /api/health` | — | health check |
| `GET /api/products`, `GET /api/products/:id` | — | catalogue |
| `GET /api/products/:id/variants` | — | variants for a product |
| `POST /api/register`, `POST /api/login` | — | auth (bcrypt + JWT) |
| `POST /api/create-payment-intent` | user | start Stripe checkout |
| `POST /api/webhook` | Stripe signature | create order on `payment_intent.succeeded` |
| `GET /api/my-orders` | user | order history |
| `POST /api/atelier`, `GET/PUT /api/atelier/:id` | user / admin | fitting appointments |
| `POST/PUT/DELETE /api/products*`, `/api/variants/:id` | admin | product CRUD |
| `GET /api/admin/overview`, `/stock`, `/customers`, `/customers/:id/orders` | admin | dashboard data |

---

# Stripe Payment Integration

How checkout payments are processed for Maison Aura, and why the flow is built the way it is.

## Overview

Checkout uses **Stripe Elements (Payment Intents API)** on the frontend and a **webhook-driven order creation** flow on the backend. The order is never created by the client directly — it's only created once Stripe confirms the payment succeeded. This avoids trusting the browser for anything financial (amount, order existence, stock deduction).

```
Customer            Frontend (CartSidebar)         Backend                      Stripe
   |                        |                          |                          |
   |  Checkout              |                          |                          |
   |----------------------->| POST /api/create-payment-intent                     |
   |                        |------------------------->| create PaymentIntent     |
   |                        |                          |------------------------->|
   |                        |                          |<-- client_secret --------|
   |                        |<-- clientSecret ---------|                          |
   |  Enters card details   |                          |                          |
   |----------------------->| stripe.confirmPayment()  |                          |
   |                        |---------------------------------------------------->|
   |                        |                          |    payment_intent.succeeded (webhook)
   |                        |                          |<-------------------------|
   |                        |                          | create order + order_items
   |                        |                          | reduce stock             |
   |  Redirected to /checkout-success                  |                          |
```

## Environment Variables

| File | Variable | Purpose |
|---|---|---|
| `backend/.env` | `STRIPE_SECRET_KEY` | Server-side key, used to create PaymentIntents |
| `backend/.env` | `STRIPE_WEBHOOK_SECRET` | Verifies webhook requests actually came from Stripe |
| `frontend/.env` | `VITE_STRIPE_PUBLISHABLE_KEY` | Client-side key, used by `loadStripe()` |

All keys used are **test mode** (`sk_test_...` / `pk_test_...`).

## Backend

### `POST /api/create-payment-intent`
- Requires a logged-in user (`requireAuth`).
- Takes `cartItems` from the request body, recalculates the total server-side (`price * quantity`, in cents).
- Creates a Stripe `PaymentIntent` with `cartItems` and `userId` stashed in `metadata` (Stripe metadata values must be strings, so `cartItems` is JSON-stringified).
- Returns `clientSecret` to the frontend — this is what `Elements` needs to render the payment form.

### `POST /api/webhook`
- Mounted with `express.raw({ type: 'application/json' })` **before** `express.json()` is applied globally — Stripe signature verification (`stripe.webhooks.constructEvent`) needs the raw, unparsed body, not JSON.
- Verifies the `stripe-signature` header against `STRIPE_WEBHOOK_SECRET`.
- On `payment_intent.succeeded`:
  1. Parses `cartItems` back out of the PaymentIntent's metadata.
  2. Inserts a row into `orders` (`status = 'completed'`).
  3. Inserts one `order_items` row per cart item.
  4. If an item's `size` is `'Atelier Fitting'`, also inserts a row into `atelier_appointments` (pulling the buyer's contact details from `users`) — buying that size automatically books a private fitting request, visible in Admin → Atelier tab.
  5. Checks and decrements `product_variants.stock`; rolls back the whole transaction if stock is insufficient.

This all runs in a single Postgres transaction (`BEGIN` / `COMMIT` / `ROLLBACK`) so a partial failure (e.g. one item out of stock) doesn't leave a half-created order.

### Webhook delivery

Stripe can't reach `localhost` or a cluster-internal service directly, so webhook events are forwarded by the Stripe CLI in both environments:

- **Local**: the `stripe-cli` container in `docker-compose.yml` runs `stripe listen --forward-to backend:5000/api/webhook`.
- **AKS**: `k8s/stripe-deployment.yaml` runs the same forwarder as a pod inside the cluster — no public HTTPS webhook endpoint or ingress needed.

Both use the signing secret printed by `stripe listen --print-secret` as `STRIPE_WEBHOOK_SECRET` (valid ~90 days per API key).

## Frontend

`frontend/src/component/CartSidebar.jsx`:
- `loadStripe(VITE_STRIPE_PUBLISHABLE_KEY, { developerTools: { assistant: { enabled: false } } })` — the second arg disables Stripe's test-mode "card presets" dev overlay.
- `handleCheckout()` calls `/api/create-payment-intent`, then swaps the cart view to a payment step using `<Elements clientSecret={...}>` wrapping a `<PaymentElement />`.
- `CheckoutForm` calls `stripe.confirmPayment({ elements, redirect: 'if_required' })`. Using `redirect: 'if_required'` means Stripe only redirects away from the page if the payment method needs an off-site step (e.g. 3DS); otherwise it resolves inline and `onSuccess()` fires immediately.
- On success: cart is cleared, sidebar closes, and the user is routed to `/checkout-success`. The order itself has (or is about to be) created asynchronously by the webhook, not by this success handler.

## Test Cards

| Card | Behaviour |
|---|---|
| `4242 4242 4242 4242` | Successful payment |
| `4000 0025 0000 3155` | Requires 3DS authentication |
| `4000 0000 0000 0002` | Declined |
| `4000 0000 0000 9995` | Declined — insufficient funds |

Any future expiry date, any 3-digit CVC.

---

## Security Notes

- Secrets never live in images or manifests — injected via `.env` locally and Kubernetes Secrets in AKS.
- Webhook requests are signature-verified; orders and stock changes happen only server-side inside a transaction.
- Passwords hashed with bcrypt; admin routes gated by JWT role checks; DB connection uses TLS (`sslmode=require`) in the cloud.

## Known Limitations

- **Redirect race condition**: `/checkout-success` doesn't receive an `orderId`, because the order is created by the webhook asynchronously — it may not exist yet at the moment the browser redirects. The success page handles a missing `orderId` gracefully but doesn't currently poll for it.
- **No server-side price validation against the DB**: `create-payment-intent` trusts the `price` sent by the client when computing the charge total. Fine for a demo/portfolio project; a production version should look up prices from `product_variants` server-side instead.
- **Legacy route**: `POST /api/checkout` (the pre-Stripe, synchronous order-creation endpoint) is still in `server.js` but is no longer called by the frontend. Safe to remove once confirmed unused elsewhere.
- **Demo-grade network security**: Azure Postgres currently allows all IPs; production would restrict the firewall to the AKS egress IP, and the site is HTTP-only (no ingress/TLS).

## Author

Khalis
