<?php

namespace Database\Seeders;

use App\Models\Permission;
use App\Models\Role;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    public function run(): void
    {
        $roles = [
            'owner' => [
                'display_name' => 'Owner / Pemilik',
                'description' => 'Akses penuh ke seluruh organisasi, cabang, keuangan, dan pengaturan.',
            ],
            'admin' => [
                'display_name' => 'Administrator Cabang',
                'description' => 'Pengelolaan operasional, master data, dan transaksi cabang.',
            ],
            'kasir' => [
                'display_name' => 'Kasir POS',
                'description' => 'Operasional kasir, penjualan POS, dan pembayaran pada cabang yang ditugaskan.',
            ],
            'gudang' => [
                'display_name' => 'Staf Gudang',
                'description' => 'Pengelolaan stok, penerimaan barang, batch, dan opname pada cabang yang ditugaskan.',
            ],
            'supplier' => [
                'display_name' => 'Supplier / Vendor',
                'description' => 'Akses khusus portal supplier untuk PO, surat jalan, dan tagihan.',
            ],
        ];

        $roleModels = [];
        foreach ($roles as $name => $data) {
            $roleModels[$name] = Role::updateOrCreate(
                ['name' => $name],
                [
                    'display_name' => $data['display_name'],
                    'description' => $data['description'],
                ]
            );
        }

        $permissions = [
            // Dashboard
            ['name' => 'dashboard.view_all_branches', 'group' => 'dashboard', 'display_name' => 'Lihat Dashboard Seluruh Cabang'],
            ['name' => 'dashboard.view_branch', 'group' => 'dashboard', 'display_name' => 'Lihat Dashboard Cabang'],

            // Organization & Branch
            ['name' => 'organization.manage', 'group' => 'organization', 'display_name' => 'Kelola Data Organisasi'],
            ['name' => 'branch.manage', 'group' => 'branch', 'display_name' => 'Kelola Cabang'],
            ['name' => 'branch.switch', 'group' => 'branch', 'display_name' => 'Ganti Cabang Aktif'],

            // User & RBAC
            ['name' => 'user.manage', 'group' => 'user', 'display_name' => 'Kelola Pengguna'],
            ['name' => 'role.manage', 'group' => 'rbac', 'display_name' => 'Kelola Role dan Permission'],

            // Master Data
            ['name' => 'product.view', 'group' => 'product', 'display_name' => 'Lihat Produk'],
            ['name' => 'product.manage', 'group' => 'product', 'display_name' => 'Kelola Produk'],
            ['name' => 'customer.manage', 'group' => 'customer', 'display_name' => 'Kelola Pelanggan'],
            ['name' => 'supplier.manage', 'group' => 'supplier', 'display_name' => 'Kelola Data Supplier'],

            // Inventory & Batch
            ['name' => 'inventory.view_stock', 'group' => 'inventory', 'display_name' => 'Lihat Stok'],
            ['name' => 'inventory.view_cost', 'group' => 'inventory', 'display_name' => 'Lihat HPP / Modal'],
            ['name' => 'inventory.adjustment', 'group' => 'inventory', 'display_name' => 'Penyesuaian Stok'],
            ['name' => 'inventory.transfer', 'group' => 'inventory', 'display_name' => 'Transfer Antar Cabang'],
            ['name' => 'inventory.opname', 'group' => 'inventory', 'display_name' => 'Stock Opname'],

            // Purchasing
            ['name' => 'purchase.manage', 'group' => 'purchase', 'display_name' => 'Kelola Pembelian & PO'],
            ['name' => 'purchase.receive', 'group' => 'purchase', 'display_name' => 'Terima Barang Masuk'],

            // POS & Sales
            ['name' => 'pos.create_sale', 'group' => 'pos', 'display_name' => 'Transaksi Penjualan Kasir'],
            ['name' => 'pos.cancel_sale', 'group' => 'pos', 'display_name' => 'Batalkan Penjualan'],
            ['name' => 'pos.return_sale', 'group' => 'pos', 'display_name' => 'Retur Penjualan'],

            // Finance
            ['name' => 'finance.view_cashflow', 'group' => 'finance', 'display_name' => 'Lihat Laporan Arus Kas'],
            ['name' => 'finance.view_profit_loss', 'group' => 'finance', 'display_name' => 'Lihat Laba Rugi'],
            ['name' => 'finance.manage_debt_receivable', 'group' => 'finance', 'display_name' => 'Kelola Hutang & Piutang'],
            ['name' => 'finance.manage_expenses', 'group' => 'finance', 'display_name' => 'Kelola Pengeluaran'],

            // Reports & Audit
            ['name' => 'report.view_all', 'group' => 'report', 'display_name' => 'Lihat Semua Laporan'],
            ['name' => 'report.export', 'group' => 'report', 'display_name' => 'Ekspor Laporan'],
            ['name' => 'audit.view', 'group' => 'audit', 'display_name' => 'Lihat Log Aktivitas'],

            // Supplier Portal
            ['name' => 'supplier_portal.access', 'group' => 'supplier_portal', 'display_name' => 'Akses Portal Supplier'],
        ];

        $permissionModels = [];
        foreach ($permissions as $p) {
            $permissionModels[$p['name']] = Permission::updateOrCreate(
                ['name' => $p['name']],
                [
                    'group' => $p['group'],
                    'display_name' => $p['display_name'],
                    'description' => $p['display_name'],
                ]
            );
        }

        // Assign permissions to roles
        // Owner gets ALL permissions
        $roleModels['owner']->permissions()->sync(array_values(array_map(fn ($m) => $m->id, $permissionModels)));

        // Admin permissions
        $adminPermissions = [
            'dashboard.view_branch',
            'branch.switch',
            'user.manage',
            'product.view',
            'product.manage',
            'customer.manage',
            'supplier.manage',
            'inventory.view_stock',
            'inventory.view_cost',
            'inventory.adjustment',
            'inventory.transfer',
            'inventory.opname',
            'purchase.manage',
            'purchase.receive',
            'pos.create_sale',
            'pos.cancel_sale',
            'pos.return_sale',
            'finance.manage_debt_receivable',
            'finance.manage_expenses',
            'report.view_all',
            'report.export',
            'audit.view',
        ];
        $roleModels['admin']->permissions()->sync(
            collect($adminPermissions)->map(fn ($p) => $permissionModels[$p]->id)
        );

        // Kasir permissions
        $kasirPermissions = [
            'dashboard.view_branch',
            'product.view',
            'inventory.view_stock',
            'pos.create_sale',
            'pos.return_sale',
            'customer.manage',
        ];
        $roleModels['kasir']->permissions()->sync(
            collect($kasirPermissions)->map(fn ($p) => $permissionModels[$p]->id)
        );

        // Gudang permissions
        $gudangPermissions = [
            'dashboard.view_branch',
            'product.view',
            'inventory.view_stock',
            'inventory.view_cost',
            'inventory.adjustment',
            'inventory.transfer',
            'inventory.opname',
            'purchase.receive',
        ];
        $roleModels['gudang']->permissions()->sync(
            collect($gudangPermissions)->map(fn ($p) => $permissionModels[$p]->id)
        );

        // Supplier permissions
        $supplierPermissions = [
            'supplier_portal.access',
        ];
        $roleModels['supplier']->permissions()->sync(
            collect($supplierPermissions)->map(fn ($p) => $permissionModels[$p]->id)
        );
    }
}

