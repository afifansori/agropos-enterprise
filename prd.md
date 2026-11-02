# AGROPOS --- Product Requirements Document (PRD)

**Versi:** 1.0\
**Tanggal:** 2 November 2026\
**Status:** Finalisasi kebutuhan dan rancangan teknis\
**Platform:** Web PWA\
**Target penggunaan:** Multi-organisasi / multi-cabang\
**Domain bisnis:** Toko obat-obatan dan sarana produksi pertanian

------------------------------------------------------------------------

## 1. Ringkasan Produk

AgroPOS adalah aplikasi Point of Sale (POS) dan manajemen operasional
untuk toko obat-obatan pertanian. Sistem mengelola pembelian, penjualan,
persediaan berbasis batch, pelanggan, supplier, hutang, piutang,
pembayaran, promosi, laporan, dan aktivitas pengguna.

Aplikasi dirancang untuk penggunaan multi-cabang. Setiap organisasi
dapat memiliki satu atau lebih cabang dengan data operasional yang
terisolasi. Owner dapat memantau seluruh cabang, sedangkan pengguna
operasional hanya dapat mengakses cabang yang ditugaskan.

AgroPOS juga menyediakan Supplier Portal agar supplier dapat melihat
pesanan pembelian, mengonfirmasi pesanan, memperbarui status pengiriman,
dan mengunggah dokumen.

### 1.1 Tujuan

-   Mempercepat transaksi penjualan di kasir.
-   Mengendalikan stok barang berdasarkan batch dan tanggal kedaluwarsa.
-   Mencatat pembelian dan penerimaan barang dari supplier.
-   Mengelola pembayaran tunai, transfer, QRIS, e-wallet, tempo/kredit,
    dan pembayaran campuran.
-   Menghitung HPP, laba kotor, laba bersih, hutang, dan piutang secara
    konsisten.
-   Menyediakan laporan harian, mingguan, bulanan, dan tahunan.
-   Mendukung pengelolaan banyak cabang dalam satu platform.
-   Menyediakan akses supplier melalui portal terpisah.
-   Menyediakan audit trail untuk aktivitas penting.

### 1.2 Sasaran Pengguna

1.  **Owner:** Mengelola organisasi, cabang, keuangan, laporan,
    pengguna, dan seluruh operasional.
2.  **Admin:** Mengelola data dan operasional sesuai hak akses yang
    diberikan.
3.  **Kasir:** Melakukan transaksi penjualan, pembayaran, dan pencetakan
    struk.
4.  **Gudang:** Mengelola penerimaan, batch, stok, opname, dan transfer.
5.  **Supplier:** Mengakses portal supplier untuk pesanan dan dokumen
    yang menjadi haknya.

### 1.3 Platform dan Perangkat

-   Web responsif untuk desktop, tablet, dan ponsel.
-   Progressive Web App (PWA) yang dapat dipasang pada perangkat
    kompatibel.
-   Printer thermal 58 mm dan 80 mm.
-   Printer A4 melalui browser/PDF.
-   Barcode scanner yang berperilaku sebagai input keyboard.
-   Printer USB, Bluetooth, atau LAN bergantung kompatibilitas
    perangkat, browser, dan integrasi tambahan.

------------------------------------------------------------------------

## 2. Ruang Lingkup Produk

### 2.1 Modul Utama

1.  Authentication dan manajemen pengguna.
2.  Organisasi dan cabang.
3.  Role dan permission (RBAC).
4.  Dashboard.
5.  Master produk, kategori, brand, dan satuan.
6.  Pelanggan.
7.  Supplier.
8.  Pembelian dan purchase order.
9.  Penerimaan barang.
10. Inventory dan batch.
11. Expired date management.
12. POS penjualan.
13. Diskon dan promosi.
14. Pembayaran.
15. Hutang dan piutang.
16. Pengeluaran operasional.
17. Transfer stok antar cabang.
18. Stock opname dan penyesuaian.
19. Retur penjualan dan pembelian.
20. Supplier Portal.
21. Laporan dan ekspor.
22. Activity Logs.
23. PWA dan printer.
24. Pengaturan dan backup.

### 2.2 Di Luar Ruang Lingkup MVP

-   Integrasi otomatis dengan marketplace.
-   Integrasi akuntansi pihak ketiga.
-   Integrasi payment gateway real-time QRIS/e-wallet kecuali
    dikembangkan sebagai fase tersendiri.
-   Sinkronisasi offline penuh untuk transaksi lintas cabang.
-   Peramalan stok berbasis AI.
-   Aplikasi native Android/iOS terpisah.

------------------------------------------------------------------------

## 3. Kebutuhan Fungsional

### 3.1 Authentication dan Pengguna

-   Login dan logout.
-   Pengelolaan profil dan kata sandi.
-   Pengelolaan pengguna.
-   Penetapan role dan permission.
-   Penugasan pengguna ke satu atau beberapa cabang.
-   Aktivasi dan penonaktifan akun.
-   Pencatatan waktu login terakhir.
-   Supplier memiliki akses portal yang terisolasi dari pengguna
    internal.

### 3.2 Organisasi dan Cabang

-   Satu akun organisasi dapat memiliki banyak cabang.
-   Setiap cabang memiliki kode, nama, alamat, nomor telepon, dan
    status.
-   Cabang dapat ditetapkan sebagai cabang utama.
-   Owner dapat melihat data lintas cabang.
-   Pengguna cabang hanya dapat mengakses cabang yang diizinkan.
-   Harga produk dapat diatur secara global atau berbeda per cabang.
-   Stok disimpan dan dihitung per cabang serta per batch.

### 3.3 Master Produk

Setiap produk sekurang-kurangnya memiliki:

-   SKU/kode barang.
-   Barcode (opsional).
-   Nama produk.
-   Kategori.
-   Brand/merek.
-   Jenis produk atau kelompok obat pertanian.
-   Deskripsi.
-   Satuan dasar.
-   Satuan alternatif dan faktor konversi.
-   Harga jual.
-   Harga modal yang berasal dari batch pembelian.
-   Minimum stok.
-   Status aktif/nonaktif.
-   Foto produk (opsional).
-   Penanda apakah produk memiliki tanggal kedaluwarsa.

Sistem mendukung konversi satuan, misalnya 1 dus = 12 botol atau 1
karton = 24 kemasan. Kuantitas stok harus dinormalisasi ke satuan dasar.

### 3.4 Pelanggan

-   Tambah, ubah, lihat, dan nonaktifkan pelanggan.
-   Kode pelanggan, nama, nomor telepon, alamat, dan jenis pelanggan.
-   Batas kredit pelanggan.
-   Riwayat pembelian dan pembayaran.
-   Saldo piutang dan umur piutang.
-   Pelanggan umum dapat digunakan untuk transaksi tanpa identitas
    pelanggan terperinci.

### 3.5 Supplier

-   Data supplier: kode, nama, perusahaan, kontak, alamat, email, dan
    contact person.
-   Riwayat pembelian.
-   Saldo hutang dan riwayat pembayaran.
-   Akun login portal supplier.
-   Supplier hanya dapat mengakses dokumen miliknya sendiri.

### 3.6 Pembelian dan Penerimaan Barang

-   Membuat pembelian langsung atau purchase order (PO).
-   Memilih supplier dan cabang penerima.
-   Menambahkan beberapa produk dalam satu dokumen.
-   Mencatat kuantitas, satuan, harga beli, diskon, dan biaya tambahan.
-   Mencatat nomor batch, tanggal produksi, dan tanggal kedaluwarsa.
-   Mendukung penerimaan parsial.
-   Mendukung beberapa batch untuk satu produk.
-   Penerimaan barang menambah stok hanya satu kali setelah
    dikonfirmasi.
-   Pembelian tempo membentuk hutang supplier.
-   Pembayaran dapat dilakukan sebagian atau penuh.
-   Retur pembelian mengurangi stok batch yang terkait.
-   Dokumen draft tidak boleh menambah stok.

### 3.7 Inventory dan Batch

-   Stok per organisasi, cabang, produk, dan batch.
-   Nomor batch, tanggal produksi, tanggal kedaluwarsa, dan harga
    perolehan.
-   Riwayat stok masuk dan keluar.
-   Stok minimum dan peringatan stok menipis.
-   Peringatan stok habis.
-   Peringatan barang mendekati kedaluwarsa.
-   Barang kedaluwarsa diblokir dari penjualan.
-   FEFO (First Expired, First Out) menjadi metode alokasi default.
-   Penyesuaian stok dan stock opname.
-   Transfer antar cabang dengan mempertahankan identitas batch.
-   Semua perubahan stok menghasilkan stock movement.
-   Stok tidak boleh negatif.
-   Kasir tidak dapat melihat harga modal kecuali diberi permission
    khusus.

### 3.8 POS dan Penjualan

-   Pencarian produk berdasarkan nama, SKU, atau barcode.
-   Katalog produk dan filter kategori.
-   Keranjang belanja.
-   Ubah kuantitas dan satuan.
-   Pilih pelanggan.
-   Diskon per item dan diskon transaksi.
-   Penerapan promo berdasarkan syarat.
-   Pembayaran tunai, transfer bank, QRIS, e-wallet, tempo/kredit, dan
    pembayaran campuran.
-   Pembayaran sebagian.
-   Perhitungan uang kembalian untuk pembayaran tunai.
-   Cetak struk dan invoice.
-   Riwayat transaksi dan cetak ulang.
-   Pembatalan transaksi melalui permission khusus.
-   Retur penjualan.
-   Penjualan kredit membuat piutang.
-   Setiap item penjualan mencatat batch dan HPP saat transaksi.

### 3.9 Diskon dan Promosi

-   Promo berupa persentase atau nominal tetap.
-   Kode promo.
-   Minimal pembelian.
-   Maksimal nilai diskon.
-   Periode mulai dan berakhir.
-   Batas penggunaan.
-   Promo dapat dibatasi untuk produk atau kategori tertentu.
-   Sistem mencegah penggunaan promo yang tidak memenuhi syarat.
-   Aturan kombinasi diskon harus dapat dikonfigurasi dan tidak boleh
    menyebabkan diskon ganda yang tidak disengaja.

### 3.10 Pembayaran

Metode pembayaran yang didukung:

-   Tunai.
-   Transfer bank.
-   QRIS.
-   E-wallet.
-   Tempo/kredit.
-   Pembayaran campuran.

Ketentuan: - Satu transaksi dapat memiliki beberapa metode pembayaran. -
Setiap pembayaran memiliki nomor referensi jika tersedia. - Pembayaran
dialokasikan ke dokumen transaksi. - Pembayaran sebagian memperbarui
saldo piutang atau hutang. - Pembayaran tempo bukan penerimaan kas
sampai pembayaran benar-benar diterima. - Status pembayaran: unpaid,
partial, paid. - Semua pembayaran harus dapat ditelusuri ke dokumen
sumber.

### 3.11 Hutang dan Piutang

**Piutang pelanggan:** - Dibentuk dari penjualan kredit. - Menyimpan
nilai awal, pembayaran, sisa tagihan, dan tanggal jatuh tempo. -
Mendukung pembayaran sebagian. - Menampilkan status open, partial, paid,
atau overdue. - Menyediakan laporan umur piutang.

**Hutang supplier:** - Dibentuk dari pembelian kredit. - Menyimpan nilai
awal, pembayaran, sisa tagihan, dan tanggal jatuh tempo. - Mendukung
pembayaran sebagian. - Menampilkan status open, partial, paid, atau
overdue. - Menyediakan laporan umur hutang.

Rentang aging: - Belum jatuh tempo. - 1--30 hari. - 31--60 hari. -
61--90 hari. - Lebih dari 90 hari.

### 3.12 Keuangan dan Pengeluaran

-   Pencatatan kas masuk dan kas keluar.
-   Pencatatan biaya operasional.
-   Kategori pengeluaran.
-   Rekap kas per shift kasir.
-   Laporan arus kas.
-   Laporan laba kotor dan laba bersih.
-   Rekonsiliasi pembayaran dan saldo tagihan.
-   Pengeluaran tidak boleh dihitung ganda dalam laporan laba.

### 3.13 Shift Kasir

-   Kasir membuka shift dengan saldo kas awal.
-   Sistem mencatat transaksi kas selama shift.
-   Kasir menutup shift dengan kas aktual.
-   Sistem menghitung kas yang seharusnya tersedia.
-   Selisih kas dicatat dan dapat diberi catatan.
-   Riwayat shift dapat dilihat oleh role yang berwenang.

### 3.14 Transfer Antar Cabang

Alur status: 1. Draft. 2. Approved. 3. Shipped. 4. Received. 5.
Cancelled.

Fitur: - Cabang asal dan tujuan. - Produk dan batch yang dipindahkan. -
Kuantitas dikirim dan diterima. - Pencatatan selisih penerimaan. -
Riwayat dan audit transfer. - Stok tidak boleh bertambah atau berkurang
dua kali. - Barang dalam perjalanan harus dapat dilacak.

### 3.15 Supplier Portal

-   Login supplier.
-   Dashboard supplier.
-   Profil supplier.
-   Daftar dan detail PO.
-   Konfirmasi atau penolakan pesanan dengan alasan.
-   Pembaruan status pengiriman.
-   Upload invoice dan surat jalan.
-   Riwayat pembayaran.
-   Notifikasi pesanan dan dokumen.
-   Supplier tidak boleh melihat data pelanggan, harga jual, laba, atau
    dokumen supplier lain.

### 3.16 Laporan

Laporan yang disediakan:

-   Penjualan harian, mingguan, bulanan, dan tahunan.
-   Pembelian.
-   Laba kotor dan laba bersih.
-   Penjualan per produk.
-   Produk terlaris.
-   Stok per cabang.
-   Stok per batch.
-   Barang mendekati kedaluwarsa dan kedaluwarsa.
-   Stok minimum.
-   Hutang dan aging hutang.
-   Piutang dan aging piutang.
-   Pengeluaran operasional.
-   Arus kas.
-   Performa kasir.
-   Performa cabang.
-   Promo.
-   Transfer stok.
-   Retur.

Filter laporan: - Rentang tanggal. - Cabang. - Produk. - Kategori. -
Supplier. - Pelanggan. - Kasir. - Status transaksi.

Format keluaran: - Tampilan web. - PDF. - Excel. - Print.

### 3.17 Activity Logs

Aktivitas yang dicatat sekurang-kurangnya:

-   Login dan logout.
-   Tambah, ubah, dan nonaktifkan data.
-   Perubahan harga.
-   Perubahan stok.
-   Penerimaan pembelian.
-   Penjualan.
-   Pembatalan dan retur.
-   Pembayaran.
-   Perubahan role dan permission.
-   Perubahan pengaturan organisasi/cabang.
-   Aktivitas supplier portal.

Log menyimpan pengguna, organisasi, cabang, aksi, modul, referensi
dokumen, nilai sebelum/sesudah jika relevan, IP, user agent, dan waktu.
Log tidak dapat diedit pengguna biasa.

------------------------------------------------------------------------

## 4. Role dan Hak Akses

  ---------------------------------------------------------------------------------
  Modul            Owner       Admin       Kasir          Gudang       Supplier
  ---------------- ----------- ----------- -------------- ------------ ------------
  Dashboard        Ya          Sesuai izin Tidak          Tidak        Portal
  seluruh cabang                                                       sendiri

  Pengaturan       Ya          Sesuai izin Tidak          Tidak        Tidak
  organisasi                                                           

  Manajemen cabang Ya          Sesuai izin Tidak          Tidak        Tidak

  Manajemen        Ya          Sesuai izin Tidak          Tidak        Tidak
  pengguna                                                             

  Master produk    Ya          Ya          Lihat          Lihat        Tidak

  Pelanggan        Ya          Ya          Lihat/tambah   Tidak        Tidak
                                           sesuai izin                 

  Supplier         Ya          Ya          Tidak          Lihat sesuai Profil
  internal                                                izin         sendiri

  Pembelian        Ya          Ya          Tidak          Penerimaan   PO sendiri
                                                          sesuai izin  

  Inventory        Ya          Ya          Lihat stok     Ya           Tidak
                                           tersedia                    

  POS              Ya          Ya          Ya             Tidak        Tidak

  Hutang/piutang   Ya          Ya          Terima         Tidak        Lihat
                                           pembayaran                  pembayaran
                                           sesuai izin                 sendiri

  Laporan keuangan Ya          Ya sesuai   Tidak          Tidak        Tidak
                               izin                                    

  Activity logs    Ya          Sesuai izin Tidak          Tidak        Tidak
  ---------------------------------------------------------------------------------

Hak akses wajib diterapkan di backend menggunakan RBAC dan pembatasan
organisasi/cabang. Tabel di atas adalah matriks awal dan dapat diperinci
menjadi permission granular.

------------------------------------------------------------------------

## 5. Business Logic dan Rumus

### 5.1 Penjualan Bersih

`Penjualan Bersih = Penjualan Kotor - Diskon - Retur Penjualan`

### 5.2 HPP

HPP dihitung berdasarkan batch aktual yang dikeluarkan. Setiap detail
penjualan menyimpan snapshot biaya per unit dan total HPP.

`HPP = Σ (Kuantitas Dasar × Biaya Per Unit Batch)`

### 5.3 Laba Kotor

`Laba Kotor = Penjualan Bersih - HPP`

### 5.4 Laba Bersih

`Laba Bersih = Laba Kotor - Biaya Operasional`

Biaya langsung pembelian, seperti ongkos angkut, harus dialokasikan ke
biaya perolehan atau dicatat sebagai biaya sesuai kebijakan akuntansi.
Hindari penghitungan biaya dua kali.

### 5.5 FEFO

Sistem memilih batch aktif dengan tanggal kedaluwarsa paling dekat
terlebih dahulu. Batch kedaluwarsa atau berstatus quarantine/closed
tidak dapat digunakan untuk penjualan normal.

### 5.6 Pembayaran Campuran

Jumlah seluruh pembayaran harus sesuai dengan jumlah yang dialokasikan
ke transaksi, dengan aturan khusus untuk uang kembalian tunai.
Pembayaran kredit dicatat sebagai sisa tagihan, bukan sebagai metode
penerimaan kas.

### 5.7 Pembatalan dan Retur

Transaksi selesai tidak dihapus secara permanen. Pembatalan dan retur
dilakukan melalui dokumen reversal yang merujuk transaksi asal,
mengembalikan/mengurangi stok sesuai kondisi barang, dan mengoreksi
laporan keuangan secara dapat diaudit.

### 5.8 Integritas Transaksi

Semua operasi pembelian, penerimaan, penjualan, pembayaran, retur, dan
transfer harus: - Menggunakan database transaction. - Mengunci saldo
batch terkait menggunakan row locking. - Memvalidasi stok dan status
dokumen sebelum commit. - Menggunakan idempotency key untuk mencegah
request ganda. - Menyimpan stock movement dan audit log. - Tidak
mempercayai total harga yang dikirim frontend; backend menghitung ulang
harga, diskon, HPP, pajak, dan total.

------------------------------------------------------------------------

## 6. Kebutuhan Non-Fungsional

### 6.1 Keamanan

-   HTTPS wajib di production.
-   Password di-hash dengan Argon2id atau bcrypt.
-   Laravel Sanctum untuk autentikasi API.
-   RBAC dan branch scope pada backend.
-   Validasi input dan output escaping.
-   Parameterized query/ORM untuk mencegah SQL injection.
-   CSRF protection untuk autentikasi berbasis cookie.
-   Rate limiting untuk login dan endpoint sensitif.
-   Validasi MIME type dan ukuran file.
-   Supplier isolation.
-   Audit trail.
-   Backup dan prosedur pemulihan database.

### 6.2 Kinerja

-   Pagination pada tabel besar.
-   Indeks pada kolom pencarian dan foreign key yang relevan.
-   Optimasi query laporan.
-   Queue untuk proses berat seperti ekspor dan notifikasi.
-   Cache hanya untuk data yang aman dan dapat diperbarui dengan benar.
-   Dashboard dan POS harus tetap responsif pada volume data operasional
    yang meningkat.

### 6.3 Keandalan

-   Foreign key dan constraint database.
-   Database transaction pada operasi kritis.
-   Pencegahan stok negatif dan overselling.
-   Idempotency pada endpoint transaksi.
-   Backup berkala.
-   Logging error dan monitoring.
-   Pengujian restore backup.

### 6.4 PWA dan Offline

-   Manifest dan service worker.
-   Installable app.
-   Cache aset statis.
-   Halaman offline dan indikator status jaringan.
-   Transaksi offline, jika diaktifkan, diberi status `pending_sync`.
-   Setiap transaksi lokal memiliki UUID dan idempotency key.
-   Sinkronisasi melakukan validasi ulang stok, harga, dan hak akses.
-   Konflik stok harus ditampilkan dan diselesaikan secara eksplisit.
-   Jangan menampilkan transaksi pending sebagai transaksi server yang
    telah berhasil.

### 6.5 Printer

-   Thermal 58 mm.
-   Thermal 80 mm.
-   A4.
-   Browser print dan PDF.
-   ESC/POS jika perangkat dan koneksi mendukung.
-   Direct printing tanpa dialog membutuhkan integrasi tambahan seperti
    QZ Tray atau aplikasi bridge yang kompatibel.
-   Kompatibilitas harus diuji pada perangkat nyata.

------------------------------------------------------------------------

## 7. Rekomendasi Arsitektur Teknologi

### 7.1 Backend

-   Laravel 12.
-   PHP 8.4.
-   MySQL 8.
-   Laravel Sanctum.
-   REST API `/api/v1`.
-   Laravel Queue.
-   Service layer untuk business logic.
-   Policies dan middleware untuk otorisasi.

### 7.2 Frontend

-   Next.js.
-   TypeScript.
-   Tailwind CSS.
-   shadcn/ui.
-   TanStack Query.
-   Zustand.
-   Recharts.

### 7.3 Arsitektur Tingkat Tinggi

``` text
Browser / PWA
      |
    HTTPS
      |
 Next.js Frontend
      |
 REST API /api/v1
      |
 Laravel Backend
      |
  Service Layer
      |
     MySQL
      |
 Queue / Scheduler / File Storage
```

### 7.4 Prinsip Multi-Tenant

-   `organization_id` menjadi batas isolasi organisasi.
-   `branch_id` menjadi batas data operasional cabang.
-   Owner dapat mengakses seluruh cabang dalam organisasinya.
-   Pengguna lain hanya dapat mengakses cabang yang ditugaskan.
-   Supplier hanya dapat mengakses data berdasarkan relasi supplier
    miliknya.
-   Jangan mengandalkan penyembunyian menu di frontend sebagai kontrol
    keamanan.

------------------------------------------------------------------------

## 8. Rancangan Database MySQL

Database menggunakan MySQL 8, InnoDB, `utf8mb4`, foreign key, indeks,
dan tipe desimal untuk kuantitas serta nilai uang.

### 8.1 Konvensi

-   Primary key: `BIGINT UNSIGNED AUTO_INCREMENT`.
-   Nilai uang: `DECIMAL(18,2)`.
-   Kuantitas: `DECIMAL(18,3)`.
-   Waktu: `DATETIME` atau `TIMESTAMP` sesuai kebutuhan.
-   Status: `ENUM` atau tabel referensi sesuai kompleksitas.
-   Tabel operasional menyimpan `organization_id` dan/atau `branch_id`
    sesuai domain.
-   Transaksi keuangan tidak dihapus permanen.

### 8.2 Tabel Organisasi dan Akses

  -----------------------------------------------------------------------
  Tabel                   Kolom utama             Keterangan
  ----------------------- ----------------------- -----------------------
  `organizations`         id, name, code, logo,   Organisasi pemilik data
                          phone, email, address,  
                          currency, timezone,     
                          status                  

  `branches`              id, organization_id,    Cabang
                          code, name, address,    
                          phone, is_main, status  

  `users`                 id, name, email, phone, Akun pengguna
                          password, status,       
                          last_login_at           

  `roles`                 id, name, description   Role

  `permissions`           id, name, description   Permission

  `role_permissions`      role_id, permission_id  Relasi role dan
                                                  permission

  `organization_users`    id, organization_id,    Keanggotaan pengguna
                          user_id, role_id        

  `user_branches`         user_id, branch_id      Penugasan cabang
  -----------------------------------------------------------------------

### 8.3 Tabel Master Data

  -------------------------------------------------------------------------
  Tabel                     Kolom utama             Keterangan
  ------------------------- ----------------------- -----------------------
  `categories`              id, organization_id,    Kategori produk
                            name, description       

  `brands`                  id, organization_id,    Merek
                            name                    

  `units`                   id, organization_id,    Satuan
                            name, abbreviation      

  `products`                id, organization_id,    Produk
                            category_id, brand_id,  
                            base_unit_id, sku,      
                            barcode, name,          
                            description, min_stock, 
                            is_expirable, is_active 

  `product_units`           id, product_id,         Satuan alternatif
                            unit_id,                
                            conversion_factor,      
                            selling_price,          
                            is_default              

  `product_branch_prices`   id, product_id,         Harga per cabang
                            branch_id,              
                            selling_price           

  `product_prices`          id, product_id,         Riwayat harga
                            branch_id, price,       
                            valid_from, valid_until 
  -------------------------------------------------------------------------

### 8.4 Tabel Inventory

  ---------------------------------------------------------------------------
  Tabel                      Kolom utama              Keterangan
  -------------------------- ------------------------ -----------------------
  `product_batches`          id, organization_id,     Batch produk
                             product_id,              
                             batch_number,            
                             production_date,         
                             expiry_date,             
                             supplier_id,             
                             initial_quantity,        
                             purchase_cost, status    

  `inventory_balances`       id, branch_id,           Saldo per batch dan
                             product_id, batch_id,    cabang
                             quantity,                
                             reserved_quantity        

  `stock_movements`          id, organization_id,     Ledger pergerakan stok
                             branch_id, product_id,   
                             batch_id, movement_type, 
                             reference_type,          
                             reference_id,            
                             quantity_in,             
                             quantity_out,            
                             balance_after,           
                             unit_cost, created_by    

  `stock_adjustments`        id, organization_id,     Dokumen penyesuaian
                             branch_id,               
                             adjustment_number,       
                             status, created_by,      
                             approved_by              

  `stock_adjustment_items`   id, adjustment_id,       Detail opname
                             product_id, batch_id,    
                             system_quantity,         
                             actual_quantity,         
                             difference               

  `stock_transfers`          id, organization_id,     Transfer antar cabang
                             transfer_number,         
                             source_branch_id,        
                             destination_branch_id,   
                             status, requested_by,    
                             approved_by              

  `stock_transfer_items`     id, transfer_id,         Detail transfer
                             product_id, batch_id,    
                             quantity_sent,           
                             quantity_received        
  ---------------------------------------------------------------------------

### 8.5 Tabel Pelanggan dan Supplier

  -----------------------------------------------------------------------
  Tabel                   Kolom utama             Keterangan
  ----------------------- ----------------------- -----------------------
  `customers`             id, organization_id,    Pelanggan
                          code, name, phone,      
                          address, customer_type, 
                          credit_limit, is_active 

  `suppliers`             id, organization_id,    Supplier
                          code, name,             
                          company_name, phone,    
                          email, address,         
                          contact_person,         
                          is_active               

  `supplier_users`        id, supplier_id,        Akun portal supplier
                          user_id                 

  `supplier_documents`    id, supplier_id,        Dokumen supplier
                          purchase_id,            
                          document_type,          
                          file_path, uploaded_at  
  -----------------------------------------------------------------------

### 8.6 Tabel Pembelian

  --------------------------------------------------------------------------
  Tabel                      Kolom utama             Keterangan
  -------------------------- ----------------------- -----------------------
  `purchase_orders`          id, organization_id,    Purchase order
                             branch_id, supplier_id, 
                             po_number, order_date,  
                             expected_date, status,  
                             grand_total             

  `purchase_order_items`     id, purchase_order_id,  Detail PO
                             product_id, unit_id,    
                             quantity, unit_cost,    
                             subtotal                

  `purchases`                id, organization_id,    Dokumen pembelian
                             branch_id, supplier_id, 
                             purchase_number,        
                             invoice_number,         
                             purchase_date,          
                             subtotal,               
                             discount_amount,        
                             additional_cost,        
                             grand_total,            
                             paid_amount, status,    
                             payment_status,         
                             created_by              

  `purchase_items`           id, purchase_id,        Detail pembelian
                             product_id, unit_id,    
                             quantity,               
                             conversion_factor,      
                             base_quantity,          
                             unit_cost,              
                             discount_amount,        
                             subtotal                

  `purchase_receipts`        id, purchase_id,        Penerimaan
                             receipt_number,         
                             received_at,            
                             received_by, status     

  `purchase_receipt_items`   id, receipt_id,         Penerimaan per batch
                             purchase_item_id,       
                             product_id, batch_id,   
                             quantity_received,      
                             expiry_date, unit_cost  

  `purchase_returns`         id, purchase_id,        Retur pembelian
                             return_number,          
                             return_date, status,    
                             total_amount            

  `purchase_return_items`    id, purchase_return_id, Detail retur
                             product_id, batch_id,   
                             quantity, unit_cost,    
                             subtotal                
  --------------------------------------------------------------------------

### 8.7 Tabel Penjualan

  -----------------------------------------------------------------------
  Tabel                   Kolom utama             Keterangan
  ----------------------- ----------------------- -----------------------
  `sales`                 id, organization_id,    Transaksi penjualan
                          branch_id, customer_id, 
                          cashier_id,             
                          sale_number, sale_date, 
                          subtotal,               
                          discount_amount,        
                          tax_amount,             
                          grand_total,            
                          paid_amount,            
                          change_amount,          
                          total_cogs,             
                          gross_profit, status,   
                          payment_status          

  `sale_items`            id, sale_id,            Detail penjualan per
                          product_id, batch_id,   batch
                          unit_id, quantity,      
                          conversion_factor,      
                          base_quantity,          
                          selling_price,          
                          unit_cost,              
                          discount_amount,        
                          subtotal, cogs,         
                          gross_profit            

  `sale_returns`          id, sale_id,            Retur penjualan
                          return_number,          
                          return_date, status,    
                          total_amount            

  `sale_return_items`     id, sale_return_id,     Detail retur
                          sale_item_id,           
                          product_id, batch_id,   
                          quantity, amount,       
                          restock_status          
  -----------------------------------------------------------------------

### 8.8 Tabel Pembayaran dan Saldo Tagihan

  ------------------------------------------------------------------------
  Tabel                    Kolom utama             Keterangan
  ------------------------ ----------------------- -----------------------
  `payment_transactions`   id, organization_id,    Pembayaran masuk/keluar
                           branch_id,              
                           transaction_number,     
                           direction,              
                           payment_method, amount, 
                           reference_number,       
                           payment_date,           
                           received_by             

  `payment_allocations`    id, payment_id,         Alokasi pembayaran
                           document_type,          
                           document_id,            
                           allocated_amount        

  `receivables`            id, organization_id,    Piutang
                           branch_id, sale_id,     
                           customer_id,            
                           original_amount,        
                           paid_amount,            
                           remaining_amount,       
                           due_date, status        

  `payables`               id, organization_id,    Hutang
                           branch_id, purchase_id, 
                           supplier_id,            
                           original_amount,        
                           paid_amount,            
                           remaining_amount,       
                           due_date, status        
  ------------------------------------------------------------------------

Metode pembayaran: `cash`, `bank_transfer`, `qris`, `ewallet`, dan
`other`. Tempo/kredit direpresentasikan sebagai saldo tagihan yang belum
dibayar, bukan sebagai uang yang sudah diterima.

### 8.9 Tabel Operasional Tambahan

  -------------------------------------------------------------------------
  Tabel                     Kolom utama             Keterangan
  ------------------------- ----------------------- -----------------------
  `promotions`              id, organization_id,    Promo
                            name, code,             
                            discount_type,          
                            discount_value,         
                            minimum_purchase,       
                            maximum_discount,       
                            start_at, end_at,       
                            usage_limit, is_active  

  `promotion_products`      promotion_id,           Produk yang mengikuti
                            product_id              promo

  `promotion_categories`    promotion_id,           Kategori yang mengikuti
                            category_id             promo

  `expenses`                id, organization_id,    Pengeluaran
                            branch_id,              
                            expense_number,         
                            category, amount,       
                            expense_date,           
                            description, created_by 

  `cash_sessions`           id, organization_id,    Shift kasir
                            branch_id, cashier_id,  
                            opening_cash,           
                            closing_cash,           
                            expected_cash,          
                            difference_amount,      
                            opened_at, closed_at,   
                            status                  

  `cash_movements`          id, cash_session_id,    Mutasi kas
                            direction, amount,      
                            reference_type,         
                            reference_id, notes     

  `payment_methods`         id, organization_id,    Konfigurasi metode
                            name, code, is_active   pembayaran

  `number_sequences`        id, organization_id,    Nomor dokumen
                            branch_id,              
                            document_type, prefix,  
                            current_number          

  `notifications`           id, organization_id,    Notifikasi
                            user_id, title, body,   
                            read_at                 

  `attachments`             id, organization_id,    Lampiran
                            reference_type,         
                            reference_id,           
                            file_path, mime_type    

  `activity_logs`           id, organization_id,    Audit log
                            branch_id, user_id,     
                            action, module,         
                            reference_type,         
                            reference_id,           
                            old_values, new_values, 
                            ip_address, user_agent, 
                            created_at              

  `organization_settings`   id, organization_id,    Pengaturan organisasi
                            setting_key,            
                            setting_value           

  `branch_settings`         id, branch_id,          Pengaturan cabang
                            setting_key,            
                            setting_value           
  -------------------------------------------------------------------------

### 8.10 Catatan Integritas Database

-   `purchase_receipt_items` menjadi sumber pembuatan batch dari
    penerimaan aktual.
-   Satu detail pembelian dapat diterima dalam beberapa kali penerimaan
    dan beberapa batch.
-   `inventory_balances` merupakan saldo operasional per cabang dan
    batch; `stock_movements` menjadi ledger pergerakan yang dapat
    direkonsiliasi.
-   Saldo batch harus diperbarui dalam transaksi database dan dengan row
    lock.
-   Relasi polymorphic seperti
    `payment_allocations.document_type/document_id` harus divalidasi
    oleh service layer karena tidak memiliki foreign key langsung ke dua
    tabel dokumen.
-   Unique constraint dan indeks harus disesuaikan untuk mencegah
    duplikasi nomor dokumen dalam organisasi/cabang.
-   Semua tabel tenant harus diperiksa agar tidak ada relasi lintas
    organisasi yang tidak sah.

------------------------------------------------------------------------

## 9. ERD Relasi Utama

### 9.1 Organisasi dan Akses

``` mermaid
erDiagram
    ORGANIZATIONS ||--o{ BRANCHES : owns
    ORGANIZATIONS ||--o{ ORGANIZATION_USERS : has
    USERS ||--o{ ORGANIZATION_USERS : joins
    ROLES ||--o{ ORGANIZATION_USERS : assigned
    USERS ||--o{ USER_BRANCHES : assigned
    BRANCHES ||--o{ USER_BRANCHES : grants
    ROLES ||--o{ ROLE_PERMISSIONS : contains
    PERMISSIONS ||--o{ ROLE_PERMISSIONS : includes
    USERS ||--o{ ACTIVITY_LOGS : performs
```

### 9.2 Produk dan Inventory

``` mermaid
erDiagram
    ORGANIZATIONS ||--o{ CATEGORIES : has
    CATEGORIES ||--o{ PRODUCTS : classifies
    BRANDS ||--o{ PRODUCTS : brands
    UNITS ||--o{ PRODUCTS : base_unit
    PRODUCTS ||--o{ PRODUCT_UNITS : supports
    PRODUCTS ||--o{ PRODUCT_BATCHES : contains
    PRODUCTS ||--o{ PRODUCT_BRANCH_PRICES : priced
    BRANCHES ||--o{ PRODUCT_BRANCH_PRICES : sets
    PRODUCT_BATCHES ||--o{ INVENTORY_BALANCES : stored
    BRANCHES ||--o{ INVENTORY_BALANCES : holds
    PRODUCT_BATCHES ||--o{ STOCK_MOVEMENTS : moves
    PRODUCTS ||--o{ STOCK_MOVEMENTS : tracks
```

### 9.3 Penjualan, Pembelian, dan Pembayaran

``` mermaid
erDiagram
    CUSTOMERS ||--o{ SALES : purchases
    SUPPLIERS ||--o{ PURCHASES : supplies
    BRANCHES ||--o{ SALES : records
    BRANCHES ||--o{ PURCHASES : receives
    SALES ||--|{ SALE_ITEMS : contains
    PURCHASES ||--|{ PURCHASE_ITEMS : contains
    PRODUCTS ||--o{ SALE_ITEMS : sold
    PRODUCTS ||--o{ PURCHASE_ITEMS : purchased
    PRODUCT_BATCHES ||--o{ SALE_ITEMS : issued
    SALES ||--o| RECEIVABLES : creates
    PURCHASES ||--o| PAYABLES : creates
    PAYMENT_TRANSACTIONS ||--o{ PAYMENT_ALLOCATIONS : allocates
```

### 9.4 Supplier Portal

``` mermaid
erDiagram
    SUPPLIERS ||--o{ SUPPLIER_USERS : has
    USERS ||--o{ SUPPLIER_USERS : accesses
    SUPPLIERS ||--o{ PURCHASE_ORDERS : receives
    PURCHASE_ORDERS ||--o{ PURCHASE_ORDER_ITEMS : contains
    PURCHASES ||--o{ PURCHASE_RECEIPTS : received
    PURCHASE_RECEIPTS ||--|{ PURCHASE_RECEIPT_ITEMS : contains
    SUPPLIERS ||--o{ SUPPLIER_DOCUMENTS : uploads
```

------------------------------------------------------------------------

## 10. REST API Specification

**Base URL:** `https://domainanda.com/api/v1`\
**Format:** JSON\
**Authentication:** Bearer Token (Sanctum)\
**Authorization:** RBAC + organization scope + branch scope

### 10.1 Authentication

  Method   Endpoint                  Fungsi
  -------- ------------------------- -----------------------------------------
  POST     `/auth/login`             Login
  POST     `/auth/logout`            Logout
  GET      `/auth/me`                Profil pengguna aktif
  POST     `/auth/refresh`           Refresh token bila mekanisme diterapkan
  PUT      `/auth/profile`           Ubah profil
  PUT      `/auth/change-password`   Ubah password

### 10.2 Organisasi dan Cabang

  Method   Endpoint                   Fungsi
  -------- -------------------------- --------------------------------------
  GET      `/organizations`           Daftar organisasi yang dapat diakses
  GET      `/organizations/current`   Organisasi aktif
  PUT      `/organizations/current`   Ubah organisasi
  GET      `/branches`                Daftar cabang
  POST     `/branches`                Tambah cabang
  GET      `/branches/{id}`           Detail cabang
  PUT      `/branches/{id}`           Ubah cabang
  DELETE   `/branches/{id}`           Nonaktifkan cabang
  POST     `/branches/switch`         Pindah cabang aktif

### 10.3 Pengguna dan Permission

  Method   Endpoint                 Fungsi
  -------- ------------------------ ----------------------
  GET      `/users`                 Daftar pengguna
  POST     `/users`                 Tambah pengguna
  PUT      `/users/{id}`            Ubah pengguna
  PATCH    `/users/{id}/status`     Ubah status
  GET      `/roles`                 Daftar role
  GET      `/permissions`           Daftar permission
  PUT      `/users/{id}/branches`   Atur cabang pengguna

### 10.4 Produk dan Master Data

  Method     Endpoint                     Fungsi
  ---------- ---------------------------- ------------------------
  GET        `/products`                  Daftar produk
  POST       `/products`                  Tambah produk
  GET        `/products/{id}`             Detail produk
  PUT        `/products/{id}`             Ubah produk
  DELETE     `/products/{id}`             Nonaktifkan produk
  GET        `/products/search`           Cari produk
  GET        `/products/barcode/{code}`   Cari barcode
  POST       `/products/import`           Import Excel
  GET        `/products/export`           Export Excel
  GET/POST   `/categories`                Daftar/tambah kategori
  GET        `/units`                     Daftar satuan
  POST       `/products/{id}/units`       Atur satuan
  GET        `/products/{id}/prices`      Riwayat harga
  PUT        `/products/{id}/prices`      Atur harga

### 10.5 Inventory

  Method   Endpoint                              Fungsi
  -------- ------------------------------------- -----------------------
  GET      `/inventory`                          Daftar stok
  GET      `/inventory/summary`                  Ringkasan stok
  GET      `/inventory/low-stock`                Stok menipis
  GET      `/inventory/expired`                  Barang kedaluwarsa
  GET      `/inventory/near-expiry`              Mendekati kedaluwarsa
  GET      `/inventory/{product_id}/batches`     Batch produk
  GET      `/inventory/movements`                Riwayat pergerakan
  POST     `/inventory/adjustments`              Penyesuaian stok
  POST     `/inventory/stock-opname`             Stock opname
  POST     `/inventory/transfers`                Buat transfer
  POST     `/inventory/transfers/{id}/approve`   Setujui transfer
  POST     `/inventory/transfers/{id}/ship`      Kirim transfer
  POST     `/inventory/transfers/{id}/receive`   Terima transfer

### 10.6 Penjualan / POS

  Method   Endpoint                Fungsi
  -------- ----------------------- ----------------------
  GET      `/sales`                Riwayat penjualan
  POST     `/sales`                Buat transaksi
  GET      `/sales/{id}`           Detail penjualan
  POST     `/sales/{id}/cancel`    Batalkan dengan izin
  POST     `/sales/{id}/returns`   Retur
  GET      `/sales/{id}/receipt`   Data struk
  POST     `/sales/{id}/reprint`   Catat cetak ulang
  GET      `/sales/today`          Penjualan hari ini

Contoh request:

``` json
{
  "branch_id": 1,
  "customer_id": 10,
  "idempotency_key": "unique-client-generated-key",
  "items": [
    {
      "product_id": 15,
      "batch_id": 20,
      "unit_id": 1,
      "quantity": 2,
      "discount_amount": 5000
    }
  ],
  "discount_amount": 10000,
  "payments": [
    {
      "method": "cash",
      "amount": 100000
    },
    {
      "method": "qris",
      "amount": 50000,
      "reference_number": "QRIS-REFERENCE"
    }
  ],
  "due_date": null,
  "notes": "Penjualan toko"
}
```

Backend wajib menghitung ulang harga, diskon, HPP, pajak, total, alokasi
batch, dan saldo pembayaran dari data server. Nilai dari frontend tidak
boleh menjadi sumber kebenaran.

### 10.7 Pembelian

  Method   Endpoint                     Fungsi
  -------- ---------------------------- ------------------------
  GET      `/purchases`                 Daftar pembelian
  POST     `/purchases`                 Buat pembelian
  GET      `/purchases/{id}`            Detail pembelian
  POST     `/purchases/{id}/receive`    Konfirmasi penerimaan
  POST     `/purchases/{id}/cancel`     Batalkan sesuai status
  POST     `/purchases/{id}/payments`   Pembayaran supplier
  POST     `/purchases/{id}/returns`    Retur pembelian
  GET      `/purchase-orders`           Daftar PO
  POST     `/purchase-orders`           Buat PO

### 10.8 Pelanggan dan Supplier

  Method     Endpoint                    Fungsi
  ---------- --------------------------- -------------------------
  GET/POST   `/customers`                Daftar/tambah pelanggan
  GET        `/customers/{id}`           Detail pelanggan
  PUT        `/customers/{id}`           Ubah pelanggan
  GET        `/customers/{id}/history`   Riwayat pelanggan
  GET/POST   `/suppliers`                Daftar/tambah supplier
  GET        `/suppliers/{id}`           Detail supplier
  PUT        `/suppliers/{id}`           Ubah supplier
  GET        `/suppliers/{id}/history`   Riwayat supplier

### 10.9 Keuangan

  Method     Endpoint                               Fungsi
  ---------- -------------------------------------- ---------------------------
  GET        `/finance/receivables`                 Daftar piutang
  GET        `/finance/payables`                    Daftar hutang
  POST       `/finance/receivables/{id}/payments`   Bayar piutang
  POST       `/finance/payables/{id}/payments`      Bayar hutang
  GET        `/finance/cash-flow`                   Arus kas
  GET/POST   `/finance/expenses`                    Daftar/tambah pengeluaran
  GET        `/finance/profit`                      Laporan laba
  GET        `/finance/profit/product`              Laba per produk

### 10.10 Laporan

  Method   Endpoint                  Fungsi
  -------- ------------------------- ---------------------
  GET      `/reports/dashboard`      Dashboard
  GET      `/reports/sales`          Penjualan
  GET      `/reports/purchases`      Pembelian
  GET      `/reports/profit`         Laba
  GET      `/reports/inventory`      Stok
  GET      `/reports/debts`          Hutang
  GET      `/reports/receivables`    Piutang
  GET      `/reports/cashier`        Kasir
  GET      `/reports/branches`       Perbandingan cabang
  GET      `/reports/monthly`        Rekap bulanan
  GET      `/reports/export/pdf`     Ekspor PDF
  GET      `/reports/export/excel`   Ekspor Excel

Parameter umum: `branch_id`, `start_date`, `end_date`, `format`, dan
filter relevan lainnya.

### 10.11 Supplier Portal

  Method   Endpoint                            Fungsi
  -------- ----------------------------------- --------------------
  POST     `/supplier/auth/login`              Login supplier
  GET      `/supplier/dashboard`               Dashboard supplier
  GET      `/supplier/profile`                 Profil
  PUT      `/supplier/profile`                 Ubah profil
  GET      `/supplier/orders`                  Daftar PO
  GET      `/supplier/orders/{id}`             Detail PO
  POST     `/supplier/orders/{id}/confirm`     Konfirmasi
  POST     `/supplier/orders/{id}/reject`      Tolak pesanan
  POST     `/supplier/orders/{id}/documents`   Upload dokumen
  GET      `/supplier/invoices`                Daftar faktur
  GET      `/supplier/payments`                Riwayat pembayaran
  GET      `/supplier/notifications`           Notifikasi

Supplier API wajib menentukan `supplier_id` dari identitas akun yang
terautentikasi, bukan mempercayai ID supplier yang dikirim klien.

------------------------------------------------------------------------

## 11. UI/UX Design Specification

### 11.1 Design System

Palet warna: - Primary: `#166534` - Secondary: `#22C55E` - Background:
`#F0FDF4` - Text: `#1E293B` - White: `#FFFFFF`

Gaya: - Modern, bersih, profesional, dan mudah digunakan. - Sidebar dan
topbar konsisten. - Data table dengan pencarian, filter, pagination, dan
aksi. - Form menggunakan validasi yang jelas. - Modal/drawer untuk
proses singkat. - Skeleton loading, empty state, error state, dan toast
notification. - Responsive untuk desktop, tablet, dan ponsel.

### 11.2 Dashboard

Menampilkan: - Total penjualan. - Total pembelian. - Laba kotor dan laba
bersih. - Piutang dan hutang. - Grafik penjualan. - Produk terlaris. -
Stok menipis. - Produk mendekati kedaluwarsa. - Transaksi terbaru. -
Filter cabang dan periode.

### 11.3 POS

Desktop: - Panel pencarian dan katalog produk. - Filter kategori. -
Keranjang. - Pilihan pelanggan. - Subtotal, diskon, dan total. -
Checkout dan pembayaran.

Mobile: - Katalog produk. - Tombol tambah ke keranjang. - Keranjang
melalui drawer. - Checkout yang nyaman di layar kecil.

### 11.4 Inventory

Kolom utama: - SKU. - Nama produk. - Kategori. - Cabang. - Total stok. -
Jumlah batch. - Kedaluwarsa terdekat. - Harga modal (khusus role
berizin). - Status stok.

### 11.5 Supplier Portal

-   Dashboard pesanan.
-   PO masuk.
-   Status konfirmasi.
-   Status pengiriman.
-   Upload faktur/surat jalan.
-   Riwayat pembayaran.
-   Notifikasi.

------------------------------------------------------------------------

## 12. Struktur Folder Proyek

``` text
agropos/
├── backend/
│   ├── app/
│   │   ├── Models/
│   │   ├── Http/
│   │   │   ├── Controllers/API/V1/
│   │   │   ├── Middleware/
│   │   │   └── Requests/
│   │   ├── Services/
│   │   │   ├── Sales/
│   │   │   ├── Purchases/
│   │   │   ├── Inventory/
│   │   │   ├── Finance/
│   │   │   └── Reports/
│   │   ├── Policies/
│   │   ├── Jobs/
│   │   └── Notifications/
│   ├── database/
│   │   ├── migrations/
│   │   ├── seeders/
│   │   └── factories/
│   ├── routes/api.php
│   ├── tests/
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── pos/
│   │   │   ├── products/
│   │   │   ├── inventory/
│   │   │   ├── purchases/
│   │   │   ├── sales/
│   │   │   ├── customers/
│   │   │   ├── suppliers/
│   │   │   ├── finance/
│   │   │   ├── reports/
│   │   │   ├── settings/
│   │   │   └── supplier-portal/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── stores/
│   │   ├── types/
│   │   └── lib/
│   ├── public/
│   │   ├── icons/
│   │   └── manifest.json
│   └── tests/
├── docs/
│   ├── PRD.md
│   ├── ERD.md
│   ├── API.md
│   ├── DATABASE.md
│   └── DEPLOYMENT.md
└── README.md
```

------------------------------------------------------------------------

## 13. Roadmap Pengembangan

  Tahap   Modul                                       Target
  ------- ------------------------------------------- ----------------------
  1       Project foundation, konfigurasi, database   Fondasi
  2       Authentication, multi-branch, RBAC          Akses aman
  3       Master data                                 Produk dan mitra
  4       Inventory, batch, expired, FEFO             Persediaan
  5       Purchase management                         Pengadaan
  6       POS sales dan checkout                      Penjualan
  7       Finance, hutang, piutang, laba              Keuangan
  8       Transfer antar cabang                       Distribusi
  9       Supplier Portal                             Integrasi supplier
  10      Reports, promo, audit logs                  Pelaporan
  11      PWA dan printer                             Pengalaman perangkat
  12      QA dan deployment                           Production

### 13.1 Prioritas MVP

-   **MVP 1:** Login, organisasi, cabang, role, master data.
-   **MVP 2:** Inventory, batch, FEFO, expired.
-   **MVP 3:** Pembelian, penerimaan, supplier, hutang.
-   **MVP 4:** POS, pembayaran, diskon, struk.
-   **MVP 5:** Piutang, pengeluaran, laba, laporan.
-   **Release 2:** Transfer cabang dan supplier portal.
-   **Release 3:** PWA offline, analitik lanjutan, dan otomatisasi.

Jangan membangun semua modul sekaligus. Setiap tahap harus selesai,
diuji, dan didokumentasikan sebelum tahap berikutnya.

------------------------------------------------------------------------

## 14. Prompt Antigravity

### 14.1 Master Project Instruction

``` text
# MASTER PROJECT INSTRUCTION — AGROPOS

Anda bertindak sebagai Senior Full-Stack Developer, Software Architect,
Database Engineer, UI/UX Designer, dan QA Engineer.

Bangun aplikasi AGROPOS, yaitu POS, Inventory Management, Purchasing,
Finance, dan Supplier Portal khusus toko obat-obatan pertanian.

TECH STACK:
Backend:
- Laravel 12
- PHP 8.4
- MySQL 8
- Laravel Sanctum
- REST API /api/v1
- Laravel Queue

Frontend:
- Next.js
- TypeScript
- Tailwind CSS
- shadcn/ui
- TanStack Query
- Zustand
- Recharts

PWA:
- Web App Manifest
- Service Worker
- Installable application
- Responsive desktop, tablet, mobile

KONSEP:
- Multi-organization dan multi-branch.
- Stok terpisah per cabang dan batch.
- Owner dapat memantau semua cabang.
- Kasir dan gudang dibatasi pada cabang yang ditugaskan.
- Supplier memiliki portal tersendiri.
- Inventory menggunakan batch dan expiry date.
- FEFO sebagai metode alokasi default.
- HPP disimpan berdasarkan batch aktual.

ROLES:
- Owner
- Admin
- Kasir
- Gudang
- Supplier

MODUL:
Authentication, Dashboard, Organization, Branch, RBAC, Product,
Customer, Supplier, Purchase, Purchase Order, Inventory, Batch,
Expired, POS, Discount, Promotion, Payment, Debt, Receivable,
Expenses, Profit & Loss, Stock Transfer, Stock Opname, Sales Return,
Purchase Return, Supplier Portal, Reports, Activity Logs, PWA,
Printer, Backup, Settings.

DESIGN:
Primary #166534
Secondary #22C55E
Background #F0FDF4
Text #1E293B
White #FFFFFF

Gunakan desain premium, modern, minimalis, profesional, responsive.
Gunakan sidebar, topbar, data table, modal, drawer, chart, statistik
cards, skeleton loading, empty state, error state, dan toast.

DEVELOPMENT RULES:
- Jangan membuat tombol palsu.
- Jangan mengganti backend dengan data dummy.
- Semua form harus divalidasi.
- Semua transaksi harus tersimpan ke MySQL.
- Gunakan database transaction dan row locking.
- Implementasikan permission di backend.
- Isolasi data organization_id dan branch_id.
- Supplier hanya boleh melihat datanya sendiri.
- Simpan audit log.
- Jangan menghapus transaksi keuangan permanen.
- Gunakan migrations, seeders, services, policies, dan automated tests.
- Jangan merusak fitur yang sudah selesai.

Setelah setiap tahap:
1. Jalankan pemeriksaan kode.
2. Jalankan migration dan test relevan.
3. Perbaiki error.
4. Perbarui dokumentasi.
5. Laporkan file yang dibuat/diubah.
6. Laporkan fitur yang berfungsi dan belum.
7. Jangan mengklaim tahap selesai jika belum diuji.

Bangun secara bertahap. Tunggu instruksi tahap berikutnya.
```

### 14.2 Prompt Tahap 1 --- Foundation dan Database

``` text
# AGROPOS — PHASE 1: PROJECT FOUNDATION

Baca PRD.md dan MASTER PROJECT INSTRUCTION.

Tugas:
1. Buat repository dengan folder backend dan frontend.
2. Setup Laravel 12 dengan PHP 8.4.
3. Setup Next.js TypeScript.
4. Setup Tailwind CSS dan shadcn/ui.
5. Konfigurasi MySQL.
6. Buat .env.example.
7. Konfigurasi CORS dan Sanctum.
8. Setup API prefix /api/v1.
9. Buat struktur folder modular.
10. Buat README dan dokumentasi database.

Migration awal:
- organizations
- branches
- users
- roles
- permissions
- role_permissions
- organization_users
- user_branches

Seeder awal:
- Owner
- Admin
- Kasir
- Gudang
- Supplier

Acceptance criteria:
- Backend berjalan.
- Frontend berjalan.
- MySQL terkoneksi.
- Migration dan seeder berhasil.
- API dapat diakses.
- Build tidak error.

Jangan membuat modul lain sebelum foundation selesai.
```

### 14.3 Prompt Tahap 2 --- Authentication, Multi-Branch, RBAC

``` text
# AGROPOS — PHASE 2: AUTHENTICATION & RBAC

Baca PRD.md.

Implementasikan:
- Login/logout.
- Profil dan ganti password.
- User management.
- Role dan permission.
- Penugasan pengguna ke cabang.
- Pemilihan cabang aktif.
- Owner dapat mengakses seluruh cabang.
- Admin, kasir, dan gudang dibatasi sesuai penugasan.
- Supplier hanya dapat mengakses portal miliknya.

Middleware:
- auth:sanctum
- organization.scope
- branch.scope
- permission
- supplier.scope

Buat UI login, dashboard awal, user management,
role management, branch selector, dan profile.

Acceptance:
- Tidak bisa mengakses organisasi lain.
- Tidak bisa mengakses cabang tanpa izin.
- Supplier tidak bisa mengakses supplier lain.
- Feature tests setiap role berhasil.
```

### 14.4 Prompt Tahap 3 --- Master Data

``` text
# AGROPOS — PHASE 3: MASTER DATA

Implementasikan CRUD:
- Produk.
- Kategori.
- Brand.
- Satuan.
- Konversi satuan.
- Harga produk.
- Pelanggan.
- Supplier.

Produk memiliki SKU, barcode, nama, kategori, brand, jenis produk,
deskripsi, satuan dasar, satuan alternatif, minimum stok, harga jual,
status aktif, dan foto opsional.

Dukung konversi satuan seperti 1 dus = 12 botol.

Harga dapat diatur secara global dan per cabang.

Buat search, pagination, filter, import/export Excel, validasi,
image upload, dan halaman detail.

SKU harus unik dalam organisasi.
Buat automated tests CRUD dan import.
Jangan lanjut sebelum master data berfungsi.
```

### 14.5 Prompt Tahap 4 --- Inventory, Batch, dan Expired

``` text
# AGROPOS — PHASE 4: INVENTORY & BATCH

Bangun:
- Stok per cabang.
- Stok per batch.
- Batch number.
- Production date.
- Expiry date.
- Harga modal per batch.
- Minimum stock.
- Low stock dan out of stock.
- Expired dan near expiry.
- Stock movement.
- Stock adjustment.
- Stock opname.
- FEFO.

Rules:
- Barang terjual mengurangi batch yang dialokasikan.
- FEFO menjadi default.
- Batch expired diblokir.
- Stok tidak boleh negatif.
- Kasir tidak dapat melihat modal tanpa izin.
- Setiap perubahan menghasilkan stock movement.
- Gunakan database transaction dan row locking.
- Transfer mempertahankan identitas batch.

Tests:
- Stock in/out.
- Expired block.
- FEFO allocation.
- Insufficient stock.
- Concurrent stock deduction.

Saldo per batch menjadi sumber utama persediaan.
```

### 14.6 Prompt Tahap 5 --- Purchase Management

``` text
# AGROPOS — PHASE 5: PURCHASE MANAGEMENT

Implementasikan:
- Purchase order.
- Supplier selection.
- Purchase invoice.
- Pembelian langsung.
- Penerimaan barang.
- Multiple batch.
- Expiry date.
- Purchase cost.
- Additional cost.
- Discount.
- Partial payment.
- Credit purchase.
- Purchase return.
- Purchase history.

Alur:
1. Pilih supplier dan cabang.
2. Buat PO atau pembelian langsung.
3. Tambahkan produk.
4. Isi quantity, unit cost, batch, dan expiry.
5. Konfirmasi penerimaan.
6. Buat batch dan tambah stok.
7. Buat hutang jika belum lunas.
8. Simpan audit log.

Draft tidak menambah stok.
Penerimaan hanya boleh diproses satu kali untuk kuantitas yang sama.
Buat laporan pembelian per supplier/cabang dan tests.
```

### 14.7 Prompt Tahap 6 --- POS Sales

``` text
# AGROPOS — PHASE 6: POS SALES

Buat POS modern dan responsive.

UI:
- Product search.
- Barcode scanner.
- Product grid.
- Category filter.
- Cart.
- Customer selector.
- Quantity control.
- Discount.
- Payment modal.
- Receipt preview.

Pembayaran:
- Cash.
- Bank transfer.
- QRIS.
- E-wallet.
- Tempo/credit.
- Mixed payment.

Fitur:
- Diskon item dan transaksi.
- Promo.
- Partial payment.
- Change calculation.
- Customer credit.
- Print 58mm, 80mm, A4.
- History dan reprint.
- Cancel dengan permission.
- Sales return.

Rules:
- Backend menghitung ulang seluruh nilai.
- Validasi stok dan batch.
- Specific batch costing.
- HPP disimpan dalam sale_items.
- Kredit menghasilkan piutang.
- Mixed payment menggunakan allocations.
- Atomic transaction dan idempotency key.
- Transaksi selesai tidak dihapus.

Buat tests semua metode pembayaran, diskon, stok, dan HPP.
```

### 14.8 Prompt Tahap 7 --- Finance

``` text
# AGROPOS — PHASE 7: FINANCE

Implementasikan:
- Hutang supplier.
- Piutang pelanggan.
- Cicilan.
- Pembayaran.
- Kas masuk dan keluar.
- Pengeluaran.
- Cash flow.
- Gross profit.
- Net profit.
- Rekap shift kasir.
- Aging report.

Rules:
- Kredit bukan uang masuk.
- Penjualan kredit tetap dicatat sebagai penjualan dan piutang.
- Pembelian kredit membentuk hutang.
- Pembayaran hutang mengurangi kas dan payable.
- Pembayaran piutang menambah kas dan mengurangi receivable.
- Jangan menghitung biaya dua kali.
- Pembayaran harus terhubung ke dokumen sumber.

Buat reconciliation tests untuk laporan dan saldo.
```

### 14.9 Prompt Tahap 8 --- Transfer Cabang

``` text
# AGROPOS — PHASE 8: BRANCH TRANSFER

Bangun transfer stok antar cabang:
- Request.
- Approval.
- Shipment.
- In transit.
- Receipt.
- Selisih penerimaan.
- Cancel sesuai status.
- History dan reports.

Pertahankan product_id, batch_id, batch number, expiry date,
dan cost per batch.

Pastikan stok tidak berkurang atau bertambah dua kali.
Setiap tahap tercatat dalam audit log.
Buat tests seluruh status transfer.
```

### 14.10 Prompt Tahap 9 --- Supplier Portal

``` text
# AGROPOS — PHASE 9: SUPPLIER PORTAL

Bangun:
- Supplier login.
- Dashboard.
- Profile.
- Purchase orders.
- Order confirmation.
- Order rejection dengan alasan.
- Delivery status.
- Upload invoice.
- Upload surat jalan.
- Payment history.
- Notifications.

Admin dapat membuat akun, menghubungkan akun ke supplier,
menonaktifkan akun, dan memverifikasi dokumen.

Supplier hanya dapat mengakses dokumen supplier_id miliknya.
Supplier tidak boleh melihat harga jual, pelanggan, laba,
atau dokumen supplier lain.

Buat security tests untuk akses dokumen lintas supplier.
```

### 14.11 Prompt Tahap 10 --- Reports dan Audit

``` text
# AGROPOS — PHASE 10: REPORTS & AUDIT

Buat laporan:
- Penjualan harian, mingguan, bulanan, tahunan.
- Pembelian.
- Laba kotor dan bersih.
- Stok dan batch.
- Expired.
- Hutang dan piutang.
- Pengeluaran.
- Cash flow.
- Performa kasir dan cabang.
- Produk terlaris.
- Promo.

Sediakan PDF, Excel, print, filter tanggal, cabang, kategori,
dan supplier.

Activity logs mencatat login, perubahan data, harga, stok,
transaksi, pembayaran, retur, dan perubahan permission.

Log tidak dapat diedit pengguna biasa.
Gunakan sumber transaksi yang valid, bukan angka dummy.
```

### 14.12 Prompt Tahap 11 --- PWA dan Printer

``` text
# AGROPOS — PHASE 11: PWA & PRINTER

Implementasikan:
- Manifest.
- Service worker.
- App icons.
- Install prompt.
- Offline application shell.
- Responsive mobile.
- Update notification.
- Network status indicator.

Jika transaksi offline diaktifkan:
- Local queue.
- Status pending_sync.
- Local transaction UUID.
- Idempotency key.
- Sinkronisasi saat online.
- Validasi ulang stok dan harga.
- Tampilkan konflik stok.

Printer:
- Thermal 58mm.
- Thermal 80mm.
- A4.
- PDF.
- Browser printing.
- ESC/POS jika didukung perangkat.

Buat pengaturan logo, header/footer, nama toko, kasir,
pelanggan, dan ukuran kertas.

Jangan mengklaim direct printing berfungsi sebelum diuji.
Dokumentasikan pengujian offline dan printer.
```

### 14.13 Prompt Tahap 12 --- Final QA dan Deployment

``` text
# AGROPOS — PHASE 12: FINAL QA & PRODUCTION

Audit backend, frontend, database, API, authorization,
multi-branch, supplier isolation, stock, FEFO, HPP,
hutang/piutang, payment, printer, PWA, dan performance.

Testing:
- Unit tests.
- Feature tests.
- API integration tests.
- Role permission tests.
- Multi-branch isolation tests.
- Supplier isolation tests.
- Concurrent transaction tests.
- Inventory reconciliation tests.
- Payment reconciliation tests.
- Responsive UI tests.

Perbaiki bug kritis.

Production:
- Environment.
- MySQL.
- HTTPS.
- Queue.
- Cron.
- Storage.
- Database backup.
- Logging.
- Monitoring.
- Deployment.

Buat README final, installation guide, admin manual,
cashier manual, supplier manual, database documentation,
API documentation, dan deployment guide.

Jangan menyatakan production-ready jika pengujian transaksi,
keamanan, dan rekonsiliasi belum berhasil.
```

------------------------------------------------------------------------

## 15. Acceptance Criteria Keseluruhan

  ID      Skenario                                 Hasil yang Diharapkan
  ------- ---------------------------------------- ----------------------------------
  QA-01   Login Owner                              Dashboard seluruh cabang
  QA-02   Login Kasir                              Hanya cabang yang ditugaskan
  QA-03   Supplier membuka dokumen supplier lain   Akses ditolak
  QA-04   Pembelian 20 botol diterima              Stok bertambah 20
  QA-05   Penjualan 5 botol                        Stok berkurang 5
  QA-06   Batch kedaluwarsa                        Penjualan diblokir
  QA-07   Stok tidak cukup                         Transaksi ditolak
  QA-08   Pembelian tempo                          Hutang terbentuk
  QA-09   Penjualan tempo                          Piutang terbentuk
  QA-10   Pembayaran sebagian                      Sisa tagihan akurat
  QA-11   Pembayaran campuran                      Semua metode tercatat
  QA-12   Pembatalan penjualan                     Reversal stok dan keuangan benar
  QA-13   Retur                                    Stok dan laporan terkoreksi
  QA-14   Transfer cabang                          Batch tetap terlacak
  QA-15   Laporan bulanan                          Sesuai transaksi
  QA-16   Harga modal berubah                      HPP transaksi lama tetap
  QA-17   Dua kasir menjual stok terakhir          Tidak terjadi overselling
  QA-18   Cetak struk                              Sesuai ukuran printer
  QA-19   Offline                                  Transaksi pending ditandai
  QA-20   Aktivitas pengguna                       Log tercatat

### 15.1 Kriteria Rilis

Aplikasi dapat dirilis jika: - Semua alur transaksi kritis lulus
pengujian. - Tidak ada kebocoran data antar organisasi/cabang. -
Supplier isolation lulus. - Stok dan ledger dapat direkonsiliasi. -
Pembayaran, hutang, dan piutang dapat direkonsiliasi. - HPP historis
tetap konsisten. - Backup dan restore telah diuji. - Fitur printer diuji
pada perangkat yang ditargetkan. - Dokumentasi instalasi dan operasional
tersedia.

------------------------------------------------------------------------

## 16. Deployment

### 16.1 Kebutuhan Server

-   VPS Linux.
-   PHP 8.4.
-   MySQL 8.
-   Node.js LTS yang kompatibel dengan Next.js.
-   Nginx.
-   HTTPS/SSL.
-   Supervisor untuk queue.
-   Cron scheduler.
-   Storage foto dan dokumen.
-   Backup otomatis.
-   Monitoring dan logging.

### 16.2 Rekomendasi

Gunakan server terpusat untuk multi-cabang agar seluruh cabang memiliki
data yang sama ketika terkoneksi internet. PWA menyediakan pengalaman
aplikasi, tetapi tidak menggantikan server sebagai sumber data utama.

------------------------------------------------------------------------

## 17. Keputusan Arsitektur yang Tidak Boleh Dilanggar

1.  **Multi-branch isolation:** Data organisasi dan cabang wajib
    terisolasi di backend.
2.  **Batch inventory:** Barang masuk dan keluar harus dapat ditelusuri
    berdasarkan batch.
3.  **Historical costing:** HPP transaksi lama tidak berubah akibat
    perubahan harga beli berikutnya.
4.  **Financial reconciliation:** Kas, hutang, piutang, pembayaran, dan
    laporan harus konsisten.
5.  **Audit trail:** Aktivitas penting harus dapat ditelusuri dan tidak
    dapat dimanipulasi pengguna biasa.
6.  **Atomic transaction:** Perubahan dokumen, stok, pembayaran, dan
    ledger harus berhasil atau gagal sebagai satu kesatuan.
7.  **No fake completion:** Fitur tidak boleh dianggap selesai hanya
    karena UI telah dibuat.

------------------------------------------------------------------------

## 18. Product Vision

AgroPOS bukan sekadar aplikasi kasir. AgroPOS dirancang menjadi pusat
pengelolaan bisnis toko pertanian: mulai dari pembelian obat-obatan
pertanian, stok per batch, penjualan, supplier, keuangan, hingga
pemantauan banyak cabang dalam satu platform.

**Prinsip utama:** aplikasi harus akurat dalam menghitung stok, HPP,
pembayaran, hutang, piutang, dan laba; aman dalam membatasi akses; serta
mudah digunakan oleh owner, admin, kasir, gudang, dan supplier.
