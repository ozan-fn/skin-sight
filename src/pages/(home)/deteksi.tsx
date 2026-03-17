import { useState } from "react";

import { useNavigate } from "react-router";
import { motion, AnimatePresence, delay } from "motion/react";
import { FileUpload } from "@/components/patterns/p-file-upload-5";
import { InputGroupCustom } from "@/components/custom-input";

export default function Deteksi() {
  const navigate = useNavigate();
  // 1. Ember penampung data
  const [description, setDescription] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]); // Sesuai tipe data uploader-mu

  // 2. Fungsi yang akan dijalankan saat tombol "Kirim" diklik
  const handleKirimKeAI = () => {
    // Validasi sederhana
    if (selectedFiles.length === 0 && !description) {
      alert("Pilih gambar atau tulis pesan dulu ya!");
      return;
    }

    // GABUNGKAN DATA DUMMY
    const dataSiapKirim = {
      teks: description,
      gambar: selectedFiles, // Ini berisi array file yang sudah diupload
      waktu: new Date().toLocaleString(),
    };

    console.log("PAKET DATA SIAP:", dataSiapKirim);
    alert(
      `Mengirim ${selectedFiles.length} gambar dan pesan: "${description}"`,
    );

    // PINDAH HALAMAN sambil membawa data (state)
    navigate("/deteksi-chat", { state: { data: dataSiapKirim } });
  };
  return (
    <div className="min-h-screen p-20">
      <div className="max-w-7xl mx-auto px-4">
        <header className="mb-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-foreground mb-4"
          >
            Deteksi Kulit Anda
          </motion.h1>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center gap-4 max-w-3xl mx-auto p-9 bg-secondary rounded-xl"
        >
          <FileUpload
            onFilesChange={(files) => setSelectedFiles(files)}
          ></FileUpload>
          <InputGroupCustom
            textValue={description}
            onTextChange={setDescription}
            onSend={handleKirimKeAI}
          ></InputGroupCustom>
        </motion.div>
      </div>
    </div>
  );
}
