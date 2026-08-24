// ==========================================================================
// MINGGU 1: Membuat 3 Section Utama Secara Dinamis
// ==========================================================================
const app = document.getElementById("app") || document.body;

// Judul Utama DailyBoard
const judulUtama = document.createElement("h2");
judulUtama.textContent = "Selamat datang di DailyBoard!";
judulUtama.style.color = "#2563eb";
app.appendChild(judulUtama);

// Indikator Loading Global (Minggu 6)
const teksStatus = document.createElement("p");
teksStatus.id = "status";
teksStatus.style.fontWeight = "bold";
teksStatus.style.color = "#2563eb";
app.appendChild(teksStatus);

// Membuat Wadah Section Kosong
const sectionTugas = document.createElement("section");
sectionTugas.id = "tugas";
const sectionCatatan = document.createElement("section");
sectionCatatan.id = "catatan";
const sectionCuaca = document.createElement("section");
sectionCuaca.id = "cuaca";

app.appendChild(sectionTugas);
app.appendChild(sectionCatatan);
app.appendChild(sectionCuaca);


// ==========================================================================
// MINGGU 2 & 3: Form Input Tugas, Tombol Tambah, & Render ke <ul> <li>
// ==========================================================================
let nextId = 1;
let daftarTugas = [];

const h3Tugas = document.createElement("h3");
h3Tugas.textContent = "Daftar Tugas (Klik 2x teks untuk edit, seret untuk urutkan)";
sectionTugas.appendChild(h3Tugas);

const inputTugas = document.createElement("input");
inputTugas.type = "text";
inputTugas.placeholder = "Masukkan nama tugas...";
sectionTugas.appendChild(inputTugas);

const tombolTambahTugas = document.createElement("button");
tombolTambahTugas.textContent = "Tambah Tugas";
sectionTugas.appendChild(tombolTambahTugas);

// Tombol Filter (Minggu 4)
const containerFilter = document.createElement("div");
containerFilter.style.margin = "10px 0";
const pilihanFilter = [
  { teks: "Semua", nilai: "semua" },
  { teks: "Selesai", nilai: "selesai" },
  { teks: "Belum Selesai", nilai: "belum" }
];
pilihanFilter.forEach(item => {
  const tombol = document.createElement("button");
  tombol.textContent = item.teks;
  tombol.style.marginRight = "5px";
  tombol.addEventListener("click", () => renderTugas(item.nilai));
  containerFilter.appendChild(tombol);
});
sectionTugas.appendChild(containerFilter);

const listUtamaTugas = document.createElement("ul");
listUtamaTugas.id = "daftar-tugas";
listUtamaTugas.style.padding = "0";
sectionTugas.appendChild(listUtamaTugas);


// ==========================================================================
// MINGGU 4 & 5: Hapus, Edit (Dblclick), Validasi Input, & Local Storage Tugas
// ==========================================================================
function validasiInput(nilai) {
  if (nilai.trim() === "") {
    alert("Input tidak boleh kosong!");
    return false;
  }
  if (nilai.length > 100) {
    alert("Input maksimal 100 karakter!");
    return false;
  }
  return true;
}

function simpanTugasKeStorage() {
  localStorage.setItem("daftarTugas", JSON.stringify(daftarTugas));
}

function tambahTugas(nama) {
  if (validasiInput(nama)) {
    daftarTugas.push({ id: nextId++, nama: nama.trim(), selesai: false });
    console.log("Nilai input:", nama.trim()); // Log Minggu 2
    simpanTugasKeStorage();
    renderTugas();
    inputTugas.value = "";
  }
}

function hapusTugas(id) {
  daftarTugas = daftarTugas.filter((t) => t.id !== id);
  simpanTugasKeStorage();
  renderTugas();
}

function editTugas(id, namaBaru) {
  daftarTugas = daftarTugas.map((t) =>
    t.id === id ? { ...t, nama: namaBaru } : t
  );
  simpanTugasKeStorage();
  renderTugas();
}

function toggleSelesai(id) {
  daftarTugas = daftarTugas.map((t) =>
    t.id === id ? { ...t, selesai: !t.selesai } : t
  );
  simpanTugasKeStorage();
  renderTugas();
}

function renderTugas(filter = "semua") {
  const list = document.getElementById("daftar-tugas");
  if (!list) return;
  list.innerHTML = "";

  const tugasTersaring = daftarTugas.filter((t) => {
    if (filter === "selesai") return t.selesai;
    if (filter === "belum") return !t.selesai;
    return true;
  });

  tugasTersaring.forEach((tugas) => {
    const li = document.createElement("li");
    li.className = "tugas-item";
    li.dataset.id = tugas.id;

    const spanTeks = document.createElement("span");
    spanTeks.textContent = tugas.nama;
    spanTeks.style.textDecoration = tugas.selesai ? "line-through" : "none";
    spanTeks.addEventListener("click", () => toggleSelesai(tugas.id));
    
    // Fitur Double Click Edit
    spanTeks.addEventListener("dblclick", () => {
      const namaBaru = prompt("Ubah nama tugas:", tugas.nama);
      if (namaBaru !== null && validasiInput(namaBaru)) {
        editTugas(tugas.id, namaBaru.trim());
      }
    });

    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus";
    tombolHapus.addEventListener("click", (e) => {
      e.stopPropagation();
      hapusTugas(tugas.id);
    });

    li.appendChild(spanTeks);
    li.appendChild(tombolHapus);
    list.appendChild(li);
  });
  aktifkanDragDrop(); // Panggil fitur Drag Minggu 7
}

tombolTambahTugas.addEventListener("click", () => {
  tambahTugas(inputTugas.value);
});


// ==========================================================================
// MINGGU 4 (BAGIAN 2): Section Catatan Cepat (Textarea & Kartu)
// ==========================================================================
let daftarCatatan = [];

const h3Catatan = document.createElement("h3");
h3Catatan.textContent = "Catatan Cepat";
sectionCatatan.appendChild(h3Catatan);

const textareaCatatan = document.createElement("textarea");
textareaCatatan.placeholder = "Tulis catatan cepat di sini...";
textareaCatatan.rows = 3;
sectionCatatan.appendChild(textareaCatatan);

const tombolTambahCatatan = document.createElement("button");
tombolTambahCatatan.textContent = "Tambah Catatan";
sectionCatatan.appendChild(tombolTambahCatatan);

const containerDaftarCatatan = document.createElement("div");
containerDaftarCatatan.id = "daftar-catatan";
containerDaftarCatatan.style.marginTop = "15px";
sectionCatatan.appendChild(containerDaftarCatatan);

function simpanCatatanKeStorage() {
  localStorage.setItem("daftarCatatan", JSON.stringify(daftarCatatan));
}

function tambahCatatan(isi) {
  if (isi.trim() !== "") {
    // Bagian Push yang dilengkapi dari potongan gambar Anda
    daftarCatatan.push({ id: Date.now(), isi: isi.trim(), tanggal: new Date().toLocaleDateString() });
    simpanCatatanKeStorage();
    renderCatatan();
    textareaCatatan.value = "";
  }
}

function renderCatatan() {
  const container = document.getElementById("daftar-catatan");
  if (!container) return;
  container.innerHTML = "";

  daftarCatatan.forEach((catatan) => {
    const div = document.createElement("div");
    div.className = "catatan-item";
    div.innerHTML = `<p style="margin:0 0 10px 0;">${catatan.isi}</p><small style="color:#666;">${catatan.tanggal}</small>`;
    container.appendChild(div);
  });
}

tombolTambahCatatan.addEventListener("click", () => {
  tambahCatatan(textareaCatatan.value);
});


// ==========================================================================
// MINGGU 6: API Fetch Data (Widget Kutipan & Cuaca Terkini)
// ==========================================================================
const widgetKutipan = document.createElement("div");
widgetKutipan.style.padding = "10px";
widgetKutipan.style.borderLeft = "4px solid #2563eb";
widgetKutipan.style.backgroundColor = "#f3f4f6";
widgetKutipan.style.marginBottom = "15px";

const teksKutipan = document.createElement("p");
teksKutipan.id = "kutipan-harian";
teksKutipan.style.fontStyle = "italic";
teksKutipan.textContent = "Memuat kutipan harian...";
widgetKutipan.appendChild(teksKutipan);
sectionCuaca.appendChild(widgetKutipan);

const h3Cuaca = document.createElement("h3");
h3Cuaca.textContent = "Informasi Cuaca Terkini";
sectionCuaca.appendChild(h3Cuaca);

const inputKota = document.createElement("input");
inputKota.type = "text";
inputKota.placeholder = "Ketik nama kota...";
sectionCuaca.appendChild(inputKota);

const tombolCariCuaca = document.createElement("button");
tombolCariCuaca.textContent = "Cari Cuaca";
sectionCuaca.appendChild(tombolCariCuaca);

const wadahInfoCuaca = document.createElement("div");
wadahInfoCuaca.id = "info-cuaca";
wadahInfoCuaca.style.marginTop = "10px";
sectionCuaca.appendChild(wadahInfoCuaca);

async function ambilKutipan() {
  try {
    const res = await fetch("https://api.quotable.io/random");
    const data = await res.json();
    document.getElementById("kutipan-harian").textContent = data.content;
  } catch (error) {
    console.error("Gagal mengambil kutipan:", error);
  }
}

ambilKutipan();


async function ambilCuaca(kota) {
  const apiKey = "9310278212343b6461b861731422458f"; 
  const url = `https://openweathermap.org{kota}&appid=${apiKey}&units=metric&lang=id`;

  wadahInfoCuaca.textContent = "Sedang memuat data cuaca...";

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Kota tidak ditemukan");
    const data = await res.json();
    wadahInfoCuaca.innerHTML = `<p><strong>${data.name}</strong>: ${data.main.temp}°C</p><p>Kondisi: ${data.weather[0].description}</p>`;
  } catch (error) {
    wadahInfoCuaca.textContent = `Error: ${error.message}`;
  }
}

tombolCariCuaca.addEventListener("click", () => {
  if (inputKota.value.trim() !== "") {
    ambilCuaca(inputKota.value.trim());
  }
});


// ==========================================================================
// MINGGU 7: Fitur Drag and Drop (Mengubah Urutan Prioritas Tugas)
// ==========================================================================
function aktifkanDragDrop() {
  const items = document.querySelectorAll(".tugas-item");
items.forEach((item) => {
    item.setAttribute("draggable", true);
    item.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", item.dataset.id);
    });
});

const list = document.getElementById("daftar-tugas");
list.addEventListener("dragover", (e) => e.preventDefault());
list.addEventListener("drop", (e) => {
    e.preventDefault();const idDiseret = parseInt(e.dataTransfer.getData("text/plain"));
    const elemenTarget = e.target.closest(".tugas-item");
    if (!elemenTarget) return;
    
    const idTarget = parseInt(elemenTarget.dataset.id);
    if (idDiseret !== idTarget) {
        const indeksDiseret = daftarTugas.findIndex(t => t.id === idDiseret);
        const indeksTarget = daftarTugas.findIndex(t => t.id === idTarget);
        const [itemDipindahkan] = daftarTugas.splice(indeksDiseret, 1);
        daftarTugas.splice(indeksTarget, 0, itemDipindahkan);
        simpanTugasKeStorage();
        renderTugas();
    }
});
}
// PROMISE.ALL & AMBIL DATA AWAL (Sinkronisasi Saat Halaman Dibuka)
function muatDataDariStorage() {
    const dataTugas = localStorage.getItem("daftarTugas");
    daftarTugas = dataTugas ? JSON.parse(dataTugas) : [
        { id: 1, nama: "Belajar JavaScript", selesai: false },
        { id: 2, nama: "Olahraga pagi", selesai: false }
    ];
    if (daftarTugas.length > 0) {
        nextId = Math.max(...daftarTugas.map(t => t.id)) + 1;
    }
    
    const dataCatatan = localStorage.getItem("daftarCatatan");
    daftarCatatan = dataCatatan ? JSON.parse(dataCatatan) : [];
}

async function muatSemuaWidget() {
    document.getElementById("status").textContent = "Memuat data dashboard...";
    try {
        // Mengeksekusi kedua API sekaligus menggunakan Promise.all (Minggu 6)
        await Promise.all([ambilKutipan(), ambilCuaca("Jakarta")]);
        document.getElementById("status").textContent = "Data berhasil dimuat";
        setTimeout(() => { document.getElementById("status").textContent = ""; }, 2000);
    }
     catch (error) {
        document.getElementById("status").textContent = "Gagal memuat widget.";
    }
}
// Menjalankan Aplikasi
window.addEventListener("DOMContentLoaded", () => {
    muatDataDariStorage();
    renderTugas();
    renderCatatan();
    muatSemuaWidget();
});