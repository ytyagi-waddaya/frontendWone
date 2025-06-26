"use client";

import * as XLSX from "xlsx";
import { useRef } from "react";
import { Button } from "@/components/ui/button";

type TicketImport = {
  Code: string;
  Title: string;
  Priority: string;
  Status: string;
  Department: string;
  "Assigned To": string;
  "Created By": string;
  "Created At": string;
};

type ImportFromExcelProps = {
  onImport: (tickets: TicketImport[]) => void;
};

export default function ImportFromExcel({ onImport }: ImportFromExcelProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const data = new Uint8Array(evt.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData: TicketImport[] = XLSX.utils.sheet_to_json(worksheet);

      onImport(jsonData); // callback with parsed ticket data
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        hidden
      />
      <Button
        variant="outline"
        onClick={() => inputRef.current?.click()}
      >
        Import from Excel
      </Button>
    </>
  );
}
