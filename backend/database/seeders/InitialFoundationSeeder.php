<?php

namespace Database\Seeders;

use App\Models\Branch;
use App\Models\Organization;
use App\Models\OrganizationUser;
use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class InitialFoundationSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Create Organization
        $org = Organization::firstOrCreate(
            ['code' => 'AGRO-01'],
            [
                'name' => 'PT Agro Tani Makmur',
                'logo' => null,
                'phone' => '0271-778899',
                'email' => 'contact@agrotani.test',
                'address' => 'Jl. Raya Pertanian No. 88, Solo, Jawa Tengah',
                'currency' => 'IDR',
                'timezone' => 'Asia/Jakarta',
                'status' => 'active',
            ]
        );

        // 2. Create Branches
        $branch1 = Branch::firstOrCreate(
            ['organization_id' => $org->id, 'code' => 'BR-01'],
            [
                'name' => 'Cabang Utama Solo',
                'address' => 'Jl. Slamet Riyadi No. 120, Solo',
                'phone' => '0271-778801',
                'is_main' => true,
                'status' => 'active',
            ]
        );

        $branch2 = Branch::firstOrCreate(
            ['organization_id' => $org->id, 'code' => 'BR-02'],
            [
                'name' => 'Cabang Klaten',
                'address' => 'Jl. Pemuda No. 45, Klaten',
                'phone' => '0272-334401',
                'is_main' => false,
                'status' => 'active',
            ]
        );

        // Roles
        $ownerRole = Role::where('name', 'owner')->first();
        $adminRole = Role::where('name', 'admin')->first();
        $kasirRole = Role::where('name', 'kasir')->first();
        $gudangRole = Role::where('name', 'gudang')->first();
        $supplierRole = Role::where('name', 'supplier')->first();

        // 3. Create Users
        $defaultPassword = Hash::make('password123');

        // Owner
        $owner = User::firstOrCreate(
            ['email' => 'owner@agropos.test'],
            [
                'name' => 'Budi Santoso (Owner)',
                'phone' => '081234567890',
                'password' => $defaultPassword,
                'status' => 'active',
            ]
        );
        OrganizationUser::firstOrCreate([
            'organization_id' => $org->id,
            'user_id' => $owner->id,
            'role_id' => $ownerRole->id,
        ]);
        // Owner has access to all branches
        $owner->branches()->syncWithoutDetaching([$branch1->id, $branch2->id]);

        // Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@agropos.test'],
            [
                'name' => 'Siti Rahma (Admin Solo)',
                'phone' => '081234567891',
                'password' => $defaultPassword,
                'status' => 'active',
            ]
        );
        OrganizationUser::firstOrCreate([
            'organization_id' => $org->id,
            'user_id' => $admin->id,
            'role_id' => $adminRole->id,
        ]);
        $admin->branches()->syncWithoutDetaching([$branch1->id]);

        // Kasir
        $kasir = User::firstOrCreate(
            ['email' => 'kasir@agropos.test'],
            [
                'name' => 'Rian Pratama (Kasir Solo)',
                'phone' => '081234567892',
                'password' => $defaultPassword,
                'status' => 'active',
            ]
        );
        OrganizationUser::firstOrCreate([
            'organization_id' => $org->id,
            'user_id' => $kasir->id,
            'role_id' => $kasirRole->id,
        ]);
        $kasir->branches()->syncWithoutDetaching([$branch1->id]);

        // Gudang
        $gudang = User::firstOrCreate(
            ['email' => 'gudang@agropos.test'],
            [
                'name' => 'Agus Setiawan (Gudang)',
                'phone' => '081234567893',
                'password' => $defaultPassword,
                'status' => 'active',
            ]
        );
        OrganizationUser::firstOrCreate([
            'organization_id' => $org->id,
            'user_id' => $gudang->id,
            'role_id' => $gudangRole->id,
        ]);
        $gudang->branches()->syncWithoutDetaching([$branch1->id, $branch2->id]);

        // Supplier
        $supplier = User::firstOrCreate(
            ['email' => 'supplier@agropos.test'],
            [
                'name' => 'PT Petro Kimia Tani (Supplier Portal)',
                'phone' => '081234567894',
                'password' => $defaultPassword,
                'status' => 'active',
            ]
        );
        OrganizationUser::firstOrCreate([
            'organization_id' => $org->id,
            'user_id' => $supplier->id,
            'role_id' => $supplierRole->id,
        ]);
    }
}

