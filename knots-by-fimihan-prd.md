# 📄 Product Requirements Document
## Knots by Fimihan — Nigerian Islamic Fashion E-Commerce Platform

**Version:** 1.0  
**Date:** June 2026  
**Author:** Adedeji  
**Status:** Draft — Ready for Development

---

## 1. Executive Summary

**Knots by Fimihan** is a Nigerian Islamic modest fashion e-commerce platform targeted at Muslim women in Nigeria. It provides a curated, culturally-aware shopping experience for abayas, hijabs, kaftans, modest dresses, and accessories — with Paystack payment integration and an AI-powered Gemini chat assistant for product discovery and style guidance.

The platform is built as a **Progressive Web App (PWA)** to serve customers on mobile-first Nigerian internet infrastructure efficiently.

---

## 2. Problem Statement

Muslim women in Nigeria currently face the following challenges when shopping for Islamic modest fashion:

- Mainstream e-commerce platforms (Jumia, Konga) have poor categorization for Islamic modest wear
- Most Islamic fashion vendors sell only on WhatsApp/Instagram with no structured shopping experience
- No smart product recommendation layer that understands modest fashion context
- Limited trust signals (reviews, size guides, return policies) on informal channels
- Poor payment UX — no order tracking after bank transfer

**Knots by Fimihan** solves this by providing a dedicated, trustworthy, brand-consistent platform purpose-built for this niche.

---

## 3. Target Users

### Primary: The Muslim Fashion Shopper
- **Age:** 18–40
- **Location:** Lagos, Abuja, Kano, Port Harcourt, Ibadan
- **Device:** Android smartphone (80%+ of traffic expected)
- **Behavior:** Discovers products on Instagram/TikTok, validates trust on website, pays via card or bank transfer
- **Need:** Easy browsing, accurate sizing, fast checkout, delivery tracking

### Secondary: Gift Buyers
- Non-Muslim or family members buying modest wear as gifts for occasions (Eid, weddings, graduations)
- Need: Guided shopping (AI assistant helps them pick appropriate styles)

### Admin: Store Manager (Fimihan)
- Manages products, tracks orders, processes fulfillments
- Need: Simple dashboard to add/edit products and view orders

---

## 4. Goals & Success Metrics

| Goal | Metric | Target |
|------|--------|--------|
| Drive conversions | Add-to-cart → Purchase rate | ≥ 15% |
| Retain customers | Return visit rate | ≥ 30% |
| AI engagement | Chat widget interactions per session | ≥ 1 per 5 sessions |
| Mobile experience | Lighthouse mobile score | ≥ 85 |
| Checkout completion | Cart abandonment rate | ≤ 60% |
| Admin efficiency | Time to add a product | ≤ 3 minutes |

---

## 5. Feature List

### 5.1 Core Features (MVP)

| # | Feature | Description | Priority |
|---|---------|-------------|----------|
| F1 | Product Catalog | Browse all products with filters | P0 |
| F2 | Product Detail Page | Full product view with images, description, sizes | P0 |
| F3 | Shopping Cart | Add/remove/update items | P0 |
| F4 | Checkout | Shipping form + Paystack payment | P0 |
| F5 | Order Confirmation | Email/in-app confirmation + order ID | P0 |
| F6 | Admin Dashboard | Add/edit/delete products, view orders | P0 |
| F7 | Gemini AI Chat | Product recommendation + style assistant | P1 |
| F8 | Category Pages | Abayas, Hijabs, Kaftans, Sets, Accessories | P0 |
| F9 | Search | Keyword-based product search | P1 |
| F10 | PWA Support | Installable, offline product browsing | P1 |

### 5.2 Post-MVP Features

| # | Feature | Description |
|---|---------|-------------|
| F11 | Wishlist | Save products for later |
| F12 | Customer Accounts | Order history, saved addresses |
| F13 | Product Reviews | Star ratings + written reviews |
| F14 | Discount Codes | Promo code support at checkout |
| F15 | WhatsApp Order Notifications | Auto WhatsApp messages for order status |
| F16 | Size Guide | Interactive size chart per product type |
| F17 | Related Products | AI-suggested similar/matching products |

---

## 6. User Flows

### 6.1 Customer Purchase Flow

```
Home Page
  → Browse Category / Search
    → Product Detail Page
      → Select Size & Quantity → Add to Cart
        → View Cart → Proceed to Checkout
          → Enter Shipping Details
            → Paystack Payment
              → Order Confirmation Page
                → Confirmation Email
```

### 6.2 AI Chat Flow

```
Any Page (floating chat button)
  → Chat opens
    → User types: "I need a hijab for a wedding"
      → Gemini responds with product suggestions + links
        → User clicks product link → Product Detail Page
```

### 6.3 Admin Product Management Flow

```
Admin Login (/admin)
  → Admin Dashboard
    → Products Tab → Add New Product
      → Fill form (name, price, description, images, sizes, category)
        → Submit → Product live on store
    → Orders Tab → View all orders
      → Click order → Mark as Shipped / add tracking number
```

---

## 7. Pages & Screens

### Public-Facing Pages

| Route | Page | Description |
|-------|------|-------------|
| `/` | Homepage | Hero banner, featured products, categories, promo section |
| `/shop` | All Products | Grid with filter sidebar (category, price, color) |
| `/category/:slug` | Category Page | Products filtered by category |
| `/product/:id` | Product Detail | Images, description, sizes, add to cart, AI chat nudge |
| `/cart` | Shopping Cart | Item list, subtotal, proceed to checkout |
| `/checkout` | Checkout | Shipping form + Paystack payment button |
| `/order-success` | Order Confirmation | Order ID, summary, delivery estimate |
| `/search?q=` | Search Results | Products matching query |
| `/about` | About Page | Brand story, values, Fimihan's intro |
| `/contact` | Contact Page | WhatsApp link, email, social links |

### Admin Pages (Protected)

| Route | Page | Description |
|-------|------|-------------|
| `/admin` | Admin Login | Password-protected entry |
| `/admin/dashboard` | Dashboard | Sales summary, recent orders |
| `/admin/products` | Products | List, add, edit, delete products |
| `/admin/products/new` | Add Product | Product upload form |
| `/admin/products/:id/edit` | Edit Product | Edit existing product |
| `/admin/orders` | Orders | All orders with status |
| `/admin/orders/:id` | Order Detail | Customer info, items, shipping update |

---

## 8. Database Schema (Supabase)

### Table: `products`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | Auto-generated |
| `name` | TEXT | Product name |
| `slug` | TEXT | URL-friendly name (unique) |
| `description` | TEXT | Full product description |
| `price` | NUMERIC | Price in Naira (NGN) |
| `compare_at_price` | NUMERIC | Original price (for sale display) |
| `category` | TEXT | abaya, hijab, kaftan, set, accessory |
| `images` | TEXT[] | Array of image URLs |
| `sizes` | TEXT[] | Available sizes e.g. ['S','M','L','XL'] |
| `colors` | TEXT[] | Available colors |
| `stock` | INTEGER | Total available inventory |
| `is_featured` | BOOLEAN | Show on homepage |
| `is_active` | BOOLEAN | Visible on store |
| `tags` | TEXT[] | Search/filter tags |
| `created_at` | TIMESTAMP | Auto |

### Table: `orders`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | Auto-generated |
| `order_number` | TEXT | Human-readable (e.g. KBF-20260001) |
| `customer_name` | TEXT | |
| `customer_email` | TEXT | |
| `customer_phone` | TEXT | |
| `shipping_address` | JSONB | `{street, city, state, country}` |
| `items` | JSONB | Array of `{product_id, name, size, color, qty, price}` |
| `subtotal` | NUMERIC | |
| `shipping_fee` | NUMERIC | |
| `total` | NUMERIC | |
| `payment_reference` | TEXT | Paystack reference |
| `payment_status` | TEXT | pending, paid, failed |
| `fulfillment_status` | TEXT | pending, processing, shipped, delivered |
| `tracking_number` | TEXT | Courier tracking number |
| `notes` | TEXT | Admin notes |
| `created_at` | TIMESTAMP | Auto |

### Table: `categories`

| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | |
| `name` | TEXT | Display name |
| `slug` | TEXT | URL slug |
| `description` | TEXT | |
| `image_url` | TEXT | Category hero image |
| `display_order` | INTEGER | Sort order on nav |

### Table: `site_settings`

| Column | Type | Notes |
|--------|------|-------|
| `key` | TEXT (PK) | Setting key |
| `value` | TEXT | Setting value |
| Examples | `hero_title`, `hero_subtitle`, `shipping_fee`, `free_shipping_threshold`, `whatsapp_number` | |

---

## 9. Product Catalog Structure

### Categories
1. **Abayas** — Full-length Islamic outer garments
2. **Hijabs** — Scarves, turbans, underscarves, ready-to-wear hijabs
3. **Kaftans** — Traditional Nigerian kaftans in modest cuts
4. **Sets** — Matching abaya + hijab or kaftan + inner sets
5. **Accessories** — Pins, bags, prayer mats, inner caps

### Product Attributes
- **Sizes:** XS, S, M, L, XL, XXL, XXXL (plus custom sizing option)
- **Colors:** Named colors with hex preview swatches
- **Material:** Cotton, chiffon, silk, lace, velvet, etc.
- **Occasion:** Casual, Eid, Wedding Guest, Office, Travel
- **Price Range:** Budget (< ₦5,000), Mid (₦5k–₦20k), Premium (> ₦20k)

---

## 10. Gemini AI Chat Widget

### Purpose
An embedded floating chat assistant that helps customers:
- Find products based on description ("I want a pink abaya for Eid")
- Get styling advice ("What hijab style works for a round face?")
- Understand sizing ("Is size M good for someone who is 5'4"?")
- Navigate the store ("Do you have anything under ₦8,000?")

### System Prompt Context
The Gemini model will be given a system prompt containing:
- Store name, brand tone, and values
- Full product catalog (injected dynamically or summarized)
- Pricing and category information
- Instructions to always link to products using `/product/:id` format
- Instructions to stay on-topic (modest Islamic fashion)
- Friendly, warm Nigerian tone

### UI Behavior
- Floating button bottom-right on all pages
- Slide-up chat panel (mobile-friendly)
- Conversation persists for the session
- Suggested quick prompts on first open: *"Help me find an Eid outfit"*, *"What's new in stock?"*, *"I need a gift for someone"*

---

## 11. Payments — Paystack Integration

### Flow
1. Customer fills shipping form
2. Clicks "Pay Now" → Paystack popup/redirect
3. Pays via card, bank transfer, USSD, or mobile money
4. Paystack sends webhook to backend on success
5. Backend verifies payment, creates order, sends confirmation

### Paystack Config
- **Currency:** NGN
- **Channels:** card, bank, ussd, bank_transfer, mobile_money
- **Webhook events to handle:** `charge.success`, `charge.failed`
- **Metadata to pass:** `order_number`, `customer_email`, `cart_items`

### Shipping Fees
- Lagos: ₦2,000
- Other South-West states: ₦2,500
- Other Nigerian states: ₦3,500
- Free shipping on orders above ₦25,000

---

## 12. Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | **Vanilla HTML/CSS/JS** or **React** (via AI Studio) | Your standard workflow |
| Styling | **Tailwind CSS** | Fast, mobile-first utility CSS |
| Backend/DB | **Supabase** | Auth, database, storage, real-time |
| File Storage | **Supabase Storage** | Product image uploads |
| AI Chat | **Gemini API** (Google AI Studio key) | Chat widget |
| Payments | **Paystack** | Nigerian payment gateway |
| Hosting | **Netlify** or **Vercel** | Free tier, fast deploys |
| PWA | Service Worker + Web Manifest | Offline + installable |
| Code Generation | **Google AI Studio** | Your workflow |
| UI Prototyping | **Google Stitch** | Your workflow |

### Supabase Setup Checklist
- [ ] `products` table with RLS (public read, admin write)
- [ ] `orders` table with RLS (insert for all, read for admin only)
- [ ] `categories` table (public read)
- [ ] `site_settings` table (public read)
- [ ] Supabase Storage bucket: `product-images` (public)
- [ ] Admin auth via Supabase Auth (email/password for Fimihan)
- [ ] Edge Function: `verify-payment` (Paystack webhook handler)
- [ ] Edge Function: `send-order-email` (post-payment confirmation)

---

## 13. Admin Dashboard Requirements

### Products Management
- View all products in a table with image thumbnail, name, price, stock, status
- Add new product form with image uploader (drag & drop or pick from gallery)
- Edit product (all fields editable inline or in form)
- Toggle product active/inactive (soft delete)
- Mark product as "featured" for homepage display

### Orders Management
- View all orders sorted by newest first
- Filter by status (pending, paid, shipped, delivered)
- View order details (customer info, items, address)
- Update fulfillment status
- Add tracking number field

### Dashboard Overview
- Total orders (today / this week / all time)
- Total revenue (this week / this month)
- Low stock alerts (products with stock < 5)
- Recent orders list (last 10)

---

## 14. Design Direction

### Brand Identity
- **Brand Name:** Knots by Fimihan
- **Tagline:** *"Dress Modestly, Live Beautifully"*
- **Tone:** Warm, feminine, culturally proud, aspirational but accessible

### Visual Language
- **Primary Color:** Deep Emerald Green `#1A5C3A` (Islamic heritage nod)
- **Accent:** Warm Gold `#C9963A` (elegance)
- **Neutral:** Cream/Off-white `#FAF7F2` (background warmth)
- **Text:** Rich Dark `#1C1C1C`
- **Typography:** 
  - Display: *Cormorant Garamond* or *Playfair Display* (elegant serif)
  - Body: *DM Sans* or *Nunito* (clean, readable)
- **Imagery Style:** Warm-toned, natural light, diverse Muslim women models
- **Logo Concept:** Stylized knot/bow or Arabic-inspired geometric motif

### UI Patterns
- Full-bleed hero on homepage with overlay text
- Product grid: 2 cols on mobile, 3 on tablet, 4 on desktop
- Sticky header with cart icon and item count badge
- Floating Gemini chat button (gold, bottom-right)
- Category pills/chips for quick filtering
- Modal-based quick view for products

---

## 15. Non-Functional Requirements

| Requirement | Target |
|-------------|--------|
| Page load time (mobile 3G) | < 3 seconds |
| Lighthouse Performance | ≥ 80 |
| Lighthouse Accessibility | ≥ 85 |
| PWA installable | ✅ |
| HTTPS | ✅ (Netlify/Vercel auto) |
| Payment security | Paystack handles PCI compliance |
| Image optimization | WebP format, lazy loading |
| SEO | Meta tags, OG tags, sitemap |
| Mobile-first | ✅ Designed for 360px+ screens |

---

## 16. Development Phases

### Phase 1 — Foundation (Week 1)
- [ ] Supabase project setup (tables, storage, RLS policies)
- [ ] Basic frontend scaffold (homepage, nav, footer)
- [ ] Category pages + product cards
- [ ] Product detail page

### Phase 2 — Commerce (Week 2)
- [ ] Shopping cart (localStorage)
- [ ] Checkout form
- [ ] Paystack integration
- [ ] Paystack webhook + order creation in Supabase
- [ ] Order confirmation page

### Phase 3 — Admin (Week 3)
- [ ] Admin login (Supabase Auth)
- [ ] Products CRUD
- [ ] Image upload to Supabase Storage
- [ ] Orders management

### Phase 4 — AI & Polish (Week 4)
- [ ] Gemini chat widget
- [ ] Search functionality
- [ ] PWA manifest + service worker
- [ ] SEO meta tags
- [ ] Performance optimization

---

## 17. Email & Notification System

### Email Provider
- **Provider:** Resend (`https://api.resend.com/emails`)
- **Sender:** "Knots by Fimihan" `<noreply@knotbyfimihan.com>`
- **API Key:** `RESEND_API_KEY` (set as Supabase Edge Function secret)

### Customer Emails

| Trigger | Subject | Sent By |
|---------|---------|---------|
| Payment verified | `Order Confirmed — KBF-xxxx` | `verify-payment` Edge Function (queues + sends via Resend) |
| Admin confirms order | `Order Confirmed — KBF-xxxx` | `send-email` Edge Function (from AdminOrders.jsx) |
| Admin marks shipped | `Order Shipped — KBF-xxxx` | `send-email` Edge Function (from AdminOrders.jsx) |
| Admin marks delivered | `Order Delivered — KBF-xxxx` | `send-email` Edge Function (from AdminOrders.jsx) |
| Admin cancels order | `Order Cancelled — KBF-xxxx` | `send-email` Edge Function (from AdminOrders.jsx) |

Each email is sent via Resend API and also queued in `email_queue` table as fallback.

### Admin In-App Notifications

| Trigger | Type | Message |
|---------|------|---------|
| New order placed | `new_order` | `{name} placed order KBF-xxxx — ₦{total}` |
| Order confirmed | `order_confirmed` | `Order KBF-xxxx was confirmed by admin` |
| Order shipped | `order_shipped` | `Order KBF-xxxx was marked as shipped` |
| Order delivered | `order_delivered` | `Order KBF-xxxx was delivered by admin` |
| Order cancelled | `order_cancelled` | `Order KBF-xxxx was cancelled by admin` |
| Contact form submitted | `new_complaint` | `{name} submitted a complaint: {subject}` |

Notifications are stored in `admin_notifications` table and displayed in the admin panel bell icon (polled every 15s).

---

## 18. UI/UX Enhancements (Implemented)

### Theme System
- **Light mode is default** for new visitors (no system dark mode auto-apply)
- Dark/light toggle lives inside the user profile dropdown
- User preference persisted in localStorage (`kbf-theme` key)
- Tailwind dark mode set to `class` strategy

### Animations
- **Custom keyframes:** `fadeInUp`, `fadeInDown`, `fadeInLeft`, `fadeInRight`, `scaleIn`, `float`, `slideUp`
- **Homepage:** Staggered hero entrance (badge → h1 → p → buttons → features), floating hero image, scroll-triggered section reveals via `useInView` hook
- **Product cards:** Hover lift (`-translate-y-1` + `shadow-xl`), enhanced image zoom (`scale-110` with `duration-700`), overlay tint
- **Product grid:** Staggered card entrance with index-based delay (`i * 60ms`)
- **Cart page:** Staggered item entrance (`i * 80ms`), order summary delay
- **Nav links:** Animated underline (`after:w-0 hover:after:w-full`)

### Footer
- Footer is in the DOM from page load but invisible until the user scrolls near it (IntersectionObserver sentinel)
- Footer hidden on: `/cart`, `/search`, `/product/*`, `/orders`, `/order-success`
- Newsletter forms stack vertically on mobile (`flex-col sm:flex-row`)

### Header
- Profile icon: gradient background (`from-emerald-600 to-emerald-800`) + gold border + hover scale
- Cart icon: `HiOutlineShoppingCart` with red badge and `animate-scale-in`
- Dark mode toggle in account dropdown and mobile menu

### Admin Panel
- Sidebar: Logo `KBF` + `Menu` label (no full brand name)
- Sign out button: border style with red hover tint

---

## 19. Out of Scope (for MVP)

- Product reviews & ratings
- Multi-vendor support
- Loyalty/points system
- Blog / content section
- Multi-currency support
- International shipping
- WhatsApp order notifications (mentioned on success page but not implemented)

---

## 20. Backend Implementation Plan (Supabase + Paystack)

**Status:** In Progress — June 2026  
**Backend:** Supabase (PostgreSQL, Auth, Storage, Edge Functions)  
**Payments:** Paystack (NGN)  
**Deployment:** Supabase Edge Functions

### Supabase Project

| Setting | Value |
|---------|-------|
| Name | `knots-by-fimihan` |
| Region | `eu-west-1` (Ireland — closest to Nigeria) |
| Plan | Free |
| Organization | Herdeydeji's Org |

### Database Schema

#### `products`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | Auto-generated |
| `name` | TEXT | Product name |
| `slug` | TEXT | URL-friendly name (unique) |
| `description` | TEXT | Full product description |
| `price` | NUMERIC | Price in Naira (NGN) |
| `compare_at_price` | NUMERIC | Original price (for sale display) |
| `category` | TEXT | abaya, hijab, kaftan, set, accessory |
| `images` | TEXT[] | Array of image URLs |
| `sizes` | TEXT[] | Available sizes |
| `colors` | TEXT[] | Available colors |
| `material` | TEXT | Fabric/material type |
| `occasion` | TEXT | Event/use type |
| `stock` | INTEGER | Total available inventory |
| `is_featured` | BOOLEAN | Show on homepage |
| `is_active` | BOOLEAN | Visible on store |
| `tags` | TEXT[] | Search/filter tags |
| `created_at` | TIMESTAMPTZ | Auto |
| `updated_at` | TIMESTAMPTZ | Auto |

#### `categories`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | |
| `name` | TEXT | Display name |
| `slug` | TEXT | URL slug (unique) |
| `description` | TEXT | |
| `image_url` | TEXT | Category hero image |
| `display_order` | INTEGER | Sort order on nav |

#### `orders`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | Auto-generated |
| `order_number` | TEXT | Human-readable (e.g. KBF-20260001) |
| `customer_name` | TEXT | |
| `customer_email` | TEXT | |
| `customer_phone` | TEXT | |
| `shipping_address` | JSONB | `{street, city, state, country}` |
| `items` | JSONB | Array of `{product_id, name, size, color, qty, price}` |
| `subtotal` | NUMERIC | |
| `shipping_fee` | NUMERIC | |
| `total` | NUMERIC | |
| `payment_reference` | TEXT | Paystack reference |
| `payment_status` | TEXT | pending, paid, failed |
| `fulfillment_status` | TEXT | pending, processing, shipped, delivered |
| `tracking_number` | TEXT | Courier tracking number |
| `notes` | TEXT | Admin notes |
| `created_at` | TIMESTAMPTZ | Auto |
| `updated_at` | TIMESTAMPTZ | Auto |

#### `site_settings`
| Column | Type | Notes |
|--------|------|-------|
| `key` | TEXT (PK) | Setting key |
| `value` | TEXT | Setting value |

**Seed data:** `hero_title`, `hero_subtitle`, `shipping_fee`, `free_shipping_threshold`, `whatsapp_number`

#### `email_queue`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | Auto-generated |
| `to_email` | TEXT | Recipient email |
| `subject` | TEXT | Email subject |
| `html_body` | TEXT | HTML content |
| `status` | TEXT | pending, sent, failed |
| `created_at` | TIMESTAMPTZ | Auto |
| `sent_at` | TIMESTAMPTZ | Null until sent |

#### `admin_notifications`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | Auto-generated |
| `type` | TEXT | new_order, new_complaint, order_confirmed, order_shipped, order_delivered, order_cancelled |
| `title` | TEXT | Short title |
| `message` | TEXT | Detailed message |
| `link` | TEXT | Admin route to navigate to |
| `is_read` | BOOLEAN | Default false |
| `created_at` | TIMESTAMPTZ | Auto |

#### `complaints`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | Auto-generated |
| `user_id` | UUID | Nullable, FK to auth.users |
| `name` | TEXT | Submitter name |
| `email` | TEXT | Submitter email |
| `subject` | TEXT | Complaint subject |
| `message` | TEXT | Complaint body |
| `status` | TEXT | open, in_progress, resolved |
| `created_at` | TIMESTAMPTZ | Auto |
| `updated_at` | TIMESTAMPTZ | Auto |

#### `newsletter_subscribers`
| Column | Type | Notes |
|--------|------|-------|
| `id` | UUID (PK) | Auto-generated |
| `email` | TEXT | Unique subscriber email |
| `created_at` | TIMESTAMPTZ | Auto |

#### `wishlists`
| Column | Type | Notes |
|--------|------|-------|
| `id` | BIGSERIAL (PK) | Identity |
| `user_id` | UUID | FK to auth.users |
| `product_id` | UUID | FK to products |
| `created_at` | TIMESTAMPTZ | Auto |

### RLS Policies

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `products` | Public | Admin only | Admin only | Admin only |
| `categories` | Public | Admin only | Admin only | Admin only |
| `orders` | Admin only | Authenticated users | Admin only | Admin only |
| `site_settings` | Public | Admin only | Admin only | Admin only |
| `email_queue` | Admin only | Edge Functions (service key) | Edge Functions (service key) | Admin only |
| `admin_notifications` | Authenticated users | Edge Functions (service key) | Authenticated users | Admin only |
| `complaints` | Admin only | Public | Admin only | Admin only |
| `newsletter_subscribers` | Admin only | Public | Admin only | Admin only |
| `wishlists` | Authenticated users | Authenticated users | Authenticated users | Authenticated users |

### Supabase Storage

- **Bucket:** `product-images` (public)
- Used for admin product image uploads
- Public read access, admin write access

### Supabase Auth

- **Provider:** Email/Password
- **Admin user:** adedejiadebeso@gmail.com
- Routes `/admin/*` protected by auth session check

### Paystack Configuration

| Setting | Value |
|---------|-------|
| Public Key | pk_test_8a6efcfbff945ad50ec6e4978b6368d73ef391b8 |
| Secret Key | sk_test_82597fc62ac6c1a8742b76bb48415cde3a888567 |
| Currency | NGN |
| Channels | card, bank, ussd, bank_transfer, mobile_money |

### Edge Functions

#### `verify-payment`
- **Trigger:** Called from frontend after Paystack popup success
- **Input:** `{ reference, customer_name, customer_email, customer_phone, shipping_address, items, subtotal, shipping_fee, total }`
- **Logic:**
  1. Verify transaction with Paystack API
  2. Check for duplicate reference (return existing order if found)
  3. Generate order number (`KBF-{year}{random4}`)
  4. Insert order into `orders` table
  5. Build email HTML with order details and item table
  6. Send email via Resend API
  7. Queue email in `email_queue` as fallback
  8. Insert admin notification (`new_order`)
- **Response:** `{ success, order_number }`
- **File:** `supabase/functions/verify-payment/index.ts`
- **Required secrets:** `PAYSTACK_SECRET_KEY`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`

#### `send-email`
- **Trigger:** Called from admin panel UI when changing order status
- **Input:** `{ to, subject, html, type?, title?, message?, link?, notifyAdmin? }`
- **Logic:**
  1. Send email via Resend API
  2. Queue email in `email_queue` table
  3. If `notifyAdmin` is true, insert admin notification record
  4. On successful send, mark queue record as `sent`
- **Response:** `{ success, sent, queued }`
- **File:** `supabase/functions/send-email/index.ts`
- **Required secrets:** `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`

### Frontend Migration

| File | Change |
|------|--------|
| `src/lib/supabase.js` | Create Supabase client with project URL + anon key |
| `src/lib/products.js` | Swap hardcoded data for `supabase.from('products').select('*')` |
| `src/lib/orders.js` | Swap for Supabase queries |
| `src/lib/auth.jsx` | Replace mock auth with `supabase.auth` |
| `src/pages/Checkout.jsx` | Integrate Paystack popup + call `verify-payment` Edge Function |
| `src/lib/constants.js` | Pull from `site_settings` table |

### Shipping Fees
- Lagos: ₦2,000
- Other South-West states: ₦2,500
- Other Nigerian states: ₦3,500
- Free shipping on orders above ₦25,000

---

## Changelog

### 2026-06-04 — Fix signup white screen crash

- **Header.jsx**: `user.name.charAt(0)` crashed on new users because `user.name` is `undefined` on the Supabase auth object. Changed to `user.user_metadata?.name || user.email`.
- **auth.jsx**: `signup` now accepts a `name` parameter and passes it as `options.data` to `supabase.auth.signUp()`.
- **Signup.jsx**: Collected `name` from the form is now forwarded to `signup(email, password, name)`.

### 2026-06-05 — UI/UX enhancements, notifications, and fixes

#### UI/UX Enhancements
- **Theme (theme.js)**: Removed `prefers-color-scheme: dark` — system dark mode no longer auto-applies. Light mode is default for new visitors.
- **Header.jsx**: Profile icon redesigned with gradient + gold border + hover scale. Cart icon changed to `HiOutlineShoppingCart` with red badge. Dark mode toggle moved to account dropdown and mobile menu. Nav links have animated underline (`after:w-0 hover:after:w-full`).
- **Footer.jsx**: IntersectionObserver sentinel for scroll-triggered fade-in. Newsletter forms stack vertically on mobile (`flex-col sm:flex-row`).
- **Layout.jsx**: Footer hidden on `/cart`, `/search`, `/product/*`, `/orders`, `/order-success`.
- **tailwind.config.js**: Extended keyframes (`fadeInUp`, `fadeInDown`, `fadeInLeft`, `fadeInRight`, `scaleIn`, `float`, `slideUp`).
- **hooks/useInView.js**: Custom IntersectionObserver hook with single-trigger behavior.
- **Homepage.jsx**: Staggered hero entrance, scroll-triggered section reveals, floating hero image, hover effects on feature icons.
- **ProductCard.jsx**: Hover lift (`hover:-translate-y-1`), enhanced image zoom, overlay tint.
- **ProductGrid.jsx**: Staggered card entrance with index-based animation delay.
- **Cart.jsx**: Staggered item entrance and order summary animation.
- **AdminLayout.jsx**: Sidebar shows only `KBF` + `Menu`. Sign out button has border-only style with red hover.
- **Admin header**: Shows "Admin Panel" heading on desktop and mobile.

#### Notification System
- **verify-payment/index.ts**: Added Resend email sending (was only queueing). Now sends payment confirmation email via Resend and marks queue as sent.
- **AdminOrders.jsx**: Sends emails via `send-email` edge function for confirm/ship/deliver/cancel actions. Creates admin notifications for each action.
- **notifications.js**: Contact form submissions create `admin_notifications` records.
- **AdminLayout.jsx**: Polls unread notification count every 15s from `admin_notifications` table.
- **AdminComplaints.jsx**: Full CRUD for complaints with status management (open/in_progress/resolved).

#### Critical Fixes
- **Checkout.jsx**: Fixed empty cart redirect overriding `navigate('/order-success')` after payment — added `paidRef` ref to prevent the cart guard from firing during payment processing.
- **admin_notifications CHECK constraint**: Altered to allow `order_shipped`, `order_delivered`, `order_cancelled` types (was only allowing `new_order`, `new_complaint`, `order_confirmed`, `product_like`, `payment_received`).

#### Deployment
- Netlify auto-deploys from GitHub `master` branch.
- Supabase Edge Functions: `verify-payment` and `send-email`.

*Document ends. Ready for implementation.*
