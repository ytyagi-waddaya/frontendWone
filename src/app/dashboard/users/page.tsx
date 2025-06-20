"use client";

import { useQuery } from "@tanstack/react-query";
import { listAllUsers, getAllDepartments, getAllRoles } from "@/lib/api/route";
import { DataTable } from "@/components/tables/users/DataTable";
import { columns, User } from "@/components/tables/users/column";
import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PAGE_SIZE = 10;

export default function UserListPage() {
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: listAllUsers,
  });

  const departmentQuery = useQuery({
    queryKey: ["departments"],
    queryFn: getAllDepartments,
  });

  const roleQuery = useQuery({
    queryKey: ["roles"],
    queryFn: getAllRoles,
  });

  const users: User[] =
    data?.users?.map((user: any) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      role: user.roles.map((r: any) => r.role.name).join(", "),
      department: user.departments.map((d: any) => d.department.name).join(", "),
    })) ?? [];

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesDepartment = selectedDepartment
        ? user.department.includes(selectedDepartment)
        : true;

      const matchesRole = selectedRole ? user.role.includes(selectedRole) : true;

      const matchesStatus =
        selectedStatus === ""
          ? true
          : selectedStatus === "active"
          ? user.isActive
          : !user.isActive;

      return matchesSearch && matchesDepartment && matchesRole && matchesStatus;
    });
  }, [users, search, selectedDepartment, selectedRole, selectedStatus]);

  const pageCount = Math.ceil(filteredUsers.length / PAGE_SIZE);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredUsers.slice(start, start + PAGE_SIZE);
  }, [filteredUsers, currentPage]);

  const resetFilters = () => {
    setSearch("");
    setSelectedDepartment("");
    setSelectedRole("");
    setSelectedStatus("");
    setCurrentPage(1);
  };

  const handlePageChange = (direction: "prev" | "next") => {
    if (direction === "prev" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (direction === "next" && currentPage < pageCount) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (isLoading) return <p>Loading users...</p>;
  if (isError) return <p className="text-red-500">Error: {(error as any)?.message}</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">All Users</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
        <div>
          <Input
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div>
          <Select value={selectedDepartment} onValueChange={(val) => {
            setSelectedDepartment(val);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select department" />
            </SelectTrigger>
            <SelectContent>
              {departmentQuery.data?.departments?.map((dept: any) => (
                <SelectItem key={dept.id} value={dept.name}>
                  {dept.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={selectedRole} onValueChange={(val) => {
            setSelectedRole(val);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              {roleQuery.data?.roles?.map((role: any) => (
                <SelectItem key={role.id} value={role.name}>
                  {role.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select value={selectedStatus} onValueChange={(val) => {
            setSelectedStatus(val);
            setCurrentPage(1);
          }}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {(search || selectedDepartment || selectedRole || selectedStatus) && (
        <Button variant="outline" onClick={resetFilters} className="w-full">
          Reset Filters
        </Button>
      )}

      {/* Table */}
      <DataTable columns={columns} data={paginatedUsers} />

      {/* Pagination */}
      <div className="flex justify-between items-center pt-4">
        <Button
          variant="outline"
          onClick={() => handlePageChange("prev")}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" /> Previous
        </Button>
        <span>
          Page {currentPage} of {pageCount}
        </span>
        <Button
          variant="outline"
          onClick={() => handlePageChange("next")}
          disabled={currentPage === pageCount}
        >
          Next <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
