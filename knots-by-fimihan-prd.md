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

## 17. Out of Scope (for MVP)

- User authentication / customer accounts
- Product reviews & ratings
- Wishlist
- Multi-vendor support
- Loyalty/points system
- Blog / content section
- Multi-currency support
- International shipping

---

## 18. Open Questions

1. Does Fimihan want to manage the admin herself, or is Adedeji the admin?
2. What courier services should be integrated or referenced (Sendbox, GIG Logistics, DHL Nigeria)?
3. Should the AI chat use a free Gemini API key or a paid one?
4. What is the initial product count for launch (affects catalog design)?
5. Is there an existing brand logo/color guide to follow?
6. Should order confirmation emails be sent via Supabase Edge Functions + Resend, or just in-app?

---

## 19. Backend Implementation Plan (Supabase + Paystack)

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

### RLS Policies

| Table | SELECT | INSERT | UPDATE | DELETE |
|-------|--------|--------|--------|--------|
| `products` | Public | Admin only | Admin only | Admin only |
| `categories` | Public | Admin only | Admin only | Admin only |
| `orders` | Admin only | Public (authenticated) | Admin only | Admin only |
| `site_settings` | Public | Admin only | Admin only | Admin only |

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
- **Input:** `{ reference, customer_name, email, phone, address, items, subtotal, shipping_fee, total }`
- **Logic:** Verify with Paystack API → Insert order into `orders` table
- **Response:** `{ success, order_number }`

#### `paystack-webhook`
- **Trigger:** Paystack webhook events (`charge.success`, `charge.failed`)
- **Logic:** Verify webhook signature → Update `orders.payment_status`
- **URL:** `{project_url}/functions/v1/paystack-webhook`

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

*IMPORTANT GITHUB COMMIT*
----always commit repo to github

*Document ends. Ready for implementation.*
