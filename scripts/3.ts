import puppeteer from 'puppeteer-core';
import * as fs from 'fs';

async function scrapeAlodokterLinks() {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

    const browser = await puppeteer.launch({
        executablePath: chromePath,
        headless: false,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    const query = 'penyakit kulit site:alodokter.com';
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    await page.goto(searchUrl, { waitUntil: 'networkidle2' });

    let allLinks: string[] = [];
    let hasNextPage = true;
    let pageCount = 1;

    while (hasNextPage) {
        console.log(`Menyisir Halaman ${pageCount}...`);

        // 1. Tunggu hasil pencarian dimuat
        await page.waitForSelector('#search');

        // 2. Auto-scroll ke bawah agar tombol "Next" muncul/dimuat
        await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
        await new Promise((r) => setTimeout(r, 1000));

        // 3. Ekstraksi Link yang lebih agresif
        const links = await page.evaluate(() => {
            // Mencari semua link yang mengandung 'alodokter.com' di atribut href-nya
            const anchors = Array.from(document.querySelectorAll('a[href*="alodokter.com"]'));

            return anchors
                .map((a) => (a as HTMLAnchorElement).href)
                .filter((href) => {
                    // Membersihkan link agar benar-benar link artikel, bukan link tracking Google
                    const isGoogleResource = href.includes('google.com') || href.includes('webcache');
                    const isAlodokter = href.includes('alodokter.com/');

                    return isAlodokter && !isGoogleResource;
                });
        });

        // Membersihkan URL dari parameter pencarian Google jika ada
        const cleanedLinks = links.map((link) => {
            try {
                const url = new URL(link);
                // Jika link dibungkus redirect Google (url?q=...), ambil url aslinya
                if (url.host.includes('google') && url.searchParams.has('q')) {
                    return url.searchParams.get('q') || link;
                }
                return link.split('&')[0]; // Ambil bagian utama saja
            } catch {
                return link;
            }
        });

        allLinks.push(...cleanedLinks);
        console.log(`Ditemukan ${cleanedLinks.length} link di halaman ini.`);

        // 4. Cari tombol Next (Google sering pakai ID 'pnnext' atau selektor teks)
        const nextButton = await page.$('#pnnext');

        if (nextButton) {
            pageCount++;
            console.log(`Menuju halaman ${pageCount}...`);

            await Promise.all([page.waitForNavigation({ waitUntil: 'networkidle2' }), nextButton.click()]);

            // Delay acak agar tidak dianggap bot (3-5 detik)
            await new Promise((r) => setTimeout(r, Math.random() * 2000 + 3000));
        } else {
            console.log('Tidak ada tombol "Next". Scraping selesai.');
            hasNextPage = false;
        }
    }

    // Hilangkan duplikat
    const uniqueLinks = [...new Set(allLinks)];

    const outputData = {
        total: uniqueLinks.length,
        keyword: query,
        scrapedAt: new Date().toISOString(),
        links: uniqueLinks,
    };

    fs.writeFileSync('2.json', JSON.stringify(outputData, null, 2));

    console.log('--- SELESAI ---');
    console.log(`Berhasil menyimpan ${uniqueLinks.length} link ke 2.json`);

    await browser.close();
}

scrapeAlodokterLinks().catch((err) => console.error('Kesalahan:', err));
