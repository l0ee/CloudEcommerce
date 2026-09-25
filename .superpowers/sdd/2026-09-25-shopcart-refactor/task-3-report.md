# Task 3 Report: Local Storage Hooks

**Status:** DONE

## Delivered

- Added `src/hooks/useCart.js` with add, quantity change, item removal, clear, subtotal, `$50` free-shipping threshold/eligibility, and `shopcart_cart` persistence.
- Added `src/hooks/useFavorites.js` with toggle, membership check, clear, and `shopcart_favorites` persistence.
- Added `tests/cartFavorites.test.js` with 8 tests covering cart and favorites behavior, hydration, persistence, malformed stored data, and the free-shipping boundary.

Both hooks safely fall back to empty state when stored data is malformed. Cart subtotal supports normalized product prices (`price.amount`) and numeric product prices.

## Verification

- Baseline `npm test`: 1 test file passed, 2 tests passed.
- RED run of `npm test tests/cartFavorites.test.js`: failed because the requested hook modules had not yet been created.
- GREEN run of `npm test tests/cartFavorites.test.js`: 1 test file passed, 8 tests passed.
- Full `npm test`: 2 test files passed, 10 tests passed.
- `git diff --check` and `git diff --cached --check`: passed with no whitespace errors.
