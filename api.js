export async function ambilKutipan() {
    try {
        const res = await fetch("https://dummyjson.com/quotes/random");
        const data = await res.json();
        return `"${data.quote}" - ${data.author}`;
    } catch (error) {
        console.error("Gagal mengambil kutipan:", error);
        return "Gagal memuat kutipan.";
    }
}

export async function ambilCuaca(kota) {
    const apiKey = "18841e293493445a30cd12b4f150c108";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${kota}&appid=${apiKey}&units=metric`;

    try {
        const res = await fetch(url);
        if (!res.ok) throw new Error("Kota tidak ditemukan");
        const data = await res.json();
        return `
            <p>${data.name}: ${data.main.temp}°C</p>
            <p>${data.weather[0].description}</p>
        `;
    } catch (error) {
        return `<p>${error.message}</p>`;
    }
}