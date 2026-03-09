import { motion, AnimatePresence, delay } from "motion/react";
import { FileUpload } from "@/components/patterns/p-file-upload-5";
import { InputGroupCustom } from "@/components/custom-input";

export default function Deteksi() {
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
          <FileUpload></FileUpload>
          <InputGroupCustom></InputGroupCustom>
        </motion.div>
      </div>
    </div>
  );
}
