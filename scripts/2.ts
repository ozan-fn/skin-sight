import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import * as cheerio from 'cheerio';
import TurndownService from 'turndown';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();
const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
});

/**
 * Fungsi untuk membersihkan dan memformat referensi dari atribut sources Alodokter
 */
function formatSources(rawSources: string | undefined): string {
    if (!rawSources) return '';

    // 1. Bersihkan tanda kutip pembungkus dan decode karakter escape
    let cleanSources = rawSources.trim().replace(/^"|"$/g, '');
    cleanSources = cleanSources
        .replace(/\\u003c/g, '<')
        .replace(/\\u003e/g, '>')
        .replace(/\\u0026/g, '&')
        .replace(/\\n/g, '\n')
        .replace(/&amp;/g, '&')
        .replace(/&quot;/g, '"');

    // 2. Load ke cheerio untuk mengambil teks saja
    const $ = cheerio.load(cleanSources);
    const text = $.text();

    // 3. Pecah per baris dan jadikan list markdown
    const lines = text
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);

    if (lines.length === 0) return '';

    return `\n\n### Referensi\n${lines.map((l) => `- ${l}`).join('\n')}`;
}

async function scrapeAndSave(url: string) {
    try {
        // Filter: Hanya proses URL yang merupakan artikel/blog
        // Kita abaikan link komunitas, tanya dokter, atau halaman spesifik seperti /gejala
        const isNotBlog = url.includes('/komunitas/') || url.includes('/topic/') || url.endsWith('/gejala') || url.endsWith('/pengobatan') || url.endsWith('/diagnosis');

        if (isNotBlog) {
            console.log(`⏭️  Melewati (Bukan Artikel/Blog): ${url}`);
            return;
        }

        console.log(`🔍 Sedang mengambil data: ${url}`);
        const response = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' },
            timeout: 10000,
        });

        const $ = cheerio.load(response.data);

        // 1. Ambil Judul
        const title = $('#post_title').text().trim();
        if (!title) {
            console.log(`⚠️  Judul tidak ditemukan, melewati: ${url}`);
            return;
        }

        // 2. Ambil Gambar Utama
        const image = $('.post-content img').first().attr('src') || null;

        // 3. Buat Slug
        const slug = url.split('/').pop() || '';

        // 4. Ambil Konten Utama
        const contentContainer = $('#postContent').clone();
        // Bersihkan elemen sampah
        contentContainer.find('script, style, #mainContainer, .adunit, #div-gpt-ad-1483928814775-0, .sources-post').remove();

        const htmlContent = contentContainer.html() || '';
        let markdownContent = turndownService.turndown(htmlContent);

        // 5. Tambahkan Referensi jika ada
        const rawSources = $('sources-post').attr('sources');
        markdownContent += formatSources(rawSources);

        // 6. Tambahkan Sumber URL Asli
        markdownContent += `\n\n---\n**Sumber Asli:** [Alodokter](${url})`;

        // 7. Simpan ke Database (MongoDB)
        const disease = await prisma.disease.upsert({
            where: { slug: slug },
            update: {
                name: title,
                image: image,
                content: markdownContent,
            },
            create: {
                name: title,
                slug: slug,
                image: image,
                content: markdownContent,
            },
        });

        console.log(`✅ Berhasil menyimpan: ${disease.name}`);
    } catch (error: any) {
        console.error(`❌ Gagal scraping ${url}:`, error.message);
    }
}

async function main() {
    const jsonPath = path.join(__dirname, '2.json');

    if (!fs.existsSync(jsonPath)) {
        console.error('❌ File 2.json tidak ditemukan!');
        return;
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const links: string[] = data.links || [];

    console.log(`🚀 Memulai proses scraping untuk ${links.length} link...`);

    // Proses satu per satu agar tidak membebani server/kena blokir
    for (const link of links) {
        await scrapeAndSave(link);
        // Delay sedikit agar lebih manusiawi
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    console.log('🏁 Semua proses selesai.');
    await prisma.$disconnect();
}

main();
