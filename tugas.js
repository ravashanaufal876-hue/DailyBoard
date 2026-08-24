export function tambahTugas(daftar, nama) {
    return [...daftar, { id: Date.now(), nama, selesai: false }];
}

export function hapusTugas(daftar, id) {
    return daftar.filter((t) => t.id !== id);
}

export function toggleSelesai(daftar, id) {
    return daftar.map((t) =>
        t.id === id ? { ...t, selesai: !t.selesai } : t
    );
}

export function editTugas(daftar, id, namaBaru) {
    return daftar.map((t) =>
        t.id === id ? { ...t, nama: namaBaru } : t
    );
}

export function validasiInput(nilai) {
    if (nilai.trim() === "") {
        alert("Input tidak boleh kosong");
        return false;
    }
    if (nilai.length > 100) {
        alert("Input maksimal 100 karakter");
        return false;
    }
    return true;
}