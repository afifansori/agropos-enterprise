# AGROPOS — Agricultural Store Enterprise Platform

> **POS, Inventory Management, Purchasing, Finance & Supplier Portal**  
> Khusus toko obat-obatan pertanian — Multi-Organization, Multi-Branch

---

## Tech Stack

| Layer | Teknologi |
|---|---|
| **Backend** | Laravel 12 · PHP 8.4 · MySQL 8 · Laravel Sanctum |
| **Frontend** | Next.js 16 · TypeScript · Tailwind CSS 4 · shadcn/ui |
| **State** | TanStack Query v5 · Zustand v5 |
| **Charts** | Recharts v3 |
| **Auth** | Sanctum Bearer Token · Multi-Org Scope |

---

## Struktur Repositori

```
AgroPos/
├── backend/          # Laravel 12 API (PHP 8.4)
│   ├── app/
│   │   ├── Models/   # Eloquent Models (Organization, Branch, User, Role, Permission…)
│   │   └── Modules/  # Modular: Auth, Org, Branch, Product, Inventory, POS, Finance…
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/api.php    # Prefix: /api/v1
│   └── .env.example
└── frontend/         # Next.js 16 App Router (TypeScript)
    ├── src/
    │   ├── app/      # App Router pages & layout
    │   ├── components/ui/  # shadcn/ui components
    │   ├── lib/      # api.ts (Axios), utils.ts (cn)
    │   └── providers/      # QueryProvider (TanStack Query)
    └── .env.example
```

---

## Prasyarat

- PHP 8.4 (via WinGet atau Laragon)
- Composer 2.x
- MySQL 8.x
- Node.js 22 LTS + npm 10
- Git

---

## Instalasi Cepat

### Backend

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate

# Konfigurasi MySQL di .env:
# DB_DATABASE=agropos · DB_USERNAME=root · DB_PASSWORD=

php artisan migrate
php artisan db:seed
php artisan serve --port=8000
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev     # http://localhost:3000
```

---

## Akun Awal (Seeded)

| Email | Role | Cabang | Password |
|---|---|---|---|
| `owner@agropos.test` | Owner | Semua | `password123` |
| `admin@agropos.test` | Admin | Solo Pusat | `password123` |
| `kasir@agropos.test` | Kasir | Solo Pusat | `password123` |
| `gudang@agropos.test` | Gudang | Solo & Klaten | `password123` |
| `supplier@agropos.test` | Supplier Portal | — | `password123` |

---

## API Endpoints Aktif (Phase 1)

| Method | Path | Deskripsi |
|---|---|---|
| `GET` | `/api/v1/ping` | Health check backend |
| `GET` | `/api/v1/user` | Profil user (auth:sanctum) |

---

## Menjalankan Tests

```bash
# Backend (PHPUnit — MySQL test DB)
cd backend && php artisan test

# Frontend (TypeScript check)
cd frontend && npm run build
```

---

## Roles & Permissions

| Role | Cakupan |
|---|---|
| **Owner** | Akses penuh seluruh organisasi, semua cabang, laporan keuangan |
| **Admin** | Operasional cabang: master data, PO, kasir, laporan |
| **Kasir** | POS penjualan — tanpa akses HPP/modal |
| **Gudang** | Stok, batch, expiry, penerimaan PO, opname |
| **Supplier** | Portal khusus: PO, faktur, surat jalan |

---

## Arsitektur Keamanan

- **Multi-org isolation**: `organization_id` diterapkan di seluruh query backend
- **Multi-branch isolation**: `branch_id` scope melalui middleware `branch.scope`  
- **Supplier isolation**: Supplier hanya dapat mengakses dokumen `supplier_id` miliknya
- **FEFO enforcement**: Alokasi stok selalu mengutamakan batch terdekat kadaluarsa
- **Historical HPP**: Cost per batch tidak berubah akibat pembelian berikutnya
- **Atomic transactions**: Semua perubahan stok + financial dalam satu DB transaction

---

## Status Pengembangan

| Tahap | Keterangan | Status |
|---|---|---|
| **1** | Project Foundation, Database, Migrasi, Seeder | ✅ Selesai |
| **2** | Authentication, Multi-Branch RBAC, Middleware | 🔜 Berikutnya |
| **3** | Master Data: Produk, Kategori, Satuan | ⏳ |
| **4** | Inventory, Batch, FEFO, Expired | ⏳ |
| **5** | Purchase Order, Penerimaan, Hutang | ⏳ |
| **6** | POS Sales, Mixed Payment | ⏳ |
| **7** | Finance: Hutang/Piutang, Laba Rugi | ⏳ |
| **8** | Branch Transfer | ⏳ |
| **9** | Supplier Portal | ⏳ |
| **10** | Reports & Audit Log | ⏳ |
| **11** | PWA & Printer Support | ⏳ |
| **12** | Final QA & Production Deployment | ⏳ |
