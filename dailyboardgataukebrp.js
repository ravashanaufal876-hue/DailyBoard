// 1. Siapkan Wadah Utama
const app = document.getElementById("app");

// 2. Buat 3 Bagian (Section)
const sectionTugas = document.createElement("div");
sectionTugas.className = "section";

const sectionCatatan = document.createElement("div");
sectionCatatan.className = "section";

const sectionCuaca = document.createElement("div");
sectionCuaca.className = "section";

app.appendChild(sectionTugas);
app.appendChild(sectionCatatan);
app.appendChild(sectionCuaca);


// ==========================================
// FITUR TUGAS (TODO LIST)
// ==========================================
let daftarTugas = [];
let filterSaatIni = "semua";

// Kantong ajaib penyimpanan
function muatDariStorage() {
  const data = localStorage.getItem("daftarTugas");
  if (data) daftarTugas = JSON.parse(data);
}

function simpanKeStorage() {
  localStorage.setItem("daftarTugas", JSON.stringify(daftarTugas));
}

// Bikin tampilan tugas
sectionTugas.innerHTML = `
  <h3>Daftar Tugas</h3>
  <input type="text" id="input-tugas" placeholder="Ketik tugas baru...">
  <button id="btn-tambah-tugas">Tambah</button>
  <br><br>
  <button onclick="ubahFilter('semua')">Semua</button>
  <button onclick="ubahFilter('selesai')">Selesai</button>
  <button onclick="ubahFilter('belum')">Belum Selesai</button>
  <ul id="daftar-tugas"></ul>
`;

// Fungsi Filter
function ubahFilter(tipe) {
  filterSaatIni = tipe;
  renderTugas();
}

// Menggambar ulang daftar tugas
function renderTugas() {
  const list = document.getElementById("daftar-tugas");
  list.innerHTML = ""; 

  const tugasTersaring = daftarTugas.filter((t) => {
    if (filterSaatIni === "selesai") return t.selesai;
    if (filterSaatIni === "belum") return !t.selesai;
    return true; 
  });

  tugasTersaring.forEach((tugas) => {
    const li = document.createElement("li");
    li.setAttribute("draggable", true); 
    
    const teksTugas = document.createElement("span");
    teksTugas.textContent = tugas.nama;
    
    // Kalau selesai, coret teksnya
    if (tugas.selesai) {
      teksTugas.style.textDecoration = "line-through";
      teksTugas.style.color = "gray";
    }

    // Klik 1x = tandai selesai
    teksTugas.addEventListener("click", () => {
      tugas.selesai = !tugas.selesai;
      simpanKeStorage();
      renderTugas();
    });

    // Klik 2x = edit tugas
    teksTugas.addEventListener("dblclick", () => {
      const namaBaru = prompt("Ubah tugasmu:", tugas.nama);
      if (namaBaru !== null && namaBaru.trim() !== "") {
        tugas.nama = namaBaru;
        simpanKeStorage();
        renderTugas();
      }
    });

    // Tombol Hapus
    const tombolHapus = document.createElement("button");
    tombolHapus.textContent = "Hapus";
    tombolHapus.addEventListener("click", () => {
      daftarTugas = daftarTugas.filter((t) => t.id !== tugas.id);
      simpanKeStorage();
      renderTugas();
    });

    li.appendChild(teksTugas);
    li.appendChild(tombolHapus);
    list.appendChild(li);
  });
}

// Telinga robot untuk input tugas baru
document.getElementById("btn-tambah-tugas").addEventListener("click", () => {
  const input = document.getElementById("input-tugas");
  const nilai = input.value;
  
  if (nilai.trim() === "") {
    alert("Eh, tugasnya tidak boleh kosong lho!");
    return;
  }

  daftarTugas.push({ id: Date.now(), nama: nilai, selesai: false });
  input.value = ""; 
  simpanKeStorage();
  renderTugas();
});


// ==========================================
// FITUR CATATAN
// ==========================================
sectionCatatan.innerHTML = `
  <h3>Catatan Cepat</h3>
  <textarea id="input-catatan" placeholder="Tulis catatan di sini..."></textarea>
  <br>
  <button id="btn-tambah-catatan">Simpan Catatan</button>
  <div id="daftar-catatan"></div>
`;

let daftarCatatan = JSON.parse(localStorage.getItem("daftarCatatan")) || [];

function renderCatatan() {
  const container = document.getElementById("daftar-catatan");
  container.innerHTML = "";
  daftarCatatan.forEach((catatan) => {
    const div = document.createElement("div");
    div.className = "catatan-item";
    div.innerHTML = `<p>${catatan.isi}</p><small>⏱ ${catatan.tanggal}</small>`;
    container.appendChild(div);
  });
}

document.getElementById("btn-tambah-catatan").addEventListener("click", () => {
  const input = document.getElementById("input-catatan");
  if(input.value.trim() === "") return alert("Catatan kosong!");
  
  daftarCatatan.push({ isi: input.value, tanggal: new Date().toLocaleDateString() });
  localStorage.setItem("daftarCatatan", JSON.stringify(daftarCatatan));
  input.value = "";
  renderCatatan();
});


// ==========================================
// FITUR CUACA & KUTIPAN (API)
// ==========================================
sectionCuaca.innerHTML = `
  <h3>Cuaca Hari Ini</h3>
  <input type="text" id="input-kota" placeholder="Cari kota (misal: Soreang)">
  <button id="btn-cari-cuaca">Cari</button>
  <div id="info-cuaca">
    <p>Ketik nama kota untuk melihat cuaca ☁️</p>
  </div>
`;

async function ambilCuaca(namaKota) {
  const apiKey = "9310278212343b6461b861731422458f"; // Tiket masukmu yang keren!
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${namaKota}&appid=${apiKey}&units=metric&lang=id`;

  try {
    const info = document.getElementById("info-cuaca");
    info.innerHTML = "Sedang mencari awan... 🏃‍♂️💨";

    const res = await fetch(url);
    if (!res.ok) throw new Error("Yah, kotanya tidak ketemu. Coba cek ejaannya!");
    
    const data = await res.json();
    info.innerHTML = `
      <h2>${data.main.temp}°C</h2>
      <p>Cuaca di <strong>${data.name}</strong>: ${data.weather[0].description}</p>
    `;
  } catch (error) {
    document.getElementById("info-cuaca").innerHTML = `<p>${error.message}</p>`;
  }
}

// Tombol cari cuaca
document.getElementById("btn-cari-cuaca").addEventListener("click", () => {
  const kota = document.getElementById("input-kota").value;
  if(kota !== "") ambilCuaca(kota);
});

// Robot pengambil kutipan (Belanja di toko baru yang lebih stabil!)
async function ambilKutipan() {
  try {
    // Kita ganti alamatnya ke dummyjson, servernya lebih kuat
    const res = await fetch("https://dummyjson.com/quotes/random");
    const data = await res.json();
    const kutipanEl = document.getElementById("kutipan-harian");
    
    // Pastikan elemennya ada sebelum ditulis. 
    // Catatan: di toko baru ini, nama bungkusannya "quote", bukan "content"
    if(kutipanEl) kutipanEl.textContent = `"${data.quote}" - ${data.author}`;
  } catch (error) {
    const kutipanEl = document.getElementById("kutipan-harian");
    if(kutipanEl) kutipanEl.textContent = "Masih gagal memuat kutipan 😢";
  }
}


// ==========================================
// NYALAKAN APLIKASI KITA! 🚀
// ==========================================
async function mulaiAplikasi() {
  // Panggil data lama
  muatDariStorage();
  renderTugas();
  renderCatatan();
  
  // Suruh kurir bekerja berbarengan
  await Promise.all([ambilKutipan(), ambilCuaca("Soreang")]);
  
  // Ubah status
  const statusEl = document.getElementById("status");
  if(statusEl) statusEl.textContent = "data siap.";
}

// Kita jalankan komandannya SEKARANG!
mulaiAplikasi();