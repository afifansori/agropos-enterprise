<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasApiTokens, HasFactory, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'status',
        'last_login_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'last_login_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function organizationUsers(): HasMany
    {
        return $this->hasMany(OrganizationUser::class);
    }

    public function organizations(): BelongsToMany
    {
        return $this->belongsToMany(Organization::class, 'organization_users')
            ->withPivot('role_id')
            ->withTimestamps();
    }

    public function branches(): BelongsToMany
    {
        return $this->belongsToMany(Branch::class, 'user_branches')
            ->withTimestamps();
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class, 'organization_users')
            ->withPivot('organization_id')
            ->withTimestamps();
    }

    public function hasRole(string $roleName, ?int $organizationId = null): bool
    {
        $query = $this->roles()->where('roles.name', $roleName);
        if ($organizationId !== null) {
            $query->wherePivot('organization_id', $organizationId);
        }
        return $query->exists();
    }

    public function hasPermission(string $permissionName, ?int $organizationId = null): bool
    {
        $rolesQuery = $this->roles();
        if ($organizationId !== null) {
            $rolesQuery->wherePivot('organization_id', $organizationId);
        }
        $roleIds = $rolesQuery->pluck('roles.id');

        return Permission::where('name', $permissionName)
            ->whereHas('roles', function ($q) use ($roleIds) {
                $q->whereIn('roles.id', $roleIds);
            })->exists();
    }
}
