import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getStyle } from "@/components/badgeStyles";

export type Ticket = {
  id: string;
  code: string;
  title: string;
  priority: string;
  status: string;
  department: string;
  assignedTo: string;
  duration: string;
  createdBy: string;
  createdAt: string;
  description?:string;
};

export const columns: ColumnDef<Ticket>[] = [
  {
    accessorKey: "code",
    header: "Code",
    cell: ({ row }) => (
      <Link
        href={`/dashboard/ticket-pool/${row.original.id}`}
        className="text-blue-600 hover:underline font-medium"
      >
        {row.original.code}
      </Link>
    ),
  },
  {
    accessorKey: "title",
    header: "Title",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const value = row.original.status;
      return (
        <Badge className={`capitalize px-2 py-1 text-xs font-medium rounded-full ${getStyle("status", value)}`}>
          {value}
        </Badge>
      );
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    cell: ({ row }) => {
      const value = row.original.priority.toLocaleUpperCase();
      return (
        <Badge className={`capitalize px-2 py-1 text-xs font-medium rounded-full ${getStyle("priority", value)}`}>
          {value}
        </Badge>
      );
    },
  },
  {
    accessorKey: "department",
    header: "Department",
    cell: ({ row }) => {
      const department = row.original.department;
      return (
        <Badge className={`capitalize px-2 py-1 text-xs font-medium rounded-full ${getStyle("department", department)}`}>
          {department}
        </Badge>
      );
    },
  },

  {
    accessorKey: "assignedTo",
    header: "Assigned To",
  },
  {
    accessorKey: "createdBy",
    header: "Created By",
  },
  {
    accessorKey: "duration",
    header: "Duration",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
  },
];
