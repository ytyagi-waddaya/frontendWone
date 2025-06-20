"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  department: string;
  isActive: boolean;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Name",
        cell: ({ row }) => (
      <Link
        href={`/dashboard/users/${row.original.id}`}
        className="text-blue-600 hover:underline font-medium"
      >
        {row.original.name}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "role",
    header: "Role",
  },
  {
    accessorKey: "department",
    header: "Department",
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) =>
      row.original.isActive ? (
        <span className="text-green-600 font-medium">✅ Active</span>
      ) : (
        <span className="text-red-600 font-medium">❌ Inactive</span>
      ),
  },
];
