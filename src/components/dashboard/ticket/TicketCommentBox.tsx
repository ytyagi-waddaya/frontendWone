// 'use client';

// import { useState, useEffect } from 'react';
// import { Textarea } from '@/components/ui/textarea';
// import { Button } from '@/components/ui/button';
// import { MessageSquareTextIcon } from 'lucide-react';
// import { postTicketComment } from '@/lib/api/route'; // adjust path as needed
// import { useMutation, useQueryClient } from '@tanstack/react-query';

// interface TicketCommentBoxProps {
//   ticketId: string;
// }

// export default function TicketCommentBox({ ticketId }: TicketCommentBoxProps) {
//   const [comment, setComment] = useState('');
//   const queryClient = useQueryClient();

//   const { mutate: submitComment, isPending } = useMutation({
//     mutationFn: () => {
//       console.log('[📨 Submitting Comment]', { ticketId, comment });
//       return postTicketComment(ticketId, { comment });
//     },
//     onSuccess: (data) => {
//       console.log('[✅ Comment Posted Successfully]', data);
//       setComment('');
//       queryClient.invalidateQueries({ queryKey: ['ticket-comments', ticketId] });
//       queryClient.invalidateQueries({ queryKey: ['ticket-activity', ticketId] });
//       console.log('[🔄 Invalidated Queries]');
//     },
//     onError: (error) => {
//       console.error('[❌ Comment Post Failed]', error);
//     }
//   });

//   const handleCommentSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!comment.trim()) {
//       console.warn('[⚠️ Empty Comment Blocked]');
//       return;
//     }
//     submitComment();
//   };

//   useEffect(() => {
//     console.log('[🛠️ TicketCommentBox Mounted] Ticket ID:', ticketId);
//   }, [ticketId]);

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//       <div className="px-4 py-2 border-b border-gray-200 bg-gray-50">
//         <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
//           <MessageSquareTextIcon className="h-3 w-3" />
//           Add Comment
//         </h2>
//       </div>

//       <form onSubmit={handleCommentSubmit} className="p-4">
//         <div className="relative">
//           <Textarea
//             value={comment}
//             onChange={(e) => {
//               setComment(e.target.value);
//               console.log('[✍️ Comment Changed]', e.target.value);
//             }}
//             placeholder="Write your comment..."
//             className="min-h-[80px] max-h-[100px] text-sm overflow-y-auto transition-all"
//             style={{ resize: 'none' }}
//           />
//         </div>
//         <div className="flex justify-end mt-2">
//           <Button
//             type="submit"
//             size="sm"
//             disabled={!comment.trim() || isPending}
//             className="disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isPending ? 'Posting...' : 'Post'}
//           </Button>
//         </div>
//       </form>
//     </div>
//   );
// }

// TicketCommentBox.tsx
// "use client";

// import { useState, useEffect } from "react";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { MessageSquareTextIcon, PaperclipIcon } from "lucide-react";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { postTicketComment } from "@/lib/api/route";
// import MentionDropdown from "@/components/dashboard/ticket/MentionDropdown";
// import AttachmentDialog from "@/components/dashboard/ticket/AttachmentDialog";

// interface TicketCommentBoxProps {
//   ticketId: string;
// }

// export default function TicketCommentBox({ ticketId }: TicketCommentBoxProps) {
//   const [comment, setComment] = useState("");
//   const [showMentions, setShowMentions] = useState(false);
//   const [mentionQuery, setMentionQuery] = useState("");
//   const [cursorPosition, setCursorPosition] = useState<number | null>(null);
//   const [showAttachmentDialog, setShowAttachmentDialog] = useState(false);

//   const queryClient = useQueryClient();

//   const { mutate: submitComment, isPending } = useMutation({
//     mutationFn: () => postTicketComment(ticketId, { comment }),
//     onSuccess: () => {
//       setComment("");
//       queryClient.invalidateQueries({ queryKey: ["ticket-comments", ticketId] });
//       queryClient.invalidateQueries({ queryKey: ["ticket-activity", ticketId] });
//     },
//     onError: (error) => console.error("[❌ Comment Post Failed]", error),
//   });

//   const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
//     const val = e.target.value;
//     setComment(val);
//     const pos = e.target.selectionStart;
//     const lastAt = val.lastIndexOf("@", pos - 1);
//     const spaceAfter = val.indexOf(" ", lastAt);
//     const isMention = lastAt !== -1 && (spaceAfter === -1 || spaceAfter > pos);

//     if (isMention) {
//       setMentionQuery(val.slice(lastAt + 1, pos));
//       setShowMentions(true);
//     } else {
//       setShowMentions(false);
//     }
//     setCursorPosition(pos);
//   };

//   const handleMentionSelect = (name: string) => {
//     if (cursorPosition !== null) {
//       const before = comment.slice(0, comment.lastIndexOf("@", cursorPosition));
//       const after = comment.slice(cursorPosition);
//       setComment(`${before}@${name} ${after}`);
//       setShowMentions(false);
//       setMentionQuery("");
//     }
//   };

//   const handleCommentSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!comment.trim()) return;
//     submitComment();
//   };

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//       <div className="px-4 py-2 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
//         <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
//           <MessageSquareTextIcon className="h-3 w-3" /> Add Comment
//         </h2>
//         <button
//           type="button"
//           onClick={() => setShowAttachmentDialog(true)}
//           className="text-gray-500 hover:text-gray-800"
//         >
//           <PaperclipIcon className="h-4 w-4" />
//         </button>
//       </div>

//       <form onSubmit={handleCommentSubmit} className="p-4 relative">
//         <Textarea
//           value={comment}
//           onChange={handleCommentChange}
//           placeholder="Write your comment..."
//           className="min-h-[80px] max-h-[100px] text-sm overflow-y-auto"
//           style={{ resize: "none" }}
//         />
//         <MentionDropdown
//           show={showMentions}
//           query={mentionQuery}
//           onSelect={handleMentionSelect}
//         />
//         <div className="flex justify-end mt-2">
//           <Button
//             type="submit"
//             size="sm"
//             disabled={!comment.trim() || isPending}
//             className="disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {isPending ? "Posting..." : "Post"}
//           </Button>
//         </div>
//       </form>

//       <AttachmentDialog
//         open={showAttachmentDialog}
//         onClose={() => setShowAttachmentDialog(false)}
//         ticketId={ticketId}
//       />
//     </div>
//   );
// }


'use client';

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { MessageSquareTextIcon, PaperclipIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postTicketComment, listAllUsers } from "@/lib/api/route";
import MentionDropdown from "@/components/dashboard/ticket/MentionDropdown";
import AttachmentDialog from "@/components/dashboard/ticket/AttachmentDialog";

interface TicketCommentBoxProps {
  ticketId: string;
}

export default function TicketCommentBox({ ticketId }: TicketCommentBoxProps) {
  const [comment, setComment] = useState("");
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [cursorPosition, setCursorPosition] = useState<number | null>(null);
  const [showAttachmentDialog, setShowAttachmentDialog] = useState(false);
  const [allUsers, setAllUsers] = useState<{ id: string; name: string }[]>([]);

  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await listAllUsers();
        const userList = Array.isArray(res) ? res : res.users || [];
        setAllUsers(userList);
      } catch (e) {
        console.error("Failed to load users:", e);
      }
    };
    fetchUsers();
  }, []);

  const extractMentionedIds = () => {
    const mentionedNames = [...comment.matchAll(/@(\w+)/g)].map((m) => m[1]);
    const mentionedIds = allUsers
      .filter((u) => mentionedNames.includes(u.name))
      .map((u) => u.id);
    return mentionedIds;
  };

  const { mutate: submitComment, isPending } = useMutation({
    mutationFn: () =>
      postTicketComment(ticketId, {
        comment,
         mentions: extractMentionedIds(),
      }),
    onSuccess: () => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["ticket-comments", ticketId] });
      queryClient.invalidateQueries({ queryKey: ["ticket-activity", ticketId] });
    },
    onError: (error) => console.error("[❌ Comment Post Failed]", error),
  });

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setComment(val);
    const pos = e.target.selectionStart;
    const lastAt = val.lastIndexOf("@", pos - 1);
    const spaceAfter = val.indexOf(" ", lastAt);
    const isMention = lastAt !== -1 && (spaceAfter === -1 || spaceAfter > pos);

    if (isMention) {
      setMentionQuery(val.slice(lastAt + 1, pos));
      setShowMentions(true);
    } else {
      setShowMentions(false);
    }
    setCursorPosition(pos);
  };

  const handleMentionSelect = (name: string) => {
    if (cursorPosition !== null) {
      const before = comment.slice(0, comment.lastIndexOf("@", cursorPosition));
      const after = comment.slice(cursorPosition);
      setComment(`${before}@${name} ${after}`);
      setShowMentions(false);
      setMentionQuery("");
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;
    submitComment();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-4 py-2 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <MessageSquareTextIcon className="h-3 w-3" /> Add Comment
        </h2>
        <button
          type="button"
          onClick={() => setShowAttachmentDialog(true)}
          className="text-gray-500 hover:text-gray-800"
        >
          <PaperclipIcon className="h-4 w-4" />
        </button>
      </div>

      <form onSubmit={handleCommentSubmit} className="p-4 relative">
        <Textarea
          value={comment}
          onChange={handleCommentChange}
          placeholder="Write your comment..."
          className="min-h-[80px] max-h-[100px] text-sm overflow-y-auto"
          style={{ resize: "none" }}
        />
        <MentionDropdown
          show={showMentions}
          query={mentionQuery}
          onSelect={handleMentionSelect}
        />
        <div className="flex justify-end mt-3">
          <Button
            type="submit"
            size="sm"
            disabled={!comment.trim() || isPending}
            className="disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Posting..." : "Post"}
          </Button>
        </div>
      </form>

      <AttachmentDialog
        open={showAttachmentDialog}
        onClose={() => setShowAttachmentDialog(false)}
        ticketId={ticketId}
      />
    </div>
  );
}
