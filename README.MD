## Project Overview (2-3 sentences)
A full-stack luxry e-commerce platform built from scratch, including frontend, backend, database, authentication, and containerisation.

---

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 19 (Vite), React Router v7, Recharts |
| Backend | Node.js, Express 5 |
| Database | PostgreSQL 17 |
| Auth | JWT (jsonwebtoken), bcrypt |
| Containerisation | Docker, Docker Compose |
| Styling | CSS (component-scoped), Google Fonts (Cinzel, Playfair Display) |

---

## Project Structure

```
ecom-project/
  frontend/
    src/
      pages/
        admin/
          OverviewTab.jsx
          ProductsTab.jsx
          CustomersTab.jsx
          AtelierTab.jsx
        Collection.jsx
        ProductDetail.jsx
        MaisonLogin.jsx
        MaisonRegister.jsx
        MaisonAbout.jsx
        MaisonSpecs.jsx
        MaisonConfigurator.jsx
        ContactSupport.jsx
        CheckoutSuccess.jsx
        CartContext.jsx
      component/
        admin/
          RevenueCards.jsx
          RevenueChart.jsx
          OrdersChart.jsx
          StockOverview.jsx
          StockChecking.jsx
          TopSellingItems.jsx
          CategorySplit.jsx
          RecentOrders.jsx
        AdminDashboard.jsx
        Header.jsx
        Footer.jsx
        Layout.jsx
        CartSidebar.jsx
        Logo.jsx
    Dockerfile
    nginx.conf
    .env
  backend/
    server.js
    db.js
    init.sql
    Dockerfile
    .env
    .env.docker
  docker-compose.yml
  .gitignore
```

---

## Features

### Customer-Facing


4. Features
   - Customer: browse, cart, checkout, login/register
   - Admin: products CRUD, customers, atelier, overview
5. Architecture diagram (optional but impressive)
6. Getting Started (local setup)
7. Docker setup
8. Database Schema
9. API Routes
10. Security
11. Planned improvements
12. Author

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

### Local webhook testing

Stripe can't reach `localhost` directly, so webhooks are forwarded with the Stripe CLI:

```bash
stripe listen --forward-to localhost:5000/api/webhook
```

This prints a `whsec_...` value — that's what goes in `STRIPE_WEBHOOK_SECRET` for local dev.

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

## Known Limitations

- **Redirect race condition**: `/checkout-success` doesn't receive an `orderId`, because the order is created by the webhook asynchronously — it may not exist yet at the moment the browser redirects. The success page handles a missing `orderId` gracefully but doesn't currently poll for it.
- **No server-side price validation against the DB**: `create-payment-intent` trusts the `price` sent by the client when computing the charge total. Fine for a demo/portfolio project; a production version should look up prices from `product_variants` server-side instead.
- **Legacy route**: `POST /api/checkout` (the pre-Stripe, synchronous order-creation endpoint) is still in `server.js` but is no longer called by the frontend. Safe to remove once confirmed unused elsewhere.
