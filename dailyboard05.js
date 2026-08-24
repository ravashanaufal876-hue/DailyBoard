// script.js
console.log("DailyBoard siap dijalankan!");

//Tugas mingguan: Setup struktur project dan buat layout dasar (header, area konten utama, footer) dengan CSS sederhana.

const app = document.getElementById("app");

const judul = document.createElement("h2");
judul.textContent = "Selamat datang di DailyBoard!";
app.appendChild(judul);

// Mengubah gaya elemen lewat JS
judul.style.color = "#2563eb";

//Tugas mingguan: Buat 3 section kosong (Tugas, Catatan, Cuaca) menggunakan document.createElement dan tambahkan ke halaman secara dinamis lewat JavaScript,
//  bukan ditulis langsung di HTML.

const tombol = document.createElement("button");
tombol.textContent = "Klik Saya";
app.appendChild(tombol);

tombol.addEventListener("click", () => {
  alert("Tombol berhasil diklik!");
});

// Event pada input
const input = document.createElement("input");
app.appendChild(input);

input.addEventListener("input", (e) => {
  console.log("Nilai input:", e.target.value);
});

//Tugas mingguan: Buat form input sederhana (nama tugas) dengan tombol "Tambah", tampilkan hasil input ke console setiap kali tombol diklik.

let daftarTugas = [
  { id: 1, nama: "Belajar JavaScript", selesai: false },
  { id: 2, nama: "Olahraga pagi", selesai: false },
];

function renderTugas() {
  const list = document.getElementById("daftar-tugas");
  list.innerHTML = "";

  daftarTugas.forEach((tugas) => {
    const li = document.createElement("li");
    li.textContent = tugas.nama;
    list.appendChild(li);
  });
}

renderTugas();

//Tugas mingguan: Tampilkan daftar tugas dalam elemen <ul>, setiap tugas ditampilkan sebagai <li> menggunakan fungsi render.

let nextId = 3;

function tambahTugas(nama) {
  daftarTugas.push({ id: nextId++, nama, selesai: false });
  renderTugas();
}

function hapusTugas(id) {
  daftarTugas = daftarTugas.filter((t) => t.id !== id);
  renderTugas();
}

function renderTugas() {
  const list = document.getElementById("daftar-tugas");
  list.innerHTML = "";

  daftarTugas.forEach((tugas) => {
    const li = document.createElement("li");
    li.textContent = tugas.nama;

    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus";
    tombolHapus.addEventListener("click", () => hapusTugas(tugas.id));

    li.appendChild(tombolHapus);
    list.appendChild(li);
  });
}

//Tugas mingguan: Hubungkan form input Minggu 3 dengan fungsi tambahTugas, dan tambahkan tombol hapus di setiap item tugas.

function toggleSelesai(id) {
  daftarTugas = daftarTugas.map((t) =>
    t.id === id ? { ...t, selesai: !t.selesai } : t
  );
  renderTugas();
}

// Filter tugas
function renderTugas(filter = "semua") {
  const list = document.getElementById("daftar-tugas");
  list.innerHTML = "";

  const tugasTersaring = daftarTugas.filter((t) => {
    if (filter === "selesai") return t.selesai;
    if (filter === "belum") return !t.selesai;
    return true;
  });

  tugasTersaring.forEach((tugas) => {
    const li = document.createElement("li");
    li.textContent = tugas.nama;
    li.style.textDecoration = tugas.selesai ? "line-through" : "none";
    li.addEventListener("click", () => toggleSelesai(tugas.id));
    list.appendChild(li);
  });
}

//Tugas mingguan: Tambahkan 3 tombol filter (Semua, Selesai, Belum Selesai) yang mengubah tampilan daftar tugas sesuai status.

function simpanKeStorage() {
  localStorage.setItem("daftarTugas", JSON.stringify(daftarTugas));
}

function muatDariStorage() {
  const data = localStorage.getItem("daftarTugas");
  daftarTugas = data ? JSON.parse(data) : [];
}

// Panggil setiap kali data berubah
function tambahTugas(nama) {
  daftarTugas.push({ id: nextId++, nama, selesai: false });
  simpanKeStorage();
  renderTugas();
}

//Tugas mingguan: Pastikan seluruh perubahan data tugas (tambah, hapus, tandai selesai) otomatis tersimpan ke localStorage, dan data dimuat kembali saat halaman dibuka ulang.

let daftarCatatan = [];

function tambahCatatan(isi) {
  daftarCatatan.push({ 
    id: Date.now(), 
    isi: isi, 
    tanggal: new Date().toLocaleDateString() 
  });
  simpanCatatanKeStorage();
  renderCatatan();
}

function renderCatatan() {
  const container = document.getElementById("daftar-catatan");
  container.innerHTML = "";

  daftarCatatan.forEach((catatan) => {
    const div = document.createElement("div");
    div.className = "catatan-item";
    div.innerHTML = `<p>${catatan.isi}</p><small>${catatan.tanggal}</small>`;
    container.appendChild(div);
  });
}

//Tugas mingguan: Buat section "Catatan" dengan form textarea untuk menambah catatan cepat,
//  tampilkan dalam bentuk kartu-kartu kecil, dan simpan ke localStorage seperti fitur

function editTugas(id, namaBaru) {
  daftarTugas = daftarTugas.map((t) =>
    t.id === id ? { ...t, nama: namaBaru } : t
  );
  simpanKeStorage();
  renderTugas();
}

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

//Tugas mingguan: Tambahkan fitur edit tugas/catatan (klik dua kali untuk mengubah isi) dan validasi agar input kosong tidak bisa disimpan.

async function ambilKutipan() {
  try {
    const res = await fetch("https://quotable.io");
    const data = await res.json();
    document.getElementById("kutipan-harian").textContent = data.content;
  } catch (error) {
    console.error("Gagal mengambil kutipan:", error);
  }
}

ambilKutipan();

//Tugas mingguan: Tambahkan widget "Kutipan Hari Ini" yang mengambil data dari API publik dan tampilkan pesan error jika gagal memuat.

async function ambilCuaca(kota) {
  const apiKey = "API_KEY_ANDA";
  const url = `https://openweathermap.org{kota}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Kota tidak ditemukan");
    const data = await res.json();

    document.getElementById("info-cuaca").innerHTML = `
      <p>${data.name}: ${data.main.temp}°C</p>
      <p>${data.weather[0].description}</p>
    `;
  } catch (error) {
    document.getElementById("info-cuaca").textContent = error.message;
  }
}

//Tugas mingguan: Buat form input nama kota, tampilkan info cuaca terkini menggunakan API cuaca publik, tangani kondisi loading dan error.

async function muatSemuaWidget() {
  document.getElementById("status").textContent = "Memuat data...";

  await Promise.all([ambilKutipan(), ambilCuaca("Jakarta")]);

  document.getElementById("status").textContent = "Data berhasil dimuat";
}

window.addEventListener("DOMContentLoaded", muatSemuaWidget);

//Tugas mingguan: Pastikan seluruh widget (kutipan, cuaca) dimuat otomatis saat halaman dibuka menggunakan Promise.all, tampilkan indikator loading selama proses berlangsung.

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
    const id = e.dataTransfer.getData("text/plain");
    console.log("Tugas dipindahkan:", id);
    // logika mengubah urutan array daftarTugas
  });
}

//Tugas mingguan: Implementasikan fitur drag-and-drop agar pengguna bisa mengubah urutan prioritas tugas, dan simpan urutan baru ke localStorage.