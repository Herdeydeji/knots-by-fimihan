# Changelog

## [1.0.0] - 2026-06-04

### Added
- **Persistent Wishlist** (`src/lib/wishlist.js`, `src/lib/auth.jsx`)
  - `wishlists` table in Supabase with RLS
  - Wishlist state lives in `AuthProvider` context
  - Fetched on login, cleared on logout
  - `ProductCard` reads wishlist from context (no props)
  - Homepage and Shop use persistent wishlist

- **Order Tracking Page** (`src/pages/Orders.jsx`)
  - New `/orders` route for customers to view their own orders
  - Auth-gated: shows "Sign In Required" when not logged in
  - Fetches orders filtered by `customer_email`
  - Expandable order cards with item details (name, qty, price, size)
  - Shows subtotal, shipping, payment status, delivery status
  - Displays shipping address
  - Shows tracking number when available
  - Loading skeleton animation
  - Empty state with link to shop
  - Added `getOrdersByEmail()` to `src/lib/orders.js`

- **User Menu Link** (`src/components/layout/Header.jsx`)
  - "My Orders" link in desktop user dropdown
  - "My Orders" link in mobile nav menu

### Fixed
- **ProductCard UI** (`src/components/ui/ProductCard.jsx`)
  - `line-clamp-2` on product name to prevent overflow
  - Responsive sizing: smaller padding on mobile
  - Price row uses `flex-wrap` so `compare_at_price` doesn't clip
  - Mobile: `p-3` on mobile, `p-4` on desktop

- **Paystack Payment Flow** (`supabase/functions/verify-payment/index.ts`)
  - CORS preflight (OPTIONS) was returning 405, blocking browser POST
  - Fixed: added OPTIONS handler returning 204 with `Access-Control-Allow-Origin: *`
  - RLS on `orders` table was blocking anon key inserts
  - Fixed: disabled RLS on `orders` table so Edge Function can insert
  - Version 5 deployed with CORS fix

## [1.1.0] - 2026-06-04

### Fixed
- **OrderSuccess Recovery** (`src/pages/OrderSuccess.jsx`)
  - Previously relied solely on `location.state` (lost on page refresh/mobile redirect)
  - Now accepts `?reference=` query param to fetch order from DB directly
  - Falls back to `getOrderByReference()` then `getOrderByNumber()` if state is missing
  - Shows detailed order info (items, subtotal, shipping, payment, delivery, address)
  - Added loading skeleton while fetching from DB
  - Error state shows helpful message with "View My Orders" link
  - Added "View My Orders" button alongside "Continue Shopping"

- **Checkout Navigation** (`src/pages/Checkout.jsx`)
  - Now passes `?reference=` as query param when navigating to `/order-success`
  - On Edge Function failure, navigates to `/order-success?reference=xxx` instead of showing `alert()`
  - Allows the success page to recover and display the order if it was created

- **New API** (`src/lib/orders.js`)
  - Added `getOrderByReference()` to look up orders by `payment_reference` or `order_number` (via Supabase OR filter)

### Changed
- **OrderSuccess Heading** (`src/pages/OrderSuccess.jsx`)
  - Changed text from "Order Confirmed!" to "Payment Successful!"
  - Replaced check icon with sparkles icon
  - Added confetti animation via `canvas-confetti` (bursts from both sides on load)
