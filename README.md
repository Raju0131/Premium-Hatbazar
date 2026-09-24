# Premium Hatbazar

This is the fully implemented Premium Hatbazar eCommerce frontend + backend integration.

## Features Built
- Full pixel-perfect UI reproduction with Tailwind v4 & custom Google Fonts.
- Smooth scrolling (Lenis) & Scroll-triggered reveals (GSAP).
- Shopping cart saved in the browser (localStorage), so the storefront pages can be prerendered.
- Dynamic term-based pricing calculator.
- Database integration using **Prisma + PostgreSQL** to store Products, Orders, OrderItems and
  customer Messages.
- Home and product pages are prerendered and served from the CDN, refreshed every 5 minutes and
  right after admin edits.

## Local Setup

### 1. Install Dependencies
```bash
npm install
```
This also generates the Prisma client.

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

> **Careful:** `npm run seed` deletes every product and re-creates them from `lib/products.ts`.
> Don't run it against the live database once products have been edited in the admin; it also
> fails as soon as any order references a product.

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
- **Messages** (`/admin/messages`) — messages customers send from the site's chat widget.

### Protecting the admin
`/admin` is open in local dev. Before deploying, set `ADMIN_PASSWORD` (and optionally
`ADMIN_USER`, default `admin`). The middleware then requires HTTP Basic Auth for all `/admin` routes.

### Product images
Images are stored as URLs on `Product.imageUrl` and rendered on the catalogue cards (with a
gradient/mark placeholder when unset).

The 12 catalogue products use images bundled in `public/products/`, served by Vercel with a
one-year browser cache (see `next.config.ts`). Each product has four files that share a content hash:

- `<slug>.<hash>.webp` — 1280px banner for the catalogue card (`imageUrl` points here)
- `<slug>.<hash>-960.webp`, `<slug>.<hash>-640.webp` — smaller copies offered via `srcSet`, so
  each device downloads only the size it displays
- `<slug>.<hash>-icon.webp` — 192px square logo crop, used automatically for the small thumbnails

When replacing a bundled image, add new files with a new hash (never overwrite an existing file,
or browsers will keep showing the cached one) and update `imageUrl`.

You can also host an image anywhere over **https** and set its URL in the admin Products editor,
or directly in SQL:

```sql
UPDATE "Product" SET "imageUrl" = 'https://your-host.com/canva.png' WHERE slug = 'canva-pro';
```

Changes made directly in the database show up on the storefront within about 5 minutes; edits
made through the admin show up immediately.

## Deploying to Vercel
1. Import the repository in Vercel (framework preset: Next.js). The build runs `prisma generate`
   itself, so no extra build settings are needed.
2. In **Settings → Environment Variables**, add:
   - `DATABASE_URL` — the Neon connection string (Neon dashboard → **Connect**, with connection
     pooling on).
   - `ADMIN_PASSWORD` — protects `/admin`. Optionally `ADMIN_USER` (default `admin`).
3. Redeploy after adding or changing a variable; variables only apply to new deployments.

The home and product pages are prerendered during the build (reading products from the database)
and refreshed in the background at most every 5 minutes.

## Tech Stack
- Next.js (App Router)
- React
- Tailwind CSS v4
- Prisma + PostgreSQL
- GSAP & Lenis
- Phosphor Icons
