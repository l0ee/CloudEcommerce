# Shopcart Task 4 UI Components Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Extract and improve the Shopcart reusable UI as ten imported components while keeping the existing storefront and its future normalized catalog data compatible.

**Architecture:** Add focused component modules plus a shared product-field utility. Integrate the modules into `main.jsx`, preserve the current callback-style APIs, and extend the existing stylesheet. Tests use the existing Vitest/JSDOM setup without adding dependencies.

**Tech Stack:** React 18, Vite, Vitest 2, JSDOM, lucide-react.

**Spec:** `docs/superpowers/specs/2026-09-25-shopcart-task-4-ui-components-design.md`

## Global Constraints

- Accept both the legacy product fields in `src/main.jsx` and normalized products in `src/data/mockData.js`.
- Do not migrate product data or page implementations in this task.
- Do not add runtime or test dependencies.
- Preserve the existing visual theme and callback-oriented flows.
- Keep unrelated staged and untracked work out of Task 4 commits.

---

### Task 1: Product utilities and presentational components

**Files:**
- Create: `src/components/productUtils.js`
- Create: `src/components/Logo.jsx`
- Create: `src/components/Rating.jsx`
- Create: `src/components/SectionTitle.jsx`
- Create: `src/components/Footer.jsx`
- Create: `tests/components.test.jsx`

**Interfaces:**
- `getProductName(product)`, `getProductPrice(product)`, `getProductOldPrice(product)`, `getProductImage(product)`, `getProductColors(product)`, `getProductRating(product)`, `getProductRatingCount(product)`, `getProductDescription(product)`, and `getDiscountPercent(product)` accept either supported product shape.
- `formatMoney(amount)` returns a USD string.
- `Logo({ onHome })`, `Rating({ value, count })`, `SectionTitle({ eyebrow, title, action, onAction })`, and `Footer({ onNavigate })` are named exports.
- `tests/components.test.jsx` defines a small React DOM render helper using `createRoot` and `act`; later tasks extend this file.

- [ ] **Step 1: Add failing product-shape and presentational tests**

Add fixtures for a legacy record (`price: 89`, `old: 119`, `image: 'product-headphones.png'`, numeric `rating`) and a normalized record (`price: { amount: 89 }`, `oldPrice: { amount: 119 }`, `images: [{ src: '/assets/product-headphones.png' }]`, object `rating`). Assert both yield price 89, prior price 119, the same asset path, rating 4.9, and a 25% discount. Assert `formatMoney(89)` is `$89.00` and `getDiscountPercent` is zero when the prior price is absent or not greater than the current price. Render `Rating` with a count and check its accessible label and visible count.

Create the test mount helper:

```jsx
function render(element) {
  const container = document.createElement('div');
  document.body.append(container);
  const root = createRoot(container);
  act(() => root.render(element));
  return {
    container,
    unmount() {
      act(() => root.unmount());
      container.remove();
    },
  };
}
```

- [ ] **Step 2: Run the targeted tests and confirm they fail**

Run: `npm test -- --reporter=verbose tests/components.test.jsx`
Expected: FAIL because `productUtils.js` and the component modules do not yet exist.

- [ ] **Step 3: Implement the utility and presentational modules**

Use `Number(product.price?.amount ?? product.price ?? 0)` and equivalent access for `oldPrice`/`old`; use `product.images?.[0]?.src` before the legacy `image` field and prefix legacy basenames with `/assets/`. Read ratings from `rating.average ?? rating`, and counts from `rating.count ?? reviewCount ?? 0`. Calculate discount with `Math.round((oldPrice - price) / oldPrice * 100)` only when the prior price exceeds the current price. `formatMoney` uses `Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })`.

Implement `Logo` as a labeled home button using `ShoppingCart`; `Rating` as a star string with a descriptive accessible label and optional review count; `SectionTitle` with an optional action button; and `Footer` by extracting the current footer markup and forwarding navigation callbacks.

- [ ] **Step 4: Run the targeted tests and confirm they pass**

Run: `npm test -- --reporter=verbose tests/components.test.jsx`
Expected: PASS for both product data shapes, money/discount edge cases, and the accessible rating output.

---

### Task 2: Responsive Header, search, and category navigation

**Files:**
- Create: `src/components/Header.jsx`
- Modify: `tests/components.test.jsx`

**Interfaces:**
- `Header({ onNavigate, cartCount, onCart, query, setQuery, onAccount, products, categories, activeCategory })` consumes controlled search state and callbacks; product suggestions navigate with `onNavigate('product', product.id)` and search submission navigates with `onNavigate('listing', target)`.
- Product matching and labels use `productUtils.js`.

- [ ] **Step 1: Add failing tests for clear, keyboard suggestion, and active category**

Render `Header` with two products, one category, `query="air"`, and callback spies. Assert the search input exposes `role="combobox"`, `aria-expanded="true"`, and the suggestion list. Click the labeled clear button and assert `setQuery('')`. In a fresh render, press ArrowDown then Enter and assert navigation to the selected product. Open Categories and assert the current category option has `aria-current="page"`; click it and assert category navigation. Assert the mobile menu button has `aria-expanded` and its drawer closes after selecting a link.

- [ ] **Step 2: Run the focused Header tests and confirm they fail**

Run: `npm test -- --reporter=verbose tests/components.test.jsx -t Header`
Expected: FAIL because `Header.jsx` has not been created.

- [ ] **Step 3: Implement the Header module**

Move the current header/topline/nav markup into `Header.jsx`. Keep query controlled by props. Give the input combobox semantics with `aria-controls`, `aria-expanded`, and `aria-activedescendant`; maintain an active suggestion index for ArrowDown/ArrowUp; Enter selects the active result or submits search; Escape closes suggestions, category menu, or mobile drawer; the clear button clears query and refocuses the input. Render suggestions from `products` using utility name/image/price accessors. Show an active-category attribute in the category menu. Add an overlay and close control to the responsive mobile navigation; close the drawer after navigation. Retain account/cart buttons and cart count.

- [ ] **Step 4: Re-run Header tests and confirm they pass**

Run: `npm test -- --reporter=verbose tests/components.test.jsx -t Header`
Expected: PASS for search control semantics, suggestion selection, category state, and drawer close behavior.

---

### Task 3: Product card and product grid

**Files:**
- Create: `src/components/ProductCard.jsx`
- Create: `src/components/ProductGrid.jsx`
- Modify: `tests/components.test.jsx`

**Interfaces:**
- `ProductCard({ product, onOpen, onAdd, favorite, onFavorite, compact = false })` invokes product callbacks with the product ID or product record as the current app expects.
- `ProductGrid({ items, onOpen, onAdd, favorites, onFavorite, compact = false })` renders cards or an empty state.

- [ ] **Step 1: Add failing tests for card controls, keyboard access, fallback, and empty state**

Render a product card and assert its image/button has a product-specific accessible name, its computed discount is visible, and each color has a labeled swatch. Trigger an image `error` event and assert the fallback appears. Click the favorite, quick-add, and product buttons and assert the supplied callbacks receive the expected values. Render the product target as a native button and assert Enter activation via `.click()` dispatches `onOpen`. Render an empty grid and assert its empty-state heading and explanatory text.

- [ ] **Step 2: Run the focused ProductCard/ProductGrid tests and confirm they fail**

Run: `npm test -- --reporter=verbose tests/components.test.jsx -t 'ProductCard|ProductGrid'`
Expected: FAIL because the component modules do not yet exist.

- [ ] **Step 3: Implement ProductCard and ProductGrid**

Use product utility functions for image, price, prior price, colors, rating, review count, and discount. Keep product activation in a native button separate from the wishlist and quick-add buttons. Add image-error state with an icon/text fallback; preserve legacy marketing tags and show a computed discount badge when applicable. Render favorites with `aria-pressed`, a state-aware label, and visible heart state. Render color indicators with accessible color names. Keep compact mode behavior and use `Rating`. Render an empty-state message when `items` is empty.

- [ ] **Step 4: Re-run ProductCard/ProductGrid tests and confirm they pass**

Run: `npm test -- --reporter=verbose tests/components.test.jsx -t 'ProductCard|ProductGrid'`
Expected: PASS for product activation, fallback, discount/color/favorite/quick-add controls, and empty state.

---

### Task 4: Cart drawer and free-shipping tracker

**Files:**
- Create: `src/components/CartDrawer.jsx`
- Modify: `tests/components.test.jsx`

**Interfaces:**
- `CartDrawer({ items, onClose, onNavigate, onChangeQty, onRemove })` consumes `{ product, qty }` line items.
- Quantity callbacks use `onChangeQty(product.id, nextQty)`; removal uses `onRemove(product.id)`.

- [ ] **Step 1: Add failing tests for item totals and the $50 threshold**

Render a `$20` product with quantity 2. Assert line total and subtotal are `$40.00`, the progress indicator is 80%, and the status reports `$10.00` remaining for free shipping. Click plus, minus, and remove and assert callbacks receive `(id, 3)`, `(id, 1)`, and `(id)`. Render a `$50` subtotal and assert progress is complete and the free-shipping state is announced. Render an empty list and assert the empty-cart browse action is shown.

- [ ] **Step 2: Run the focused CartDrawer tests and confirm they fail**

Run: `npm test -- --reporter=verbose tests/components.test.jsx -t CartDrawer`
Expected: FAIL because `CartDrawer.jsx` does not yet exist.

- [ ] **Step 3: Implement CartDrawer**

Extract the existing drawer structure. For each line, show image, name, color where available, quantity controls, remove action, and `price * qty`. Compute subtotal from all lines. Set progress to `Math.min(subtotal / 50 * 100, 100)` and remaining to `Math.max(50 - subtotal, 0)`. Label the progressbar with min/max/current values and expose the unlocked/remaining message. Keep checkout and continue-shopping actions. Add dialog label, Escape-to-close, backdrop dismissal, and an empty-cart browse state.

- [ ] **Step 4: Re-run CartDrawer tests and confirm they pass**

Run: `npm test -- --reporter=verbose tests/components.test.jsx -t CartDrawer`
Expected: PASS for line totals, callbacks, empty state, and below/at-threshold progress.

---

### Task 5: Account and order modals

**Files:**
- Create: `src/components/AccountModal.jsx`
- Create: `src/components/OrderModal.jsx`
- Modify: `tests/components.test.jsx`

**Interfaces:**
- `AccountModal({ onClose })` renders sign-in inputs and the existing create-account action.
- `OrderModal({ onClose, onContinue })` renders confirmation content and callbacks.

- [ ] **Step 1: Add failing dialog and close-action tests**

Render each modal and assert `role="dialog"`, `aria-modal="true"`, and an accessible heading relationship. Press Escape and assert `onClose`; click the backdrop and assert `onClose`; click the order continue button and assert `onContinue`.

- [ ] **Step 2: Run focused modal tests and confirm they fail**

Run: `npm test -- --reporter=verbose tests/components.test.jsx -t 'AccountModal|OrderModal'`
Expected: FAIL because the modal modules do not yet exist.

- [ ] **Step 3: Extract and implement the modal modules**

Move the current account and order markup into their files. Add `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, labeled close buttons, Escape handling, and backdrop handling. Preserve input types, text, existing close/continue callbacks, and the current styling class names.

- [ ] **Step 4: Re-run modal tests and confirm they pass**

Run: `npm test -- --reporter=verbose tests/components.test.jsx -t 'AccountModal|OrderModal'`
Expected: PASS for dialog semantics and each close/continue path.

---

### Task 6: Integrate components, style, report, and verify

**Files:**
- Modify: `src/main.jsx`
- Modify: `src/style.css`
- Modify: `docs/superpowers/plans/2026-09-25-shopcart-refactor.md` (mark Task 4 steps complete)
- Create: `.superpowers/sdd/2026-09-25-shopcart-refactor/task-4-report.md`

**Interfaces:**
- `main.jsx` imports the ten named component exports and passes current products/categories/category and existing callbacks to `Header`.
- The report records final test/build results and the Task 4 commit hash.

- [ ] **Step 1: Replace inline component definitions with imports**

Import each extracted module at the top of `main.jsx`; remove only the inline `Logo`, `Header`, `Rating`, `ProductCard`, `SectionTitle`, `ProductGrid`, `CartDrawer`, `OrderModal`, `AccountModal`, and `Footer` definitions. Pass `products`, `categories`, and `category` to `Header`. Preserve the inline pages, app state, callback semantics, and all other icons still used by page code.

- [ ] **Step 2: Add component-specific styles**

Append focused rules to `src/style.css` for the mobile drawer/overlay, suggestion active state, focus treatment, fallback, discount badge, color dots, empty state, and free-shipping tracker/progress. Add responsive adjustments at the existing breakpoints and preserve current theme variables and page styles.

- [ ] **Step 3: Run the component test file**

Run: `npm test -- --reporter=verbose tests/components.test.jsx`
Expected: PASS for utilities, Header, product cards/grid, cart drawer, and modals.

- [ ] **Step 4: Run the full test suite and production build**

Run: `npm test`
Expected: PASS for component and existing catalog tests.

Run: `npm run build`
Expected: Vite completes and emits the production bundle.

- [ ] **Step 5: Mark Task 4 complete and write the requested report**

Mark the five Task 4 checklist steps complete in the original refactor plan. Create the report with the component list, interaction/accessibility changes, `main.jsx` integration, exact test/build results, and final commit hash.

- [ ] **Step 6: Review and commit only Task 4 files**

Run `git status --short`, `git diff`, and `git log --oneline -10`. Stage only the Task 4 modules, tests, integration/style changes, Task 4 plan checkbox update, implementation plan, and requested report. Commit with `feat: extract modular shopcart ui components`. Keep pre-existing staged/untracked work out of the commit.
