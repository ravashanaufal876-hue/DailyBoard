//import file dari yg lain
import { simpanData, muatData } from "./storage.js";
import { tambahTugas, hapusTugas, toggleSelesai, editTugas, validasiInput } from "./tugas.js";
import { tambahCatatan, hapusCatatan, editCatatan, validasiInNote } from "./catatan.js";
import { ambilKutipan, ambilCuaca } from "./api.js";

const header = document.getElementById("header");
const app = document.getElementById("app");
const dataContainer = document.createElement("div");
app.appendChild(dataContainer);

//tugas

let daftarTugas = muatData("daftarTugas");

const tugas = document.createElement("section");
tugas.id = "sectugas";
const subJuduTugas = document.createElement("h4");
subJuduTugas.textContent = "Tugas";

const daftar = document.createElement("article");
const input = document.createElement("input");
input.placeholder = "Masukkan Tugas...";
const tambahBtn = document.createElement("button");
tambahBtn.textContent = "Tambah Tugas";

//kolom Pencarian

const inputCari = document.createElement("input");
inputCari.id = "cari-tugas";
inputCari.placeholder = "Cari tugas...";

//filter

const filterSemua = document.createElement("button");
const filterSudah = document.createElement("button");
const filterBelum = document.createElement("button");
filterSemua.textContent = "Semua";
filterSudah.textContent = "Sudah";
filterBelum.textContent = "Belum";

const wf = document.createElement("div");
wf.className = "filter-container";
wf.append(filterSemua, filterSudah, filterBelum);

tugas.append(subJuduTugas, inputCari, input, tambahBtn, wf, daftar);
app.appendChild(tugas);

//fungsi utama tugas

tambahBtn.addEventListener("click", () => {
    const nilai = input.value.trim();
    if (validasiInput(nilai)) {
        daftarTugas = tambahTugas(daftarTugas, nilai); // Pakai rumus dari tugas.js
        simpanData("daftarTugas", daftarTugas);
        renderTugas();
        input.value = "";
    }
});

filterSemua.addEventListener("click", () => renderTugas("semua"));
filterSudah.addEventListener("click", () => renderTugas("sudah"));
filterBelum.addEventListener("click", () => renderTugas("belum"));

//debounce

function debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => fn(...args), delay);
    };
}

const cariTugasDebounced = debounce((kataKunci) => {
    const hasil = daftarTugas.filter((t) => t.nama.toLowerCase().includes(kataKunci));
    renderTugasKustom(hasil);
}, 300);

inputCari.addEventListener("input", (e) => {
    const kataKunci = e.target.value.toLowerCase();
    cariTugasDebounced(kataKunci);
});

//dragdrop

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
    simpanData("daftarTugas", daftarTugas);
    renderTugas();
});

//render

function renderAturan(dataRender) {
    daftar.innerHTML = "";
    const list = document.createElement("ul");
    daftar.appendChild(list);

    dataRender.forEach((listTugas) => {
        const li = document.createElement("li");
        li.textContent = listTugas.nama;
        li.dataset.id = listTugas.id;
        li.style.textDecoration = listTugas.selesai ? "line-through" : "none";

        li.addEventListener("click", () => {
            daftarTugas = toggleSelesai(daftarTugas, listTugas.id);
            simpanData("daftarTugas", daftarTugas);
            renderTugas();
        });

        const hapusBtn = document.createElement("button");
        hapusBtn.textContent = "Hapus";
        hapusBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            daftarTugas = hapusTugas(daftarTugas, listTugas.id);
            simpanData("daftarTugas", daftarTugas);
            renderTugas();
        });

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const tugasBaru = prompt("Masukkan nama tugas: ", listTugas.nama);
            if (tugasBaru !== null && validasiInput(tugasBaru)) {
                daftarTugas = editTugas(daftarTugas, listTugas.id, tugasBaru);
                simpanData("daftarTugas", daftarTugas);
                renderTugas();
            }
        });

        li.append(editBtn, hapusBtn);
        list.appendChild(li);
    });
    aktifkanDragDrop();
}

function renderTugas(filter = "semua") {
    const tugasTersaring = daftarTugas.filter((t) => {
        if (filter === "sudah") return t.selesai;
        if (filter === "belum") return !t.selesai;
        return true;
    });
    renderAturan(tugasTersaring);
}

function renderTugasKustom(dataHasilPencarian) {
    renderAturan(dataHasilPencarian);
}

//catatan

let dataCatatan = muatData("dataCatatan");

const catatan = document.createElement("section");
const subJudulCatatan = document.createElement("h4");
subJudulCatatan.textContent = "Catatan";

const listDaftarCatatan = document.createElement("article");
const inputCatatan = document.createElement("textarea");
const tambahBtnCatatan = document.createElement("button");
tambahBtnCatatan.textContent = "Tambah Catatan";

catatan.append(subJudulCatatan, inputCatatan, tambahBtnCatatan, listDaftarCatatan);
app.appendChild(catatan);

tambahBtnCatatan.addEventListener("click", () => {
    const noteNow = inputCatatan.value.trim();
    if (validasiInNote(noteNow)) {
        dataCatatan = tambahCatatan(dataCatatan, noteNow);
        simpanData("dataCatatan", dataCatatan);
        renderCatatan();
        inputCatatan.value = "";
    }
});

function renderCatatan() {
    listDaftarCatatan.innerHTML = "";
    dataCatatan.forEach((catat) => {
        const div = document.createElement("div");
        div.className = "catatan-item";
        div.innerHTML = `<p>${catat.isi}</p><small>${catat.tanggal}</small>`;

        const catatanBtnDel = document.createElement("button");
        catatanBtnDel.textContent = "Hapus";
        catatanBtnDel.addEventListener("click", () => {
            dataCatatan = hapusCatatan(dataCatatan, catat.id);
            simpanData("dataCatatan", dataCatatan);
            renderCatatan();
        });

        const editNote = document.createElement("button");
        editNote.textContent = "Edit";
        editNote.addEventListener("click", () => {
            const noteNew = prompt("Masukkan catatan baru:", catat.isi);
            if (noteNew !== null && validasiInNote(noteNew)) {
                dataCatatan = editCatatan(dataCatatan, catat.id, noteNew);
                simpanData("dataCatatan", dataCatatan);
                renderCatatan();
            }
        });

        div.append(editNote, catatanBtnDel);
        listDaftarCatatan.appendChild(div);
    });
}

//cuaca sama kutipan

const cuaca = document.createElement("section");
const subJudulCuaca = document.createElement("h4");
subJudulCuaca.textContent = "Cuaca";

const infoCuaca = document.createElement("article");
const subHeade = document.createElement("h4");
subHeade.textContent = "Info Cuaca";
const inputKota = document.createElement("input");
inputKota.placeholder = "Masukkan Nama Kota";
const tombolCuaca = document.createElement("button");
tombolCuaca.textContent = "Cek";
const info = document.createElement("p");
info.id = "info-cuaca";
info.textContent = "Memuat Info Cuaca...";

infoCuaca.append(subHeade, inputKota, tombolCuaca, info);
cuaca.append(subJudulCuaca, infoCuaca);
app.appendChild(cuaca);

tombolCuaca.addEventListener("click", async () => {
    const kota = inputKota.value.trim();
    if(kota !== "") {
        info.innerHTML = "mencari cuaca";
        info.innerHTML = await ambilCuaca(kota); // Memanggil dari api.js
    }
});

const kutipan = document.createElement("section");
const subJudulKutipan = document.createElement("h4");
subJudulKutipan.textContent = "Kutipan Harian";
const kutipanHarian = document.createElement("p");
kutipanHarian.id = "kutipan-harian";

kutipan.append(subJudulKutipan, kutipanHarian);
app.appendChild(kutipan);

const status = document.createElement("p");
app.appendChild(status);

//dark mode

let tombolGelap = document.getElementById("tombol-gelap");
if(!tombolGelap) {
    tombolGelap = document.createElement("button");
    tombolGelap.id = "tombol-gelap";
    tombolGelap.textContent = "Dark Mode";
    if(header) header.appendChild(tombolGelap);
}

if (localStorage.getItem("tema") === "gelap") {
    document.body.classList.add("dark-mode");
}

tombolGelap.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const modeAktif = document.body.classList.contains("dark-mode");
    localStorage.setItem("tema", modeAktif ? "gelap" : "terang");
});

window.addEventListener("DOMContentLoaded", async () => {
    status.textContent = "memuat data";
    renderTugas();
    renderCatatan();
    
    const [hasilKutipan, hasilCuaca] = await Promise.all([ambilKutipan(), ambilCuaca("Jakarta")]);
    kutipanHarian.textContent = hasilKutipan;
    info.innerHTML = hasilCuaca;
    
    status.textContent = "data dimuat";
});