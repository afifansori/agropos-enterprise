<?php

namespace Tests\Feature;

use App\Models\Branch;
use App\Models\Organization;
use App\Models\Role;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FoundationTest extends TestCase
{
    use RefreshDatabase;

    protected bool $seed = true;

    public function test_api_ping_endpoint_returns_success(): void
    {
        $response = $this->getJson('/api/v1/ping');

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'AGROPOS API v1 is running',
                'version' => '1.0.0',
            ]);
    }

    public function test_initial_roles_exist(): void
    {
        $expectedRoles = ['owner', 'admin', 'kasir', 'gudang', 'supplier'];
        foreach ($expectedRoles as $role) {
            $this->assertDatabaseHas('roles', ['name' => $role]);
        }
    }

    public function test_initial_organization_and_branches_exist(): void
    {
        $this->assertDatabaseHas('organizations', ['code' => 'AGRO-01']);
        $this->assertDatabaseHas('branches', ['code' => 'BR-01', 'is_main' => 1]);
        $this->assertDatabaseHas('branches', ['code' => 'BR-02', 'is_main' => 0]);
    }

    public function test_initial_users_exist_with_roles(): void
    {
        $owner = User::where('email', 'owner@agropos.test')->first();
        $this->assertNotNull($owner);
        $this->assertTrue($owner->hasRole('owner'));
        $this->assertCount(2, $owner->branches);

        $kasir = User::where('email', 'kasir@agropos.test')->first();
        $this->assertNotNull($kasir);
        $this->assertTrue($kasir->hasRole('kasir'));
        $this->assertCount(1, $kasir->branches);
    }
}
