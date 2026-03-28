// 1. Configuration & Global Variables
window.tailwind.config = {
  theme: {
    extend: {
      colors: {
        "oren-tua": "#EE8F36",
        "emas-teks": "#78450E",
      },
      backgroundImage: {
        "emas-main": "linear-gradient(90deg, #BFA370 39%, #8E754A 82%)",
        "oren-grd": "linear-gradient(90deg, #FF7A3D 0%, #FF9A6A 100%)",
        "gold-grd": "linear-gradient(90deg, #B88214 0%, #E1BF59 100%)",
      },
    },
  },
};

let lastScrollY = window.scrollY;

// Database Menu Dinamis
const menuData = [
  {
    id: 1,
    nama: "Ayam Paha Atas",
    harga: "Rp15.000",
    terjual: "10RB+",
    suka: 1341,
    jarak: "240m | 15min",
    kategori: "terlaris",
  },
  {
    id: 2,
    nama: "Ayam Dada Mentok",
    harga: "Rp17.000",
    terjual: "8RB+",
    suka: 950,
    jarak: "240m | 15min",
    kategori: "terlaris",
  },
  {
    id: 3,
    nama: "Paket Hemat 1",
    harga: "Rp25.000",
    terjual: "5RB+",
    suka: 1200,
    jarak: "240m | 15min",
    kategori: "rating",
  },
  {
    id: 4,
    nama: "Sate Kulit Krispi",
    harga: "Rp5.000",
    terjual: "15RB+",
    suka: 2000,
    rating: 4.8,
    kategori: "terlaris",
  },
  {
    id: 5,
    nama: "Ayam Penyet 39",
    harga: "Rp18.500",
    terjual: "3RB+",
    suka: 750,
    rating: 4.9,
    kategori: "rating",
  },
  {
    id: 6,
    nama: "Kulit Ayam Bakar",
    harga: "Rp7.000",
    terjual: "12RB+",
    suka: 1800,
    rating: 4.7,
    kategori: "terlaris",
  },
  {
    id: 7,
    nama: "Nasi Uduk Spesial",
    harga: "Rp8.000",
    terjual: "9RB+",
    suka: 1100,
    jarak: "240m | 15min",
    kategori: "rating",
  },
  {
    id: 8,
    nama: "Es Teh Manis Jumbo",
    harga: "Rp5.000",
    terjual: "25RB+",
    suka: 3500,
    jarak: "240m | 15min",
    kategori: "terlaris",
  },
];

// 2. Inisialisasi Utama
document.addEventListener("DOMContentLoaded", () => {
  loadHeader();
  loadProfilToko();
  startCountdown(4 * 3600 + 32 * 60 + 10);
  // Default render semua menu saat pertama buka
  renderMenuToko("semua");
});

// 3. Fungsi Load Components
function loadHeader() {
  const container = document.getElementById("header-container");
  if (!container) return;

  fetch("header.html")
    .then((response) => response.text())
    .then((data) => {
      container.innerHTML = data;
      initFilterLogic();
      initScrollHide();
      const header = document.getElementById("main-header");
      if (header) header.classList.remove("-translate-y-full");
    })
    .catch((err) => console.error("Gagal load header:", err));
}

function loadProfilToko() {
  const container = document.getElementById("store-container");
  if (container) {
    fetch("profil-toko.html")
      .then((response) => response.text())
      .then((data) => {
        container.innerHTML = data;
      })
      .catch((err) => console.error("Gagal load profil toko:", err));
  }
}

// 4. Fitur Header & Scroll
function initScrollHide() {
  const header = document.getElementById("main-header");
  if (!header) return;

  window.addEventListener(
    "scroll",
    () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY <= 50) {
        header.classList.remove("-translate-y-full");
      } else if (currentScrollY > lastScrollY && currentScrollY > 100) {
        header.classList.add("-translate-y-full");
      } else if (currentScrollY < lastScrollY) {
        header.classList.remove("-translate-y-full");
      }
      lastScrollY = currentScrollY;
    },
    { passive: true },
  );
}

// 5. Filter & Dropdown
function initFilterLogic() {
  const btnToggle = document.getElementById("btn-filter-toggle");
  const dropdown = document.getElementById("dropdown-filter");
  const searchInput = document.getElementById("main-search-input");

  const btnJarak = document.getElementById("btn-jarak-main");
  const subJarak = document.getElementById("sub-jarak");
  const btnHarga = document.getElementById("btn-harga-dropdown");
  const boxHarga = document.getElementById("box-batas-harga");

  // 1. Toggle Dropdown Utama
  if (btnToggle && dropdown) {
    btnToggle.onclick = (e) => {
      e.stopPropagation();
      const isHidden = dropdown.classList.toggle("hidden");
      searchInput?.classList.toggle("rounded-xl", isHidden);
      searchInput?.classList.toggle("rounded-t-xl", !isHidden);
    };
  }

  // 2. Fungsi Reset Status Tombol & Detail
  function resetSubFilters() {
    subJarak?.classList.add("hidden");
    boxHarga?.classList.add("hidden");

    // Reset warna jadi redup
    btnJarak?.classList.remove("active-emas");
    btnJarak?.classList.add("inactive-emas");
    btnHarga?.classList.remove("active-emas");
    btnHarga?.classList.add("inactive-emas");
  }

  // 3. Klik Tombol Jarak
  btnJarak?.addEventListener("click", (e) => {
    e.stopPropagation();
    const isAlreadyOpen = !subJarak.classList.contains("hidden");

    resetSubFilters(); // Tutup semua detail dan redupkan semua warna

    if (!isAlreadyOpen) {
      subJarak.classList.remove("hidden");
      btnJarak.classList.add("active-emas");
      btnJarak.classList.remove("inactive-emas");
    }
  });

  // 4. Klik Tombol Harga
  btnHarga?.addEventListener("click", (e) => {
    e.stopPropagation();
    const isAlreadyOpen = !boxHarga.classList.contains("hidden");

    resetSubFilters(); // Tutup semua detail dan redupkan semua warna

    if (!isAlreadyOpen) {
      boxHarga.classList.remove("hidden");
      btnHarga.classList.add("active-emas");
      btnHarga.classList.remove("inactive-emas");
    }
  });

  // 5. Pilihan Jarak (Terdekat/Terjauh)
  document.getElementById("opt-terdekat")?.addEventListener("click", () => {
    btnJarak.innerHTML = `Terdekat <i class="ri-arrow-down-s-fill"></i>`;
    subJarak.classList.add("hidden");
  });
  document.getElementById("opt-terjauh")?.addEventListener("click", () => {
    btnJarak.innerHTML = `Terjauh <i class="ri-arrow-down-s-fill"></i>`;
    subJarak.classList.add("hidden");
  });

  // 6. Klik Luar untuk Menutup Semuanya
  document.addEventListener("click", (e) => {
    if (dropdown && !dropdown.contains(e.target) && e.target !== btnToggle) {
      dropdown.classList.add("hidden");
      resetSubFilters();
      // Kembalikan tombol Terdekat ke warna aktif default jika mau
      btnJarak.classList.add("active-emas");
      btnJarak.classList.remove("inactive-emas");
      searchInput?.classList.replace("rounded-t-xl", "rounded-xl");
    }
  });
}

// Event delegation untuk pilihan jarak
document.getElementById("opt-terdekat")?.addEventListener("click", () => {
  btnJarakMain.childNodes[0].textContent = "Terdekat ";
  subJarak.classList.add("hidden");
});

btnHarga?.addEventListener("click", (e) => {
  e.stopPropagation();
  boxHarga?.classList.toggle("hidden");
});

document.onclick = (e) => {
  if (!dropdown.contains(e.target) && e.target !== btnToggle) {
    dropdown.classList.add("hidden");
    subJarak?.classList.add("hidden");
    searchInput?.classList.replace("rounded-t-xl", "rounded-xl");
  }
};

// 6. Menu Toko Tab System (Update Perbaikan)

function filterMenuToko(kategori) {
  // 1. Update UI Button
  const buttons = document.querySelectorAll(".menu-toko-btn");
  buttons.forEach((btn) => {
    btn.classList.remove("tab-active");
    btn.classList.add("bg-white", "text-gray-400", "border-gray-200");
  });

  const activeBtn = document.getElementById(`tab-${kategori}`);
  activeBtn.classList.add("tab-active");
  activeBtn.classList.remove("bg-white", "text-gray-400", "border-gray-200");

  // 2. Render Data
  renderMenuToko(kategori);
}

function renderMenuToko(kategori) {
  const container = document.getElementById("menu-grid-container");
  if (!container) return;

  container.innerHTML = ""; // Kosongkan container

  // Filter data berdasarkan kategori menu toko
  const filteredData =
    kategori === "semua"
      ? menuData
      : menuData.filter((item) => item.kategori === kategori);

  filteredData.forEach((item) => {
    const card = `
      <a href="detail-menu.html" class="block bg-white rounded-2xl overflow-hidden shadow-sm border border-transparent hover:border-gray-200 transition p-3 active:scale-95" style="background: #f3f3f3; box-shadow: 0px 10px 0px #e9e9e9">
        <img src="assets/images/makanan2.png" alt="${item.nama}" class="w-full h-32 md:h-40 object-cover rounded-xl mb-3" />
        <h3 class="font-bold text-gray-800 text-sm md:text-base mb-1">${item.nama}</h3>
        <p class="text-green-600 font-bold text-base mb-3">${item.harga}</p>
        <div class="flex items-center justify-between text-[10px] md:text-xs text-gray-400 border-t pt-3">
              <span>${item.terjual}terjual</span>
              <span>${item.jarak}</span>
            </div>
        <div class="mt-2 flex items-center gap-1 text-[12px] text-gray-500">
    <div class="cursor-pointer flex items-center gap-1 group" 
         onclick="event.preventDefault(); event.stopPropagation(); toggleLike(this)">
        
        <i class="ri-heart-3-line text-sm text-gray-400 transition-all duration-300 group-hover:text-red-400"></i> 
        
        <span>Disukai oleh ${item.suka}</span>
    </div>
</div>
      </a>
    `;
    container.innerHTML += card;
  });
}

// 7. Event Delegation (Qty & Radio)
document.addEventListener("click", function (e) {
  if (e.target.classList.contains("btn-qty-plus")) {
    const qtySpan = e.target.parentElement.querySelector(".qty-value");
    qtySpan.innerText = parseInt(qtySpan.innerText) + 1;
  }

  if (e.target.classList.contains("btn-qty-minus")) {
    const qtySpan = e.target.parentElement.querySelector(".qty-value");
    let val = parseInt(qtySpan.innerText);
    if (val > 1) qtySpan.innerText = val - 1;
  }
});

// 8. Timer & Accordion
function startCountdown(duration) {
  let timer = duration;
  setInterval(() => {
    let h = Math.floor(timer / 3600);
    let m = Math.floor((timer % 3600) / 60);
    let s = timer % 60;

    if (document.querySelector(".timer-jam")) {
      document.querySelector(".timer-jam").textContent = String(h).padStart(
        2,
        "0",
      );
      document.querySelector(".timer-menit").textContent = String(m).padStart(
        2,
        "0",
      );
      document.querySelector(".timer-detik").textContent = String(s).padStart(
        2,
        "0",
      );
    }
    if (--timer < 0) timer = 0;
  }, 1000);
}

function toggleAccordion(element) {
  const content = element.nextElementSibling;
  const arrow = element.querySelector(".arrow-icon");
  const isOpen = content.style.maxHeight && content.style.maxHeight !== "0px";

  content.style.maxHeight = isOpen ? "0px" : content.scrollHeight + "px";
  arrow?.classList.toggle("rotate-180", !isOpen);
}

// tab bar flashsale
// 1. Database Menu untuk Flash Sale
const flashSaleData = [
  {
    id: 101,
    nama: "Nasi Campur",
    harga: "12.000",
    coret: "18.000",
    rating: 4.8,
    review: 125,
    img: "assets/images/makanan2.png",
    type: "rekomendasi",
    jarak: "4km",
  },
  {
    id: 102,
    nama: "Nasi Sayur",
    harga: "20.000",
    coret: "18.000",
    rating: 4.8,
    review: 125,
    img: "assets/images/mie ayam.png",
    type: "rekomendasi",
    jarak: "200m",
  },
  {
    id: 103,
    nama: "Mie Ayam Spesial",
    harga: "15.000",
    coret: "25.000",
    rating: 4.9,
    review: 210,
    img: "assets/images/mie ayam.png",
    type: "terlaris",
    jarak: "2km",
  },
  {
    id: 104,
    nama: "Seblak Bandung",
    harga: "15.000",
    coret: "18.000",
    rating: 4.7,
    review: 85,
    img: "assets/images/rawon.png",
    type: "sekitarmu",
    jarak: "1km",
  },
  {
    id: 105,
    nama: "Gudeg Jogja",
    harga: "18.000",
    coret: "22.000",
    rating: 4.8,
    review: 150,
    img: "assets/images/rawon.png",
    type: "terlaris",
    jarak: "3km",
  },
];

// Status Global untuk Waktu (Ongoing / Coming Soon)
let currentStatus = "ongoing";

// 2. Fungsi Utama Ganti Tab Menu
function switchMenuTab(category, element) {
  // Update Style Tombol Tab
  document.querySelectorAll(".menu-tab-btn").forEach((btn) => {
    btn.classList.remove("border-[#BFA370]", "text-gray-700");
    btn.classList.add("border-transparent", "text-gray-400");
  });
  element.classList.add("border-[#BFA370]", "text-gray-700");
  element.classList.remove("border-transparent", "text-gray-400");

  renderFlashSale(category);
}

// 3. Fungsi Render Menu ke Grid
function renderFlashSale(category) {
  const grid = document.getElementById("flash-sale-grid");
  if (!grid) return;

  grid.innerHTML = "";

  // Filter data berdasarkan kategori tab
  const filtered = flashSaleData.filter((item) => item.type === category);

  filtered.forEach((item) => {
    // Logika Badge Terlaris (Sesuai Foto 2)
    const badgeHtml =
      category === "terlaris"
        ? `<div class="absolute top-0 left-0 bg-oren-grd text-white text-[10px] font-bold px-3 py-1.5 rounded-br-2xl flex items-center gap-1 z-10">
                <i class="ri-fire-fill"></i> 5RB+ TERJUAL
               </div>`
        : "";

    // Logika Tombol (Sesuai Foto 4 - Jika Coming Soon maka disabled)
    const buttonHtml =
      currentStatus === "ongoing"
        ? `<button onclick="addToCart('${item.nama}', '${item.harga}', '${item.img}')" class="w-full py-3 bg-emas-main text-white rounded-xl font-bold shadow-lg hover:brightness-110 active:scale-95 transition-all">Beli Sekarang</button>`
        : `<button disabled class="w-full py-3 bg-gray-400 text-white rounded-xl font-bold cursor-not-allowed">Belum Tersedia</button>`;

    const card = `
            <div class="bg-white rounded-[1.5rem] p-4 shadow-xl border border-gray-50 group relative transition-all ${currentStatus !== "ongoing" ? "opacity-80" : ""}">
                <div class="relative h-48 rounded-2xl overflow-hidden mb-4 ${currentStatus !== "ongoing" ? "grayscale" : ""}">
                    ${badgeHtml}
                    <img src="${item.img}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <h4 class="font-bold text-gray-800 text-lg">${item.nama}</h4>
                <div class="flex items-center gap-1 text-sm text-gray-400 mb-2">
                    <i class="ri-star-fill text-yellow-500"></i>
                    <span class="text-orange-400 font-bold">${item.rating}</span> (${item.review})
                </div>
                <div class="flex items-baseline gap-2 mb-1">
                    <span class="text-2xl font-bold text-green-700">Rp ${item.harga}</span>
                    <span class="text-sm text-gray-400 line-through">Rp ${item.coret}</span>
                </div>
                <div class="flex items-center gap-1 text-gray-400 text-xs mb-4">
                    <i class="ri-map-pin-2-fill"></i> ${item.jarak}
                </div>
                ${buttonHtml}
            </div>
        `;
    grid.insertAdjacentHTML("beforeend", card);
  });
}

// 4. Interaksi Tab Waktu (18:00, 21:00, 12:00)
document.querySelectorAll(".tab-time").forEach((tab) => {
  tab.addEventListener("click", function () {
    // Hapus class active dari semua tab waktu
    document.querySelectorAll(".tab-time").forEach((t) => {
      t.classList.remove("active");
      t.classList.add("bg-[#D9D9D9]");
    });

    // Tambah class active ke yang diklik
    this.classList.add("active");
    this.classList.remove("bg-[#D9D9D9]");

    // Ambil status (Ongoing/Coming Soon)
    const statusText =
      this.querySelector("span:last-child").innerText.toLowerCase();
    currentStatus = statusText.includes("ongoing") ? "ongoing" : "coming soon";

    // Refresh menu yang tampil saat ini
    const activeCategory = document
      .querySelector(".menu-tab-btn.text-gray-700")
      .innerText.toLowerCase();
    renderFlashSale(activeCategory);
  });
});

// Jalankan pertama kali
document.addEventListener("DOMContentLoaded", () => {
  renderFlashSale("rekomendasi");
});

function switchTab(tab) {
  // reset semua tombol
  document.querySelectorAll(".tab-btn").forEach((btn) => {
    btn.classList.remove("active");
  });

  // aktifkan tombol yg diklik
  document.getElementById(`btn-${tab}`).classList.add("active");

  // hide semua konten
  document.querySelectorAll(".tab-pane").forEach((pane) => {
    pane.classList.add("hidden");
  });

  // tampilkan konten sesuai tab
  document.getElementById(`content-${tab}`).classList.remove("hidden");
}

// chat
// 1. Data Mockup (Bisa ditambah sesuai kebutuhan)
const chatData = [
  {
    id: "ag",
    name: "Ayam Goreng 39",
    img: "assets/images/mie ayam.png",
    lastMsg: "Bisa kak",
    messages: [
      {
        sender: "user",
        text: "Untuk pesanan ayam goreng paha atas, Ayam sama nasinya bisa di pisah nggk ya?",
        time: "12.24",
      },
      { sender: "store", text: "Bisa kak", time: "12.24" },
    ],
  },
  {
    id: "ba",
    name: "Burjo Ambucuy",
    img: "https://placehold.co/100/f3f3f3/BFA370?text=BA",
    lastMsg: "Siap, sedang diproses ya",
    messages: [
      { sender: "user", text: "Tambah sambal ya mang", time: "10.05" },
      { sender: "store", text: "Siap, sedang diproses ya", time: "10.06" },
    ],
  },
];

let activeChatId = "ag";

// 2. Fungsi Utama untuk Menampilkan Pesan (Bubble)
function loadChat(id) {
  activeChatId = id;
  const chat = chatData.find((c) => c.id === id);
  if (!chat) return;

  // Update Header Chat (Nama & Foto Toko)
  document.getElementById("active-store-name").textContent = chat.name;
  document.getElementById("active-store-img").src = chat.img;

  // Render semua bubble chat dari array messages
  const container = document.getElementById("chat-messages");
  container.innerHTML = `
        <div class="text-center mb-4">
            <span class="text-[10px] bg-gray-200 text-gray-500 px-3 py-1 rounded-full uppercase tracking-wider">Kemarin</span>
        </div>
    `;

  chat.messages.forEach((m) => {
    const bubbleDiv = document.createElement("div");
    bubbleDiv.className = `flex flex-col ${m.sender === "user" ? "items-end" : "items-start"} mb-4`;

    bubbleDiv.innerHTML = `
            <div class="bubble ${m.sender === "user" ? "bubble-right" : "bubble-left"}">
                ${m.text}
            </div>
            <span class="chat-time px-1">${m.time}</span>
        `;
    container.appendChild(bubbleDiv);
  });

  // Auto scroll ke paling bawah
  container.scrollTop = container.scrollHeight;

  // Refresh daftar kontak di kiri agar tanda "active" pindah
  renderContacts();
}

// 3. Fungsi Render Daftar Kontak di Sidebar
function renderContacts() {
  const list = document.getElementById("contact-list");
  list.innerHTML = chatData
    .map(
      (chat) => `
        <div class="contact-item p-4 flex items-center gap-3 cursor-pointer hover:bg-gray-50 transition-colors ${chat.id === activeChatId ? "active" : ""}" 
             onclick="loadChat('${chat.id}')">
            <img src="${chat.img}" onerror="this.src='https://placehold.co/100/f3f3f3/BFA370?text=Food'" class="w-12 h-12 rounded-full object-cover">
            <div class="flex-1 min-w-0">
                <div class="flex justify-between items-baseline">
                    <h4 class="font-bold text-gray-800 text-sm truncate">${chat.name}</h4>
                    <span class="text-[10px] text-gray-400">12.24</span>
                </div>
                <p class="text-xs text-gray-500 truncate">${chat.messages[chat.messages.length - 1].text}</p>
            </div>
        </div>
    `,
    )
    .join("");
}

// 4. Logika Mengirim Pesan Baru
document.addEventListener("DOMContentLoaded", () => {
  const chatForm = document.getElementById("chat-form");
  const inputField = document.getElementById("input-message");

  chatForm.addEventListener("submit", (e) => {
    e.preventDefault(); // Mencegah halaman refresh

    const messageText = inputField.value.trim();

    if (messageText !== "") {
      // Ambil waktu saat ini (format HH.mm)
      const now = new Date();
      const timeStr = `${now.getHours()}.${String(now.getMinutes()).padStart(2, "0")}`;

      // Masukkan pesan baru ke data array
      const currentChat = chatData.find((c) => c.id === activeChatId);
      currentChat.messages.push({
        sender: "user",
        text: messageText,
        time: timeStr,
      });

      // Kosongkan input
      inputField.value = "";

      // Render ulang chat agar bubble muncul
      loadChat(activeChatId);
    }
  });

  // Inisialisasi pertama kali
  init();
});

function init() {
  loadChat("ag");
}


function showComingSoonAlert() {
    // Menggunakan SweetAlert2 (opsional tapi lebih bagus) atau alert browser biasa
    alert("🚀 Fitur Flash Sale Segera Hadir!\nNantikan promo menarik lainnya di Market Kita.");
}

// hasil pencarian
function handleSearch(event) {
    // Mengecek apakah tombol yang ditekan adalah Enter (kode 13)
    if (event.key === 'Enter') {
        const query = event.target.value.trim();

        if (query.length > 0) {
            // Arahkan ke file search-results.html
            window.location.href = `search-results.html?q=${encodeURIComponent(query)}`;
        }
    }
}

// heart search result
// FUNGSI LIKE/UNLIKE GLOBAL
// Parameter 'el' menerima 'this' dari HTML, jadi tidak perlu ID lagi!
function toggleLike(el) {
    // 1. Cari icon <i> di dalam tombol yang diklik
    const heart = el.querySelector('i');
    
    if (!heart) return; // Keamanan jika icon tidak ditemukan

    // 2. Cek apakah icon menggunakan ri-heart-3-line (kosong/abu)
    // Kita cek juga variasi 'ri-heart-line' (tanpa angka 3) supaya aman di semua halaman
    const isLine = heart.classList.contains('ri-heart-3-line') || heart.classList.contains('ri-heart-line');

    if (isLine) {
        // --- PROSES LIKE (Ubah ke Merah Fill) ---
        // Hapus class garis & abu-abu
        heart.classList.remove('ri-heart-3-line', 'ri-heart-line', 'text-gray-300');
        // Tambah class isi & merah
        heart.classList.add('ri-heart-3-fill', 'text-red-500');

        // Animasi Pop (Biar interaktif)
        heart.style.transition = "transform 0.15s ease";
        heart.style.transform = "scale(1.4)";
        setTimeout(() => {
            heart.style.transform = "scale(1)";
        }, 150);

    } else {
        // --- PROSES UNLIKE (Balik ke Abu-abu Line) ---
        heart.classList.remove('ri-heart-3-fill', 'text-red-500');
        heart.classList.add('ri-heart-3-line', 'text-gray-300');
    }
}