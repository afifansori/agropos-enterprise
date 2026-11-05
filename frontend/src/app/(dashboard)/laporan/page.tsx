'use client'

import React, { useState, useEffect } from 'react'
import {
  FileBarChart,
  TrendingUp,
  CircleDollarSign,
  Boxes,
  Download,
  Calendar,
  Eye,
  Printer,
  X,
  Building2,
  FileSpreadsheet,
} from 'lucide-react'
import { StatCard } from '@/components/ui/stat-card'
import { useAppStore } from '@/stores/use-app-store'
import { exportToCsv } from '@/lib/export-csv'

interface ReportMeta {
  id: string
  title: string
  period: string
  category: string
  author: string
  status: string
}

const reportsList: ReportMeta[] = [
  {
    id: 'rep-01',
    title: 'Laporan Penjualan Kasir Harian',
    period: '19 Mei 2025',
    category: 'Kasir POS',
    author: 'Sistem Kasir Budi Santoso',
    status: 'Siap Unduh',
  },
  {
    id: 'rep-02',
    title: 'Laporan Laba Kotor & HPP Historis',
    period: 'Mei 2025',
    category: 'Keuangan',
    author: 'Sistem Otomatis AgroPOS',
    status: 'Siap Unduh',
  },
  {
    id: 'rep-03',
    title: 'Laporan Valuasi Stok & Audit Batch',
    period: 'Mei 2025',
    category: 'Inventori',
    author: 'Gudang Dedi Pratama',
    status: 'Siap Unduh',
  },
  {
    id: 'rep-04',
    title: 'Laporan Monitoring Kedaluwarsa (FEFO)',
    period: 'Q2 2025',
    category: 'Inventori FEFO',
    author: 'Sistem Alarm FEFO',
    status: 'Siap Unduh',
  },
  {
    id: 'rep-05',
    title: 'Laporan Rekapitulasi Piutang Petani',
    period: 'Mei 2025',
    category: 'Piutang',
    author: 'Finance & Administrasi',
    status: 'Siap Unduh',
  },
]

// Detailed datasets for each report
const reportDetailsData: Record<
  string,
  {
    headers: string[]
    rows: (string | number)[][]
    summary: { label: string; value: string }[]
  }
> = {
  'rep-01': {
    headers: ['No. Struk', 'Waktu', 'Kasir Bertugas', 'Pelanggan', 'Metode Bayar', 'Total Belanja (Rp)'],
    rows: [
      ['TRX-250519-001', '08:14 WIB', 'Budi Santoso', 'Pak Budi Santoso (Petani)', 'Tunai', '345.000'],
      ['TRX-250519-002', '09:30 WIB', 'Budi Santoso', 'Ibu Nurhayati (Poktan)', 'QRIS Mandiri', '820.000'],
      ['TRX-250519-003', '11:05 WIB', 'Budi Santoso', 'Pak Slamet (Petani Mandiri)', 'Piutang Tempo', '1.250.000'],
      ['TRX-250519-004', '14:22 WIB', 'Budi Santoso', 'Toko Berkah Tani (Grosir)', 'Transfer BCA', '4.780.000'],
      ['TRX-250519-005', '16:45 WIB', 'Budi Santoso', 'Pak Budi Santoso (Petani)', 'Tunai', '165.000'],
    ],
    summary: [
      { label: 'Total Transaksi', value: '5 Struk Kasir' },
      { label: 'Total Penerimaan Kasir', value: 'Rp 7.360.000' },
      { label: 'Porsi Non-Tunai / QRIS', value: '75,8%' },
    ],
  },
  'rep-02': {
    headers: ['Kategori Produk', 'Unit Terjual', 'Penjualan Bersih (Rp)', 'HPP Modal (Rp)', 'Laba Kotor (Rp)', 'Margin (%)'],
    rows: [
      ['Insektisida', '420 Botol', '68.400.000', '52.100.000', '16.300.000', '23.8%'],
      ['Fungisida', '310 Pack', '41.250.000', '31.800.000', '9.450.000', '22.9%'],
      ['Herbisida', '560 Botol', '72.800.000', '56.400.000', '16.400.000', '22.5%'],
      ['Pupuk Cair & Organik', '180 Jerigen', '24.600.000', '18.200.000', '6.400.000', '26.0%'],
      ['Alat Pertanian & Sprayer', '45 Unit', '19.800.000', '15.200.000', '4.600.000', '23.2%'],
    ],
    summary: [
      { label: 'Total Penjualan Bersih', value: 'Rp 226.850.000' },
      { label: 'Total HPP (Modal Barang)', value: 'Rp 173.700.000' },
      { label: 'Total Laba Kotor', value: 'Rp 53.150.000 (23,4%)' },
    ],
  },
  'rep-03': {
    headers: ['Kode SKU', 'Nama Obat / Pupuk', 'No. Batch', 'Tgl ED', 'Stok Fisik', 'HPP Satuan (Rp)', 'Total Valuasi (Rp)'],
    rows: [
      ['HRB-001', 'Roundup 486 SL (1 Liter)', 'B240315', '2026-03-15', '142 Botol', '102.000', '14.484.000'],
      ['FNG-002', 'Antracol 70 WP (1 Kg)', 'B240410', '2025-10-10', '85 Pack', '74.000', '6.290.000'],
      ['INS-003', 'Regent 50 SC (250 ml)', 'B240218', '2025-08-20', '64 Botol', '68.000', '4.352.000'],
      ['PPK-004', 'Pupuk NPK Mutiara 16-16-16', 'B240101', '2027-01-01', '210 Karung', '175.000', '36.750.000'],
      ['HRB-002', 'Gramoxone 276 SL', 'B240105', '2025-07-05', '4 Botol', '71.000', '284.000'],
    ],
    summary: [
      { label: 'Jumlah Item SKU Terdaftar', value: '5 Master Produk' },
      { label: 'Total Fisik Barang', value: '505 Unit' },
      { label: 'Total Nilai Aset Stok Toko Pusat', value: 'Rp 62.160.000' },
    ],
  },
  'rep-04': {
    headers: ['SKU', 'Nama Produk', 'Batch No.', 'Tgl Kedaluwarsa', 'Sisa Hari', 'Stok Gudang', 'Status Tingkat Risiko'],
    rows: [
      ['HRB-002', 'Gramoxone 276 SL (1 Liter)', 'B240105', '2025-07-05', '47 Hari', '4 Botol', 'KRITIS (<60 Hari)'],
      ['INS-003', 'Regent 50 SC (250 ml)', 'B240218', '2025-08-20', '93 Hari', '64 Botol', 'WASPADA (<120 Hari)'],
      ['FNG-002', 'Antracol 70 WP (1 Kg)', 'B240410', '2025-10-10', '144 Hari', '85 Pack', 'WASPADA (<180 Hari)'],
      ['HRB-001', 'Roundup 486 SL (1 Liter)', 'B240315', '2026-03-15', '300 Hari', '142 Botol', 'AMAN (>180 Hari)'],
    ],
    summary: [
      { label: 'Batch Kritis Segera Dijual', value: '1 Batch (4 Botol)' },
      { label: 'Batch Waspada Promosi', value: '2 Batch (149 Item)' },
      { label: 'Kepatuhan FEFO Kasir', value: '100% Mengikuti Urutan ED' },
    ],
  },
  'rep-05': {
    headers: ['Nama Petani / Mitra', 'Kontak HP', 'Total Plafon (Rp)', 'Sisa Piutang (Rp)', 'Jatuh Tempo', 'Status Piutang'],
    rows: [
      ['Pak Budi Santoso', '0812-3456-7788', '5.000.000', '1.450.000', '2025-06-15', 'Lancar'],
      ['Pak Slamet Riyadi', '0857-1122-3344', '3.000.000', '2.800.000', '2025-05-25', 'Jatuh Tempo Dekat'],
      ['Ibu Nurhayati (Poktan)', '0813-8899-0011', '10.000.000', '3.200.000', '2025-07-01', 'Lancar'],
      ['Kelompok Tani Subur Makmur', '0821-9988-7766', '15.000.000', '8.500.000', '2025-06-30', 'Lancar'],
    ],
    summary: [
      { label: 'Total Debitur Petani Aktif', value: '4 Pelanggan' },
      { label: 'Total Piutang Beredar', value: 'Rp 15.950.000' },
      { label: 'Plafon Kredit Tersisa', value: 'Rp 17.050.000' },
    ],
  },
}

export default function LaporanPage() {
  const { addToast } = useAppStore()
  const [activeTab, setActiveTab] = useState('Semua Laporan')
  const [selectedReport, setSelectedReport] = useState<ReportMeta | null>(null)
  const [printDateStr, setPrintDateStr] = useState('19/05/2025')

  useEffect(() => {
    setPrintDateStr(new Date().toLocaleDateString('id-ID'))
  }, [])

  const handleOpenPreview = (report: ReportMeta) => {
    setSelectedReport(report)
  }

  const handleDownloadExcel = () => {
    if (!selectedReport) return
    const data = reportDetailsData[selectedReport.id] || {
      headers: ['Kolom 1', 'Kolom 2'],
      rows: [['Data 1', 'Data 2']],
    }

    const filename = `${selectedReport.title.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}`
    exportToCsv(filename, data.headers, data.rows)
    addToast(`${selectedReport.title} berhasil diunduh ke Excel (.csv)!`, 'success')
  }

  const handlePrintPdf = () => {
    if (!selectedReport) return
    window.print()
    addToast(`Mencetak dokumen ${selectedReport.title} format A4...`, 'info')
  }

  const filteredReports = reportsList.filter((r) => {
    if (activeTab === 'Penjualan POS') return r.category === 'Kasir POS'
    if (activeTab === 'Inventori & Batch') return r.category.includes('Inventori')
    if (activeTab === 'Keuangan') return r.category === 'Keuangan'
    if (activeTab === 'Pajak & Pembukuan') return r.category === 'Piutang'
    return true
  })

  const currentDetail = selectedReport ? reportDetailsData[selectedReport.id] : null

  return (
    <div className="space-y-6">
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-report-area,
          #printable-report-area * {
            visibility: visible;
          }
          #printable-report-area {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            margin: 0;
            padding: 18mm 20mm;
            background: #ffffff !important;
            color: #000000 !important;
            box-shadow: none !important;
            border: none !important;
            z-index: 99999;
          }
          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#166534]">Analitik & Ekspor Toko Pusat</p>
          <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">Pusat Laporan & Rekap</h1>
          <p className="mt-1 text-xs text-slate-500">
            Preview terlebih dahulu, lalu unduh format Excel (.CSV) atau Cetak / Print PDF ukuran kertas A4 resmi.
          </p>
        </div>

        <button
          onClick={() => {
            handleOpenPreview(reportsList[0])
            addToast('Menampilkan preview laporan harian Toko Pusat', 'info')
          }}
          className="inline-flex items-center gap-2 self-start rounded-2xl bg-[#166534] px-5 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition hover:bg-emerald-800 sm:self-auto"
        >
          <Eye size={16} /> Preview Laporan Harian Terkini
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Penjualan Bersih Bulan Ini"
          value="Rp 486,2 jt"
          detail="Pertumbuhan +18,4% vs bulan lalu"
          icon={TrendingUp}
          tone="green"
        />
        <StatCard
          label="Estimasi Laba Bersih"
          value="Rp 102,8 jt"
          detail="Margin laba bersih 21,1%"
          icon={CircleDollarSign}
          tone="blue"
        />
        <StatCard
          label="Perputaran Persediaan (Turnover)"
          value="4,2x"
          detail="Rata-rata siklus stok 28 hari"
          icon={Boxes}
          tone="purple"
        />
      </div>

      <section className="rounded-3xl border border-slate-200/80 bg-white shadow-card overflow-hidden">
        <div className="border-b border-slate-100 px-6 pt-2">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            {['Semua Laporan', 'Penjualan POS', 'Inventori & Batch', 'Keuangan', 'Pajak & Pembukuan'].map((tab) => (
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

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead>
              <tr className="bg-slate-50/80 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                <th className="px-6 py-3.5">Nama Laporan</th>
                <th className="px-4 py-3.5">Periode</th>
                <th className="px-4 py-3.5">Kategori</th>
                <th className="px-4 py-3.5">Dibuat Oleh</th>
                <th className="px-4 py-3.5">Format Dokumen</th>
                <th className="px-6 py-3.5 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReports.map((r) => (
                <tr key={r.id} className="text-xs transition hover:bg-slate-50/70">
                  <td className="px-6 py-4 font-bold text-slate-800">
                    <div className="flex items-center gap-2.5">
                      <div className="flex size-8 items-center justify-center rounded-lg bg-emerald-50 text-[#166534]">
                        <FileBarChart size={15} />
                      </div>
                      <span className="font-semibold text-slate-900">{r.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{r.period}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-700">
                      {r.category}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-500">{r.author}</td>
                  <td className="px-4 py-4">
                    <span className="rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-[#166534]">
                      A4 PDF & Excel
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleOpenPreview(r)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-[#166534] hover:bg-emerald-100 hover:border-[#166534] transition shadow-xs"
                    >
                      <Eye size={13} />
                      <span>Preview & Unduh</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Preview Modal formatted as A4 Paper */}
      {selectedReport && currentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-4xl max-h-[92vh] flex flex-col rounded-3xl bg-white shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4 bg-slate-50/70">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#166534]">
                  Preview Dokumen A4 Resmi
                </span>
                <h3 className="font-bold text-slate-900 text-base">{selectedReport.title}</h3>
                <p className="text-[11px] text-slate-400">
                  Periode: {selectedReport.period} • Toko Pusat AgroPOS
                </p>
              </div>

              {/* Action Buttons in Modal Header */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadExcel}
                  className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition"
                  title="Unduh format spreadsheet .csv"
                >
                  <FileSpreadsheet size={15} className="text-emerald-700" />
                  <span className="hidden sm:inline">Unduh Excel</span>
                </button>

                <button
                  type="button"
                  onClick={handlePrintPdf}
                  className="flex items-center gap-1.5 rounded-xl bg-[#166534] px-4 py-2 text-xs font-bold text-white hover:bg-emerald-800 transition shadow-sm"
                  title="Cetak langsung atau simpan PDF ukuran A4"
                >
                  <Printer size={15} />
                  <span>Print PDF (A4)</span>
                </button>

                <button
                  onClick={() => setSelectedReport(null)}
                  className="rounded-xl p-2 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition ml-2"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable Container with A4 Sheet Preview */}
            <div className="overflow-y-auto p-4 sm:p-8 bg-slate-100/60 flex justify-center">
              <div
                id="printable-report-area"
                className="w-full max-w-[210mm] bg-white p-8 sm:p-12 shadow-md rounded-xl text-slate-900 border border-slate-200/60"
                style={{ minHeight: '297mm' }}
              >
                {/* Official Letterhead (Kop Surat) */}
                <div className="border-b-2 border-slate-900 pb-4 mb-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-xl font-black tracking-tight text-slate-950 uppercase">
                        TOKO PUSAT AGROPOS
                      </h1>
                      <p className="text-xs font-medium text-slate-600 mt-0.5">
                        PT Agro Tani Makmur — Solusi Pertanian Terpadu
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Jl. Raya Pertanian No. 18, Dramaga, Kab. Bogor, Jawa Barat 16610
                      </p>
                      <p className="text-[11px] text-slate-500">
                        Telp/WA: 0251-8622100 | Email: tokopusat@agropos.id | NPWP: 01.234.567.8-901.000
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block rounded-md bg-[#166534] px-2.5 py-1 text-[11px] font-bold text-white uppercase tracking-wider">
                        DOKUMEN RESMI
                      </span>
                      <p className="text-[11px] text-slate-400 mt-2 font-mono">
                        Dicetak: {printDateStr}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Report Subject & Metadata */}
                <div className="text-center my-6">
                  <h2 className="text-lg font-black uppercase tracking-wide text-slate-950">
                    {selectedReport.title}
                  </h2>
                  <p className="text-xs font-semibold text-slate-600 mt-1">
                    Periode Laporan: <span className="font-bold text-slate-900">{selectedReport.period}</span>
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Unit Kerja: <span className="font-semibold text-slate-800">Toko Pusat AgroPOS (Utama)</span> | Dibuat Oleh: {selectedReport.author}
                  </p>
                </div>

                {/* Report Table */}
                <div className="overflow-hidden border border-slate-300 rounded-lg mb-6">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 text-[11px] font-bold text-slate-800 border-b border-slate-300">
                        <th className="p-2.5 border-r border-slate-300 text-center w-10">No</th>
                        {currentDetail.headers.map((h, i) => (
                          <th
                            key={i}
                            className={`p-2.5 ${i < currentDetail.headers.length - 1 ? 'border-r border-slate-300' : ''}`}
                          >
                            {h}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {currentDetail.rows.map((row, rowIdx) => (
                        <tr key={rowIdx} className="hover:bg-slate-50">
                          <td className="p-2.5 border-r border-slate-200 text-center text-slate-500 font-mono">
                            {rowIdx + 1}
                          </td>
                          {row.map((cell, cellIdx) => (
                            <td
                              key={cellIdx}
                              className={`p-2.5 ${
                                cellIdx < row.length - 1 ? 'border-r border-slate-200' : ''
                              } ${
                                String(cell).includes('Rp') ||
                                String(cell).includes('%') ||
                                typeof cell === 'number'
                                  ? 'font-medium'
                                  : ''
                              }`}
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Summary Box */}
                <div className="bg-slate-50 rounded-lg border border-slate-200 p-4 mb-8">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Ringkasan & Kesimpulan Laporan:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentDetail.summary.map((sum, i) => (
                      <div key={i} className="bg-white p-2.5 rounded border border-slate-200">
                        <div className="text-[10px] font-semibold text-slate-500 uppercase">{sum.label}</div>
                        <div className="text-sm font-black text-[#166534] mt-0.5">{sum.value}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Signatures Block (Tanda Tangan Pengesahan) */}
                <div className="mt-12 pt-6 border-t border-slate-200 grid grid-cols-2 text-center text-xs">
                  <div>
                    <p className="text-slate-500">Disiapkan Oleh,</p>
                    <div className="h-16"></div>
                    <p className="font-bold text-slate-900 border-b border-slate-300 inline-block px-6 pb-0.5">
                      {selectedReport.author}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Staf Operasional Toko Pusat</p>
                  </div>

                  <div>
                    <p className="text-slate-500">Mengetahui & Menyetujui,</p>
                    <div className="h-16"></div>
                    <p className="font-bold text-slate-900 border-b border-slate-300 inline-block px-6 pb-0.5">
                      Arif Setiawan
                    </p>
                    <p className="text-[11px] text-slate-400 mt-0.5">Kepala Toko Pusat AgroPOS</p>
                  </div>
                </div>

                {/* Watermark / Footer */}
                <div className="mt-10 pt-4 border-t border-slate-100 flex justify-between text-[10px] text-slate-400">
                  <span>AgroPOS Enterprise System • Cetak Ukuran Standar A4</span>
                  <span>Halaman 1 dari 1</span>
                </div>
              </div>
            </div>

            {/* Modal Bottom Bar */}
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3.5 bg-slate-50/90">
              <span className="text-xs text-slate-500">
                Gunakan menu dialog browser saat print untuk memilih printer fisik atau <b>Simpan Sebagai PDF (A4)</b>.
              </span>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50"
              >
                Tutup Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
