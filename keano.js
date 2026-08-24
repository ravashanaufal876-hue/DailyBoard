//Kutipan di Judul
const kepala = document.getElementById("kepala");
const kutipanText = document.createElement("p");
kutipanText.id = "kutipan-harian";
kutipanText.textContent = "Memuat kutipan...";

kepala.appendChild(kutipanText);


// Kutipan Harian
async function ambilKutipan() {
    try {
        const res = await fetch("https://motivational-spark-api.vercel.app/api/quotes/random");
        const data = await res.json();
        kutipanText.textContent = data.quote;
        console.log(data);
    } catch (error) {
        console.log("Gagal mengambil kutipan:", error);
    }
}


//=====================================================
//Local Storage To Do List
function simpanKeStorage() {
    localStorage.setItem("daftarTugas", JSON.stringify(daftarTugas));
}

function muatDariStorage() {
    const data = localStorage.getItem("daftarTugas");
    daftarTugas = data ? JSON.parse(data) : [];
}

//======================================================
const app = document.getElementById("app");

const tugas = document.createElement("section"); // Section Tugas
tugas.id = "sectugas";
const subJuduTugas = document.createElement("h2");
subJuduTugas.textContent = "Tugas";

// Untuk mengisi dan menambahkan
const daftar = document.createElement("article");
const input = document.createElement("input");
input.placeholder = "Masukkan Tugas...";
const tambahBtn = document.createElement("button");
tambahBtn.textContent = "Tambah Tugas";

//Keluarga Filter
const filterSemua = document.createElement("button");
filterSemua.textContent = "Semua";
const filterSudah = document.createElement("button");
filterSudah.textContent = "Sudah";
const filterBelum = document.createElement("button");
filterBelum.textContent = "Belum";

app.appendChild(tugas);
tugas.appendChild(subJuduTugas);
tugas.appendChild(input);
tugas.appendChild(tambahBtn);
tugas.appendChild(filterSemua);
tugas.appendChild(filterSudah);
tugas.appendChild(filterBelum);
tugas.appendChild(daftar);

// Isi Daftar Tugas dan render
let daftarTugas = [
    { id: 1, nama: "JavaScript", selesai: false },
    { id: 2, nama: "TipeScript", selesai: false },
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

// Function
// Tambah Tugas
function tambahTugas(nama) {
    daftarTugas.push({ id: nextId++, nama, selesai: false });

    renderTugas();
    simpanKeStorage();
    input.value = "";
}

// Hapus Tugas
function hapusTugas(id) {
    daftarTugas = daftarTugas.filter((t) => t.id !== id);

    renderTugas();
    simpanKeStorage();
}

// Toggle untuk selesai
function toggleSelesai(id) {
    daftarTugas = daftarTugas.map((t) =>
        t.id === id ? { ...t, selesai: !t.selesai } : t
    );

    renderTugas();
    simpanKeStorage();
}

// Edit Tugas
function editTugas(id, namaBaru) {
    daftarTugas = daftarTugas.map((t) =>
        t.id === id ? { ...t, nama: namaBaru } : t
    );
    simpanKeStorage();
    renderTugas();
}

// Validasi Input
function validasiInput(nilai) {
    if (nilai.trim() === "") {
        alert("Input tidak boleh kosong!")
        return false;
    }
    if (nilai.length > 100) {
        alert("Input maksimal 100 karakter!");
        return false;
    }
    return true;
}

// Drag & Drop
function aktifkanDragDrop() {
    const items = document.querySelectorAll("li");
    items.forEach((item) => {
        item.setAttribute("draggable", true);

        item.addEventListener("dragstart", (e) => {
            e.dataTransfer.setData("text/plain", item.dataset.id);
        });
    });
}

daftar.addEventListener("dragover", (e) => e.preventDefault());
daftar.addEventListener("drop", (e) => {
    const id = e.dataTransfer.getData("text/plain");
    console.log("Tugas dipindahkan: ", id);
    // logika mengubah urutan array daftarTugas
})

// Render Tugas
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
        li.style.textDecoration = listTugas.selesai ? "line-through" : "none";
        li.addEventListener("click", () => toggleSelesai(listTugas.id))

        const hapusBtn = document.createElement("button");
        hapusBtn.textContent = "Hapus";

        li.addEventListener("dblclick", () => {
            const tugasBaru = prmpt("Masukkan nama tugas: ");
            if (validasiInput(tugasBaru)) {
                editTugas(listTugas.id, tugasBaru);
            }
        })

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", () => {
            const tugasBaru = prompt("Masukkan nama tugas: ");
            if (validasiInput(tugasBaru)){
                editTugas(listTugas.id, tugasBaru);
            }
        })

        hapusBtn.addEventListener("click", () => hapusTugas(listTugas.id));
        li.appendChild(hapusBtn);
        li.appendChild(editBtn);
        list.appendChild(li);
        aktifkanDragDrop();
    });
    
}

renderTugas();

const garis = document.createElement("hr");
tugas.appendChild(garis);





//================================================
//Local Storage Catatan
function simpanCatatanKeStorage() {
    localStorage.setItem("dataCatatan", JSON.stringify(dataCatatan));
}

function muatCatatanDariStorage() {
    const data = localStorage.getItem("dataCatatan");
    dataCatatan = data ? JSON.parse(data): [];
}

//=================================================
const catatan = document.createElement("section"); // Section Catatan
const subJudulCatatan = document.createElement("h2");
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

// Mulai
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

const garis2 = document.createElement("hr");
catatan.appendChild(garis2);






//==================================================
const cuaca = document.createElement("section"); // Section Cuaca
const subJudulCuaca = document.createElement("h2");
subJudulCuaca.textContent = "Cuaca";
app.appendChild(cuaca);
cuaca.appendChild(subJudulCuaca);

// Widget Cuaca
const infoCuaca = document.createElement("article");
const subHeade = document.createElement("h3");
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

const garis4 = document.createElement("hr");
infoCuaca.appendChild(garis4);


// // Muat semua
const status = document.createElement("p");
app.appendChild(status);

async function muatSemuaWidget() {
    status.textContent = "Memuat data...";

    await Promise.all([ambilKutipan(), ambilCuaca("Jakarta")]);

    status.textContent = "Data berhasil dimuat";
}

window.addEventListener("DOMContentLoaded", muatSemuaWidget);

// // Pembatas
const garis3 = document.createElement("hr");
app.appendChild(garis3);



// Penghias
const toggleBtn = document.createElement("button");
toggleBtn.textContent = "Dark Mode";
toggleBtn.id = "toggle-tema";



kepala.appendChild(toggleBtn);

const toggleTema = document.getElementById("toggle-tema");

toggleTema.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const modeAktif = document.body.classList.contains("dark-mode");
    localStorage.setItem("tema", modeAktif ? "gelap" : "terang");
});

// terapkan tema tersimpan saat halaman dimuat
window.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem("tema") === "gelap") {
        document.body.classList.add("dark-mode");
    }
});

// pencarian
const inpCari = document.createElement("input");
inpCari.placeholder = "Cari Tugas...";
inpCari.id = "cari-tugas";
const cariBtn = document.createElement("button");
cariBtn.textContent = "Cari";
kepala.appendChild(inpCari);
kepala.appendChild(cariBtn);


document.getElementById("cari-tugas").addEventListener("input", (e) => {
    const isi = e.target.value
    const kataKunci = isi.toLowerCase();
    const hasil = daftarTugas.filter((t) => t.nama.toLowerCase().includes(kataKunci));
    renderTugas(hasil);
});

for (const con of daftarTugas) {
    console.log(`Nama: ${con.nama}`)
}

const variable = document.queryElement("list");
const dataContainer = document.createElement("div");
app.appendChild(dataContainer);