'use client'

import React, { useState, useEffect } from 'react'
import {
  UsersRound,
  ShieldCheck,
  Building2,
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Laptop,
  Smartphone,
  Download,
  RotateCcw,
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { ConfirmDeleteModal } from '@/components/ui/confirm-delete-modal'
import { mockUsers } from '@/lib/mock-data'
import { useAppStore } from '@/stores/use-app-store'
import { User, Role } from '@/types/auth'
import { exportToCsv } from '@/lib/export-csv'
import { usePermissionStore } from '@/stores/use-permission-store'
import { APP_MODULES, AppModule } from '@/lib/rbac'

interface AuditLogEntry {
  id: string
  timestamp: string
  userName: string
  userEmail: string
  role: Role
  ipAddress: string
  device: string
  location: string
  status: 'success' | 'logout' | 'failed'
}

const initialAuditLogs: AuditLogEntry[] = [
  {
    id: 'log-01',
    timestamp: '19 Mei 2025, 08:14:02 WIB',
    userName: 'Budi Santoso',
    userEmail: 'kasir@agropos.id',
    role: 'cashier',
    ipAddress: '192.168.1.104',
    device: 'POS Terminal 01 (Windows 11 / Edge)',
    location: 'Toko Pusat',
    status: 'success',
  },
  {
    id: 'log-02',
    timestamp: '19 Mei 2025, 08:02:11 WIB',
    userName: 'Rina Wulandari',
    userEmail: 'admin@agropos.id',
    role: 'admin',
    ipAddress: '192.168.1.102',
    device: 'Admin PC (Windows 10 / Chrome)',
    location: 'Toko Pusat',
    status: 'success',
  },
  {
    id: 'log-03',
    timestamp: '19 Mei 2025, 07:45:30 WIB',
    userName: 'Arif Setiawan',
    userEmail: 'owner@agropos.id',
    role: 'owner',
    ipAddress: '180.252.88.14',
    device: 'MacBook Air (macOS / Safari)',
    location: 'Toko Pusat',
    status: 'success',
  },
  {
    id: 'log-04',
    timestamp: '18 Mei 2025, 21:05:40 WIB',
    userName: 'Budi Santoso',
    userEmail: 'kasir@agropos.id',
    role: 'cashier',
    ipAddress: '192.168.1.104',
    device: 'POS Terminal 01 (Windows 11 / Edge)',
    location: 'Toko Pusat',
    status: 'logout',
  },
  {
    id: 'log-05',
    timestamp: '18 Mei 2025, 17:30:15 WIB',
    userName: 'Dedi Pratama',
    userEmail: 'gudang@agropos.id',
    role: 'warehouse',
    ipAddress: '192.168.1.108',
    device: 'Warehouse Tablet (Android 14)',
    location: 'Toko Pusat',
    status: 'success',
  },
  {
    id: 'log-06',
    timestamp: '18 Mei 2025, 12:10:04 WIB',
    userName: 'Akun Tamu / Percobaan',
    userEmail: 'unknown@supplier.com',
    role: 'supplier',
    ipAddress: '114.124.200.5',
    device: 'Mobile Phone (Android / Chrome)',
    location: 'Toko Pusat',
    status: 'failed',
  },
]

export default function PenggunaAksesPage() {
  const { addToast } = useAppStore()
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [activeTab, setActiveTab] = useState('Daftar Pengguna')
  const [search, setSearch] = useState('')

  // Permissions Store Integration
  const { permissions, setPermission, resetToDefault, initPermissions } = usePermissionStore()

  useEffect(() => {
    initPermissions()
  }, [initPermissions])

  // State for Add / Edit User
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [deletingUser, setDeletingUser] = useState<User | null>(null)

  // Form state
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('cashier')

  // State for Audit Logs
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(initialAuditLogs)

  const handleOpenAdd = () => {
    setEditingUser(null)
    setName('')
    setEmail('')
    setRole('cashier')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (u: User) => {
    setEditingUser(u)
    setName(u.name)
    setEmail(u.email)
    setRole(u.role)
    setIsModalOpen(true)
  }

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email) {
      alert('Nama dan email staf wajib diisi.')
      return
    }

    if (editingUser) {
      setUsers(
        users.map((u) =>
          u.id === editingUser.id
            ? {
                ...u,
                name,
                email,
                role,
              }
            : u
        )
      )
      addToast(`Akun staf "${name}" berhasil diperbarui!`, 'success')
    } else {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name,
        email,
        role,
        storeName: 'Toko Pusat',
        lastLogin: 'Belum pernah',
        status: 'active',
      }
      setUsers([...users, newUser])
      addToast(`Akun staf baru "${name}" berhasil didaftarkan!`, 'success')
    }

    setIsModalOpen(false)
    setEditingUser(null)
  }

  const handleDeleteConfirm = () => {
    if (!deletingUser) return
    setUsers(users.filter((u) => u.id !== deletingUser.id))
    addToast(`Akun pengguna "${deletingUser.name}" berhasil dihapus!`, 'info')
    setDeletingUser(null)
  }

  // Toggle permission in matrix and update store in real-time
  const handleTogglePermission = (module: AppModule, targetRole: Role) => {
    if (targetRole === 'owner') return
    const currentVal = Boolean(permissions[targetRole]?.[module])
    setPermission(targetRole, module, !currentVal)
  }

  const handleSavePermissions = () => {
    addToast(
      'Matriks hak akses peran (RBAC) berhasil disimpan dan langsung diterapkan ke sidebar serta seluruh halaman!',
      'success'
    )
  }

  const handleResetPermissions = () => {
    resetToDefault()
    addToast('Matriks hak akses dikembalikan ke setelan default pabrikan.', 'info')
  }

  // Export Audit Logs to CSV
  const handleExportAuditLogs = () => {
    const headers = ['Waktu', 'Nama Staf', 'Email', 'Role', 'Alamat IP', 'Perangkat', 'Lokasi Unit', 'Status Login']
    const rows = auditLogs.map((log) => [
      log.timestamp,
      log.userName,
      log.userEmail,
      log.role.toUpperCase(),
      log.ipAddress,
      log.device,
      log.location,
      log.status === 'success' ? 'Berhasil Masuk' : log.status === 'logout' ? 'Keluar / Logout' : 'Gagal Masuk',
    ])
    const dateStr = new Date().toISOString().slice(0, 10)
    exportToCsv(`Audit_Log_Login_AgroPOS_Toko_Pusat_${dateStr}`, headers, rows)
    addToast('Audit log login berhasil diekspor ke Excel (CSV)!', 'success')
  }

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  )

  const filteredLogs = auditLogs.filter(
    (log) =>
      log.userName.toLowerCase().includes(search.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      log.ipAddress.includes(search)
  )

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#166534]">Administrasi & Keamanan</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">
            Pengguna & Hak Akses (RBAC)
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Kelola akun staf, penetapan hak akses berbasis peran (Owner, Admin, Kasir, Gudang, Supplier) Toko Pusat.
          </p>
        </div>

        {activeTab === 'Daftar Pengguna' && (
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 self-start rounded-2xl bg-[#166534] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800 sm:self-auto"
          >
            <Plus size={16} /> Tambah Pengguna Baru
          </button>
        )}

        {activeTab === 'Audit Log Login' && (
          <button
            onClick={handleExportAuditLogs}
            className="inline-flex items-center gap-2 self-start rounded-2xl bg-[#166534] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800 sm:self-auto"
          >
            <Download size={16} /> Ekspor Log Login
          </button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Akun Terdaftar"
          value={`${users.length} Pengguna`}
          detail="Staf operasional Toko Pusat"
          icon={UsersRound}
          tone="green"
        />
        <StatCard
          label="Role Sistem (RBAC)"
          value="5 Role"
          detail="Owner, Admin, Kasir, Gudang, Supplier"
          icon={ShieldCheck}
          tone="blue"
        />
        <StatCard
          label="Unit Operasional"
          value="Toko Pusat"
          detail="Kasir & Gudang Utama Terpadu"
          icon={Building2}
          tone="purple"
        />
      </div>

      <section className="rounded-3xl border border-slate-200/80 bg-white shadow-card overflow-hidden">
        {/* Navigation Tabs */}
        <div className="border-b border-slate-100 px-6 pt-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {['Daftar Pengguna', 'Hak Akses & Role', 'Audit Log Login'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap border-b-2 px-3.5 py-4 text-xs font-bold transition ${
                  activeTab === tab
                    ? 'border-[#166534] text-[#166534]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* TAB 1: DAFTAR PENGGUNA */}
        {activeTab === 'Daftar Pengguna' && (
          <div>
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex h-11 w-full max-w-sm items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 focus-within:border-emerald-500 focus-within:bg-white">
                <Search size={16} className="text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama, email, atau role staf..."
                  className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>
              <span className="text-xs text-slate-400">{filteredUsers.length} staf aktif Toko Pusat</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-3.5">Nama Staf</th>
                    <th className="px-4 py-3.5">Email</th>
                    <th className="px-4 py-3.5">Role</th>
                    <th className="px-4 py-3.5">Lokasi Toko</th>
                    <th className="px-4 py-3.5">Login Terakhir</th>
                    <th className="px-4 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="text-xs transition hover:bg-slate-50/70">
                      <td className="px-6 py-4 font-bold text-slate-800">
                        <div className="flex items-center gap-3">
                          <div className="flex size-9 items-center justify-center rounded-xl bg-[#166534] text-xs font-bold text-white uppercase">
                            {u.name
                              .split(' ')
                              .map((n) => n[0])
                              .slice(0, 2)
                              .join('')}
                          </div>
                          <span>{u.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-slate-500 font-mono">{u.email}</td>
                      <td className="px-4 py-4">
                        <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-[#166534] uppercase">
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{u.storeName}</td>
                      <td className="px-4 py-4 text-slate-400">{u.lastLogin}</td>
                      <td className="px-4 py-4">
                        <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                          Aktif
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleOpenEdit(u)}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-700 hover:bg-emerald-50 hover:border-emerald-300 hover:text-[#166534] transition"
                            title="Edit Pengguna"
                          >
                            <Edit2 size={12} />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => setDeletingUser(u)}
                            className="flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-red-600 hover:bg-red-50 hover:border-red-300 transition"
                            title="Hapus Pengguna"
                          >
                            <Trash2 size={12} />
                            <span>Hapus</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: HAK AKSES & ROLE (RBAC MATRIX CONNECTED DIRECTLY TO SYSTEM) */}
        {activeTab === 'Hak Akses & Role' && (
          <div className="p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-emerald-50/60 p-4 rounded-2xl border border-emerald-100">
              <div>
                <h3 className="text-sm font-bold text-emerald-950">
                  Matriks Hak Akses Berbasis Peran (RBAC Terkoneksi)
                </h3>
                <p className="text-xs text-emerald-800 mt-0.5">
                  Centang untuk mengizinkan atau hilangkan centang untuk membatasi akses menu & dashboard setiap role.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleResetPermissions}
                  className="flex items-center gap-1 rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition"
                >
                  <RotateCcw size={13} /> Reset Default
                </button>
                <button
                  type="button"
                  onClick={handleSavePermissions}
                  className="flex items-center gap-1 rounded-xl bg-[#166534] px-4 py-1.5 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-sm"
                >
                  <Save size={13} /> Simpan Hak Akses
                </button>
              </div>
            </div>

            <div className="overflow-x-auto border border-slate-200 rounded-2xl">
              <table className="w-full min-w-[780px] text-left">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                    <th className="px-6 py-3.5">Modul & Navigasi Sistem</th>
                    <th className="px-4 py-3.5 text-center">Owner (Pemilik)</th>
                    <th className="px-4 py-3.5 text-center">Admin</th>
                    <th className="px-4 py-3.5 text-center">Kasir POS</th>
                    <th className="px-4 py-3.5 text-center">Staf Gudang</th>
                    <th className="px-4 py-3.5 text-center">Supplier Mitra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {APP_MODULES.map((mod) => (
                    <tr key={mod.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 uppercase">
                            {mod.category}
                          </span>
                          <div>
                            <div className="font-bold text-slate-900">{mod.name}</div>
                            <div className="text-[11px] text-slate-400 font-normal">
                              {mod.description} • Rute:{' '}
                              <code className="text-[#166534] font-mono font-semibold">{mod.path}</code>
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Owner */}
                      <td className="px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={permissions.owner?.[mod.id] ?? true}
                          disabled
                          className="size-4 rounded accent-[#166534] cursor-not-allowed opacity-80"
                          title="Owner selalu memiliki akses penuh ke seluruh modul sistem"
                        />
                      </td>

                      {/* Admin */}
                      <td className="px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={permissions.admin?.[mod.id] ?? false}
                          onChange={() => handleTogglePermission(mod.id, 'admin')}
                          className="size-4 rounded accent-[#166534] cursor-pointer"
                        />
                      </td>

                      {/* Cashier */}
                      <td className="px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={permissions.cashier?.[mod.id] ?? false}
                          onChange={() => handleTogglePermission(mod.id, 'cashier')}
                          className="size-4 rounded accent-[#166534] cursor-pointer"
                        />
                      </td>

                      {/* Warehouse */}
                      <td className="px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={permissions.warehouse?.[mod.id] ?? false}
                          onChange={() => handleTogglePermission(mod.id, 'warehouse')}
                          className="size-4 rounded accent-[#166534] cursor-pointer"
                        />
                      </td>

                      {/* Supplier */}
                      <td className="px-4 py-3.5 text-center">
                        <input
                          type="checkbox"
                          checked={permissions.supplier?.[mod.id] ?? false}
                          onChange={() => handleTogglePermission(mod.id, 'supplier')}
                          className="size-4 rounded accent-[#166534] cursor-pointer"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 text-[11px] text-slate-600 space-y-1">
              <p className="font-bold text-[#166534]">
                ✓ Alur Koneksi Otomatis:
              </p>
              <p>
                Setiap perubahan ceklis langsung memfilter menu di <b>Sidebar kiri</b> dan mengamankan akses URL halaman agar staf hanya dapat melihat data sesuai hak wewenang perannya.
              </p>
            </div>
          </div>
        )}

        {/* TAB 3: AUDIT LOG LOGIN */}
        {activeTab === 'Audit Log Login' && (
          <div>
            <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex h-11 w-full max-w-sm items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3.5 focus-within:border-emerald-500 focus-within:bg-white">
                <Search size={16} className="text-slate-400" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama, email, atau alamat IP..."
                  className="w-full bg-transparent text-xs text-slate-800 outline-none placeholder:text-slate-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">
                  Menampilkan <b>{filteredLogs.length}</b> rekaman log keamanan
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left">
                <thead>
                  <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <th className="px-6 py-3.5">Waktu Aktivitas</th>
                    <th className="px-4 py-3.5">Nama Staf & Akun</th>
                    <th className="px-4 py-3.5">Role</th>
                    <th className="px-4 py-3.5">Alamat IP & Perangkat</th>
                    <th className="px-4 py-3.5">Unit Toko</th>
                    <th className="px-6 py-3.5 text-right">Status Aktivitas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs">
                  {filteredLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/80 transition">
                      <td className="px-6 py-4 font-mono font-medium text-slate-600">{log.timestamp}</td>
                      <td className="px-4 py-4 font-bold text-slate-800">
                        <div>{log.userName}</div>
                        <div className="text-[11px] text-slate-400 font-normal font-mono">{log.userEmail}</div>
                      </td>
                      <td className="px-4 py-4">
                        <span className="rounded-lg bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#166534] uppercase">
                          {log.role}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-600">
                        <div className="flex items-center gap-1.5">
                          {log.device.includes('Mobile') || log.device.includes('Tablet') ? (
                            <Smartphone size={13} className="text-slate-400" />
                          ) : (
                            <Laptop size={13} className="text-slate-400" />
                          )}
                          <span className="font-mono font-semibold text-slate-700">{log.ipAddress}</span>
                        </div>
                        <div className="text-[11px] text-slate-400">{log.device}</div>
                      </td>
                      <td className="px-4 py-4 font-semibold text-slate-700">{log.location}</td>
                      <td className="px-6 py-4 text-right">
                        {log.status === 'success' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700">
                            <CheckCircle2 size={12} /> Berhasil Masuk
                          </span>
                        )}
                        {log.status === 'logout' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600">
                            <LogOut size={12} /> Logout Sukses
                          </span>
                        )}
                        {log.status === 'failed' && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-bold text-red-600">
                            <AlertCircle size={12} /> Gagal Otentikasi
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-sm">
                {editingUser ? 'Edit Akun Pengguna' : 'Tambah Staf Pengguna Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nama staf operasional"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#166534]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Akun</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staf@agropos.id"
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs outline-none focus:border-[#166534]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Peran / Hak Akses (Role)</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Role)}
                  className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-bold outline-none"
                >
                  <option value="cashier">Kasir (Transaksi & POS)</option>
                  <option value="warehouse">Gudang (Stok, Batch, FEFO & Opname)</option>
                  <option value="admin">Admin (Operasional & Laporan)</option>
                  <option value="owner">Owner (Akses Penuh Seluruh Sistem)</option>
                  <option value="supplier">Supplier (Portal Mitra Pengadaan)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-xl bg-[#166534] px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800"
                >
                  <Save size={14} /> Simpan Pengguna
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirm Delete Modal */}
      <ConfirmDeleteModal
        isOpen={Boolean(deletingUser)}
        title="Hapus Pengguna"
        message="Apakah Anda yakin ingin menonaktifkan dan menghapus akun staf ini dari sistem Toko Pusat?"
        itemName={deletingUser ? `${deletingUser.name} (${deletingUser.email} • Role: ${deletingUser.role})` : undefined}
        onClose={() => setDeletingUser(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  )
}
