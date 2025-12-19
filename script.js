// ============ VARIABEL GLOBAL ============
let currentCheckPeriod = {
    bulan: '',
    tahun: ''
};

// Data inventaris untuk simulasi
let inventoryData = [
    { 
        kode: 'INV-001', 
        nama: 'Laptop Dell', 
        merek: 'Dell Latitude 5420', 
        tahun: 2022, 
        jumlah: 10, 
        penggunaan: 'Kantor', 
        kondisi: 'baik',
        tanggal_ditambahkan: '2024-12-01'
    },
    { 
        kode: 'INV-002', 
        nama: 'Printer', 
        merek: 'HP LaserJet Pro', 
        tahun: 2021, 
        jumlah: 5, 
        penggunaan: 'Administrasi', 
        kondisi: 'baik',
        tanggal_ditambahkan: '2024-11-15'
    },
    { 
        kode: 'INV-003', 
        nama: 'Meja Kerja', 
        merek: 'Olympic', 
        tahun: 2020, 
        jumlah: 25, 
        penggunaan: 'Kantor', 
        kondisi: 'rusak-ringan',
        tanggal_ditambahkan: '2024-10-20'
    },
    { 
        kode: 'INV-004', 
        nama: 'Kursi Kantor', 
        merek: 'Informa Ergonomic', 
        tahun: 2021, 
        jumlah: 30, 
        penggunaan: 'Kantor', 
        kondisi: 'baik',
        tanggal_ditambahkan: '2024-12-05'
    },
    { 
        kode: 'INV-005', 
        nama: 'AC', 
        merek: 'Daikin 1.5 PK', 
        tahun: 2019, 
        jumlah: 8, 
        penggunaan: 'Ruang Meeting', 
        kondisi: 'rusak-ringan',
        tanggal_ditambahkan: '2024-09-10'
    }
];

// Data pengecekan untuk simulasi
let checkData = [
    { 
        kode: 'INV-001', 
        nama: 'Laptop Dell', 
        merek: 'Dell Latitude 5420', 
        tahun: 2022, 
        jumlah: 10, 
        jumlah_aktual: 10,
        penggunaan: 'Kantor', 
        kondisi: 'baik',
        kondisi_aktual: 'baik',
        tanggal_cek: '2024-12-15'
    },
    { 
        kode: 'INV-002', 
        nama: 'Printer', 
        merek: 'HP LaserJet Pro', 
        tahun: 2021, 
        jumlah: 5, 
        jumlah_aktual: 5,
        penggunaan: 'Administrasi', 
        kondisi: 'baik',
        kondisi_aktual: 'baik',
        tanggal_cek: '2024-12-15'
    },
    { 
        kode: 'INV-003', 
        nama: 'Meja Kerja', 
        merek: 'Olympic', 
        tahun: 2020, 
        jumlah: 25, 
        jumlah_aktual: 24,
        penggunaan: 'Kantor', 
        kondisi: 'rusak-ringan',
        kondisi_aktual: 'rusak-ringan',
        tanggal_cek: '2024-12-10'
    },
    { 
        kode: 'INV-004', 
        nama: 'Kursi Kantor', 
        merek: 'Informa Ergonomic', 
        tahun: 2021, 
        jumlah: 30, 
        jumlah_aktual: 30,
        penggunaan: 'Kantor', 
        kondisi: 'baik',
        kondisi_aktual: 'baik',
        tanggal_cek: '2024-12-12'
    },
    { 
        kode: 'INV-005', 
        nama: 'AC', 
        merek: 'Daikin 1.5 PK', 
        tahun: 2019, 
        jumlah: 8, 
        jumlah_aktual: 8,
        penggunaan: 'Ruang Meeting', 
        kondisi: 'rusak-ringan',
        kondisi_aktual: 'rusak-ringan',
        tanggal_cek: '2024-12-08'
    }
];

// Riwayat pengecekan (disimpan di localStorage)
let checkHistory = JSON.parse(localStorage.getItem('checkHistory')) || [];

// ============ FUNGSI UMUM ============
function navigateTo(page) {
    // Hapus class active dari semua menu
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
    });
    
    // Tambah class active ke menu yang diklik
    event.target.classList.add('active');
    
    // Redirect ke halaman yang sesuai
    if (page === 'dashboard') {
        window.location.href = 'index.html';
    } else {
        window.location.href = `${page}.html`;
    }
}

function setActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop();
    let activePage = '';
    
    switch(currentPage) {
        case 'index.html':
            activePage = 'dashboard';
            break;
        case 'inventaris.html':
            activePage = 'inventaris';
            break;
        case 'pengecekan.html':
            activePage = 'pengecekan';
            break;
        case 'laporan.html':
            activePage = 'laporan';
            break;
        default:
            activePage = 'dashboard';
    }
    
    // Atur menu aktif
    document.querySelectorAll('.sidebar-menu a').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick')?.includes(activePage)) {
            link.classList.add('active');
        }
    });
}

function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    const toggleBtn = document.querySelector('.sidebar-toggle i');
    
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');
    
    if (sidebar.classList.contains('collapsed')) {
        toggleBtn.classList.remove('fa-times');
        toggleBtn.classList.add('fa-bars');
    } else {
        toggleBtn.classList.remove('fa-bars');
        toggleBtn.classList.add('fa-times');
    }
}

function showNotification(message, type = 'info') {
    // Hapus notifikasi sebelumnya jika ada
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Buat elemen notifikasi
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;
    
    // Tambahkan ke body
    document.body.appendChild(notification);
    
    // Hilangkan otomatis setelah 3 detik
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// ============ FUNGSI INVENTARIS ============
function showAddItemModal() {
    const modal = document.getElementById('addModal');
    const modalContent = document.querySelector('#addModal .modal-content');
    
    // Generate next kode barang
    const nextCode = generateNextKode();
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>Tambah Barang Baru</h3>
            <button class="modal-close" onclick="closeModal('addModal')">&times;</button>
        </div>
        <form id="addItemForm">
            <div class="form-group">
                <label for="addKode">Kode Barang *</label>
                <input type="text" id="addKode" value="${nextCode}" readonly>
                <small class="form-text">Kode akan otomatis terisi</small>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="addNama">Nama Barang *</label>
                    <input type="text" id="addNama" placeholder="Contoh: Laptop Dell" required>
                </div>
                <div class="form-group">
                    <label for="addMerek">Merek/Tipe *</label>
                    <input type="text" id="addMerek" placeholder="Contoh: Dell Latitude 5420" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="addTahun">Tahun *</label>
                    <input type="number" id="addTahun" min="2000" max="2030" 
                           value="${new Date().getFullYear()}" required>
                </div>
                <div class="form-group">
                    <label for="addJumlah">Jumlah *</label>
                    <input type="number" id="addJumlah" min="1" value="1" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="addPenggunaan">Penggunaan *</label>
                    <select id="addPenggunaan" required>
                        <option value="">Pilih Penggunaan</option>
                        <option value="Kantor">Kantor</option>
                        <option value="Administrasi">Administrasi</option>
                        <option value="Ruang Meeting">Ruang Meeting</option>
                        <option value="Lab">Lab</option>
                        <option value="Lainnya">Lainnya</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="addKondisi">Kondisi Barang *</label>
                    <select id="addKondisi" required>
                        <option value="">Pilih Kondisi</option>
                        <option value="baik">Baik</option>
                        <option value="rusak-ringan">Rusak Ringan</option>
                        <option value="rusak-berat">Rusak Berat</option>
                    </select>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-danger" onclick="closeModal('addModal')">
                    <i class="fas fa-times"></i> Batal
                </button>
                <button type="submit" class="btn btn-success">
                    <i class="fas fa-save"></i> Simpan
                </button>
            </div>
        </form>
    `;
    
    modal.style.display = 'flex';
    
    // Event listener untuk form tambah
    document.getElementById('addItemForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveNewItem();
    });
}

function generateNextKode() {
    // Ambil kode terakhir dari inventoryData
    if (inventoryData && inventoryData.length > 0) {
        const lastItem = inventoryData[inventoryData.length - 1];
        const lastCode = lastItem.kode;
        const match = lastCode.match(/INV-(\d+)/);
        
        if (match) {
            const nextNumber = parseInt(match[1]) + 1;
            return `INV-${nextNumber.toString().padStart(3, '0')}`;
        }
    }
    return 'INV-001';
}

function saveNewItem() {
    const newItem = {
        kode: document.getElementById('addKode').value,
        nama: document.getElementById('addNama').value,
        merek: document.getElementById('addMerek').value,
        tahun: parseInt(document.getElementById('addTahun').value),
        jumlah: parseInt(document.getElementById('addJumlah').value),
        penggunaan: document.getElementById('addPenggunaan').value,
        kondisi: document.getElementById('addKondisi').value,
        tanggal_ditambahkan: new Date().toISOString().split('T')[0]
    };
    
    // Validasi data
    if (!newItem.nama || !newItem.merek || !newItem.penggunaan || !newItem.kondisi) {
        alert('Harap lengkapi semua field yang wajib diisi!');
        return;
    }
    
    if (newItem.jumlah < 1) {
        alert('Jumlah barang minimal 1!');
        return;
    }
    
    // Tambah ke data inventaris
    inventoryData.push(newItem);
    
    // Tampilkan notifikasi
    showNotification(`Barang "${newItem.nama}" berhasil ditambahkan!`, 'success');
    
    // Tutup modal
    closeModal('addModal');
    
    // Perbarui tabel
    if (window.location.pathname.includes('inventaris.html')) {
        renderInventoryTable();
    }
    
    // Perbarui statistik
    updateInventoryStats();
}

function editItem(kode) {
    const item = inventoryData.find(item => item.kode === kode);
    if (!item) return;
    
    const modal = document.getElementById('editModal');
    const modalContent = document.querySelector('#editModal .modal-content');
    
    modalContent.innerHTML = `
        <div class="modal-header">
            <h3>Edit Barang</h3>
            <button class="modal-close" onclick="closeModal('editModal')">&times;</button>
        </div>
        <form id="editItemForm">
            <div class="form-group">
                <label for="editKode">Kode Barang</label>
                <input type="text" id="editKode" value="${item.kode}" readonly>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editNama">Nama Barang *</label>
                    <input type="text" id="editNama" value="${item.nama}" required>
                </div>
                <div class="form-group">
                    <label for="editMerek">Merek/Tipe *</label>
                    <input type="text" id="editMerek" value="${item.merek}" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editTahun">Tahun *</label>
                    <input type="number" id="editTahun" value="${item.tahun}" min="2000" max="2030" required>
                </div>
                <div class="form-group">
                    <label for="editJumlah">Jumlah *</label>
                    <input type="number" id="editJumlah" value="${item.jumlah}" min="1" required>
                </div>
            </div>
            
            <div class="form-row">
                <div class="form-group">
                    <label for="editPenggunaan">Penggunaan *</label>
                    <select id="editPenggunaan" required>
                        <option value="Kantor" ${item.penggunaan === 'Kantor' ? 'selected' : ''}>Kantor</option>
                        <option value="Administrasi" ${item.penggunaan === 'Administrasi' ? 'selected' : ''}>Administrasi</option>
                        <option value="Ruang Meeting" ${item.penggunaan === 'Ruang Meeting' ? 'selected' : ''}>Ruang Meeting</option>
                        <option value="Lab" ${item.penggunaan === 'Lab' ? 'selected' : ''}>Lab</option>
                        <option value="Lainnya" ${item.penggunaan === 'Lainnya' ? 'selected' : ''}>Lainnya</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="editKondisi">Kondisi Barang *</label>
                    <select id="editKondisi" required>
                        <option value="baik" ${item.kondisi === 'baik' ? 'selected' : ''}>Baik</option>
                        <option value="rusak-ringan" ${item.kondisi === 'rusak-ringan' ? 'selected' : ''}>Rusak Ringan</option>
                        <option value="rusak-berat" ${item.kondisi === 'rusak-berat' ? 'selected' : ''}>Rusak Berat</option>
                    </select>
                </div>
            </div>
            
            <div class="form-actions">
                <button type="button" class="btn btn-danger" onclick="closeModal('editModal')">
                    <i class="fas fa-times"></i> Batal
                </button>
                <button type="submit" class="btn btn-success">
                    <i class="fas fa-save"></i> Perbarui
                </button>
            </div>
        </form>
    `;
    
    modal.style.display = 'flex';
    
    // Event listener untuk form edit
    document.getElementById('editItemForm').addEventListener('submit', function(e) {
        e.preventDefault();
        updateItem(kode);
    });
}

function updateItem(kode) {
    const index = inventoryData.findIndex(item => item.kode === kode);
    if (index === -1) return;
    
    // Update data
    inventoryData[index] = {
        ...inventoryData[index],
        nama: document.getElementById('editNama').value,
        merek: document.getElementById('editMerek').value,
        tahun: parseInt(document.getElementById('editTahun').value),
        jumlah: parseInt(document.getElementById('editJumlah').value),
        penggunaan: document.getElementById('editPenggunaan').value,
        kondisi: document.getElementById('editKondisi').value
    };
    
    // Tampilkan notifikasi
    showNotification(`Barang dengan kode ${kode} berhasil diperbarui!`, 'success');
    
    // Tutup modal
    closeModal('editModal');
    
    // Perbarui tabel
    if (window.location.pathname.includes('inventaris.html')) {
        renderInventoryTable();
    }
    
    // Perbarui statistik
    updateInventoryStats();
}

function deleteItem(kode) {
    const item = inventoryData.find(item => item.kode === kode);
    if (!item) return;
    
    if (confirm(`Apakah Anda yakin ingin menghapus barang "${item.nama}" (${kode})?`)) {
        const index = inventoryData.findIndex(item => item.kode === kode);
        if (index !== -1) {
            inventoryData.splice(index, 1);
            
            // Tampilkan notifikasi
            showNotification(`Barang "${item.nama}" berhasil dihapus!`, 'success');
            
            // Perbarui tabel
            if (window.location.pathname.includes('inventaris.html')) {
                renderInventoryTable();
            }
            
            // Perbarui statistik
            updateInventoryStats();
        }
    }
}

function renderInventoryTable() {
    const tbody = document.querySelector('#inventoryTable tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    inventoryData.forEach((item) => {
        const kondisiBadge = item.kondisi === 'baik' ? 
            '<span class="badge badge-success">Baik</span>' : 
            item.kondisi === 'rusak-ringan' ? 
            '<span class="badge badge-warning">Rusak Ringan</span>' : 
            '<span class="badge badge-danger">Rusak Berat</span>';
        
        const row = `
            <tr>
                <td>${item.kode}</td>
                <td>${item.nama}</td>
                <td>${item.merek}</td>
                <td>${item.tahun}</td>
                <td>${item.jumlah}</td>
                <td>${item.penggunaan}</td>
                <td>${kondisiBadge}</td>
                <td>
                    <button class="btn btn-icon" title="Edit" onclick="editItem('${item.kode}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-icon" title="Hapus" onclick="deleteItem('${item.kode}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
        
        tbody.innerHTML += row;
    });
}

function filterInventoryByPeriod() {
    const bulan = document.getElementById('filterBulanInventaris').value;
    const tahun = document.getElementById('filterTahunInventaris').value;
    
    if (!bulan || !tahun) {
        alert('Harap pilih bulan dan tahun terlebih dahulu!');
        return;
    }
    
    const namaBulan = document.getElementById('filterBulanInventaris').selectedOptions[0].text;
    const infoElement = document.getElementById('periodInfoInventaris');
    
    if (infoElement) {
        infoElement.textContent = `Data inventaris untuk periode: ${namaBulan} ${tahun}`;
    }
    
    // Simulasi filter (untuk demo, kita tetap tampilkan semua data)
    renderInventoryTable();
    
    // Tambah tombol reset jika belum ada
    if (!document.querySelector('.btn-reset-inventaris')) {
        const filterActions = document.querySelector('#inventoryFilter .filter-actions');
        if (filterActions) {
            const resetBtn = document.createElement('button');
            resetBtn.type = 'button';
            resetBtn.className = 'btn btn-danger btn-reset-inventaris';
            resetBtn.innerHTML = '<i class="fas fa-undo"></i> Reset';
            resetBtn.onclick = resetInventoryFilter;
            filterActions.appendChild(resetBtn);
        }
    }
    
    // Tampilkan notifikasi
    showNotification(`Menampilkan data untuk periode ${namaBulan} ${tahun}`, 'info');
}

function resetInventoryFilter() {
    // Reset form filter
    document.getElementById('filterBulanInventaris').value = '';
    document.getElementById('filterTahunInventaris').value = '';
    
    // Update info periode
    const infoElement = document.getElementById('periodInfoInventaris');
    if (infoElement) {
        infoElement.textContent = 'Kelola data barang inventaris';
    }
    
    // Render semua data
    renderInventoryTable();
    
    // Hapus tombol reset
    const resetBtn = document.querySelector('.btn-reset-inventaris');
    if (resetBtn) {
        resetBtn.remove();
    }
    
    // Tampilkan notifikasi
    showNotification('Filter berhasil direset', 'info');
}

function updateInventoryStats() {
    const totalBarang = inventoryData.reduce((sum, item) => sum + item.jumlah, 0);
    const kondisiBaik = inventoryData.filter(item => item.kondisi === 'baik').length;
    const rusakRingan = inventoryData.filter(item => item.kondisi === 'rusak-ringan').length;
    const rusakBerat = inventoryData.filter(item => item.kondisi === 'rusak-berat').length;
    
    // Update dashboard stats jika di halaman dashboard
    const totalElement = document.getElementById('total-barang');
    const baikElement = document.getElementById('kondisi-baik');
    const ringanElement = document.getElementById('rusak-ringan');
    const beratElement = document.getElementById('rusak-berat');
    
    if (totalElement) totalElement.textContent = totalBarang;
    if (baikElement) baikElement.textContent = kondisiBaik;
    if (ringanElement) ringanElement.textContent = rusakRingan;
    if (beratElement) beratElement.textContent = rusakBerat;
}

// ============ FUNGSI PENGECEKAN ============
function initializeCheckPage() {
    if (window.location.pathname.includes('pengecekan.html')) {
        renderCheckPage();
        loadCheckHistory();
    }
}

function renderCheckPage() {
    const tableContainer = document.querySelector('.table-container');
    if (!tableContainer) return;
    
    const checkHTML = `
        <div class="check-header">
            <h2><i class="fas fa-clipboard-check"></i> Pengecekan Fisik Barang</h2>
            <p>Catat kondisi dan jumlah barang saat pengecekan lapangan</p>
        </div>
        
        <div class="check-controls">
            <button class="btn btn-primary" onclick="showRiwayatPengecekan()">
                <i class="fas fa-history"></i> Lihat Riwayat
            </button>
            <button class="btn btn-success" onclick="simpanSemuaPerubahan()">
                <i class="fas fa-save"></i> Simpan Semua Perubahan
            </button>
        </div>
        
        <table id="checkTable">
            <thead>
                <tr>
                    <th>KODE</th>
                    <th>NAMA BARANG</th>
                    <th>MEREK/TIPE</th>
                    <th>TAHUN</th>
                    <th>JUMLAH</th>
                    <th>JUMLAH AKTUAL</th>
                    <th>PENGGUNAAN</th>
                    <th>KONDISI AKTUAL</th>
                    <th>AKSI</th>
                </tr>
            </thead>
            <tbody id="checkTableBody">
                <!-- Data akan diisi oleh JavaScript -->
            </tbody>
        </table>
        
        <p style="margin-top: 20px; color: #666; font-style: italic;">
            <strong>Catatan:</strong> Klik tombol "Perbarui" untuk mencatat kondisi dan jumlah barang saat pengecekan lapangan. 
            Data akan otomatis tersimpan dengan tanggal pengecekan hari ini.
        </p>
    `;
    
    tableContainer.innerHTML = checkHTML;
    
    // Render tabel pengecekan
    renderCheckTable();
}

// Fungsi untuk membuat badge kondisi
function getConditionBadge(kondisi) {
    if (kondisi === 'baik') {
        return '<span class="badge badge-success">Baik</span>';
    } else if (kondisi === 'rusak-ringan') {
        return '<span class="badge badge-warning">Rusak Ringan</span>';
    } else {
        return '<span class="badge badge-danger">Rusak Berat</span>';
    }
}

// Fungsi untuk render tabel pengecekan
function renderCheckTable() {
    const tbody = document.getElementById('checkTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    checkData.forEach((item) => {
        const kondisiBadge = getConditionBadge(item.kondisi_aktual);
        
        const row = `
            <tr id="row-${item.kode}">
                <td>${item.kode}</td>
                <td>${item.nama}</td>
                <td>${item.merek}</td>
                <td>${item.tahun}</td>
                <td>${item.jumlah}</td>
                <td>
                    <span id="jumlah-${item.kode}">${item.jumlah_aktual}</span>
                    <input type="number" 
                           id="input-jumlah-${item.kode}" 
                           class="edit-input" 
                           value="${item.jumlah_aktual}" 
                           min="0" 
                           style="display: none; width: 70px; padding: 5px;">
                </td>
                <td>${item.penggunaan}</td>
                <td>
                    <span id="kondisi-${item.kode}">${kondisiBadge}</span>
                    <select id="select-kondisi-${item.kode}" 
                            class="edit-select" 
                            style="display: none; width: 120px; padding: 5px;">
                        <option value="baik" ${item.kondisi_aktual === 'baik' ? 'selected' : ''}>Baik</option>
                        <option value="rusak-ringan" ${item.kondisi_aktual === 'rusak-ringan' ? 'selected' : ''}>Rusak Ringan</option>
                        <option value="rusak-berat" ${item.kondisi_aktual === 'rusak-berat' ? 'selected' : ''}>Rusak Berat</option>
                    </select>
                </td>
                <td>
                    <button class="btn btn-warning" id="btn-perbarui-${item.kode}" onclick="toggleEditMode('${item.kode}')">
                        <i class="fas fa-edit"></i> Perbarui
                    </button>
                    <button class="btn btn-success" id="btn-simpan-${item.kode}" onclick="saveChanges('${item.kode}')" style="display: none;">
                        <i class="fas fa-check"></i> Simpan
                    </button>
                    <button class="btn btn-danger" id="btn-batal-${item.kode}" onclick="cancelEdit('${item.kode}')" style="display: none;">
                        <i class="fas fa-times"></i> Batal
                    </button>
                </td>
            </tr>
        `;
        
        tbody.innerHTML += row;
    });
}

// Fungsi untuk mengaktifkan mode edit
function toggleEditMode(kode) {
    // Sembunyikan tombol perbarui
    document.getElementById(`btn-perbarui-${kode}`).style.display = 'none';
    
    // Tampilkan tombol simpan dan batal
    document.getElementById(`btn-simpan-${kode}`).style.display = 'inline-block';
    document.getElementById(`btn-batal-${kode}`).style.display = 'inline-block';
    
    // Sembunyikan teks jumlah dan tampilkan input
    document.getElementById(`jumlah-${kode}`).style.display = 'none';
    document.getElementById(`input-jumlah-${kode}`).style.display = 'inline-block';
    
    // Sembunyikan badge kondisi dan tampilkan dropdown
    document.getElementById(`kondisi-${kode}`).style.display = 'none';
    document.getElementById(`select-kondisi-${kode}`).style.display = 'inline-block';
    
    // Highlight baris yang sedang diedit
    document.getElementById(`row-${kode}`).style.backgroundColor = '#f0f8ff';
}

// Fungsi untuk menyimpan perubahan
function saveChanges(kode) {
    const index = checkData.findIndex(item => item.kode === kode);
    if (index === -1) return;
    
    // Ambil nilai dari input
    const jumlahAktual = parseInt(document.getElementById(`input-jumlah-${kode}`).value);
    const kondisiAktual = document.getElementById(`select-kondisi-${kode}`).value;
    
    // Validasi input
    if (isNaN(jumlahAktual) || jumlahAktual < 0) {
        alert('Jumlah aktual harus berupa angka yang valid dan tidak negatif!');
        return;
    }
    
    // Update data
    checkData[index].jumlah_aktual = jumlahAktual;
    checkData[index].kondisi_aktual = kondisiAktual;
    checkData[index].tanggal_cek = new Date().toISOString().split('T')[0];
    
    // Update tampilan
    document.getElementById(`jumlah-${kode}`).textContent = jumlahAktual;
    document.getElementById(`kondisi-${kode}`).innerHTML = getConditionBadge(kondisiAktual);
    
    // Kembalikan ke mode non-edit
    cancelEdit(kode);
    
    // Tampilkan pesan sukses
    showNotification(`Data pengecekan untuk ${kode} berhasil diperbarui!`, 'success');
}

// Fungsi untuk membatalkan edit
function cancelEdit(kode) {
    const index = checkData.findIndex(item => item.kode === kode);
    if (index === -1) return;
    
    // Tampilkan tombol perbarui
    document.getElementById(`btn-perbarui-${kode}`).style.display = 'inline-block';
    
    // Sembunyikan tombol simpan dan batal
    document.getElementById(`btn-simpan-${kode}`).style.display = 'none';
    document.getElementById(`btn-batal-${kode}`).style.display = 'none';
    
    // Tampilkan teks jumlah dan sembunyikan input
    document.getElementById(`jumlah-${kode}`).style.display = 'inline';
    document.getElementById(`input-jumlah-${kode}`).style.display = 'none';
    
    // Tampilkan badge kondisi dan sembunyikan dropdown
    document.getElementById(`kondisi-${kode}`).style.display = 'inline-block';
    document.getElementById(`select-kondisi-${kode}`).style.display = 'none';
    
    // Reset nilai input ke data asli
    document.getElementById(`input-jumlah-${kode}`).value = checkData[index].jumlah_aktual;
    document.getElementById(`select-kondisi-${kode}`).value = checkData[index].kondisi_aktual;
    
    // Hapus highlight baris
    document.getElementById(`row-${kode}`).style.backgroundColor = '';
}

function simpanSemuaPerubahan() {
    // Check if all items have been checked
    let allChecked = true;
    let checkedItems = [];
    
    checkData.forEach(item => {
        if (item.jumlah_aktual === undefined || item.kondisi_aktual === undefined) {
            allChecked = false;
        } else {
            checkedItems.push({
                kode: item.kode,
                nama: item.nama,
                jumlah_aktual: item.jumlah_aktual,
                kondisi_aktual: item.kondisi_aktual,
                tanggal_cek: new Date().toISOString().split('T')[0]
            });
        }
    });
    
    if (!allChecked) {
        if (!confirm('Beberapa barang belum diperiksa. Lanjutkan penyimpanan?')) {
            return;
        }
    }
    
    // Save to localStorage (simulasi database)
    saveCheckToHistory(checkedItems);
    
    // Tampilkan notifikasi
    showNotification(`Data pengecekan untuk ${checkedItems.length} barang berhasil disimpan!`, 'success');
    
    // Tampilkan prompt untuk membuat laporan
    setTimeout(() => {
        if (confirm('Pengecekan berhasil disimpan. Apakah Anda ingin membuat laporan?')) {
            showReportPrompt();
        }
    }, 500);
}

function saveCheckToHistory(checkedItems) {
    // Simpan ke localStorage sebagai riwayat
    let checkHistory = JSON.parse(localStorage.getItem('checkHistory')) || [];
    
    const historyEntry = {
        id: Date.now(),
        tanggal: new Date().toISOString().split('T')[0],
        waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        items: checkedItems,
        total_barang: checkedItems.length
    };
    
    checkHistory.push(historyEntry);
    localStorage.setItem('checkHistory', JSON.stringify(checkHistory));
    
    return historyEntry;
}

function showRiwayatPengecekan() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'historyModal';
    
    // Load history from localStorage
    const checkHistory = JSON.parse(localStorage.getItem('checkHistory')) || [];
    
    let historyHTML = '';
    
    if (checkHistory.length === 0) {
        historyHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h3><i class="fas fa-history"></i> Riwayat Pengecekan</h3>
                    <button class="modal-close" onclick="closeModal('historyModal')">&times;</button>
                </div>
                <div class="no-history">
                    <i class="fas fa-clipboard-list" style="font-size: 3rem; color: #95a5a6; margin-bottom: 20px;"></i>
                    <h4>Belum Ada Riwayat Pengecekan</h4>
                    <p>Lakukan pengecekan barang terlebih dahulu untuk melihat riwayat.</p>
                </div>
            </div>
        `;
    } else {
        historyHTML = `
            <div class="modal-content" style="max-width: 800px;">
                <div class="modal-header">
                    <h3><i class="fas fa-history"></i> Riwayat Pengecekan</h3>
                    <button class="modal-close" onclick="closeModal('historyModal')">&times;</button>
                </div>
                <div class="history-content">
                    <div class="history-summary">
                        <p><strong>Total Pengecekan:</strong> ${checkHistory.length} kali</p>
                        <p><strong>Terakhir:</strong> ${formatDate(checkHistory[checkHistory.length - 1].tanggal)}</p>
                    </div>
                    <div class="history-list">
                        ${checkHistory.map((history, index) => `
                            <div class="history-item">
                                <div class="history-header">
                                    <span class="history-number">#${checkHistory.length - index}</span>
                                    <span class="history-date">${formatDate(history.tanggal)} ${history.waktu}</span>
                                    <span class="history-count">${history.total_barang} barang</span>
                                </div>
                                <div class="history-details">
                                    <table class="history-table">
                                        <thead>
                                            <tr>
                                                <th>Kode</th>
                                                <th>Nama Barang</th>
                                                <th>Jumlah Aktual</th>
                                                <th>Kondisi</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            ${history.items.map(item => `
                                                <tr>
                                                    <td>${item.kode}</td>
                                                    <td>${item.nama}</td>
                                                    <td>${item.jumlah_aktual}</td>
                                                    <td>${getConditionBadge(item.kondisi_aktual)}</td>
                                                </tr>
                                            `).join('')}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
    
    modal.innerHTML = historyHTML;
    document.body.appendChild(modal);
    modal.style.display = 'flex';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
    });
}

function loadCheckHistory() {
    // Load history from localStorage
    checkHistory = JSON.parse(localStorage.getItem('checkHistory')) || [];
}

function showReportPrompt() {
    const promptModal = document.createElement('div');
    promptModal.className = 'prompt-modal';
    promptModal.id = 'reportPrompt';
    
    promptModal.innerHTML = `
        <div class="prompt-content">
            <h3><i class="fas fa-file-pdf"></i> Buat Laporan?</h3>
            <p>Apakah Anda ingin membuat laporan PDF untuk hasil pengecekan ini?</p>
            
            <div class="prompt-actions">
                <button class="btn btn-secondary" onclick="closeReportPrompt()">
                    <i class="fas fa-times"></i> Nanti Saja
                </button>
                <button class="btn btn-success" onclick="goToReport()">
                    <i class="fas fa-check"></i> Ya, Buat Laporan
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(promptModal);
    promptModal.style.display = 'flex';
}

function closeReportPrompt() {
    const promptModal = document.getElementById('reportPrompt');
    if (promptModal) {
        promptModal.remove();
    }
}

function goToReport() {
    closeReportPrompt();
    
    // Navigate to report page
    navigateTo('laporan');
}

// ============ FUNGSI LAPORAN ============
function initializeReportWithPeriod() {
    if (window.location.pathname.includes('laporan.html')) {
        // Set nilai default filter
        const currentYear = new Date().getFullYear();
        const currentMonth = (new Date().getMonth() + 1).toString().padStart(2, '0');
        
        const tahunInput = document.getElementById('filterTahunLaporan');
        const bulanSelect = document.getElementById('filterBulanLaporan');
        
        if (tahunInput) {
            tahunInput.value = currentYear;
        }
        
        if (bulanSelect) {
            for (let i = 0; i < bulanSelect.options.length; i++) {
                if (bulanSelect.options[i].value === currentMonth) {
                    bulanSelect.selectedIndex = i;
                    break;
                }
            }
        }
    }
}

function filterLaporanByPeriod() {
    const bulan = document.getElementById('filterBulanLaporan').value;
    const tahun = document.getElementById('filterTahunLaporan').value;
    
    if (!bulan || !tahun) {
        alert('Harap pilih bulan dan tahun terlebih dahulu!');
        return;
    }
    
    const namaBulan = document.getElementById('filterBulanLaporan').selectedOptions[0].text;
    const judulElement = document.querySelector('.table-container h2');
    
    if (judulElement) {
        judulElement.textContent = `Ringkasan Inventaris - ${namaBulan} ${tahun}`;
    }
    
    // Simulasi filter
    showNotification(`Menampilkan laporan untuk periode: ${namaBulan} ${tahun}`, 'info');
}

function downloadReport() {
    const bulan = document.getElementById('filterBulanLaporan').value;
    const tahun = document.getElementById('filterTahunLaporan').value;
    
    if (!bulan || !tahun) {
        alert('Harap pilih bulan dan tahun terlebih dahulu!');
        return;
    }
    
    const namaBulan = document.getElementById('filterBulanLaporan').selectedOptions[0].text;
    
    showNotification(`Laporan untuk ${namaBulan} ${tahun} sedang diunduh dalam format PDF...`, 'success');
    
    // Simulasi download
    setTimeout(() => {
        showNotification(`Laporan ${namaBulan} ${tahun} berhasil diunduh!`, 'success');
    }, 1500);
}

// ============ INISIALISASI ============
document.addEventListener('DOMContentLoaded', function() {
    setActiveMenu();
    
    // Inisialisasi untuk halaman inventaris
    if (window.location.pathname.includes('inventaris.html')) {
        renderInventoryTable();
    }
    
    // Inisialisasi untuk halaman pengecekan
    if (window.location.pathname.includes('pengecekan.html')) {
        initializeCheckPage();
    }
    
    // Inisialisasi untuk halaman laporan
    if (window.location.pathname.includes('laporan.html')) {
        initializeReportWithPeriod();
    }
    
    // Inisialisasi untuk dashboard
    if (window.location.pathname.includes('index.html')) {
        updateInventoryStats();
    }
});

// Tambahkan style untuk riwayat pengecekan
const style = document.createElement('style');
style.textContent = `
    .check-header {
        margin-bottom: 20px;
    }
    
    .check-controls {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
    }
    
    .history-content {
        max-height: 500px;
        overflow-y: auto;
    }
    
    .history-summary {
        background-color: #f8f9fa;
        padding: 15px;
        border-radius: 8px;
        margin-bottom: 20px;
        display: flex;
        justify-content: space-between;
    }
    
    .history-item {
        border: 1px solid #e9ecef;
        border-radius: 8px;
        margin-bottom: 15px;
        overflow: hidden;
    }
    
    .history-header {
        background-color: #f8f9fa;
        padding: 12px 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #e9ecef;
    }
    
    .history-number {
        font-weight: bold;
        color: #2c3e50;
    }
    
    .history-date {
        color: #555;
    }
    
    .history-count {
        background-color: #3498db;
        color: white;
        padding: 3px 10px;
        border-radius: 20px;
        font-size: 0.8rem;
    }
    
    .history-details {
        padding: 15px;
    }
    
    .history-table {
        width: 100%;
        font-size: 0.9rem;
    }
    
    .history-table th {
        background-color: #f8f9fa;
        padding: 10px;
        text-align: left;
    }
    
    .history-table td {
        padding: 10px;
        border-bottom: 1px solid #eee;
    }
    
    .history-table tr:last-child td {
        border-bottom: none;
    }
    
    .no-history {
        text-align: center;
        padding: 40px 20px;
        color: #7f8c8d;
    }
`;
document.head.appendChild(style);