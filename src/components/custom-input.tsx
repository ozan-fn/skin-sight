"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import TextareaAutosize from "react-textarea-autosize";
import { Send } from "lucide-react";

interface InputGroupCustomProps {
  textValue: string;
  onTextChange: (val: string) => void;
  onSend: () => void;
  isLoading?: boolean;
}

export function InputGroupCustom({
  textValue,
  onTextChange,
  onSend,
}: InputGroupCustomProps) {
  return (
    <div className="grid w-full max-w-2xl gap-6">
      <InputGroup className="bg-card">
        <TextareaAutosize
          data-slot="input-group-control"
          className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
          placeholder="Tulis deskripsi kulit Anda..."
          // HUBUNGKAN STATE DI SINI
          value={textValue}
          onChange={(e) => onTextChange(e.target.value)}
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton
            className="ml-auto"
            size="sm"
            variant="default" // HUBUNGKAN TOMBOL KIRIM DI SINI
            onClick={onSend}
          >
            <Send />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
