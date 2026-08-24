export function simpanData(kunci, data) {
    localStorage.setItem(kunci, JSON.stringify(data));
}

export function muatData(kunci) {
    const data = localStorage.getItem(kunci);
    return data ? JSON.parse(data) : [];
}