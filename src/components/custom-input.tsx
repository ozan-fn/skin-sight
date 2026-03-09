"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";
import TextareaAutosize from "react-textarea-autosize";
import { Send } from "lucide-react";

export function InputGroupCustom() {
  return (
    <div className="grid w-full max-w-2xl gap-6">
      <InputGroup className="bg-card">
        <TextareaAutosize
          data-slot="input-group-control"
          className="flex field-sizing-content min-h-16 w-full resize-none rounded-md bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
          placeholder="Autoresize textarea..."
        />
        <InputGroupAddon align="block-end">
          <InputGroupButton className="ml-auto" size="sm" variant="default">
            <Send />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
