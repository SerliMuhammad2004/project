
Lakukan semua langkah ini di dalam **Terminal Ubuntu Desktop** kamu.

---

### Tahap 1: Instalasi Tools (Environment Setup)
Buka Terminal (**Ctrl+Alt+T**) dan masukkan perintah berikut:

```bash
# 1. Update sistem
sudo apt update

# 2. Install Sleuthkit, Extundelete, dan Autopsy
sudo apt install sleuthkit extundelete binutils xxd autopsy -y
```

---

### Tahap 2: Membuat Bukti Digital (Simulasi File .dd)
Karena dosen belum memberikan file, kita akan membuat file `nama_file.dd` sendiri yang memiliki data terhapus di dalamnya.

```bash
# 1. Buat file kosong 100MB
dd if=/dev/zero of=nama_file.dd bs=1M count=100

# 2. Format menjadi sistem file ext4
mkfs.ext4 linux_forensik_p6.dd

# 3. Mount ke folder temporary untuk mengisi data
mkdir -p ./mnt_tugas
sudo mount -o loop nama_file.dd ./mnt_tugas

# 4. Buat 3 file (Barang Bukti)
sudo sh -c "echo 'Data Rahasia 01' > ./mnt_tugas/dokumen_penting.txt"
sudo sh -c "echo 'Gambar Terlarang' > ./mnt_tugas/foto_bukti.jpg"
sudo sh -c "echo 'Log Transaksi' > ./mnt_tugas/catatan.pdf"

# 5. Hapus file tersebut (agar statusnya terhapus namun masih di disk)
sudo rm ./mnt_tugas/dokumen_penting.txt ./mnt_tugas/foto_bukti.jpg ./mnt_tugas/catatan.pdf

# 6. Lepas mount
sudo umount ./mnt_tugas
```

---

### Tahap 3: Penyelesaian Tugas Sesuai Instruksi Dosen

#### Langkah 1: Verifikasi Filesystem
**Tujuan:** Memastikan file image benar dan mengecek status filesystem.
```bash
file nama_file.dd
fsstat nama_file.dd
```
* **📸 SCREENSHOT 1:** Hasil `fsstat` yang menampilkan informasi umum filesystem.

#### Langkah 2: Baca Superblock & Hitung Persentase
**Tujuan:** Mengambil data teknis disk.
```bash
dumpe2fs nama_file.dd | head -50
```
* Cari **Block count** dan **Free blocks**.
* **Rumus:** $\text{Persentase Terpakai} = \frac{\text{Block count} - \text{Free blocks}}{\text{Block count}} \times 100$
* **📸 SCREENSHOT 2:** Hasil output `dumpe2fs` dan hasil perhitunganmu.

#### Langkah 3: List Inode Terhapus
**Tujuan:** Mencari "jejak" file yang sudah hilang.
```bash
ils nama_file.dd -r > deleted_inodes.txt
cat deleted_inodes.txt
```
* **📸 SCREENSHOT 3:** Daftar nomor Inode yang muncul di terminal (pilih 3 nomor untuk langkah berikutnya).

#### Langkah 4: Analisis Inode Spesifik & Konversi Waktu
**Tujuan:** Mengetahui kapan file dihapus. Misal kita pilih Inode nomor **12**.
```bash
istat nama_file.dd 12
```
* Lihat bagian `i_dtime` (Unix timestamp). Konversi ke waktu manusia:
```bash
date -d @[isi_angka_timestamp_tadi]
```
* **📸 SCREENSHOT 4:** Hasil `istat` dan hasil perintah `date`.

#### Langkah 5: Ekstrak File & Identifikasi Magic Bytes
**Tujuan:** Mengambil kembali isi file secara manual dan cek tipenya.
```bash
icat nama_file.dd 12 > file_recovery_1
xxd file_recovery_1 | head -n 1
```
* **📸 SCREENSHOT 5:** Hasil `xxd` (kode hex) yang menunjukkan Magic Bytes file tersebut.

#### Langkah 6: Recovery via Extundelete
**Tujuan:** Mengembalikan semua file secara otomatis.
```bash
mkdir output
sudo extundelete nama_file.dd --restore-all --output-dir output
```
* **📸 SCREENSHOT 6:** Proses eksekusi `extundelete` di terminal.

#### Langkah 7: Analisis di Autopsy
**Tujuan:** Verifikasi visual.
1. Jalankan: `sudo autopsy`
2. Buka browser di Ubuntu (Firefox) ke: `http://localhost:9999/autopsy/`
3. Buat **New Case**, Add Image `nama_file.dd`, lalu buka tab **Deleted Files**.
* **📸 SCREENSHOT 7:** Tampilan browser yang menunjukkan file-file merah (deleted).

