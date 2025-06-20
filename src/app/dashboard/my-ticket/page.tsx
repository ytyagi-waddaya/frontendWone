"use client";

import { useQuery } from "@tanstack/react-query";
import { TicketsByUserId } from "@/lib/api/route";
import { useMemo, useState, useEffect } from "react";
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
import { DataTable } from "@/components/tables/ticket/DataTable";
import { columns, Ticket } from "@/components/tables/ticket/userTicket/column";

const PAGE_SIZE = 10;

export default function TicketsListPage() {
  const [search, setSearch] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("");
  const [selectedPriority, setSelectedPriority] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  
  const { data: ticketsData, isLoading, isError, error } = useQuery({
    queryKey: ["tickets"],
    queryFn: TicketsByUserId, 
    // queryClient.invalidateQueries(["tickets"])
  });

//   const departmentQuery = useQuery({
//     queryKey: ["departments"],
//     queryFn: getAllDepartments,
//   });

  const tickets: Ticket[] =
    ticketsData?.tickets?.map((ticket: any) => ({
      id: ticket.id,
      code: ticket.code,
      title: ticket.title,
      priority: ticket.priority,
      status: ticket.status,
    //   department: ticket.department?.name || "",
      assignedTo: ticket.assignedTo?.name || "-",
      createdBy: ticket.createdBy?.name || "",
      createdAt: new Date(ticket.createdAt).toLocaleString() || "",
      
    })) ?? [];

  const filteredTickets = useMemo(() => {
    const result = tickets.filter((ticket) => {
      const matchesSearch =
        ticket.title.toLowerCase().includes(search.toLowerCase()) ||
        ticket.code.toLowerCase().includes(search.toLowerCase());

    //   const matchesDepartment = selectedDepartment
    //     ? ticket.department.toLowerCase() === selectedDepartment.toLowerCase()
    //     : true;

      const matchesPriority = selectedPriority
        ? ticket.priority.toLowerCase() === selectedPriority.toLowerCase()
        : true;

      const matchesStatus = selectedStatus
        ? ticket.status.toLowerCase() === selectedStatus.toLowerCase()
        : true;

      return (
        matchesSearch &&
        // matchesDepartment &&
        matchesPriority &&
        matchesStatus
      );
    });

    return result;
  }, [tickets, search, selectedDepartment, selectedPriority, selectedStatus]);

  const pageCount = Math.ceil(filteredTickets.length / PAGE_SIZE);
  const paginatedTickets = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    const result = filteredTickets.slice(start, start + PAGE_SIZE);
    return result;
  }, [filteredTickets, currentPage]);

  const resetFilters = () => {
    setSearch("");
    setSelectedDepartment("");
    setSelectedPriority("");
    setSelectedStatus("");
    setCurrentPage(1);
  };

  const handlePageChange = (dir: "prev" | "next") => {
    if (dir === "prev" && currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    } else if (dir === "next" && currentPage < pageCount) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  if (isLoading) return <p>Loading tickets...</p>;
  if (isError) return <p className="text-red-500">Error: {(error as any)?.message}</p>;

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">My Tickets</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 items-end">
        <div>
          <Input
            placeholder="Search by title or code"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

          <div>
          <Select
            value={selectedDepartment}
            onValueChange={(val) => {
              setSelectedDepartment(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Department" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BASIS">BASIS</SelectItem>
              <SelectItem value="ABAP">ABAP</SelectItem>
              <SelectItem value="FUNCTIONAL">FUNCTIONAL</SelectItem>
              <SelectItem value="CLIENT">CLIENT</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={selectedPriority}
            onValueChange={(val) => {
              setSelectedPriority(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="critical">Critical</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Select
            value={selectedStatus}
            onValueChange={(val) => {
              setSelectedStatus(val);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OPEN">Open</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="CLOSED">Closed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {(search || selectedDepartment || selectedPriority || selectedStatus) && (
        <Button variant="outline" onClick={resetFilters} className="w-full">
          Reset Filters
        </Button>
      )}

      {/* Table */}
      <DataTable columns={columns} data={paginatedTickets} />

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
