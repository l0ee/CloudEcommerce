# Shopcart Storefront UX/UI & Code Architecture Refactor Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor Shopcart React storefront into a clean, modular architecture prepared for Strapi, with improved UI/UX, full state persistence, responsive design, checkout validation, accessible controls, and unit tests.

**Architecture:** Split `src/main.jsx` into data types/models, catalog service abstraction (`src/services/catalogService.js`), custom state hooks (`useCart`, `useFavorites`, `useUrlState`), UI components (`src/components/*`), pages (`src/pages/*`), and add documentation for future Strapi integration. Add Vitest for automated unit tests verifying shopping behaviors.

**Tech Stack:** React 18, Vite, Lucide React, Vitest, JSDOM.

---

### Task 1: Setup Testing & Project Structure Scaffolding

**Files:**
- Modify: `package.json`
- Create: `vitest.config.js`
- Create: `src/types/dataTypes.js`
- Create: `src/data/mockData.js`

- [ ] **Step 1: Update package.json to include vitest and test command**

```json
{
  "name": "shopcart-storefront",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "vitest run"
  },
  "dependencies": {
    "lucide-react": "^0.468.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1"
  },
  "devDependencies": {
    "vite": "^6.0.5",
    "vitest": "^2.1.8",
    "jsdom": "^25.0.1"
  }
}
```

- [ ] **Step 2: Create `vitest.config.js`**

```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
  },
});
```

- [ ] **Step 3: Create `src/types/dataTypes.js` for normalized data shapes**

Define product, category, promo, and filter data shapes.

- [ ] **Step 4: Create `src/data/mockData.js` with rich product catalog**

Extract and extend product and category list with stable slugs, full specs, variant colors, ratings, images, and stock info.

- [ ] **Step 5: Run tests / install dependencies**

Run `npm install` and `npm test` to verify Vitest works.

- [ ] **Step 6: Commit changes**

```bash
git add package.json vitest.config.js src/types/dataTypes.js src/data/mockData.js
git commit -m "chore: setup vitest testing environment and mock catalog data"
```

---

### Task 2: Service Boundary & Catalog Service (`catalogService.js`)

**Files:**
- Create: `src/services/apiConfig.js`
- Create: `src/services/catalogService.js`
- Test: `tests/catalogService.test.js`

- [ ] **Step 1: Write test for `catalogService` filtering and search**
- [ ] **Step 2: Implement `src/services/apiConfig.js` reading `import.meta.env.VITE_STRAPI_API_URL` and `VITE_STRAPI_TOKEN`**
- [ ] **Step 3: Implement `src/services/catalogService.js` with async methods: `getProducts`, `getProductById`, `getProductBySlug`, `getCategories`, `getBrands`, `getPromotions`**
- [ ] **Step 4: Verify test passes**
- [ ] **Step 5: Commit**

---

### Task 3: Local Storage Hooks (`useCart`, `useFavorites`) & Tests

**Files:**
- Create: `src/hooks/useCart.js`
- Create: `src/hooks/useFavorites.js`
- Test: `tests/cartFavorites.test.js`

- [ ] **Step 1: Write test for cart quantity changes, removal, and local storage persistence**
- [ ] **Step 2: Write test for favorites toggle and local storage persistence**
- [ ] **Step 3: Implement `useCart` hook**
- [ ] **Step 4: Implement `useFavorites` hook**
- [ ] **Step 5: Verify tests pass**
- [ ] **Step 6: Commit**

---

### Task 4: Modular Navigation & Layout Components

**Files:**
- Create: `src/components/Logo.jsx`
- Create: `src/components/Rating.jsx`
- Create: `src/components/SectionTitle.jsx`
- Create: `src/components/Header.jsx`
- Create: `src/components/Footer.jsx`
- Create: `src/components/ProductCard.jsx`
- Create: `src/components/ProductGrid.jsx`
- Create: `src/components/CartDrawer.jsx`
- Create: `src/components/AccountModal.jsx`
- Create: `src/components/OrderModal.jsx`

- [x] **Step 1: Extract reusable UI elements into separate files**
- [x] **Step 2: Enhance Header search bar with suggestion popover, keyboard clearing, accessibility labels (`aria-expanded`, `aria-label`)**
- [x] **Step 3: Refine ProductCard layout (price, discount badge, star rating, color swatches, quick add, heart button, accessible tap target)**
- [x] **Step 4: Refine CartDrawer layout with line totals, quantity controls, remove buttons, subtotal, free shipping progress indicator**
- [x] **Step 5: Commit**

---

### Task 5: Pages Implementation & Form Validation

**Files:**
- Create: `src/pages/HomePage.jsx`
- Create: `src/pages/ListingPage.jsx`
- Create: `src/pages/ProductDetailPage.jsx`
- Create: `src/pages/CheckoutPage.jsx`
- Test: `tests/checkoutValidation.test.js`

- [ ] **Step 1: Write test for Checkout field validation and coupon application**
- [ ] **Step 2: Implement `HomePage.jsx` with category grid, featured deals, hero section, promo band, and trust badges**
- [ ] **Step 3: Implement `ListingPage.jsx` with active filter chips, reset all button, price/rating/color popovers, sort selector, and pagination**
- [ ] **Step 4: Implement `ProductDetailPage.jsx` with multi-image gallery thumbnail picker, color selector, quantity control, stock status, delivery postal code check, and detailed specifications**
- [ ] **Step 5: Implement `CheckoutPage.jsx` with validated fields (first name, last name, email, street, city, postal code), error state rendering, order summary breakdown, promo code application, and secure simulated checkout**
- [ ] **Step 6: Verify checkout validation test passes**
- [ ] **Step 7: Commit**

---

### Task 6: Routing & App Assembly

**Files:**
- Modify: `src/main.jsx`
- Refine: `src/style.css`

- [ ] **Step 1: Implement URL hash routing in `App` component (`#home`, `#category/:slug`, `#product/:slug`, `#checkout`) for direct link support and browser refresh**
- [ ] **Step 2: Refine styling in `src/style.css` for typography, spacing, responsive grid, focus rings, hover transitions, and mobile drawer touch targets**
- [ ] **Step 3: Connect all components, toast notifications, modals, and persisted hooks in `src/main.jsx`**
- [ ] **Step 4: Commit**

---

### Task 7: Strapi Documentation & Build Verification

**Files:**
- Create: `docs/strapi-integration.md`

- [ ] **Step 1: Create `docs/strapi-integration.md` detailing proposed content types (Products, Categories, Brands, Promotions), field types, Strapi environment variables, media URL transformer helper, and steps to switch `catalogService.js` to Strapi GraphQL/REST API**
- [ ] **Step 2: Run `npm run build` to verify clean build without TypeScript/bundler warnings or errors**
- [ ] **Step 3: Run `npm test` to verify all unit tests pass**
- [ ] **Step 4: Commit**
