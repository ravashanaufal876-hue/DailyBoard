const header = document.getElementById("header");

function simpanKeStorage() {
    localStorage.setItem("daftarTugas", JSON.stringify(daftarTugas));
}

function muatDariStorage() {
    const data = localStorage.getItem("daftarTugas");
    daftarTugas = data ? JSON.parse(data) : [];
}

const app = document.getElementById("app");

const tugas = document.createElement("section");
const subJuduTugas = document.createElement("h4");
tugas.id = "sectugas";
subJuduTugas.textContent = "Tugas";

const daftar = document.createElement("article");
const input = document.createElement("input");
const tambahBtn = document.createElement("button");
input.placeholder = "Masukkan Tugas...";
tambahBtn.textContent = "Tambah Tugas";

const filterSemua = document.createElement("button");
const filterSudah = document.createElement("button");
const filterBelum = document.createElement("button");
filterSemua.textContent = "Semua";
filterSudah.textContent = "Sudah";
filterBelum.textContent = "Belum";

const wf = document.createElement("div");
wf.className = "filter-container";
wf.appendChild(filterSemua);
wf.appendChild(filterSudah);
wf.appendChild(filterBelum);

app.appendChild(tugas);
tugas.appendChild(subJuduTugas);
tugas.appendChild(input);
tugas.appendChild(tambahBtn);
tugas.appendChild(wf);
tugas.appendChild(daftar);

let daftarTugas = [
    { id: 1, nama: "js mantep sumpah", selesai: false },
    { id: 2, nama: "html sahabat", selesai: false },
];

let nextId = 3;

input.addEventListener("input", (e) => {
    console.log("Input: ", e.target.value);
});

tambahBtn.addEventListener("click", () => {
    const nilai = input.value.trim();
    console.log("Input: ", nilai);
    if (validasiInput(nilai)) {
        tambahTugas(nilai);
    }
});

filterSemua.addEventListener("click", () => renderTugas("semua"));
filterSudah.addEventListener("click", () => renderTugas("sudah"));
filterBelum.addEventListener("click", () => renderTugas("belum"));

muatDariStorage();

function tambahTugas(nama) {
    daftarTugas.push({ id: nextId++, nama, selesai: false });

    renderTugas();
    simpanKeStorage();
    input.value = "";
}

function hapusTugas(id) {
    daftarTugas = daftarTugas.filter((t) => t.id !== id);

    renderTugas();
    simpanKeStorage();
}

function toggleSelesai(id) {
    daftarTugas = daftarTugas.map((t) =>
        t.id === id ? { ...t, selesai: !t.selesai } : t
    );

    renderTugas();
    simpanKeStorage();
}

function editTugas(id, namaBaru) {
    daftarTugas = daftarTugas.map((t) =>
        t.id === id ? { ...t, nama: namaBaru } : t
    );
    simpanKeStorage();
    renderTugas();
}

function validasiInput(nilai) {
    if (nilai.trim() === "") {
        alert("Input tidak boleh kosong")
        return false;
    }
    if (nilai.length > 100) {
        alert("Input maksimal 100 karakter");
        return false;
    }
    return true;
}

function aktifkanDragDrop() {
    const items = document.querySelectorAll("#sectugas li");
    items.forEach((item) => {
        item.setAttribute("draggable", true);

        item.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", item.dataset.id);
        });
    });
}

daftar.addEventListener("dragover", (e) => e.preventDefault());

daftar.addEventListener("drop", (e) => {
    e.preventDefault();
    const idDiseret = Number(e.dataTransfer.getData("text/plain"));

    const target = e.target.closest("li");
    if (!target) return;

    const idTarget = Number(target.dataset.id);
    if (idDiseret === idTarget) return;
    const indexDiseret = daftarTugas.findIndex((t) => t.id === idDiseret);
    const indexTarget = daftarTugas.findIndex((t) => t.id === idTarget);

    if (indexDiseret === -1 || indexTarget === -1) return;

    const [item] = daftarTugas.splice(indexDiseret, 1);
    daftarTugas.splice(indexTarget, 0, item);

    renderTugas();
    simpanKeStorage();
});

function renderTugas(filter = "semua") {
    daftar.innerHTML = "";
    const list = document.createElement("ul");
    daftar.appendChild(list);

    const tugasTersaring = daftarTugas.filter((t) => {
        if (filter === "sudah") return t.selesai;
        if (filter === "belum") return !t.selesai;
        return true;
    });

    tugasTersaring.forEach((listTugas) => {
        const li = document.createElement("li");
        li.textContent = listTugas.nama;
        li.dataset.id = listTugas.id;
        li.style.textDecoration = listTugas.selesai ? "line-through" : "none";
        li.addEventListener("click", () => toggleSelesai(listTugas.id));

        const hapusBtn = document.createElement("button");
        hapusBtn.textContent = "Hapus";

        li.addEventListener("dblclick", () => {
            const tugasBaru = prompt("Masukkan nama tugas: ");
            if (validasiInput(tugasBaru)) {
                editTugas(listTugas.id, tugasBaru);
            }
        });

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => {
            const tugasBaru = prompt("Masukkan nama tugas: ");
            if (validasiInput(tugasBaru)) {
                editTugas(listTugas.id, tugasBaru);
            }
        });

        hapusBtn.addEventListener("click", () => hapusTugas(listTugas.id));
        li.appendChild(hapusBtn);
        li.appendChild(editBtn);
        list.appendChild(li);
    });

    aktifkanDragDrop();
}

renderTugas();

function simpanCatatanKeStorage() {
    localStorage.setItem("dataCatatan", JSON.stringify(dataCatatan));
}

function muatCatatanDariStorage() {
    const data = localStorage.getItem("dataCatatan");
    dataCatatan = data ? JSON.parse(data) : [];
}

const catatan = document.createElement("section");
const subJudulCatatan = document.createElement("h4");
subJudulCatatan.textContent = "Catatan";
app.appendChild(catatan);
catatan.appendChild(subJudulCatatan);

const listDaftarCatatan = document.createElement("article");
const inputCatatan = document.createElement("textarea");
const tambahBtnCatatan = document.createElement("button");
tambahBtnCatatan.textContent = "Tambah Catatan";
catatan.appendChild(inputCatatan);
catatan.appendChild(tambahBtnCatatan);
catatan.appendChild(listDaftarCatatan);

let dataCatatan = [];

tambahBtnCatatan.addEventListener("click", () => {
    const noteNow = inputCatatan.value.trim();
    if (validasiInNote(noteNow)) {
        tambahCatatan(noteNow)
    }
});

muatCatatanDariStorage();

function tambahCatatan(isi) {
    dataCatatan.push({ id: Date.now(), isi, tanggal: new Date().toLocaleDateString() });
    simpanCatatanKeStorage();
    renderCatatan();
    inputCatatan.value = "";
}

function hapusCatatan(id) {
    dataCatatan = dataCatatan.filter((c) => c.id !== id);
    simpanCatatanKeStorage();
    renderCatatan();
}

function validasiInNote(nilai) {
    if (nilai === "") {
        alert("Input tidak boloh kosong!");
        return false;
    }
    return true;
}

function editCatatan(id, catatanBaru) {
    dataCatatan = dataCatatan.map((c) =>
        c.id === id ? { ...c, isi: catatanBaru } : c
    );
    simpanCatatanKeStorage();
    renderCatatan();
}

function renderCatatan() {
    listDaftarCatatan.innerHTML = "";

    dataCatatan.forEach((catatan) => {
        const div = document.createElement("div");
        div.className = "catatan-item";
        div.innerHTML = `
<p>${catatan.isi}</p>
<small>${catatan.tanggal}</small>
`;

        const catatanBtnDel = document.createElement("button");
        catatanBtnDel.textContent = "Hapus";
        catatanBtnDel.addEventListener("click", () => hapusCatatan(catatan.id));

        const editNote = document.createElement("button");
        editNote.textContent = "Edit";
        editNote.addEventListener("click", () => {
            const noteNew = prompt("Masukkan catatan baru:", catatan.isi);
            if (validasiInNote(noteNew)) {
                editCatatan(catatan.id, noteNew);
            }
        })

        div.appendChild(editNote);
        div.appendChild(catatanBtnDel);
        listDaftarCatatan.appendChild(div);
    });
}

renderCatatan();

const cuaca = document.createElement("section");
const subJudulCuaca = document.createElement("h4");
subJudulCuaca.textContent = "Cuaca";
app.appendChild(cuaca);
cuaca.appendChild(subJudulCuaca);

const infoCuaca = document.createElement("article");
const subHeade = document.createElement("h4");
const inputKota = document.createElement("input");
inputKota.placeholder = "Masukkan Nama Kota";
subHeade.textContent = "Info Cuaca";
const tombolCuaca = document.createElement("button");
tombolCuaca.textContent = "Cek";
const info = document.createElement("p");
info.id = "info-cuaca";
info.textContent = "Memuat Info Cuaca...";

tombolCuaca.addEventListener("click", () => {
    console.log(inputKota.value);
    const kota = inputKota.value.trim();
    ambilCuaca(kota);
})

const kutipan = document.createElement("section");
const subJudulKutipan = document.createElement("h4");
subJudulKutipan.textContent = "Kutipan Harian";
const kutipanHarian = document.createElement("p");
kutipanHarian.id = "kutipan-harian";
kutipanHarian.textContent = "Memuat kutipan...";

app.appendChild(kutipan);
kutipan.appendChild(subJudulKutipan);
kutipan.appendChild(kutipanHarian);

async function ambilKutipan() {
  try {
    const res = await fetch("https://dummyjson.com/quotes/random");
    const data = await res.json();
    document.getElementById("kutipan-harian").textContent = `"${data.quote}" - ${data.author}`;  } catch (error) {
    console.error("Gagal mengambil kutipan:", error);
    document.getElementById("kutipan-harian").textContent = "Gagal memuat kutipan.";
  }
}

ambilKutipan();

async function ambilCuaca(kota) {
    const apiKey = "18841e293493445a30cd12b4f150c108";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${kota}&appid=${apiKey}&units=metric`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Kota tidak ditemukan");
        const data = await res.json();

        info.innerHTML = `
<p>${data.name}: ${data.main.temp}°C</p>
<p>${data.weather[0].description}</p>
`
    } catch (error) {
        info.textContent = error.message;
    }
}
cuaca.appendChild(infoCuaca);
infoCuaca.appendChild(subHeade);
infoCuaca.appendChild(inputKota);
infoCuaca.appendChild(tombolCuaca);
infoCuaca.appendChild(info);

const status = document.createElement("p");
app.appendChild(status);

async function muatSemuaWidget() {
    status.textContent = "Memuat data...";

    await Promise.all([ambilKutipan(), ambilCuaca("Jakarta")]);

    status.textContent = "Data berhasil dimuat";
}

window.addEventListener("DOMContentLoaded", muatSemuaWidget);

const tombolGelap = document.getElementById("tombol-gelap");

if (localStorage.getItem("tema") === "gelap") {
  document.body.classList.add("dark-mode");
}

tombolGelap.addEventListener("click", () => {
  
  document.body.classList.toggle("dark-mode");
  
  const modeAktif = document.body.classList.contains("dark-mode");
  if (modeAktif) {
    localStorage.setItem("tema", "gelap");
  } else {
    localStorage.setItem("tema", "terang");
  }
});

for (const con of daftarTugas) {
    console.log(`Nama: ${con.nama}`)
}

const inputCari = document.createElement("input");
inputCari.id = "cari-tugas";
inputCari.placeholder = "cari tugas";

tugas.appendChild(inputCari);

inputCari.addEventListener("input", (e) => {
    const kataKunci = e.target.value.toLowerCase();
    
    const hasil = daftarTugas.filter((t) => 
        t.nama.toLowerCase().includes(kataKunci)
    );
    
    renderTugasKustom(hasil); 
});

function renderTugasKustom(dataHasilPencarian) {
    daftar.innerHTML = "";
    const list = document.createElement("ul");
    daftar.appendChild(list);

    dataHasilPencarian.forEach((listTugas) => {
        const li = document.createElement("li");
        li.textContent = listTugas.nama;
        li.dataset.id = listTugas.id;
        li.style.textDecoration = listTugas.selesai ? "line-through" : "none";
        
        li.addEventListener("click", () => toggleSelesai(listTugas.id));

        const hapusBtn = document.createElement("button");
        hapusBtn.textContent = "Hapus";
        hapusBtn.addEventListener("click", (e) => {
            hapusTugas(listTugas.id);
        });

        li.appendChild(hapusBtn);
        list.appendChild(li);
    });
}

const dataContainer = document.createElement("div");
app.appendChild(dataContainer);