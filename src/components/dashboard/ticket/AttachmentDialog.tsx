// AttachmentDialog.tsx
"use client";

import React, { useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AttachmentDialogProps {
  open: boolean;
  onClose: () => void;
  ticketId: string;
}

export default function AttachmentDialog({ open, onClose, ticketId }: AttachmentDialogProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleUpload = () => {
    const file = fileRef.current?.files?.[0];
    if (file) {
      console.log("[📎 Uploading Attachment]", file.name);
      // Handle actual upload here
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Attach File</DialogTitle>
        </DialogHeader>
        <input ref={fileRef} type="file" className="mb-4" />
        <div className="flex justify-end gap-2">
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button onClick={handleUpload}>Upload</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
