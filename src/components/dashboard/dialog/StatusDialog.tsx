"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useMutation, useQuery } from "@tanstack/react-query";
import { updateTicket, listAllUsers, updateTicketStatus } from "@/lib/api/route";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export interface StatusDialogProps {
  ticketId: string;
  currentStatus?: string;
  trigger?: React.ReactNode;
  onStatusChanged?: () => void;
  userRole?: string; // Optional: to support Admin override
}

type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "REASSIGNED"
  | "CLOSED"
  | "REOPENED"
  | "ON_HOLD"
  | "AWAITING_INPUT";

const ALL_STATUSES: TicketStatus[] = [
  "OPEN",
  "IN_PROGRESS",
  "PENDING_APPROVAL",
  "APPROVED",
  "REJECTED",
  "REASSIGNED",
  "CLOSED",
  "REOPENED",
  "ON_HOLD",
  "AWAITING_INPUT",
];

const STATUSES_REQUIRING_COMMENT: TicketStatus[] = [
  "REJECTED",
  "REASSIGNED",
  "REOPENED",
  "PENDING_APPROVAL",
  "APPROVED"
];


const transitions: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ["IN_PROGRESS", "CLOSED"],
  IN_PROGRESS: ["PENDING_APPROVAL", "CLOSED", "REASSIGNED", "ON_HOLD"],
  PENDING_APPROVAL: ["APPROVED", "REJECTED", "REASSIGNED"],
  APPROVED: ["IN_PROGRESS", "CLOSED", "REASSIGNED"],
  REJECTED: ["CLOSED", "REOPENED"],
  REASSIGNED: ["IN_PROGRESS", "PENDING_APPROVAL"],
  AWAITING_INPUT: ["IN_PROGRESS", "ON_HOLD", "CLOSED"],
  ON_HOLD: ["IN_PROGRESS", "CLOSED"],
  CLOSED: ["REOPENED"],
  REOPENED: [ "IN_PROGRESS", "PENDING_APPROVAL", "ON_HOLD"],
};

export default function StatusDialog({
  ticketId,
  currentStatus,
  trigger,
  onStatusChanged,
  userRole = "User",
}: StatusDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | undefined>();
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | undefined>();
  const [comment, setComment] = useState<string>("");

  // const mutation = useMutation({
  //   mutationFn: ({
  //     newStatus,
  //     assignedToId,
  //     approverId,
  //     comment,
  //   }: {
  //     newStatus: TicketStatus;
  //     assignedToId?: string;
  //     approverId?: string;
  //     comment?: string;
  //   }) => updateTicket(ticketId, newStatus, assignedToId, approverId, comment),
  //   onSuccess: () => {
  //     toast.success("Ticket status updated");
  //     setOpen(false);
  //     setSelectedUserId(undefined);
  //     setSelectedStatus(undefined);
  //     setComment("");
  //     onStatusChanged?.();
  //   },
  //   onError: () => toast.error("Failed to update status"),
  // });
const mutation = useMutation({
  mutationFn: ({
    newStatus,
    assignedToId,
    approverId,
    comment,
  }: {
    newStatus: TicketStatus;
    assignedToId?: string;
    approverId?: string;
    comment?: string;
  }) =>
    updateTicketStatus(ticketId, newStatus, assignedToId, approverId, comment),

  onSuccess: () => {
    toast.success("Ticket status updated");
    setOpen(false);
    setSelectedUserId(undefined);
    setSelectedStatus(undefined);
    setComment("");
    onStatusChanged?.();
  },
  onError: () => toast.error("Failed to update status"),
});

  const { data, refetch: fetchUsers } = useQuery({
    queryKey: ["users"],
    queryFn: listAllUsers,
    enabled: false,
  });

  useEffect(() => {
    if (
      ["PENDING_APPROVAL", "REASSIGNED", "REOPENED"].includes(selectedStatus ?? "")
    ) {
      fetchUsers();
    }
  }, [selectedStatus, fetchUsers]);


  const getFilteredStatuses = (): TicketStatus[] => {
    return transitions[currentStatus as TicketStatus] ?? ALL_STATUSES;
  };

  const isApproval = selectedStatus === "PENDING_APPROVAL";
  const isAssignment = ["REASSIGNED", "REOPENED"].includes(selectedStatus ?? "");
  const requiresComment =
  selectedStatus !== undefined &&
  STATUSES_REQUIRING_COMMENT.includes(selectedStatus);


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Update Ticket Status</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          {getFilteredStatuses().map((status) => (
            <div
              key={status}
              className={`flex items-center justify-between border p-2 rounded hover:bg-gray-50 transition ${
                selectedStatus === status ? "bg-gray-100" : ""
              }`}
            >
              <p className="text-sm font-medium text-gray-900">
                {status.replaceAll("_", " ")}
              </p>
              <Button
                size="sm"
                onClick={() => setSelectedStatus(status)}
                disabled={mutation.isPending || status === currentStatus}
              >
                {status === currentStatus ? "Current" : "Select"}
              </Button>
            </div>
          ))}
        </div>

        {/* Show comment field if status needs it */}
        {requiresComment && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-1">
              Comment <span className="text-red-500">*</span>
            </p>
            <Textarea
              placeholder="Provide reason for this action"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>
        )}

        {(isApproval || isAssignment) && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Select User</p>
            <Select onValueChange={(value) => setSelectedUserId(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Choose a user" />
              </SelectTrigger>
              <SelectContent>
                {data?.users?.map((user: any) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              className="w-full mt-4"
              disabled={
                !selectedUserId ||
                mutation.isPending ||
                (requiresComment && comment.trim() === "")
              }
              onClick={() =>
                mutation.mutate({
                  newStatus: selectedStatus!,
                  assignedToId: isAssignment ? selectedUserId : undefined,
                  approverId: isApproval ? selectedUserId : undefined,
                  comment: comment.trim(),
                })
              }
            >
              Confirm Status Update
            </Button>
          </div>
        )}

        {!isApproval &&
          !isAssignment &&
          selectedStatus &&
          selectedStatus !== currentStatus && (
            <Button
              className="w-full mt-4"
              disabled={
                mutation.isPending || (requiresComment && comment.trim() === "")
              }
              onClick={() =>
                mutation.mutate({
                  newStatus: selectedStatus!,
                  assignedToId: isAssignment ? selectedUserId : undefined,
                  approverId: isApproval ? selectedUserId : undefined,
                  comment: comment.trim(),
              })

              }
            >
              Confirm Status Update
            </Button>
          )}
      </DialogContent>
    </Dialog>
  );
}