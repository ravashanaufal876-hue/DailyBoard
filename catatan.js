export function tambahCatatan(daftar, isi) {
    return [...daftar, { id: Date.now(), isi, tanggal: new Date().toLocaleDateString() }];
}

export function hapusCatatan(daftar, id) {
    return daftar.filter((c) => c.id !== id);
}

export function editCatatan(daftar, id, catatanBaru) {
    return daftar.map((c) =>
        c.id === id ? { ...c, isi: catatanBaru } : c
    );
}

export function validasiInNote(nilai) {
    if (nilai.trim() === "") {
        alert("Input tidak boleh kosong!");
        return false;
    }
    return true;
}