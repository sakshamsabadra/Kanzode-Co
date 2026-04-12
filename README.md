# Aurum Advisory OS

Initial project architecture for a premium advisory-firm admin app built with Next.js App Router, TypeScript, and Tailwind CSS.

## Routes

- `/dashboard`
- `/clients`
- `/quotations/new`
- `/quotations/[id]`
- `/invoices/[id]`

## Structure

- `app/`: route pages and global shell
- `components/`: layout and reusable UI components
- `data/`: mock clients, services, quotations, invoices, and activity logs
- `lib/`: helpers and navigation config
- `types/`: TypeScript domain interfaces

## Reusable UI

- Sidebar navigation
- Top header
- Dashboard card
- Reusable data table
- Reusable status badge
- Reusable action button

## Run

```bash
npm install
npm run dev
```
