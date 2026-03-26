// ============================================================
// SELLER SHARED JS — seller-shared.js
// ============================================================

// ---- Sidebar toggle ----
let sidebarOpen = true;

function toggleSidebar() {
    const sidebar = document.getElementById('seller-sidebar');
    const main    = document.getElementById('seller-main');
    sidebarOpen = !sidebarOpen;
    sidebar.classList.toggle('collapsed', !sidebarOpen);
    if (main) main.classList.toggle('sidebar-collapsed', !sidebarOpen);
}

// ---- Page navigation ----
function goPage(url) {
    window.location.href = url;
}

// ---- Load components (header + sidebar) ----
function loadSellerHeader() {
    const el = document.getElementById('seller-header-container');
    if (!el) return;
    fetch('seller-header.html')
        .then(r => r.text()).then(html => { el.innerHTML = html; })
        .catch(() => { el.innerHTML = '<div style="height:52px;background:linear-gradient(90deg,#BFA370,#8E754A)"></div>'; });
}

function loadSellerSidebar() {
    const el = document.getElementById('seller-sidebar-container');
    if (!el) return;
    fetch('seller-sidebar.html')
        .then(r => r.text()).then(html => {
            el.innerHTML = html;
            // Tandai nav item aktif berdasarkan halaman saat ini
            const page = location.pathname.split('/').pop().replace('.html','');
            document.querySelectorAll('.s-nav-item').forEach(a => {
                if (a.dataset.page === page) a.classList.add('active');
            });
        })
        .catch(() => {});
}

// ---- Status Toko toggle ----
function toggleStorStatus(btn) {
    btn.classList.toggle('on');
    const label = btn.nextElementSibling;
    if (label) label.textContent = btn.classList.contains('on') ? 'Toko Dibuka' : 'Toko Ditutup';
}

// ---- Countdown timer (MM:SS) ----
function startTimer(elementId, totalSeconds) {
    const el = document.getElementById(elementId);
    if (!el) return;
    const iv = setInterval(() => {
        if (totalSeconds <= 0) { clearInterval(iv); el.textContent = '00:00'; return; }
        totalSeconds--;
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        el.textContent = String(m).padStart(2,'0') + ':' + String(s).padStart(2,'0');
    }, 1000);
}

// ---- Init ----
document.addEventListener('DOMContentLoaded', () => {
    loadSellerHeader();
    loadSellerSidebar();
});