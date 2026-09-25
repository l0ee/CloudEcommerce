# Shopcart Task 4: UI Components Design

## Goal

Extract the storefront's reusable UI from `src/main.jsx` into the ten component
modules listed in Task 4 of
`docs/superpowers/plans/2026-09-25-shopcart-refactor.md`, improve their specified
interactions and accessibility, and keep the current storefront working through
the extracted components.

## Architecture and data flow

- Create `Logo`, `Rating`, `SectionTitle`, `Header`, `Footer`, `ProductCard`,
  `ProductGrid`, `CartDrawer`, `AccountModal`, and `OrderModal` under
  `src/components/`.
- Add a small component utility for product name, price, prior price, image,
  colors, rating, and category access. It will accept both the legacy shape
  currently used by `main.jsx` and normalized catalog records from
  `src/data/mockData.js`; the product dataset and pages are not migrated in
  this task.
- Preserve existing callback-oriented component APIs where practical. `Header`
  receives product/category lists, current category, controlled search state,
  navigation, account, and cart callbacks. `ProductGrid` passes product and
  favorite/add callbacks to `ProductCard`. `CartDrawer` receives `{ product,
  qty }` items, quantity/remove callbacks, navigation, and close callbacks.
- Import the extracted components from `src/main.jsx` and remove their inline
  duplicates so the new modules are exercised by the current app.
- Keep the existing visual theme and extend `src/style.css` for the additions.
  No new runtime or test dependencies are required.

## Component behavior

- `Logo`, `Rating`, and `SectionTitle` retain their reusable presentational
  roles; `Footer` retains the existing navigation and newsletter presentation.
- `Header` has a responsive mobile navigation drawer, active category state,
  controlled search with suggestions, keyboard selection/dismissal, and a
  labeled clear-search action.
- `ProductCard` has image-error fallback UI, product/discount badges, rating,
  color indicators, favorite toggle, quick add, and a native keyboard-operable
  product target. Interactive controls remain separate rather than nested.
- `ProductGrid` renders a helpful empty state when there are no products.
- `CartDrawer` renders line totals, quantity controls, remove actions, subtotal,
  and progress toward free shipping at $50; an empty cart has a browse action.
- `AccountModal` and `OrderModal` expose labeled dialogs and support their
  existing close/continue callbacks.

## Accessibility and styling

- Use native buttons and inputs, visible focus styles, descriptive `aria-label`
  and `aria-pressed` states, search `aria-expanded`/combobox relationships,
  active-category indication, and labeled modal dialogs.
- Support Escape and backdrop dismissal for open overlays, prevent nested
  interactive controls in product cards, and retain responsive touch targets.
- Extend current component styles without changing unrelated page layouts.

## Verification and deliverables

- Add focused component interaction tests for key search, product-card, and
  cart-drawer behaviors using the existing Vitest/JSDOM setup.
- Run `npm test` and `npm run build`.
- Write the implementation report to
  `.superpowers/sdd/2026-09-25-shopcart-refactor/task-4-report.md` with the
  changed components, integration, checks, and commit reference.
- Commit only Task 4 work; preserve unrelated staged and untracked work already
  present in the repository.
