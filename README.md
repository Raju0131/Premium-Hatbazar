# Premium Hatbazar

This is the fully implemented Premium Hatbazar eCommerce frontend + backend integration.

## Features Built
- Full pixel-perfect UI reproduction with Tailwind v4 & custom Google Fonts.
- Smooth scrolling (Lenis) & Scroll-triggered reveals (GSAP).
- Server-persisted shopping cart using Next.js Cookies & Server Actions.
- Dynamic term-based pricing calculator.
- Database integration using **Prisma + PostgreSQL** to store Orders, Products, and OrderItems.

## Local Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Database
By default, the project expects a PostgreSQL database (like Neon or Supabase).
1. Rename `.env.example` to `.env`
2. Update the `DATABASE_URL` with your Postgres connection string.

### 3. Push Schema & Seed Data
Once your `DATABASE_URL` is set, push the schema and seed the 12 products:

```bash
npx prisma db push
npm run seed
```
*The seed script reads from `lib/products.ts` and loads all products into the database.*

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:3000` to see the site.

## Admin Panel
Visit `http://localhost:3000/admin`:
- **Dashboard** — live sales/order stats + recent orders.
- **Orders** (`/admin/orders`) — the full order queue. Open an order to update its status
  (Pending → Verified → Delivered → Cancelled). Marking **Delivered** shows on the customer's
  `/track/<id>` timeline.
- **Products** (`/admin/products`) — full CRUD: add / edit / delete products, and set price,
  stock, badge, and the product **image URL**.

### Protecting the admin
`/admin` is open in local dev. Before deploying, set `ADMIN_PASSWORD` (and optionally
`ADMIN_USER`, default `admin`). The middleware then requires HTTP Basic Auth for all `/admin` routes.

### Product images
Images are stored as URLs on `Product.imageUrl` and rendered on the catalogue cards (with a
gradient/mark placeholder when unset). Host the image anywhere over **https**, then set it in the
admin Products editor, or directly in SQL:

```sql
UPDATE "Product" SET "imageUrl" = 'https://your-host.com/canva.png' WHERE slug = 'canva-pro';
```

## Tech Stack
- Next.js (App Router)
- React
- Tailwind CSS v4
- Prisma + PostgreSQL
- GSAP & Lenis
- Phosphor Icons
