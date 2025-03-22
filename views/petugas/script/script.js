async function loadDashboardStats(month = null, year = null) {
    try {
        // Buat URL dengan query params jika ada
        let url = '/api/dashboard-stats';
        const params = new URLSearchParams();
        
        if (month) params.append('month', month);
        if (year) params.append('year', year);
        
        if (params.toString()) {
            url += `?${params.toString()}`;
        }

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const stats = await response.json();

        // Transaksi Card
        const transaksiBulanCard = document.getElementById('transaksi-bulan');
        transaksiBulanCard.innerHTML = "0";
        transaksiBulanCard.innerHTML = `${stats.totalTransaksi}`;

        // Pendapatan Card
        const pendapatanBulanCard = document.getElementById('pendapatan-bulan');
        pendapatanBulanCard.innerHTML = "0";
        pendapatanBulanCard.innerHTML = `${formatRupiah(stats.totalPendapatan)}`;
    } catch (error) {
        console.error('Error:', error);
    }
}

// Function untuk mengkonversi nama bulan menjadi angka
function getMonthNumber(monthName) {
    const months = {
        'january': 1,
        'february': 2,
        'march': 3,
        'april': 4,
        'may': 5,
        'june': 6,
        'july': 7,
        'august': 8,
        'september': 9,
        'october': 10,
        'november': 11,
        'december': 12
    };
    return months[monthName.toLowerCase()];
}

// Event listener untuk perubahan pada dropdown
document.addEventListener('DOMContentLoaded', function() {
    // Set nilai default
    const now = new Date();
    const currentMonth = now.getMonth(); // 0-11
    const currentYear = now.getFullYear();
    
    // Saat halaman dimuat, load data dengan bulan dan tahun saat ini
    loadDashboardStats();
    
    // Dapatkan elemen select
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    
    // Set default values pada dropdown
    // Konversi indeks bulan (0-11) ke nama bulan pada dropdown
    const monthNames = ['january', 'february', 'march', 'april', 'may', 'june', 
                        'july', 'august', 'september', 'october', 'november', 'december'];
    monthSelect.value = monthNames[currentMonth];
    
    // Set tahun saat ini sebagai default jika tersedia dalam options
    // Cek apakah ada option dengan nilai tahun saat ini
    let yearOptionExists = false;
    for (let option of yearSelect.options) {
        if (option.value == currentYear) {
            yearOptionExists = true;
            option.selected = true;
            break;
        }
    }
    
    // Tambahkan event listeners
    monthSelect.addEventListener('change', updateDashboard);
    yearSelect.addEventListener('change', updateDashboard);
    
    function updateDashboard() {
        const selectedMonth = getMonthNumber(monthSelect.value);
        const selectedYear = yearSelect.value;
        
        // Load data dengan filter
        loadDashboardStats(selectedMonth, selectedYear);
    }
});


async function loadDailyStats(date) {
    try {
        const url = `/api/dashboard-stats?date=${date}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const stats = await response.json();

        // Update card untuk tanggal
        const transaksiTanggalCard = document.getElementById('transaksi-tanggal');
        transaksiTanggalCard.innerHTML =  stats.totalTransaksi ? `${stats.totalTransaksi}` : "0";

        const pendapatanTanggalCard = document.getElementById('pendapatan-tanggal');
        pendapatanTanggalCard.innerHTML = stats.totalPendapatan 
            ? `${formatRupiah(stats.totalPendapatan)}` : "0";
    } catch (error) {
        console.error('Error:', error);

        // Jika terjadi kesalahan, set nilai default ke 0
        const transaksiTanggalCard = document.getElementById('transaksi-tanggal');
        transaksiTanggalCard.innerHTML = "0";

        const pendapatanTanggalCard = document.getElementById('pendapatan-tanggal');
        pendapatanTanggalCard.innerHTML = "0";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const monthSelect = document.getElementById('month-select');
    const yearSelect = document.getElementById('year-select');
    const dateInput = document.getElementById('date-select');

    // Set default tanggal hari ini
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    dateInput.value = today;

    // Load data untuk bulan, tahun, dan tanggal saat ini
    const currentMonth = now.getMonth() + 1; // 0-indexed
    const currentYear = now.getFullYear();

    loadDashboardStats(currentMonth, currentYear);
    loadDailyStats(today);

    // Event untuk bulan dan tahun
    monthSelect.addEventListener('change', () => {
        const selectedMonth = getMonthNumber(monthSelect.value);
        const selectedYear = yearSelect.value;
        loadDashboardStats(selectedMonth, selectedYear);
    });

    yearSelect.addEventListener('change', () => {
        const selectedMonth = getMonthNumber(monthSelect.value);
        const selectedYear = yearSelect.value;
        loadDashboardStats(selectedMonth, selectedYear);
    });

    // Event untuk tanggal
    dateInput.addEventListener('change', () => {
        const selectedDate = dateInput.value;
        if (selectedDate) {
            loadDailyStats(selectedDate);
        }
    });
});



    function getCookieValue(cookieName) {
            const cookies = document.cookie.split('; ');
            
            for (let i = 0; i < cookies.length; i++) {
                const [key, value] = cookies[i].split('=');
                if (key === cookieName) {
                    return decodeURIComponent(value); 
                }
            }
            return null; 
        }
        const username = getCookieValue('nama_lengkap');
        console.log(username)

        if (username) {
            document.getElementById('nama_lengkap').textContent = ` Selamat datang, ${username}`;
        } else {
            document.getElementById('nama_lengkap').textContent = 'Anonymous';
        }

        const role = getCookieValue('role');
        console.log(role)

        if (role) {
            document.getElementById('role').textContent =` Saat ini anda login dengan role ${role}`;
        } else {
            document.getElementById('role').textContent = 'Anonymous';
        }

    
    async function handleLogout(event) {
        event.preventDefault();
        
        if (confirm("Apakah Anda yakin ingin logout?")) {
            try {
                const response = await fetch('/api/logout', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (response.ok) {
                    window.location.href = '/login'; 
                } else {
                    alert('Gagal logout. Silakan coba lagi.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Terjadi kesalahan saat logout');
            }
        }
    }

function formatRupiah(angka) {
    let number_string = angka.toString();
    let sisa = number_string.length % 3;
    let rupiah = number_string.substr(0, sisa);
    let ribuan = number_string.substr(sisa).match(/\d{3}/g);

    if (ribuan) {
        let separator = sisa ? '.' : '';
        rupiah += separator + ribuan.join('.');
    }

    return 'Rp ' + rupiah;
}

document.addEventListener('DOMContentLoaded', loadDashboardStats);