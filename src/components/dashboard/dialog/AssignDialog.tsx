"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery, useMutation } from "@tanstack/react-query";
import { assignTicket } from "@/lib/api/route";
import { useState } from "react";
import { toast } from "sonner";
import { listAllUsers } from "@/lib/api/route";

export interface User {
  id: string;
  name: string;
  email: string;
}

interface AssignDialogProps {
  ticketId: string;
  trigger?: React.ReactNode;
  onAssigned?: () => void;
}

export default function AssignDialog({ ticketId, trigger, onAssigned }: AssignDialogProps) {
  const [open, setOpen] = useState(false);

  const { data, isLoading: isUsersLoading } = useQuery({
    queryKey: ["users"],
    queryFn: listAllUsers,
  });

  const mutation = useMutation({
    mutationFn: ({ assignedToId }: { assignedToId: string }) =>
      assignTicket(ticketId, assignedToId),
    onSuccess: () => {
      toast.success("Ticket assigned successfully");
      setOpen(false);
      onAssigned?.();
    },
    onError: () => toast.error("Failed to assign ticket"),
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Ticket</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {isUsersLoading ? (
            <p>Loading users...</p>
          ) : (
            data?.users?.map((user: User) => (
              <div
                key={user.id}
                className="flex items-center justify-between border p-2 rounded hover:bg-gray-50 transition"
              >
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => mutation.mutate({ assignedToId: user.id })}
                  disabled={mutation.isPending}
                >
                  Assign
                </Button>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
