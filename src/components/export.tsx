"use client";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Button } from "@/components/ui/button";
import { Ticket } from "@/components/tables/ticket/column";

type ExportToExcelButtonProps = {
  data: Ticket[];
  filename?: string;
};

export default function ExportToExcelButton({
  data,
  filename = "tickets.xlsx",
}: ExportToExcelButtonProps) {
  const handleExport = () => {
    const dataToExport = data.map((ticket) => ({
      Code: ticket.code,
      Title: ticket.title,
      Priority: ticket.priority,
      Status: ticket.status,
      Department: ticket.department,
      Duration: ticket.duration,
      "Assigned To": ticket.assignedTo,
      "Created By": ticket.createdBy,
      "Created At": ticket.createdAt,
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Tickets");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(blob, filename);
  };

  return (
    <Button onClick={handleExport} variant="outline">
      Export to Excel
    </Button>
  );
}
