"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getTicket } from "@/lib/api/route";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ArrowLeftIcon, PaperclipIcon, MessageSquareTextIcon } from "lucide-react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Ticket } from "@/lib/api/types/ticket";
import AssignDialog from "@/components/dashboard/dialog/AssignDialog";
import StatusDialog from "@/components/dashboard/dialog/StatusDialog";
import TicketActivityTimeline from "@/components/dashboard/ticket/TicketActivityTimeline";
import TicketCommentBox from "@/components/dashboard/ticket/TicketCommentBox";
import { getStyle } from "@/components/badgeStyles";


interface Attachment {
  name: string;
  size: number;
  mimeType: string;
  data: { [key: number]: number }; // binary object
}

// function createBlobUrl(attachment: Attachment): string {
//   const byteArray = Object.values(attachment.data);
//   const uint8Array = new Uint8Array(byteArray);
//   const blob = new Blob([uint8Array], { type: attachment.mimeType });
//   return URL.createObjectURL(blob);
// }


function createBlobUrl(attachment: {
  data: { [key: number]: number };
  mimeType: string;
}): string {
  const byteArray = Object.values(attachment.data);
  const uint8Array = new Uint8Array(byteArray);
  const blob = new Blob([uint8Array], { type: attachment.mimeType });
  return URL.createObjectURL(blob);
}



export default function TicketDetailWithComments() {
  const params = useParams();
  const id = Array.isArray(params?.id) ? params.id[0] : params?.id;
  const router = useRouter();
  const [isAttachmentDialogOpen, setIsAttachmentDialogOpen] = useState(false);
  const [activityRefreshCounter, setActivityRefreshCounter] = useState(0);
  const [viewedAttachmentUrl, setViewedAttachmentUrl] = useState<string | null>(null);
  const [viewedAttachmentMime, setViewedAttachmentMime] = useState<string | null>(null);




  if (!id) {
    return <div>No ticket ID provided.</div>;
  }

  const { data: ticket, isLoading, isError,refetch } = useQuery<Ticket>({
    queryKey: ["ticket", id],
    queryFn: () => getTicket(id),
  });


  if (isLoading) return <div>Loading ticket...</div>;
  if (isError || !ticket) return <div>Error loading ticket details.</div>;

  return (
    <div className="flex flex-1 h-full overflow-hidden">
      {/* Left Side - Ticket Details */}
      <div className="w-3/4 p-4 overflow-y-auto">
        <Card className="h-full w-full ">
          <CardHeader className="flex flex-row items-center gap-4 justify-between">
            <div className="flex flex-row items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeftIcon className="h-4 w-4" />
            </Button>
            <CardTitle className="text-2xl font-bold">Ticket Details</CardTitle>
            <span className="bg-indigo-100 text-center text-indigo-800 px-2.5 py-0.5 rounded-full text-xs font-medium whitespace-nowrap flex-shrink-0 max-w-24">
              {ticket.code || "TICKET"}
            </span>
            </div>
            <div className="flex gap-4 w-full sm:w-auto">
                    <StatusDialog
                      ticketId={ticket.id}
                      currentStatus={ticket.status}
                      onStatusChanged={() => {
                        refetch();
                        setActivityRefreshCounter((prev) => prev + 1); 
                      }}
                      trigger={
                        <Button variant="outline">
                          Status
                        </Button>
                      }
                    />
                  {/* <AssignDialog
                      ticketId={id}
                      onAssigned={() => {
                        refetch(); 
                        setActivityRefreshCounter((prev) => prev + 1);
                      }}
                      trigger={<Button>Assign</Button>}
                    /> */}
            </div>
          </CardHeader>
          <CardContent className="space-y-6 ">
            <div className="max-w-6xl mx-auto space-y-6 ">
              {/* Header Section */}
              <div className="flex flex-col sm:flex-row justify-between items-start p-4 max-w-2xl ">
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-col xs:flex-row xs:items-center gap-3">
                    <h1 className="text-2xl font-semibold text-gray-900 tracking-tight truncate">
                      {ticket.title || "Untitled Ticket"}
                    </h1>
                  </div>
                </div>
              </div>

              {/* Main Content Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6  ">
                {/* Left Column (Main Content) */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Description Card */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-5 py-2 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                      <h2 className="text-base font-semibold text-gray-900">Description</h2>
                     
                     {/* {ticket.attachments?.length > 0 && (
                            <Dialog open={isAttachmentDialogOpen} onOpenChange={setIsAttachmentDialogOpen}>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
                                  <PaperclipIcon className="h-4 w-4 mr-2" />
                                  {ticket.attachments?.length ?? 0} attachment
                                  {(ticket.attachments?.length ?? 0) !== 1 ? 's' : ''}
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[600px]">
                                <DialogHeader>
                                  <DialogTitle>Attachments</DialogTitle>
                                </DialogHeader>

                                
                                <div className="grid gap-4 py-4">
                                  {ticket.attachments?.map((attachment, index) => {
                                    const blobUrl = createBlobUrl(attachment);

                                    return (
                                      <div key={index} className="flex flex-col gap-2 p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                          <PaperclipIcon className="h-5 w-5 text-gray-500" />
                                          <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                                            <p className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(2)} KB</p>
                                          </div>
                                          <div className="flex gap-2">
                                            <Button
                                              variant="secondary"
                                              size="sm"
                                              onClick={() => {
                                                setViewedAttachmentUrl(blobUrl);
                                                setViewedAttachmentMime(attachment.mimeType);
                                              }}
                                            >
                                              View
                                            </Button>
                                            <a href={blobUrl} download={attachment.name} target="_blank" rel="noopener noreferrer">
                                              <Button variant="outline" size="sm">Download</Button>
                                            </a>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>

                                {viewedAttachmentUrl && (
                                  <div className="mt-6 border-t pt-4">
                                    <h4 className="text-sm font-semibold mb-2">Preview</h4>
                                    {viewedAttachmentMime?.startsWith("image/") && (
                                      <img
                                        src={viewedAttachmentUrl}
                                        alt="Attachment Preview"
                                        className="max-h-96 w-auto rounded shadow"
                                      />
                                    )}
                                    {viewedAttachmentMime === "application/pdf" && (
                                      <iframe
                                        src={viewedAttachmentUrl}
                                        title="PDF Preview"
                                        className="w-full h-[500px] rounded border"
                                      />
                                    )}
                                  </div>
                                )}
                              </DialogContent>                   
                            </Dialog>
                      )} */}

                      {(ticket.attachments?.length ?? 0) > 0 && (
  <Dialog open={isAttachmentDialogOpen} onOpenChange={setIsAttachmentDialogOpen}>
    <DialogTrigger asChild>
      <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-700">
        <PaperclipIcon className="h-4 w-4 mr-2" />
        {(ticket.attachments?.length ?? 0)} attachment
        {(ticket.attachments?.length ?? 0) !== 1 ? 's' : ''}
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[600px]">
      <DialogHeader>
        <DialogTitle>Attachments</DialogTitle>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        {(ticket.attachments as Attachment[] | undefined)?.map(
          (attachment: Attachment, index: number) => {
            const blobUrl = createBlobUrl(attachment);
            return (
              <div key={index} className="flex flex-col gap-2 p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <PaperclipIcon className="h-5 w-5 text-gray-500" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{attachment.name}</p>
                    <p className="text-xs text-gray-500">{(attachment.size / 1024).toFixed(2)} KB</p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setViewedAttachmentUrl(blobUrl);
                        setViewedAttachmentMime(attachment.mimeType);
                      }}
                    >
                      View
                    </Button>
                    <a
                      href={blobUrl}
                      download={attachment.name}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm">Download</Button>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {viewedAttachmentUrl && (
        <div className="mt-6 border-t pt-4">
          <h4 className="text-sm font-semibold mb-2">Preview</h4>
          {viewedAttachmentMime?.startsWith("image/") && (
            <img src={viewedAttachmentUrl} alt="Attachment Preview" className="max-h-96 w-auto rounded shadow" />
          )}
          {viewedAttachmentMime === "application/pdf" && (
            <iframe
              src={viewedAttachmentUrl}
              title="PDF Preview"
              className="w-full h-[500px] rounded border"
            />
          )}
        </div>
      )}
    </DialogContent>
  </Dialog>
)}



                    </div>
                    <div className="p-5 h-96 overflow-y-auto">
                      {ticket.description ? (
                        <div className="prose prose-sm max-w-none text-gray-700">
                          <p className="whitespace-pre-wrap">{ticket.description}</p>
                        </div>
                      ) : (
                        <p className="text-gray-400 italic">No description provided</p>
                      )}
                    </div>
                  </div>
                  {/* Comment Form */}
                  <TicketCommentBox ticketId={ticket.id} />
                </div>   
                {/* Right Column (Details) */}
                <div className="space-y-6">
                  {/* Details Card */}
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-200 bg-gray-50">
                      <h2 className="text-base font-semibold text-gray-900">Details</h2>
                    </div>
                    <div className="divide-y divide-gray-200">
                      <div className="px-5 py-3.5">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Status</p>
                        <p className="text-sm font-medium text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStyle("status", ticket.status)}`}>
                            {ticket.status || "Not specified"}
                          </span>
                        </p>
                      </div>
                      <div className="px-5 py-3.5">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Priority</p>
                        <p className="text-sm font-medium text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStyle("priority", ticket.priority)}`}>
                            {ticket.priority?.toLocaleUpperCase() || "Not specified"}
                          </span>
                        </p>
                      </div>
                      <div className="px-5 py-3.5">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Department</p>
                        <p className="text-sm font-medium text-gray-900">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStyle("priority", ticket.priority)}`}>
                            {ticket.department?.name || "Not specified"}
                          </span>
                          {/* {ticket.department?.name || <span className="text-gray-400">Not specified</span>} */}
                        </p>
                      </div>
                      {/* <div className="px-5 py-3.5">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Assigned To</p>
                        <p className="text-sm font-medium text-gray-900">
                          {ticket.assignedTo?.name || (
                            <span className="text-gray-400">Unassigned</span>
                          )}
                        </p>
                      </div> */}
                      <div className="px-5 py-3.5">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">
                          Assigned To
                        </p>
                        {ticket.assignedTo ? (
                          <div className="text-sm font-medium text-gray-900">
                            <p>{ticket.assignedTo.name}</p>
                            <p className="text-xs text-gray-500">{ticket.assignedTo.email}</p>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-400">Unassigned</p>
                        )}
                      </div>

                      <div className="px-5 py-3.5">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Created By</p>
                        <div className="flex items-center justify-between">
                            <div className="flex flex-col justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {ticket.createdBy?.name || "N/A"}
                          </p>
                           <span className="text-xs font-medium text-gray-500">
                                {ticket.createdBy?.email || "N/A"}
                            </span>
                            </div>
                          <span className="text-xs text-gray-500 font-normal">
                            {ticket.createdAt && new Date(ticket.createdAt).toLocaleDateString("en-GB")}
                          </span>
                         
                        </div>
                      </div>
                      <div className="px-5 py-3.5">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Last Updated</p>
                        <p className="text-sm font-medium text-gray-900">
                          {ticket.createdAt ? (
                            new Date(ticket.createdAt).toLocaleString("en-GB")
                          ) : (
                            <span className="text-gray-400">Never</span>
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>     
      {/* Right Side - Activity */}
      <div className="w-1/4 flex flex-col h-full  p-4 overflow-y-auto">
        <Card className="h-full">
          <CardHeader>
            <CardTitle className="text-center">
              <div className="pb-4">
                <h3 className="text-lg font-semibold">Activity Timeline</h3>
                <p className="text-sm text-muted-foreground">
                  Recent actions on this ticket
                </p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="max-h-[45rem]">
            {/* <TicketActivityTimeline ticketId={ticket.id} /> */}
            <TicketActivityTimeline ticketId={ticket.id} refetchSignal={activityRefreshCounter} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

