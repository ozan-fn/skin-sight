import axios from 'axios';
import * as cheerio from 'cheerio';

async function main() {
    try {
        const url = 'https://www.alodokter.com/cara-meningkatkan-hormon-progesteron-yang-perlu-diketahui-wanita';
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        // 1. Mengambil Judul
        const title = $('#post_title').text().trim();

        // 2. Mengambil Tanggal Update (diambil dari meta atau teks)
        const lastUpdated = $('.date-article').first().text().replace('Terakhir diperbarui:', '').trim();

        // 3. Mengambil Nama Dokter (dari atribut komponen sources-post)
        const reviewer = $('sources-post').attr('doctor-name');

        // 4. Mengambil Konten Utama (Menghapus elemen yang tidak diinginkan seperti Iklan/Video)
        const contentContainer = $('#postContent').clone();

        // Bersihkan elemen yang mengganggu (iklan, video, div kosong)
        contentContainer.find('#mainContainer, #div-gpt-ad-1483928814775-0, script, img').remove();

        const contentHtml = contentContainer.html()?.trim();
        const contentText = contentContainer.text().trim();

        // 5. Mengambil Referensi (dari atribut sources di tag sources-post)
        // Karena datanya berupa string HTML yang di-encode, kita perlu me-loadnya kembali
        const rawSources = $('sources-post').attr('sources');
        const $sources = cheerio.load(rawSources || '');
        const references = $sources
            .text()
            .trim()
            .split('\n')
            .filter((ref) => ref.trim() !== '');

        // Output Hasil
        console.log('=== DATA ARTIKEL ALODOKTER ===');
        console.log('Judul       :', title);
        console.log('Reviewer    :', reviewer);
        console.log('Update      :', lastUpdated);
        console.log('\n--- Referensi ---');
        references.forEach((ref, i) => console.log(`${i + 1}. ${ref.trim()}`));

        console.log('\n--- Preview Konten ---');
        console.log(contentText.substring(0, 300) + '...');
    } catch (error: any) {
        console.error('Terjadi kesalahan:', error.message);
    }
}

main();
