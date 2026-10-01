# CloudEcommerce — Shopcart Storefront

A responsive electronics and department store prototype inspired by the Shopcart reference. The shop flow includes product browsing, search, filters, product details, favorites, cart, and checkout.

Built with **React 18, JavaScript, and Vite 6**, with an optional Strapi integration for live catalogue and account workflows. Checkout is simulated; this repository is a frontend prototype.

## Features

- Product browsing, search, filtering, and detail views.
- Favorites, cart management, and a simulated checkout flow.
- A mock catalogue for exploration without a backend.
- Optional Strapi-backed registration, sign-in, session restoration, and product publishing.

## Run locally

Use a Node.js version supported by Vite 6 (**Node.js 18, 20, or 22+**) and npm. Node.js 22+ is recommended for a new setup.

```bash
git clone https://github.com/l0ee/CloudEcommerce.git
cd CloudEcommerce
npm ci
npm run dev
```

Open the local address printed by Vite. Without a configured Strapi URL, development uses the mock catalogue.

## Development commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm test` | Run the Vitest suite |
| `npm run build` | Build the production bundle in `dist` |
| `npm run preview` | Preview the production bundle locally |

The test suite includes account flows, authentication sessions, catalogue services, cart and favorites, checkout validation, and product-selling flows.

## Repository layout

| Directory | Purpose |
| --- | --- |
| `src/components/` | Reusable interface components |
| `src/pages/` | Storefront page views |
| `src/services/` | Backend and application services |
| `src/data/` | Catalogue data |
| `tests/` | Unit and interface tests |
| `docs/` | Additional project documentation |

## Live Strapi presentation setup

Create `.env.local` (or set the variable in your hosting environment):

```env
VITE_STRAPI_API_URL=https://your-strapi-domain.example
```

Restart `npm run dev` after changing the environment. Without this URL, the storefront shows its original mock catalogue. `.env.production` supplies the current public Cloudflare tunnel URL for production builds; replace it or set `VITE_STRAPI_API_URL` in your deployment environment when the temporary tunnel changes. Do **not** put a Strapi admin/API token in any `VITE_` variable: Vite includes it in the publicly downloadable JavaScript. Browser users register and sign in using Strapi's Users & Permissions JWT instead.

In Strapi admin, configure **Settings → Users & Permissions plugin → Roles**:

- **Public:** enable `Product.find`, `Product.findOne`, `Category.find` and `Category.findOne` for browsing; enable `Auth.register` if public signup is part of the demo.
- **Authenticated:** enable `Product.create` and upload plugin's `upload` action, plus the read actions used above. Confirm the Users & Permissions plugin permits `Auth.callback` (login) and `User.me` (session restore) in your version.
- Ensure the product and category content types have records; verify product `title`, `description`, `price`, `stock`, `category` and single `image` fields match the forms. Configure Strapi CORS to allow your frontend origin. Strapi v5 REST POST publishes by default unless the request explicitly uses `status=draft`.

Demo path: create account → sign in → Sell Product → select a category and image → publish → browse the updated catalogue → add to cart → simulated checkout. If signup uses email confirmation, confirm the account before sign-in. This demo allows any authenticated user to create listings; server-side seller ownership/approval is not configured.
