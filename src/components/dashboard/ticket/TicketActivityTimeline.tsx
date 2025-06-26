// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { apiClient } from "@/lib/api/client";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { format } from "date-fns";
// import {
//   MessageSquare,
//   RefreshCw,
//   UserRoundCog,
//   Activity,
//   AlertCircle,
//   History,
//   Clock,
//   CheckCircle2,
//   XCircle,
//   Plus
// } from "lucide-react";
// import { JSX, useEffect } from "react";
// import { getStyle } from "@/components/badgeStyles";
// import { toast } from "sonner";

// enum WorkflowAction {
//   CREATED = "CREATED",
//   STATUS_CHANGE = "STATUS_CHANGE",
//   ASSIGNMENT = "ASSIGNMENT",
//   APPROVAL = "APPROVAL",
//   REJECTION = "REJECTION",
//   COMMENT = "COMMENT"
// }

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   avatarUrl?: string | null;
// }

// interface ActivityItem {
//   id: string;
//   user: User | null;
//   action: WorkflowAction;
//   comment?: string | null;
//   status?: string | null;
//   createdAt: string;
//   metadata?: Record<string, unknown> | null;
// }

// interface TicketActivityTimelineProps {
//   ticketId: string;
//   refetchSignal?: number;
//   className?: string;
//   maxHeight?: string;
// }

// const DEFAULT_MAX_HEIGHT = "h-[calc(100%-1px)]";

// const actionIcons: Record<WorkflowAction, JSX.Element> = {
//   [WorkflowAction.COMMENT]: <MessageSquare className="h-3.5 w-3.5" />,
//   [WorkflowAction.STATUS_CHANGE]: <RefreshCw className="h-3.5 w-3.5" />,
//   [WorkflowAction.ASSIGNMENT]: <UserRoundCog className="h-3.5 w-3.5" />,
//   [WorkflowAction.CREATED]: <Plus className="h-3.5 w-3.5" />,
//   [WorkflowAction.APPROVAL]: <CheckCircle2 className="h-3.5 w-3.5" />,
//   [WorkflowAction.REJECTION]: <XCircle className="h-3.5 w-3.5" />,
// };

// const actionLabels: Record<WorkflowAction, string> = {
//   [WorkflowAction.COMMENT]: "commented",
//   [WorkflowAction.STATUS_CHANGE]: "changed status",
//   [WorkflowAction.ASSIGNMENT]: "reassigned",
//   [WorkflowAction.CREATED]: "created ticket",
//   [WorkflowAction.APPROVAL]: "approved",
//   [WorkflowAction.REJECTION]: "rejected",
// };

// const actionVariant: Record<WorkflowAction, "default" | "secondary" | "destructive" | "outline"> = {
//   [WorkflowAction.COMMENT]: "secondary",
//   [WorkflowAction.STATUS_CHANGE]: "outline",
//   [WorkflowAction.ASSIGNMENT]: "default",
//   [WorkflowAction.CREATED]: "outline",
//   [WorkflowAction.APPROVAL]: "default",
//   [WorkflowAction.REJECTION]: "destructive",
// };

// const actionClasses: Record<WorkflowAction, string> = {
//   [WorkflowAction.COMMENT]: "text-blue-600 bg-blue-50 hover:bg-blue-100",
//   [WorkflowAction.STATUS_CHANGE]: "text-purple-600 bg-purple-50 hover:bg-purple-100",
//   [WorkflowAction.ASSIGNMENT]: "text-amber-600 bg-amber-50 hover:bg-amber-100",
//   [WorkflowAction.CREATED]: "text-green-600 bg-green-50 hover:bg-green-100",
//   [WorkflowAction.APPROVAL]: "text-green-600 bg-green-50 hover:bg-green-100",
//   [WorkflowAction.REJECTION]: "text-red-600 bg-red-50 hover:bg-red-100",
// };

// export default function TicketActivityTimeline({
//   ticketId,
//   refetchSignal,
//   className = "",
//   maxHeight = DEFAULT_MAX_HEIGHT,
// }: TicketActivityTimelineProps) {
//   const { data, isLoading, error, refetch } = useQuery<ActivityItem[]>({
//     queryKey: ["ticket-activity", ticketId],
//     queryFn: async () => {
//       try {
//         const response = await apiClient.get(`/tickets/${ticketId}/history`);
//         console.log("History:",response);
        

//         if (!response?.data?.history) {
//           throw new Error("Invalid response structure");
//         }

//         return response.data.history.map((item: unknown) => {
//           const activity = item as Record<string, unknown>;

//           return {
//             id: String(activity.id),
//             user: activity.user
//               ? {
//                   id: String((activity.user as any).id),
//                   name: String((activity.user as any).name),
//                   email: String((activity.user as any).email),
//                   avatarUrl: (activity.user as any).avatarUrl ?? null,
//                 }
//               : null,
//             action: String(activity.action).toUpperCase() as WorkflowAction,
//             comment: activity.comment ? String(activity.comment) : null,
//             status: activity.status ? String(activity.status) : null,
//             createdAt: String(activity.createdAt),
//             metadata: activity.metadata ?? null,
//           };
//         });
//       } catch (err) {
//         const errorMessage =
//           err instanceof Error ? err.message : "Failed to fetch ticket history";
//         toast.error("Error", {
//           description: errorMessage,
//         });
//         throw new Error(errorMessage);
//       }
//     },
//     refetchOnWindowFocus: false,
//     retry: 2,
//     staleTime: 300000, // 5 minutes
//   });

//   useEffect(() => {
//     if (refetchSignal !== undefined) {
//       refetch().catch(() => {
//         toast.error("Refresh failed", {
//           description: "Could not update ticket history",
//         });
//       });
//     }
//   }, [refetchSignal, refetch]);

//   const sortedActivities = data ?? [];

//   if (isLoading) {
//     return (
//       <div className={`space-y-4 ${className}`} data-testid="activity-loading">
//         {Array.from({ length: 3 }).map((_, index) => (
//           <div key={`skeleton-${index}`} className="flex gap-3">
//             <Skeleton className="h-8 w-8 rounded-full" />
//             <div className="flex-1 space-y-2">
//               <Skeleton className="h-4 w-[120px]" />
//               <Skeleton className="h-3 w-[200px]" />
//               <Skeleton className="h-3 w-[80px]" />
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div
//         className={`flex flex-col items-center justify-center py-8 gap-2 text-center ${className}`}
//       >
//         <AlertCircle className="h-5 w-5 text-destructive" />
//         <p className="text-sm font-medium text-destructive">
//           Failed to load activity
//         </p>
//         <p className="text-xs text-muted-foreground">
//           Couldn't retrieve the ticket history
//         </p>
//       </div>
//     );
//   }

//   return (
//     <ScrollArea
//       className={`${maxHeight} ${className}`}
//       data-testid="activity-scroll-area"
//     >
//       <div className="relative pr-3">
//         <div
//           className="absolute left-4 top-0 h-full w-px bg-border"
//           aria-hidden="true"
//         />

//         <div className="space-y-6">
//           {sortedActivities.length > 0 ? (
//             sortedActivities.map((activity) => (
//               <div key={activity.id} className="relative flex gap-3">
//                 <div className="relative z-10 flex flex-col items-center">
//                   <Avatar className="h-8 w-8 border-2 border-background">
//                     <AvatarImage
//                       src={activity.user?.avatarUrl || undefined}
//                       alt={
//                         activity.user?.name
//                           ? `${activity.user.name}'s avatar`
//                           : "System avatar"
//                       }
//                     />
//                     <AvatarFallback className="text-xs font-medium bg-muted">
//                       {activity.user?.name?.charAt(0).toUpperCase() || "S"}
//                     </AvatarFallback>
//                   </Avatar>
//                 </div>

//                 <div className="flex-1 space-y-1.5 pb-6">
//                   <div className="flex items-center gap-2">
//                     <span className="text-sm font-medium">
//                       {activity.user?.name || "System"}
//                     </span>
//                     <Badge
//                       variant={actionVariant[activity.action]}
//                       className={`flex items-center gap-1 ${actionClasses[activity.action]}`}
//                       aria-label={`Action: ${activity.action}`}
//                     >
//                       {actionIcons[activity.action] || (
//                         <Activity className="h-3.5 w-3.5" />
//                       )}
//                       {actionLabels[activity.action] ||
//                         activity.action.toLowerCase().replace("_", " ")}
//                     </Badge>
//                   </div>

//                   {activity.comment && (
//                     <div className="rounded-lg bg-muted/50 p-3 text-sm whitespace-pre-wrap break-words">
//                       {activity.comment}
//                     </div>
//                   )}

//                   {activity.status && (
//                     <Badge
//                       variant="outline"
//                       className={`mt-1 gap-1 ${getStyle("status", activity.status)}`}
//                       aria-label={`Status: ${activity.status}`}
//                     >
//                       <RefreshCw className="h-3 w-3" />
//                       Status: {activity.status.replace("_", " ")}
//                     </Badge>
//                   )}

//                   <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
//                     <Clock className="h-3 w-3" />
//                     {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
//                   </div>
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="flex flex-col items-center justify-center py-8 gap-2">
//               <History className="h-5 w-5 text-muted-foreground" />
//               <p className="text-sm font-medium text-muted-foreground">
//                 No activity recorded
//               </p>
//               <p className="text-xs text-muted-foreground">
//                 This ticket has no history yet
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </ScrollArea>
//   );
// }



// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { apiClient } from "@/lib/api/client";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { format, formatDistanceToNow } from "date-fns";
// import {
//   MessageSquare,
//   RefreshCw,
//   UserRoundCog,
//   Activity,
//   AlertCircle,
//   History,
//   Clock,
//   CheckCircle2,
//   XCircle,
//   Plus,
//   ChevronRight
// } from "lucide-react";
// import { JSX, useEffect } from "react";
// import { getStyle } from "@/components/badgeStyles";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";

// enum WorkflowAction {
//   CREATED = "CREATED",
//   STATUS_CHANGE = "STATUS_CHANGE",
//   ASSIGNMENT = "ASSIGNMENT",
//   APPROVAL = "APPROVAL",
//   REJECTION = "REJECTION",
//   COMMENT = "COMMENT"
// }

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   avatarUrl?: string | null;
// }

// interface ActivityItem {
//   id: string;
//   user: User | null;
//   action: WorkflowAction;
//   comment?: string | null;
//   status?: string | null;
//   createdAt: string;
//   metadata?: Record<string, unknown> | null;
// }

// interface TicketActivityTimelineProps {
//   ticketId: string;
//   refetchSignal?: number;
//   className?: string;
//   maxHeight?: string;
//   compact?: boolean;
// }

// const DEFAULT_MAX_HEIGHT = "h-[calc(100%-1px)]";

// const actionIcons: Record<WorkflowAction, JSX.Element> = {
//   [WorkflowAction.COMMENT]: <MessageSquare className="h-4 w-4" />,
//   [WorkflowAction.STATUS_CHANGE]: <RefreshCw className="h-4 w-4" />,
//   [WorkflowAction.ASSIGNMENT]: <UserRoundCog className="h-4 w-4" />,
//   [WorkflowAction.CREATED]: <Plus className="h-4 w-4" />,
//   [WorkflowAction.APPROVAL]: <CheckCircle2 className="h-4 w-4" />,
//   [WorkflowAction.REJECTION]: <XCircle className="h-4 w-4" />,
// };

// const actionLabels: Record<WorkflowAction, string> = {
//   [WorkflowAction.COMMENT]: "commented",
//   [WorkflowAction.STATUS_CHANGE]: "changed status",
//   [WorkflowAction.ASSIGNMENT]: "reassigned",
//   [WorkflowAction.CREATED]: "created ticket",
//   [WorkflowAction.APPROVAL]: "approved",
//   [WorkflowAction.REJECTION]: "rejected",
// };

// const actionColors: Record<WorkflowAction, string> = {
//   [WorkflowAction.COMMENT]: "text-blue-600 dark:text-blue-400",
//   [WorkflowAction.STATUS_CHANGE]: "text-purple-600 dark:text-purple-400",
//   [WorkflowAction.ASSIGNMENT]: "text-amber-600 dark:text-amber-400",
//   [WorkflowAction.CREATED]: "text-green-600 dark:text-green-400",
//   [WorkflowAction.APPROVAL]: "text-green-600 dark:text-green-400",
//   [WorkflowAction.REJECTION]: "text-red-600 dark:text-red-400",
// };

// const actionBgColors: Record<WorkflowAction, string> = {
//   [WorkflowAction.COMMENT]: "bg-blue-50 dark:bg-blue-900/30",
//   [WorkflowAction.STATUS_CHANGE]: "bg-purple-50 dark:bg-purple-900/30",
//   [WorkflowAction.ASSIGNMENT]: "bg-amber-50 dark:bg-amber-900/30",
//   [WorkflowAction.CREATED]: "bg-green-50 dark:bg-green-900/30",
//   [WorkflowAction.APPROVAL]: "bg-green-50 dark:bg-green-900/30",
//   [WorkflowAction.REJECTION]: "bg-red-50 dark:bg-red-900/30",
// };

// export default function TicketActivityTimeline({
//   ticketId,
//   refetchSignal,
//   className = "",
//   maxHeight = DEFAULT_MAX_HEIGHT,
//   compact = false,
// }: TicketActivityTimelineProps) {
//   const { data, isLoading, error, refetch } = useQuery<ActivityItem[]>({
//     queryKey: ["ticket-activity", ticketId],
//     queryFn: async () => {
//       try {
//         const response = await apiClient.get(`/tickets/${ticketId}/history`);
        
//         if (!response?.data?.history) {
//           throw new Error("Invalid response structure");
//         }

//         return response.data.history.map((item: unknown) => {
//           const activity = item as Record<string, unknown>;

//           return {
//             id: String(activity.id),
//             user: activity.user
//               ? {
//                   id: String((activity.user as any).id),
//                   name: String((activity.user as any).name),
//                   email: String((activity.user as any).email),
//                   avatarUrl: (activity.user as any).avatarUrl ?? null,
//                 }
//               : null,
//             action: String(activity.action).toUpperCase() as WorkflowAction,
//             comment: activity.comment ? String(activity.comment) : null,
//             status: activity.status ? String(activity.status) : null,
//             createdAt: String(activity.createdAt),
//             metadata: activity.metadata ?? null,
//           };
//         });
//       } catch (err) {
//         const errorMessage =
//           err instanceof Error ? err.message : "Failed to fetch ticket history";
//         toast.error("Error", {
//           description: errorMessage,
//         });
//         throw new Error(errorMessage);
//       }
//     },
//     refetchOnWindowFocus: false,
//     retry: 2,
//     staleTime: 300000, // 5 minutes
//   });

//   useEffect(() => {
//     if (refetchSignal !== undefined) {
//       refetch().catch(() => {
//         toast.error("Refresh failed", {
//           description: "Could not update ticket history",
//         });
//       });
//     }
//   }, [refetchSignal, refetch]);

//   const sortedActivities = data ?? [];

//   if (isLoading) {
//     return (
//       <div className={`space-y-4 ${className}`} data-testid="activity-loading">
//         {Array.from({ length: 3 }).map((_, index) => (
//           <div key={`skeleton-${index}`} className="flex gap-3">
//             <Skeleton className="h-9 w-9 rounded-full" />
//             <div className="flex-1 space-y-2">
//               <Skeleton className="h-4 w-[120px]" />
//               <Skeleton className="h-3 w-[200px]" />
//               <Skeleton className="h-3 w-[80px]" />
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div
//         className={`flex flex-col items-center justify-center py-8 gap-2 text-center ${className}`}
//       >
//         <AlertCircle className="h-5 w-5 text-destructive" />
//         <p className="text-sm font-medium text-destructive">
//           Failed to load activity
//         </p>
//         <p className="text-xs text-muted-foreground">
//           Couldn't retrieve the ticket history
//         </p>
//       </div>
//     );
//   }

//   return (
//     <ScrollArea
//       className={`${maxHeight} ${className}`}
//       data-testid="activity-scroll-area"
//     >
//       <div className="relative pr-3">
//         {/* Timeline line */}
//         <div
//           className="absolute left-5 top-0 h-full w-0.5 bg-gradient-to-b from-border/50 via-border/30 to-transparent"
//           aria-hidden="true"
//         />

//         <div className={cn("space-y-4", compact ? "space-y-3" : "space-y-6")}>
//           {sortedActivities.length > 0 ? (
//             sortedActivities.map((activity) => (
//               <div key={activity.id} className="relative flex gap-3 group">
//                 {/* Timeline dot */}
//                 <div className="absolute left-5 top-5 -ml-[3px] h-2 w-2 rounded-full bg-primary z-10" />
                
//                 <div className="relative z-10 flex flex-col items-center pl-1">
//                   <Avatar className={cn(
//                     "border-2 border-background",
//                     compact ? "h-7 w-7" : "h-9 w-9"
//                   )}>
//                     <AvatarImage
//                       src={activity.user?.avatarUrl || undefined}
//                       alt={
//                         activity.user?.name
//                           ? `${activity.user.name}'s avatar`
//                           : "System avatar"
//                       }
//                     />
//                     <AvatarFallback className={cn(
//                       "text-xs font-medium bg-muted",
//                       compact ? "text-[0.65rem]" : "text-xs"
//                     )}>
//                       {activity.user?.name?.charAt(0).toUpperCase() || "S"}
//                     </AvatarFallback>
//                   </Avatar>
//                 </div>

//                 <div className={cn(
//                   "flex-1 pb-4",
//                   compact ? "space-y-1 pb-3" : "space-y-1.5 pb-6"
//                 )}>
//                   <div className="flex items-center gap-2">
//                     <span className={cn(
//                       "font-medium",
//                       compact ? "text-sm" : "text-sm"
//                     )}>
//                       {activity.user?.name || "System"}
//                     </span>
//                     <span className={cn(
//                       "flex items-center gap-1 px-2 py-0.5 rounded-full text-xs",
//                       actionColors[activity.action],
//                       actionBgColors[activity.action],
//                       compact ? "text-xs" : "text-sm"
//                     )}>
//                       {actionIcons[activity.action] || (
//                         <Activity className="h-3.5 w-3.5" />
//                       )}
//                       {actionLabels[activity.action] ||
//                         activity.action.toLowerCase().replace("_", " ")}
//                     </span>
//                     <span className="text-xs text-muted-foreground ml-auto">
//                       {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
//                     </span>
//                   </div>

//                   {activity.comment && (
//                     <div className={cn(
//                       "rounded-lg bg-muted/50 p-3 whitespace-pre-wrap break-words",
//                       compact ? "text-sm mt-1" : "text-sm mt-1.5"
//                     )}>
//                       {activity.comment}
//                     </div>
//                   )}

//                   {activity.status && (
//                     <div className="flex items-center gap-2 mt-1.5">
//                       <div className={cn(
//                         "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs border",
//                         getStyle("status", activity.status),
//                         compact ? "text-xs" : "text-sm"
//                       )}>
//                         <RefreshCw className="h-3 w-3" />
//                         {activity.status.replace("_", " ")}
//                       </div>
//                       <ChevronRight className="h-3 w-3 text-muted-foreground" />
//                       <span className="text-xs text-muted-foreground">
//                         {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
//                       </span>
//                     </div>
//                   )}

//                   {!activity.status && !compact && (
//                     <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
//                       <Clock className="h-3 w-3" />
//                       {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="flex flex-col items-center justify-center py-8 gap-2">
//               <History className="h-5 w-5 text-muted-foreground" />
//               <p className="text-sm font-medium text-muted-foreground">
//                 No activity recorded
//               </p>
//               <p className="text-xs text-muted-foreground">
//                 This ticket has no history yet
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </ScrollArea>
//   );
// }


// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { apiClient } from "@/lib/api/client";
// import { Skeleton } from "@/components/ui/skeleton";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { format, formatDistanceToNow } from "date-fns";
// import {
//   MessageSquare,
//   RefreshCw,
//   UserRoundCog,
//   Activity,
//   AlertCircle,
//   History,
//   Clock,
//   CheckCircle2,
//   XCircle,
//   Plus,
//   ChevronRight,
// } from "lucide-react";
// import { JSX, useEffect } from "react";
// import { getStyle } from "@/components/badgeStyles";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";

// enum WorkflowAction {
//   CREATED = "CREATED",
//   STATUS_CHANGE = "STATUS_CHANGE",
//   ASSIGNMENT = "ASSIGNMENT",
//   APPROVAL = "APPROVAL",
//   REJECTION = "REJECTION",
//   COMMENT = "COMMENT",
// }

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   avatarUrl?: string | null;
// }

// interface ActivityItem {
//   id: string;
//   user: User | null;
//   action: WorkflowAction;
//   comment?: string | null;
//   status?: string | null;
//   createdAt: string;
//   metadata?: Record<string, unknown> | null;
// }

// interface TicketActivityTimelineProps {
//   ticketId: string;
//   refetchSignal?: number;
//   className?: string;
//   maxHeight?: string;
//   compact?: boolean;
// }

// const DEFAULT_MAX_HEIGHT = "h-[calc(100%-1px)]";

// const actionIcons: Record<WorkflowAction, JSX.Element> = {
//   [WorkflowAction.COMMENT]: <MessageSquare className="h-3.5 w-3.5" />,
//   [WorkflowAction.STATUS_CHANGE]: <RefreshCw className="h-3.5 w-3.5" />,
//   [WorkflowAction.ASSIGNMENT]: <UserRoundCog className="h-3.5 w-3.5" />,
//   [WorkflowAction.CREATED]: <Plus className="h-3.5 w-3.5" />,
//   [WorkflowAction.APPROVAL]: <CheckCircle2 className="h-3.5 w-3.5" />,
//   [WorkflowAction.REJECTION]: <XCircle className="h-3.5 w-3.5" />,
// };

// const actionLabels: Record<WorkflowAction, string> = {
//   [WorkflowAction.COMMENT]: "commented",
//   [WorkflowAction.STATUS_CHANGE]: "changed status",
//   [WorkflowAction.ASSIGNMENT]: "reassigned",
//   [WorkflowAction.CREATED]: "created ticket",
//   [WorkflowAction.APPROVAL]: "approved",
//   [WorkflowAction.REJECTION]: "rejected",
// };

// const actionColors: Record<WorkflowAction, string> = {
//   [WorkflowAction.COMMENT]: "text-blue-600 dark:text-blue-400",
//   [WorkflowAction.STATUS_CHANGE]: "text-purple-600 dark:text-purple-400",
//   [WorkflowAction.ASSIGNMENT]: "text-amber-600 dark:text-amber-400",
//   [WorkflowAction.CREATED]: "text-green-600 dark:text-green-400",
//   [WorkflowAction.APPROVAL]: "text-green-600 dark:text-green-400",
//   [WorkflowAction.REJECTION]: "text-red-600 dark:text-red-400",
// };

// const actionBgColors: Record<WorkflowAction, string> = {
//   [WorkflowAction.COMMENT]: "bg-blue-50 dark:bg-blue-900/30",
//   [WorkflowAction.STATUS_CHANGE]: "bg-purple-50 dark:bg-purple-900/30",
//   [WorkflowAction.ASSIGNMENT]: "bg-amber-50 dark:bg-amber-900/30",
//   [WorkflowAction.CREATED]: "bg-green-50 dark:bg-green-900/30",
//   [WorkflowAction.APPROVAL]: "bg-green-50 dark:bg-green-900/30",
//   [WorkflowAction.REJECTION]: "bg-red-50 dark:bg-red-900/30",
// };

// export default function TicketActivityTimeline({
//   ticketId,
//   refetchSignal,
//   className = "",
//   maxHeight = DEFAULT_MAX_HEIGHT,
//   compact = false,
// }: TicketActivityTimelineProps) {
//   const { data, isLoading, error, refetch } = useQuery<ActivityItem[]>({
//     queryKey: ["ticket-activity", ticketId],
//     queryFn: async () => {
//       try {
//         const response = await apiClient.get(`/tickets/${ticketId}/history`);
        
//         if (!response?.data?.history) {
//           throw new Error("Invalid response structure");
//         }

//         return response.data.history.map((item: unknown) => {
//           const activity = item as Record<string, unknown>;

//           return {
//             id: String(activity.id),
//             user: activity.user
//               ? {
//                   id: String((activity.user as any).id),
//                   name: String((activity.user as any).name),
//                   email: String((activity.user as any).email),
//                   avatarUrl: (activity.user as any).avatarUrl ?? null,
//                 }
//               : null,
//             action: String(activity.action).toUpperCase() as WorkflowAction,
//             comment: activity.comment ? String(activity.comment) : null,
//             status: activity.status ? String(activity.status) : null,
//             createdAt: String(activity.createdAt),
//             metadata: activity.metadata ?? null,
//           };
//         });
//       } catch (err) {
//         const errorMessage =
//           err instanceof Error ? err.message : "Failed to fetch ticket history";
//         toast.error("Error", {
//           description: errorMessage,
//         });
//         throw new Error(errorMessage);
//       }
//     },
//     refetchOnWindowFocus: false,
//     retry: 2,
//     staleTime: 300000, // 5 minutes
//   });

//   useEffect(() => {
//     if (refetchSignal !== undefined) {
//       refetch().catch(() => {
//         toast.error("Refresh failed", {
//           description: "Could not update ticket history",
//         });
//       });
//     }
//   }, [refetchSignal, refetch]);

//   const sortedActivities = data ?? [];

//   if (isLoading) {
//     return (
//       <div className={`space-y-6 ${className}`} data-testid="activity-loading">
//         {Array.from({ length: 3 }).map((_, index) => (
//           <div key={`skeleton-${index}`} className="flex gap-4">
//             <div className="flex flex-col items-center">
//               <Skeleton className="h-10 w-10 rounded-full" />
//               <Skeleton className="mt-2 h-4 w-4 rounded-full" />
//             </div>
//             <div className="flex-1 space-y-3 pt-1">
//               <div className="flex items-center gap-3">
//                 <Skeleton className="h-4 w-24 rounded-md" />
//                 <Skeleton className="h-4 w-16 rounded-full" />
//               </div>
//               <Skeleton className="h-16 w-full rounded-lg" />
//               <Skeleton className="h-3 w-32 rounded-md" />
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div
//         className={`flex flex-col items-center justify-center py-12 gap-3 text-center ${className}`}
//       >
//         <div className="p-3 rounded-full bg-destructive/10">
//           <AlertCircle className="h-6 w-6 text-destructive" />
//         </div>
//         <p className="text-sm font-medium text-destructive">
//           Failed to load activity
//         </p>
//         <p className="text-sm text-muted-foreground max-w-md">
//           Couldn't retrieve the ticket history. Please try again later.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <ScrollArea
//       className={`${maxHeight} ${className}`}
//       data-testid="activity-scroll-area"
//     >
//       <div className="relative pr-4">
//         {/* Timeline line */}
//         <div
//           className={cn(
//             "absolute left-5 top-0 h-full w-px bg-gradient-to-b",
//             "from-border via-border/50 to-transparent",
//             compact ? "left-[18px]" : "left-5"
//           )}
//           aria-hidden="true"
//         />

//         <div className={cn("space-y-6", compact && "space-y-4")}>
//           {sortedActivities.length > 0 ? (
//             sortedActivities.map((activity) => (
//               <div
//                 key={activity.id}
//                 className="relative flex gap-4 group hover:bg-muted/30 transition-colors rounded-lg p-2 -mx-2"
//               >
//                 {/* Timeline dot */}
//                 <div
//                   className={cn(
//                     "absolute left-5 top-5 -ml-[2px] h-2 w-2 rounded-full",
//                     "bg-primary ring-4 ring-primary/10 z-10",
//                     compact && "left-[18px] top-4"
//                   )}
//                 />

//                 <div className="relative z-10 flex flex-col items-center">
//                   <Avatar
//                     className={cn(
//                       "border-2 border-background",
//                       compact ? "h-8 w-8" : "h-10 w-10",
//                       "transition-transform group-hover:scale-105"
//                     )}
//                   >
//                     <AvatarImage
//                       src={activity.user?.avatarUrl || undefined}
//                       alt={
//                         activity.user?.name
//                           ? `${activity.user.name}'s avatar`
//                           : "System avatar"
//                       }
//                     />
//                     <AvatarFallback
//                       className={cn(
//                         "font-medium bg-muted",
//                         compact ? "text-xs" : "text-sm"
//                       )}
//                     >
//                       {activity.user?.name?.charAt(0).toUpperCase() || "S"}
//                     </AvatarFallback>
//                   </Avatar>
//                 </div>

//                 <div
//                   className={cn(
//                     "flex-1 space-y-2 pt-0.5",
//                     compact && "space-y-1.5"
//                   )}
//                 >
//                   <div className="flex items-start gap-2">
//                     <div className="flex-1 flex items-center gap-2 flex-wrap">
//                       <span
//                         className={cn(
//                           "font-medium text-foreground",
//                           compact ? "text-sm" : "text-base"
//                         )}
//                       >
//                         {activity.user?.name || "System"}
//                       </span>
//                       <span
//                         className={cn(
//                           "flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium",
//                           actionColors[activity.action],
//                           actionBgColors[activity.action],
//                           "border border-transparent",
//                           compact && "px-2 py-0.5"
//                         )}
//                       >
//                         {actionIcons[activity.action] || (
//                           <Activity className="h-3.5 w-3.5" />
//                         )}
//                         {actionLabels[activity.action] ||
//                           activity.action.toLowerCase().replace("_", " ")}
//                       </span>
//                     </div>
//                     <span
//                       className={cn(
//                         "text-xs text-muted-foreground whitespace-nowrap",
//                         "mt-0.5",
//                         compact && "text-[0.7rem]"
//                       )}
//                     >
//                       {formatDistanceToNow(new Date(activity.createdAt), {
//                         addSuffix: true,
//                       })}
//                     </span>
//                   </div>

//                   {activity.comment && (
//                     <div
//                       className={cn(
//                         "rounded-lg bg-muted/40 p-3 whitespace-pre-wrap break-words",
//                         "text-sm border border-border/50",
//                         compact && "text-sm p-2"
//                       )}
//                     >
//                       {activity.comment}
//                     </div>
//                   )}

//                   {activity.status && (
//                     <div className="flex items-center gap-2 mt-1 flex-wrap">
//                       <div
//                         className={cn(
//                           "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full",
//                           "text-xs font-medium border",
//                           getStyle("status", activity.status),
//                           compact && "px-2 py-0.5"
//                         )}
//                       >
//                         <RefreshCw className="h-3 w-3" />
//                         {activity.status.replace("_", " ")}
//                       </div>
//                       <ChevronRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
//                       <span
//                         className={cn(
//                           "text-xs text-muted-foreground whitespace-nowrap",
//                           compact && "text-[0.7rem]"
//                         )}
//                       >
//                         {format(
//                           new Date(activity.createdAt),
//                           "MMM d, yyyy 'at' h:mm a"
//                         )}
//                       </span>
//                     </div>
//                   )}

//                   {!activity.status && !compact && (
//                     <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
//                       <Clock className="h-3 w-3 flex-shrink-0" />
//                       {format(
//                         new Date(activity.createdAt),
//                         "MMM d, yyyy 'at' h:mm a"
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             ))
//           ) : (
//             <div className="flex flex-col items-center justify-center py-12 gap-3">
//               <div className="p-3 rounded-full bg-muted">
//                 <History className="h-6 w-6 text-muted-foreground" />
//               </div>
//               <p className="text-sm font-medium text-muted-foreground">
//                 No activity recorded
//               </p>
//               <p className="text-sm text-muted-foreground max-w-md text-center">
//                 This ticket doesn't have any history yet. Activities will appear here once created.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </ScrollArea>
//   );
// }


// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { apiClient } from "@/lib/api/client";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
// import { format, formatDistanceToNow } from "date-fns";
// import {
//   MessageSquare,
//   RefreshCw,
//   UserRoundCog,
//   Plus,
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   History,
//   Clock,
//   ChevronRight,
//   Activity,
// } from "lucide-react";
// import { useEffect } from "react";
// import { cn } from "@/lib/utils";
// import { getStyle } from "@/components/badgeStyles";

// const enum WorkflowAction {
//   CREATED = "CREATED",
//   STATUS_CHANGE = "STATUS_CHANGE",
//   ASSIGNMENT = "ASSIGNMENT",
//   APPROVAL = "APPROVAL",
//   REJECTION = "REJECTION",
//   COMMENT = "COMMENT",
// }

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   avatarUrl?: string | null;
// }

// interface ActivityItem {
//   id: string;
//   user: User | null;
//   action: WorkflowAction;
//   comment?: string | null;
//   status?: string | null;
//   createdAt: string;
//   metadata?: Record<string, unknown> | null;
// }

// interface TicketActivityTimelineProps {
//   ticketId: string;
//   refetchSignal?: number;
//   className?: string;
//   maxHeight?: string;
//   compact?: boolean;
// }

// const actionMeta = {
//   [WorkflowAction.COMMENT]: {
//     icon: MessageSquare,
//     label: "commented",
//     text: "text-blue-600 dark:text-blue-400",
//     bg: "bg-blue-50 dark:bg-blue-900/30",
//   },
//   [WorkflowAction.STATUS_CHANGE]: {
//     icon: RefreshCw,
//     label: "changed status",
//     text: "text-purple-600 dark:text-purple-400",
//     bg: "bg-purple-50 dark:bg-purple-900/30",
//   },
//   [WorkflowAction.ASSIGNMENT]: {
//     icon: UserRoundCog,
//     label: "reassigned",
//     text: "text-amber-600 dark:text-amber-400",
//     bg: "bg-amber-50 dark:bg-amber-900/30",
//   },
//   [WorkflowAction.CREATED]: {
//     icon: Plus,
//     label: "created ticket",
//     text: "text-green-600 dark:text-green-400",
//     bg: "bg-green-50 dark:bg-green-900/30",
//   },
//   [WorkflowAction.APPROVAL]: {
//     icon: CheckCircle2,
//     label: "approved",
//     text: "text-green-600 dark:text-green-400",
//     bg: "bg-green-50 dark:bg-green-900/30",
//   },
//   [WorkflowAction.REJECTION]: {
//     icon: XCircle,
//     label: "rejected",
//     text: "text-red-600 dark:text-red-400",
//     bg: "bg-red-50 dark:bg-red-900/30",
//   },
// };

// const DEFAULT_MAX_HEIGHT = "h-[calc(100%-1px)]";

// export default function TicketActivityTimeline({
//   ticketId,
//   refetchSignal,
//   className = "",
//   maxHeight = DEFAULT_MAX_HEIGHT,
//   compact = false,
// }: TicketActivityTimelineProps) {
//   const {
//     data: activities = [],
//     isLoading,
//     error,
//     refetch,
//   } = useQuery<ActivityItem[]>({
//     queryKey: ["ticket-activity", ticketId],
//     queryFn: async () => {
//       const response = await apiClient.get(`/tickets/${ticketId}/history`);
//       if (!response?.data?.history) throw new Error("Invalid response structure");

//       return response.data.history.map((activity: any) => ({
//         id: activity.id,
//         user: activity.user
//           ? {
//               id: activity.user.id,
//               name: activity.user.name,
//               email: activity.user.email,
//               avatarUrl: activity.user.avatarUrl ?? null,
//             }
//           : null,
//         action: activity.action.toUpperCase(),
//         comment: activity.comment ?? null,
//         status: activity.status ?? null,
//         createdAt: activity.createdAt,
//         metadata: activity.metadata ?? null,
//       }));
//     },
//     staleTime: 300000,
//     refetchOnWindowFocus: false,
//     retry: 2,
//   });

//   useEffect(() => {
//     if (refetchSignal !== undefined) {
//       refetch().catch(() =>
//         toast.error("Failed to refresh activity history")
//       );
//     }
//   }, [refetchSignal, refetch]);

//   if (isLoading) {
//     return (
//       <div className={cn("space-y-6", className)}>
//         {Array.from({ length: 3 }).map((_, i) => (
//           <div key={i} className="flex gap-4">
//             <Skeleton className="h-10 w-10 rounded-full" />
//             <div className="flex-1 space-y-2">
//               <Skeleton className="h-4 w-32 rounded-md" />
//               <Skeleton className="h-3 w-24 rounded" />
//               <Skeleton className="h-12 w-full rounded-lg" />
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={cn("text-center py-10 space-y-3", className)}>
//         <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
//         <p className="font-medium text-red-600">Error loading activity</p>
//         <p className="text-sm text-muted-foreground">
//           Please try again later.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <ScrollArea className={cn(maxHeight, className)}>
//       <div className="relative space-y-6 pr-4">
//         <div className="absolute left-5 top-0 h-full w-px bg-border" />

//         {activities.length === 0 ? (
//           <div className="text-center py-10 space-y-3">
//             <History className="mx-auto h-8 w-8 text-muted-foreground" />
//             <p className="font-medium text-muted-foreground">
//               No activity recorded
//             </p>
//             <p className="text-sm text-muted-foreground">
//               All ticket history will appear here.
//             </p>
//           </div>
//         ) : (
//           activities.map((activity) => {
//             const meta = actionMeta[activity.action as WorkflowAction] ?? {
//               icon: Activity,
//               label: activity.action,
//               text: "text-muted-foreground",
//               bg: "bg-muted",
//             };

//             const Icon = meta.icon;

//             return (
//               <div
//                 key={activity.id}
//                 className="relative flex gap-4 group hover:bg-muted/40 rounded-lg px-2 py-3"
//               >
//                 <div className="absolute left-5 top-5 h-2 w-2 rounded-full bg-primary ring-4 ring-primary/10" />

//                 <Avatar className="h-10 w-10 border border-background">
//                   <AvatarImage
//                     src={activity.user?.avatarUrl || undefined}
//                     alt={activity.user?.name || "System"}
//                   />
//                   <AvatarFallback>
//                     {activity.user?.name?.[0]?.toUpperCase() || "S"}
//                   </AvatarFallback>
//                 </Avatar>

//                 <div className="flex-1 space-y-1">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <span className="font-medium text-sm">
//                       {activity.user?.name || "System"}
//                     </span>
//                     <Badge
//                       className={cn(
//                         "flex items-center gap-1.5 text-xs",
//                         meta.text,
//                         meta.bg
//                       )}
//                     >
//                       <Icon className="h-3.5 w-3.5" />
//                       {meta.label}
//                     </Badge>
//                     <span className="text-xs text-muted-foreground">
//                       {formatDistanceToNow(new Date(activity.createdAt), {
//                         addSuffix: true,
//                       })}
//                     </span>
//                   </div>

//                   {activity.comment && (
//                     <p className="bg-muted p-3 text-sm rounded border border-border/40">
//                       {activity.comment}
//                     </p>
//                   )}

//                   {activity.status && (
//                     <div className="flex items-center gap-2 flex-wrap text-xs mt-1">
//                       <span
//                         className={cn(
//                           "inline-flex items-center gap-1 px-2 py-1 rounded-full border",
//                           getStyle("status", activity.status)
//                         )}
//                       >
//                         <RefreshCw className="h-3 w-3" />
//                         {activity.status.replace("_", " ")}
//                       </span>
//                       <ChevronRight className="h-3 w-3 text-muted-foreground" />
//                       <span className="text-muted-foreground">
//                         {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
//                       </span>
//                     </div>
//                   )}

//                   {!activity.status && (
//                     <div className="flex items-center text-xs gap-1 text-muted-foreground mt-1">
//                       <Clock className="h-3 w-3" />
//                       {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </ScrollArea>
//   );
// }


// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { apiClient } from "@/lib/api/client";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
// import { format, formatDistanceToNow } from "date-fns";
// import {
//   MessageSquare,
//   RefreshCw,
//   UserRoundCog,
//   Plus,
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   History,
//   Clock,
//   Activity,
// } from "lucide-react";
// import { useEffect } from "react";
// import { cn } from "@/lib/utils";
// import { getStyle } from "@/components/badgeStyles";

// const enum WorkflowAction {
//   CREATED = "CREATED",
//   STATUS_CHANGE = "STATUS_CHANGE",
//   ASSIGNMENT = "ASSIGNMENT",
//   APPROVAL = "APPROVAL",
//   REJECTION = "REJECTION",
//   COMMENT = "COMMENT",
// }

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   avatarUrl?: string | null;
// }

// interface ActivityItem {
//   id: string;
//   user: User | null;
//   action: WorkflowAction;
//   comment?: string | null;
//   status?: string | null;
//   createdAt: string;
//   metadata?: Record<string, unknown> | null;
// }

// interface TicketActivityTimelineProps {
//   ticketId: string;
//   refetchSignal?: number;
//   className?: string;
//   maxHeight?: string;
//   compact?: boolean;
// }

// const actionMeta = {
//   [WorkflowAction.COMMENT]: {
//     icon: MessageSquare,
//     label: "commented",
//     text: "text-blue-600 dark:text-blue-400",
//     bg: "bg-blue-50 dark:bg-blue-900/30",
//   },
//   [WorkflowAction.STATUS_CHANGE]: {
//     icon: RefreshCw,
//     label: "changed status",
//     text: "text-purple-600 dark:text-purple-400",
//     bg: "bg-purple-50 dark:bg-purple-900/30",
//   },
//   [WorkflowAction.ASSIGNMENT]: {
//     icon: UserRoundCog,
//     label: "reassigned",
//     text: "text-amber-600 dark:text-amber-400",
//     bg: "bg-amber-50 dark:bg-amber-900/30",
//   },
//   [WorkflowAction.CREATED]: {
//     icon: Plus,
//     label: "created ticket",
//     text: "text-green-600 dark:text-green-400",
//     bg: "bg-green-50 dark:bg-green-900/30",
//   },
//   [WorkflowAction.APPROVAL]: {
//     icon: CheckCircle2,
//     label: "approved",
//     text: "text-green-600 dark:text-green-400",
//     bg: "bg-green-50 dark:bg-green-900/30",
//   },
//   [WorkflowAction.REJECTION]: {
//     icon: XCircle,
//     label: "rejected",
//     text: "text-red-600 dark:text-red-400",
//     bg: "bg-red-50 dark:bg-red-900/30",
//   },
// };

// const DEFAULT_MAX_HEIGHT = "h-[calc(100%-1px)]";

// export default function TicketActivityTimeline({
//   ticketId,
//   refetchSignal,
//   className = "",
//   maxHeight = DEFAULT_MAX_HEIGHT,
//   compact = false,
// }: TicketActivityTimelineProps) {
//   const {
//     data: activities = [],
//     isLoading,
//     error,
//     refetch,
//   } = useQuery<ActivityItem[]>({
//     queryKey: ["ticket-activity", ticketId],
//     queryFn: async () => {
//       const response = await apiClient.get(`/tickets/${ticketId}/history`);
//       console.log(response);
      
//       if (!response?.data?.history) throw new Error("Invalid response structure");

//       return response.data.history.map((activity: any) => ({
//         id: activity.id,
//         user: activity.user
//           ? {
//               id: activity.user.id,
//               name: activity.user.name,
//               email: activity.user.email,
//               avatarUrl: activity.user.avatarUrl ?? null,
//             }
//           : null,
//         action: activity.action.toUpperCase(),
//         comment: activity.comment ?? null,
//         status: activity.status ?? null,
//         createdAt: activity.createdAt,
//         metadata: activity.metadata ?? null,
//       }));
//     },
//     staleTime: 300000,
//     refetchOnWindowFocus: false,
//     retry: 2,
//   });

//   useEffect(() => {
//     if (refetchSignal !== undefined) {
//       refetch().catch(() =>
//         toast.error("Failed to refresh activity history")
//       );
//     }
//   }, [refetchSignal, refetch]);

//   if (isLoading) {
//     return (
//       <div className={cn("space-y-6", className)}>
//         {Array.from({ length: 3 }).map((_, i) => (
//           <div key={i} className="flex gap-4">
//             <Skeleton className="h-10 w-10 rounded-full" />
//             <div className="flex-1 space-y-2">
//               <Skeleton className="h-4 w-32 rounded-md" />
//               <Skeleton className="h-3 w-24 rounded" />
//               <Skeleton className="h-12 w-full rounded-lg" />
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={cn("text-center py-10 space-y-3", className)}>
//         <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
//         <p className="font-medium text-red-600">Error loading activity</p>
//         <p className="text-sm text-muted-foreground">
//           Please try again later.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <ScrollArea className={cn(maxHeight, className)}>
//       <div className="relative space-y-6 pr-4">
//         <div className="absolute left-5 top-0 h-full w-px bg-border" />

//         {activities.length === 0 ? (
//           <div className="text-center py-10 space-y-3">
//             <History className="mx-auto h-8 w-8 text-muted-foreground" />
//             <p className="font-medium text-muted-foreground">
//               No activity recorded
//             </p>
//             <p className="text-sm text-muted-foreground">
//               All ticket history will appear here.
//             </p>
//           </div>
//         ) : (
//           activities.map((activity) => {
//             const meta = actionMeta[activity.action as WorkflowAction] ?? {
//               icon: Activity,
//               label: activity.action,
//               text: "text-muted-foreground",
//               bg: "bg-muted",
//             };

//             const Icon = meta.icon;

//             return (
//               <div
//                 key={activity.id}
//                 className="relative flex gap-4 group hover:bg-muted/40 rounded-lg px-2 py-3"
//               >
//                 <div className="absolute left-5 top-5 h-2 w-2 rounded-full bg-primary ring-4 ring-primary/10" />

//                 <Avatar className="h-10 w-10 border border-background">
//                   <AvatarImage
//                     src={activity.user?.avatarUrl || undefined}
//                     alt={activity.user?.name || "System"}
//                   />
//                   <AvatarFallback>
//                     {activity.user?.name?.[0]?.toUpperCase() || "S"}
//                   </AvatarFallback>
//                 </Avatar>

//                 <div className="flex-1 space-y-1">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <span className="font-medium text-sm">
//                       {activity.user?.name || "System"}
//                     </span>
//                     <Badge
//                       className={cn(
//                         "flex items-center gap-1.5 text-xs",
//                         meta.text,
//                         meta.bg
//                       )}
//                     >
//                       <Icon className="h-3.5 w-3.5" />
//                       {meta.label}
//                     </Badge>
//                     <span className="text-xs text-muted-foreground">
//                       {formatDistanceToNow(new Date(activity.createdAt), {
//                         addSuffix: true,
//                       })}
//                     </span>
//                   </div>

//                   {activity.comment && (
//                     <p className="bg-muted p-3 text-sm rounded border border-border/40">
//                       {activity.comment}
//                     </p>
//                   )}

//                   {activity.status && (
//                     <div className="flex items-center gap-2 flex-wrap text-xs mt-1">
//                       <Badge
//                         className={cn(
//                           "inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full border text-xs font-medium",
//                           getStyle("status", activity.status)
//                         )}
//                       >
//                         <RefreshCw className="h-3 w-3" />
//                         {activity.status.replace("_", " ")}
//                       </Badge>
//                       <span className="text-muted-foreground">
//                         {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
//                       </span>
//                     </div>
//                   )}

//                   {!activity.status && (
//                     <div className="flex items-center text-xs gap-1 text-muted-foreground mt-1">
//                       <Clock className="h-3 w-3" />
//                       {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </ScrollArea>
//   );
// }



// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { apiClient } from "@/lib/api/client";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
// import { format, formatDistanceToNow } from "date-fns";
// import {
//   MessageSquare,
//   RefreshCw,
//   UserRoundCog,
//   Plus,
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   History,
//   Clock,
//   Activity,
// } from "lucide-react";
// import { useEffect } from "react";
// import { cn } from "@/lib/utils";
// import { getStyle } from "@/components/badgeStyles";

// const enum WorkflowAction {
//   CREATED = "CREATED",
//   STATUS_CHANGE = "STATUS_CHANGE",
//   ASSIGNMENT = "ASSIGNMENT",
//   APPROVAL = "APPROVAL",
//   REJECTION = "REJECTION",
//   COMMENT = "COMMENT",
// }

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   avatarUrl?: string | null;
// }

// interface ActivityItem {
//   id: string;
//   user: User | null;
//   action: WorkflowAction;
//   comment?: string | null;
//   status?: string | null;
//   fromStatus?: string | null;
//   previousAssigneeId?: string | null;
//   newAssigneeId?: string | null;
//   previousApproverId?: string | null;
//   newApproverId?: string | null;
//   createdAt: string;
//   metadata?: Record<string, unknown> | null;
// }

// interface TicketActivityTimelineProps {
//   ticketId: string;
//   refetchSignal?: number;
//   className?: string;
//   maxHeight?: string;
//   compact?: boolean;
// }

// const actionMeta = {
//   [WorkflowAction.COMMENT]: {
//     icon: MessageSquare,
//     label: "commented",
//     text: "text-blue-600 dark:text-blue-400",
//     bg: "bg-blue-50 dark:bg-blue-900/30",
//   },
//   [WorkflowAction.STATUS_CHANGE]: {
//     icon: RefreshCw,
//     label: "changed status",
//     text: "text-purple-600 dark:text-purple-400",
//     bg: "bg-purple-50 dark:bg-purple-900/30",
//   },
//   [WorkflowAction.ASSIGNMENT]: {
//     icon: UserRoundCog,
//     label: "reassigned",
//     text: "text-amber-600 dark:text-amber-400",
//     bg: "bg-amber-50 dark:bg-amber-900/30",
//   },
//   [WorkflowAction.CREATED]: {
//     icon: Plus,
//     label: "created ticket",
//     text: "text-green-600 dark:text-green-400",
//     bg: "bg-green-50 dark:bg-green-900/30",
//   },
//   [WorkflowAction.APPROVAL]: {
//     icon: CheckCircle2,
//     label: "approved",
//     text: "text-green-600 dark:text-green-400",
//     bg: "bg-green-50 dark:bg-green-900/30",
//   },
//   [WorkflowAction.REJECTION]: {
//     icon: XCircle,
//     label: "rejected",
//     text: "text-red-600 dark:text-red-400",
//     bg: "bg-red-50 dark:bg-red-900/30",
//   },
// };

// const DEFAULT_MAX_HEIGHT = "h-[calc(100%-1px)]";

// export default function TicketActivityTimeline({
//   ticketId,
//   refetchSignal,
//   className = "",
//   maxHeight = DEFAULT_MAX_HEIGHT,
//   compact = false,
// }: TicketActivityTimelineProps) {
//   const {
//     data: activities = [],
//     isLoading,
//     error,
//     refetch,
//   } = useQuery<ActivityItem[]>({
//     queryKey: ["ticket-activity", ticketId],
//     queryFn: async () => {
//       const response = await apiClient.get(`/tickets/${ticketId}/history`);
//       if (!response?.data?.history) throw new Error("Invalid response structure");

//       return response.data.history.map((activity: any) => ({
//         id: activity.id,
//         user: activity.user
//           ? {
//               id: activity.user.id,
//               name: activity.user.name,
//               email: activity.user.email,
//               avatarUrl: activity.user.avatarUrl ?? null,
//             }
//           : null,
//         action: activity.action.toUpperCase(),
//         comment: activity.comment ?? null,
//         status: activity.status ?? null,
//         fromStatus: activity.fromStatus ?? null,
//         previousApproverId: activity.previousApproverId ?? null,
//         newApproverId: activity.newApproverId ?? null,
//         previousAssigneeId: activity.previousAssigneeId ?? null,
//         newAssigneeId: activity.newAssigneeId ?? null,
//         createdAt: activity.createdAt,
//         metadata: activity.metadata ?? null,
//       }));
//     },
//     staleTime: 300000,
//     refetchOnWindowFocus: false,
//     retry: 2,
//   });

//   useEffect(() => {
//     if (refetchSignal !== undefined) {
//       refetch().catch(() =>
//         toast.error("Failed to refresh activity history")
//       );
//     }
//   }, [refetchSignal, refetch]);

//   const renderDetail = (activity: ActivityItem) => {
//     if (activity.comment) return activity.comment;

//     if (activity.action === WorkflowAction.STATUS_CHANGE) {
//       return activity.fromStatus
//         ? `Status changed from ${activity.fromStatus} → ${activity.status}`
//         : `Status set to ${activity.status}`;
//     }

//     if (activity.action === WorkflowAction.ASSIGNMENT) {
//       if (activity.previousAssigneeId && activity.newAssigneeId)
//         return `Assignee changed from ${activity.previousAssigneeId} → ${activity.newAssigneeId}`;
//       if (activity.newAssigneeId)
//         return `Assigned to ${activity.newAssigneeId}`;
//     }

//     if (activity.action === WorkflowAction.APPROVAL) {
//       if (activity.previousApproverId && activity.newApproverId)
//         return `Approver changed from ${activity.previousApproverId} → ${activity.newApproverId}`;
//       if (activity.newApproverId)
//         return `Sent for approval to ${activity.newApproverId}`;
//     }

//     return `Performed action: ${activity.action}`;
//   };

//   if (isLoading) {
//     return (
//       <div className={cn("space-y-6", className)}>
//         {Array.from({ length: 3 }).map((_, i) => (
//           <div key={i} className="flex gap-4">
//             <Skeleton className="h-10 w-10 rounded-full" />
//             <div className="flex-1 space-y-2">
//               <Skeleton className="h-4 w-32 rounded-md" />
//               <Skeleton className="h-3 w-24 rounded" />
//               <Skeleton className="h-12 w-full rounded-lg" />
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={cn("text-center py-10 space-y-3", className)}>
//         <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
//         <p className="font-medium text-red-600">Error loading activity</p>
//         <p className="text-sm text-muted-foreground">
//           Please try again later.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <ScrollArea className={cn(maxHeight, className)}>
//       <div className="relative space-y-6 pr-4">
//         <div className="absolute left-5 top-0 h-full w-px bg-border" />

//         {activities.length === 0 ? (
//           <div className="text-center py-10 space-y-3">
//             <History className="mx-auto h-8 w-8 text-muted-foreground" />
//             <p className="font-medium text-muted-foreground">
//               No activity recorded
//             </p>
//             <p className="text-sm text-muted-foreground">
//               All ticket history will appear here.
//             </p>
//           </div>
//         ) : (
//           activities.map((activity) => {
//             const meta = actionMeta[activity.action as WorkflowAction] ?? {
//               icon: Activity,
//               label: activity.action,
//               text: "text-muted-foreground",
//               bg: "bg-muted",
//             };
//             const Icon = meta.icon;

//             return (
//               <div
//                 key={activity.id}
//                 className="relative flex gap-4 group hover:bg-muted/40 rounded-lg px-2 py-3"
//               >
//                 <div className="absolute left-5 top-5 h-2 w-2 rounded-full bg-primary ring-4 ring-primary/10" />

//                 <Avatar className="h-10 w-10 border border-background">
//                   <AvatarImage
//                     src={activity.user?.avatarUrl || undefined}
//                     alt={activity.user?.name || "System"}
//                   />
//                   <AvatarFallback>
//                     {activity.user?.name?.[0]?.toUpperCase() || "S"}
//                   </AvatarFallback>
//                 </Avatar>

//                 <div className="flex-1 space-y-1">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <span className="font-medium text-sm">
//                       {activity.user?.name || "System"}
//                     </span>
//                     <Badge
//                       className={cn(
//                         "flex items-center gap-1.5 text-xs",
//                         meta.text,
//                         meta.bg
//                       )}
//                     >
//                       <Icon className="h-3.5 w-3.5" />
//                       {meta.label}
//                     </Badge>
//                     <span className="text-xs text-muted-foreground">
//                       {formatDistanceToNow(new Date(activity.createdAt), {
//                         addSuffix: true,
//                       })}
//                     </span>
//                   </div>

//                   <p className="bg-muted p-3 text-sm rounded border border-border/40">
//                     {renderDetail(activity)}
//                   </p>

//                   <div className="flex items-center text-xs gap-1 text-muted-foreground mt-1">
//                     <Clock className="h-3 w-3" />
//                     {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </ScrollArea>
//   );
// }



// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { apiClient } from "@/lib/api/client";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
// import { format, formatDistanceToNow } from "date-fns";
// import {
//   MessageSquare,
//   RefreshCw,
//   UserRoundCog,
//   Plus,
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   History,
//   Clock,
//   Activity,
// } from "lucide-react";
// import { useEffect } from "react";
// import { cn } from "@/lib/utils";
// import { getStyle } from "@/components/badgeStyles";

// const enum WorkflowAction {
//   CREATED = "CREATED",
//   STATUS_CHANGE = "STATUS_CHANGE",
//   ASSIGNMENT = "ASSIGNMENT",
//   APPROVAL = "APPROVAL",
//   REJECTION = "REJECTION",
//   COMMENT = "COMMENT",
// }

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   avatarUrl?: string | null;
// }

// interface ActivityItem {
//   id: string;
//   user: User | null;
//   action: WorkflowAction;
//   comment?: string | null;
//   status?: string | null;
//   fromStatus?: string | null;
//   previousAssigneeId?: string | null;
//   newAssigneeId?: string | null;
//   previousApproverId?: string | null;
//   newApproverId?: string | null;
//   createdAt: string;
//   metadata?: Record<string, unknown> | null;
// }

// interface TicketActivityTimelineProps {
//   ticketId: string;
//   refetchSignal?: number;
//   className?: string;
//   maxHeight?: string;
//   compact?: boolean;
// }

// const actionMeta = {
//   [WorkflowAction.COMMENT]: {
//     icon: MessageSquare,
//     label: "commented",
//     text: "text-blue-600 dark:text-blue-400",
//     bg: "bg-blue-50 dark:bg-blue-900/30",
//   },
//   [WorkflowAction.STATUS_CHANGE]: {
//     icon: RefreshCw,
//     label: "changed status",
//     text: "text-purple-600 dark:text-purple-400",
//     bg: "bg-purple-50 dark:bg-purple-900/30",
//   },
//   [WorkflowAction.ASSIGNMENT]: {
//     icon: UserRoundCog,
//     label: "reassigned",
//     text: "text-amber-600 dark:text-amber-400",
//     bg: "bg-amber-50 dark:bg-amber-900/30",
//   },
//   [WorkflowAction.CREATED]: {
//     icon: Plus,
//     label: "created ticket",
//     text: "text-green-600 dark:text-green-400",
//     bg: "bg-green-50 dark:bg-green-900/30",
//   },
//   [WorkflowAction.APPROVAL]: {
//     icon: CheckCircle2,
//     label: "approved",
//     text: "text-green-600 dark:text-green-400",
//     bg: "bg-green-50 dark:bg-green-900/30",
//   },
//   [WorkflowAction.REJECTION]: {
//     icon: XCircle,
//     label: "rejected",
//     text: "text-red-600 dark:text-red-400",
//     bg: "bg-red-50 dark:bg-red-900/30",
//   },
// };

// const DEFAULT_MAX_HEIGHT = "h-[calc(100%-1px)]";

// export default function TicketActivityTimeline({
//   ticketId,
//   refetchSignal,
//   className = "",
//   maxHeight = DEFAULT_MAX_HEIGHT,
//   compact = false,
// }: TicketActivityTimelineProps) {
//   const {
//     data: activities = [],
//     isLoading,
//     error,
//     refetch,
//   } = useQuery<ActivityItem[]>({
//     queryKey: ["ticket-activity", ticketId],
//     queryFn: async () => {
//       const response = await apiClient.get(`/tickets/${ticketId}/history`);
//       if (!response?.data?.history) throw new Error("Invalid response structure");

//       return response.data.history.map((activity: any) => ({
//         id: activity.id,
//         user: activity.user
//           ? {
//               id: activity.user.id,
//               name: activity.user.name,
//               email: activity.user.email,
//               avatarUrl: activity.user.avatarUrl ?? null,
//             }
//           : null,
//         action: activity.action.toUpperCase(),
//         comment: activity.comment ?? null,
//         status: activity.status ?? null,
//         fromStatus: activity.fromStatus ?? null,
//         previousAssigneeId: activity.previousAssigneeId ?? null,
//         newAssigneeId: activity.newAssigneeId ?? null,
//         previousApproverId: activity.previousApproverId ?? null,
//         newApproverId: activity.newApproverId ?? null,
//         createdAt: activity.createdAt,
//         metadata: activity.metadata ?? null,
//       }));
//     },
//     staleTime: 300000,
//     refetchOnWindowFocus: false,
//     retry: 2,
//   });

//   useEffect(() => {
//     if (refetchSignal !== undefined) {
//       refetch().catch(() =>
//         toast.error("Failed to refresh activity history")
//       );
//     }
//   }, [refetchSignal, refetch]);

//   const userMap = Object.fromEntries(
//     activities
//       .filter((a) => a.user)
//       .map((a) => [a.user!.id, a.user!.name])
//   );

//   const getUserName = (id: string | null | undefined) =>
//     id ? userMap[id] || `User: ${id.slice(0, 6)}...` : "—";

//   const renderDetail = (activity: ActivityItem) => {
//     if (activity.comment) return activity.comment;

//     if (activity.action === WorkflowAction.STATUS_CHANGE) {
//       return activity.fromStatus && activity.status
//         ? `Status changed from ${activity.fromStatus} → ${activity.status}`
//         : `Status set to ${activity.status}`;
//     }

//     if (activity.action === WorkflowAction.ASSIGNMENT) {
//       if (activity.previousAssigneeId && activity.newAssigneeId)
//         return `Assignee changed from ${getUserName(activity.previousAssigneeId)} → ${getUserName(activity.newAssigneeId)}`;
//       if (activity.newAssigneeId)
//         return `Assigned to ${getUserName(activity.newAssigneeId)}`;
//     }

//     if (activity.action === WorkflowAction.APPROVAL) {
//       if (activity.previousApproverId && activity.newApproverId)
//         return `Approver changed from ${getUserName(activity.previousApproverId)} → ${getUserName(activity.newApproverId)}`;
//       if (activity.newApproverId)
//         return `Sent for approval to ${getUserName(activity.newApproverId)}`;
//     }

//     return `Performed action: ${activity.action}`;
//   };

//   if (isLoading) {
//     return (
//       <div className={cn("space-y-6", className)}>
//         {Array.from({ length: 3 }).map((_, i) => (
//           <div key={i} className="flex gap-4">
//             <Skeleton className="h-10 w-10 rounded-full" />
//             <div className="flex-1 space-y-2">
//               <Skeleton className="h-4 w-32 rounded-md" />
//               <Skeleton className="h-3 w-24 rounded" />
//               <Skeleton className="h-12 w-full rounded-lg" />
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={cn("text-center py-10 space-y-3", className)}>
//         <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
//         <p className="font-medium text-red-600">Error loading activity</p>
//         <p className="text-sm text-muted-foreground">Please try again later.</p>
//       </div>
//     );
//   }

//   return (
//     <ScrollArea className={cn(maxHeight, className)}>
//       <div className="relative space-y-6 pr-4">
//         <div className="absolute left-5 top-0 h-full w-px bg-border" />

//         {activities.length === 0 ? (
//           <div className="text-center py-10 space-y-3">
//             <History className="mx-auto h-8 w-8 text-muted-foreground" />
//             <p className="font-medium text-muted-foreground">No activity recorded</p>
//             <p className="text-sm text-muted-foreground">
//               All ticket history will appear here.
//             </p>
//           </div>
//         ) : (
//           activities.map((activity) => {
//             const meta = actionMeta[activity.action as WorkflowAction] ?? {
//               icon: Activity,
//               label: activity.action,
//               text: "text-muted-foreground",
//               bg: "bg-muted",
//             };
//             const Icon = meta.icon;

//             return (
//               <div
//                 key={activity.id}
//                 className="relative flex gap-4 group hover:bg-muted/40 rounded-lg px-2 py-3"
//               >
//                 <div className="absolute left-5 top-5 h-2 w-2 rounded-full bg-primary ring-4 ring-primary/10" />

//                 <Avatar className="h-10 w-10 border border-background">
//                   <AvatarImage
//                     src={activity.user?.avatarUrl || undefined}
//                     alt={activity.user?.name || "System"}
//                   />
//                   <AvatarFallback>
//                     {activity.user?.name?.[0]?.toUpperCase() || "S"}
//                   </AvatarFallback>
//                 </Avatar>

//                 <div className="flex-1 space-y-1">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <span className="font-medium text-sm">
//                       {activity.user?.name || "System"}
//                     </span>
//                     <Badge
//                       className={cn(
//                         "flex items-center gap-1.5 text-xs",
//                         meta.text,
//                         meta.bg
//                       )}
//                     >
//                       <Icon className="h-3.5 w-3.5" />
//                       {meta.label}
//                     </Badge>
//                     <span className="text-xs text-muted-foreground">
//                       {formatDistanceToNow(new Date(activity.createdAt), {
//                         addSuffix: true,
//                       })}
//                     </span>
//                   </div>

//                   <p className="bg-muted p-3 text-sm rounded border border-border/40">
//                     {renderDetail(activity)}
//                   </p>

//                   <div className="flex items-center text-xs gap-1 text-muted-foreground mt-1">
//                     <Clock className="h-3 w-3" />
//                     {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </ScrollArea>
//   );
// }


// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { apiClient } from "@/lib/api/client";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import { Skeleton } from "@/components/ui/skeleton";
// import { toast } from "sonner";
// import { format, formatDistanceToNow } from "date-fns";
// import {
//   MessageSquare,
//   RefreshCw,
//   UserRoundCog,
//   Plus,
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   History,
//   Clock,
//   Activity,
// } from "lucide-react";
// import { useEffect } from "react";
// import { cn } from "@/lib/utils";
// import { getStyle } from "@/components/badgeStyles";

// const enum WorkflowAction {
//   CREATED = "CREATED",
//   STATUS_CHANGE = "STATUS_CHANGE",
//   ASSIGNMENT = "ASSIGNMENT",
//   APPROVAL = "APPROVAL",
//   REJECTION = "REJECTION",
//   COMMENT = "COMMENT",
// }

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   avatarUrl?: string | null;
// }

// interface ActivityItem {
//   id: string;
//   user: User | null;
//   action: WorkflowAction;
//   comment?: string | null;
//   status?: string | null;
//   fromStatus?: string | null;
//   createdAt: string;
//   previousAssigneeName?: string | null;
//   newAssigneeName?: string | null;
//   previousApproverName?: string | null;
//   newApproverName?: string | null;
// }

// interface TicketActivityTimelineProps {
//   ticketId: string;
//   refetchSignal?: number;
//   className?: string;
//   maxHeight?: string;
// }

// const actionMeta = {
//   [WorkflowAction.COMMENT]: {
//     icon: MessageSquare,
//     label: "commented",
//     text: "text-blue-600 dark:text-blue-400",
//     bg: "bg-blue-50 dark:bg-blue-900/30",
//   },
//   [WorkflowAction.STATUS_CHANGE]: {
//     icon: RefreshCw,
//     label: "changed status",
//     text: "text-purple-600 dark:text-purple-400",
//     bg: "bg-purple-50 dark:bg-purple-900/30",
//   },
//   [WorkflowAction.ASSIGNMENT]: {
//     icon: UserRoundCog,
//     label: "reassigned",
//     text: "text-amber-600 dark:text-amber-400",
//     bg: "bg-amber-50 dark:bg-amber-900/30",
//   },
//   [WorkflowAction.CREATED]: {
//     icon: Plus,
//     label: "created ticket",
//     text: "text-green-600 dark:text-green-400",
//     bg: "bg-green-50 dark:bg-green-900/30",
//   },
//   [WorkflowAction.APPROVAL]: {
//     icon: CheckCircle2,
//     label: "approved",
//     text: "text-green-600 dark:text-green-400",
//     bg: "bg-green-50 dark:bg-green-900/30",
//   },
//   [WorkflowAction.REJECTION]: {
//     icon: XCircle,
//     label: "rejected",
//     text: "text-red-600 dark:text-red-400",
//     bg: "bg-red-50 dark:bg-red-900/30",
//   },
// };

// const DEFAULT_MAX_HEIGHT = "h-[calc(100%-1px)]";

// export default function TicketActivityTimeline({
//   ticketId,
//   refetchSignal,
//   className = "",
//   maxHeight = DEFAULT_MAX_HEIGHT,
// }: TicketActivityTimelineProps) {
//   const {
//     data: activities = [],
//     isLoading,
//     error,
//     refetch,
//   } = useQuery<ActivityItem[]>({
//     queryKey: ["ticket-activity", ticketId],
//     queryFn: async () => {
//       const response = await apiClient.get(`/tickets/${ticketId}/history`);
//       if (!response?.data?.history) throw new Error("Invalid response structure");
//       return response.data.history;
//     },
//     staleTime: 300000,
//     refetchOnWindowFocus: false,
//     retry: 2,
//   });

//   useEffect(() => {
//     if (refetchSignal !== undefined) {
//       refetch().catch(() =>
//         toast.error("Failed to refresh activity history")
//       );
//     }
//   }, [refetchSignal, refetch]);

//   if (isLoading) {
//     return (
//       <div className={cn("space-y-6", className)}>
//         {[...Array(3)].map((_, i) => (
//           <div key={i} className="flex gap-4">
//             <Skeleton className="h-10 w-10 rounded-full" />
//             <div className="flex-1 space-y-2">
//               <Skeleton className="h-4 w-32" />
//               <Skeleton className="h-3 w-24" />
//               <Skeleton className="h-12 w-full" />
//             </div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className={cn("text-center py-10 space-y-3", className)}>
//         <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
//         <p className="font-medium text-red-600">Error loading activity</p>
//         <p className="text-sm text-muted-foreground">Please try again later.</p>
//       </div>
//     );
//   }

//   return (
//     <ScrollArea className={cn(maxHeight, className)}>
//       <div className="relative space-y-6 pr-4">
//         <div className="absolute left-5 top-0 h-full w-px bg-border" />

//         {activities.length === 0 ? (
//           <div className="text-center py-10 space-y-3">
//             <History className="mx-auto h-8 w-8 text-muted-foreground" />
//             <p className="font-medium text-muted-foreground">No activity recorded</p>
//             <p className="text-sm text-muted-foreground">All ticket history will appear here.</p>
//           </div>
//         ) : (
//           activities.map((activity) => {
//             const meta = actionMeta[activity.action as WorkflowAction] ?? {
//               icon: Activity,
//               label: activity.action,
//               text: "text-muted-foreground",
//               bg: "bg-muted",
//             };
//             const Icon = meta.icon;

//             return (
//               <div key={activity.id} className="relative flex gap-4 group hover:bg-muted/40 rounded-lg px-2 py-3">
//                 <div className="absolute left-5 top-5 h-2 w-2 rounded-full bg-primary ring-4 ring-primary/10" />

//                 <Avatar className="h-10 w-10 border border-background">
//                   <AvatarImage src={activity.user?.avatarUrl || undefined} alt={activity.user?.name || "System"} />
//                   <AvatarFallback>{activity.user?.name?.[0]?.toUpperCase() || "S"}</AvatarFallback>
//                 </Avatar>

//                 <div className="flex-1 space-y-1">
//                   <div className="flex items-center gap-2 flex-wrap">
//                     <span className="font-medium text-sm">{activity.user?.name || "System"}</span>
//                     <Badge className={cn("flex items-center gap-1.5 text-xs", meta.text, meta.bg)}>
//                       <Icon className="h-3.5 w-3.5" />
//                       {meta.label}
//                     </Badge>
//                     <span className="text-xs text-muted-foreground">
//                       {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
//                     </span>
//                   </div>

//                   {activity.comment && (
//                     <p className="bg-muted p-3 text-sm rounded border border-border/40">
//                       {activity.comment}
//                     </p>
//                   )}

//                   <div className="text-xs text-muted-foreground space-y-1">
//                     {/* {activity.fromStatus && activity.status && activity.fromStatus !== activity.status && (
//                       <p>
//                         <strong>Status changed:</strong> {activity.fromStatus} → {activity.status}
//                       </p>
//                     )} */}
//                     {activity.action === WorkflowAction.STATUS_CHANGE &&
//                       activity.fromStatus &&
//                       activity.status &&
//                       activity.fromStatus !== activity.status && (
//                         <p>
//                           <strong>{activity.user?.name}</strong> changed status from{" "}
//                           <strong>{activity.fromStatus}</strong> to <strong>{activity.status}</strong>
//                         </p>
//                     )}

//                     {/* {activity.previousApproverName && activity.newApproverName && activity.previousApproverName !== activity.newApproverName && (
//                       <p>
//                         <strong>Approver changed:</strong> {activity.previousApproverName} → {activity.newApproverName}
//                       </p>
//                     )} */}
//                     {activity.action === WorkflowAction.APPROVAL &&
//                       activity.previousApproverName &&
//                       activity.newApproverName &&
//                       activity.previousApproverName !== activity.newApproverName && (
//                         <p>
//                           <strong>{activity.user?.name}</strong> changed approver from{" "}
//                           <strong>{activity.previousApproverName}</strong> to{" "}
//                           <strong>{activity.newApproverName}</strong>
//                         </p>
//                     )}

//                     {/* {activity.previousAssigneeName && activity.newAssigneeName && activity.previousAssigneeName !== activity.newAssigneeName && (
//                       <p>
//                         <strong>Assignee changed:</strong> {activity.previousAssigneeName} → {activity.newAssigneeName}
//                       </p>
//                     )} */}
//                     {activity.action === WorkflowAction.ASSIGNMENT &&
//                       activity.previousAssigneeName &&
//                       activity.newAssigneeName &&
//                       activity.previousAssigneeName !== activity.newAssigneeName && (
//                         <p>
//                           <strong>{activity.user?.name}</strong> reassigned the ticket from{" "}
//                           <strong>{activity.previousAssigneeName}</strong> to{" "}
//                           <strong>{activity.newAssigneeName}</strong>
//                         </p>
//                     )}
//                   </div>

//                   <div className="flex items-center text-xs gap-1 text-muted-foreground mt-1">
//                     <Clock className="h-3 w-3" />
//                     {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
//                   </div>
//                 </div>
//               </div>
//             );
//           })
//         )}
//       </div>
//     </ScrollArea>
//   );
// }

// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { useEffect } from "react";
// import { format, formatDistanceToNow } from "date-fns";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";
// import { apiClient } from "@/lib/api/client";
// import {
//   MessageSquare,
//   RefreshCw,
//   UserRoundCog,
//   Plus,
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   History,
//   Clock,
//   Activity,
// } from "lucide-react";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";
// import {
//   Badge
// } from "@/components/ui/badge";
// import {
//   ScrollArea,
// } from "@/components/ui/scroll-area";
// import {
//   Skeleton,
// } from "@/components/ui/skeleton";

// enum WorkflowAction {
//   CREATED = "CREATED",
//   STATUS_CHANGE = "STATUS_CHANGE",
//   ASSIGNMENT = "ASSIGNMENT",
//   APPROVAL = "APPROVAL",
//   REJECTION = "REJECTION",
//   COMMENT = "COMMENT",
// }

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   avatarUrl?: string | null;
// }

// interface ActivityItem {
//   id: string;
//   user: User | null;
//   action: WorkflowAction;
//   comment?: string | null;
//   status?: string | null;
//   fromStatus?: string | null;
//   createdAt: string;
//   previousAssigneeName?: string | null;
//   newAssigneeName?: string | null;
//   previousApproverName?: string | null;
//   newApproverName?: string | null;
// }

// interface TicketActivityTimelineProps {
//   ticketId: string;
//   refetchSignal?: number;
//   className?: string;
//   maxHeight?: string;
// }

// const ACTION_META = {
//   [WorkflowAction.COMMENT]: {
//     icon: MessageSquare,
//     label: "commented",
//     text: "text-blue-600 dark:text-blue-400",
//     bg: "bg-blue-50 dark:bg-blue-900/30",
//   },
//   [WorkflowAction.STATUS_CHANGE]: {
//     icon: RefreshCw,
//     label: "changed status",
//     text: "text-purple-600 dark:text-purple-400",
//     bg: "bg-purple-50 dark:bg-purple-900/30",
//   },
//   [WorkflowAction.ASSIGNMENT]: {
//     icon: UserRoundCog,
//     label: "reassigned",
//     text: "text-amber-600 dark:text-amber-400",
//     bg: "bg-amber-50 dark:bg-amber-900/30",
//   },
//   [WorkflowAction.CREATED]: {
//     icon: Plus,
//     label: "created ticket",
//     text: "text-green-600 dark:text-green-400",
//     bg: "bg-green-50 dark:bg-green-900/30",
//   },
//   [WorkflowAction.APPROVAL]: {
//     icon: CheckCircle2,
//     label: "approved",
//     text: "text-green-600 dark:text-green-400",
//     bg: "bg-green-50 dark:bg-green-900/30",
//   },
//   [WorkflowAction.REJECTION]: {
//     icon: XCircle,
//     label: "rejected",
//     text: "text-red-600 dark:text-red-400",
//     bg: "bg-red-50 dark:bg-red-900/30",
//   },
// } as const;

// const DEFAULT_MAX_HEIGHT = "h-[calc(100%-1px)]";

// export default function TicketActivityTimeline({
//   ticketId,
//   refetchSignal,
//   className = "",
//   maxHeight = DEFAULT_MAX_HEIGHT,
// }: TicketActivityTimelineProps) {
//   const { data, isLoading, error, refetch } = useQuery<ActivityItem[]>({
//     queryKey: ["ticket-activity", ticketId],
//     queryFn: async () => {
//       const res = await apiClient.get(`/tickets/${ticketId}/history`);
//       if (!res?.data?.history) throw new Error("Invalid response");
//       return res.data.history;
//     },
//     staleTime: 300000,
//   });

//   useEffect(() => {
//     if (refetchSignal !== undefined) {
//       refetch().catch(() => toast.error("Failed to refresh history"));
//     }
//   }, [refetchSignal, refetch]);

//   if (isLoading) return <ActivitySkeleton className={className} />;
//   if (error) return <ErrorState className={className} />;
//   if (!data?.length) return <EmptyState className={className} />;

//   return (
//     <ScrollArea className={cn(maxHeight, className)}>
//       <div className="relative space-y-6 pr-4">
//         <div className="absolute left-[1.125rem] top-0 h-full w-px bg-border" />
        
//         {data.map((activity) => (
//           <ActivityItem key={activity.id} activity={activity} />
//         ))}
//       </div>
//     </ScrollArea>
//   );
// }

// function ActivityItem({ activity }: { activity: ActivityItem }) {
//   const meta = ACTION_META[activity.action] ?? {
//     icon: Activity,
//     label: activity.action,
//     text: "text-muted-foreground",
//     bg: "bg-muted",
//   };
//   const Icon = meta.icon;

//   return (
//     <div className="relative flex gap-4 group hover:bg-muted/40 rounded-lg px-2 py-3">
//       <div className="absolute left-[1.125rem] top-5 h-2 w-2 rounded-full bg-primary ring-4 ring-primary/10" />

//       <Avatar className="h-10 w-10 border border-background">
//         <AvatarImage src={activity.user?.avatarUrl || undefined} />
//         <AvatarFallback>{activity.user?.name?.[0].toLocaleUpperCase() || "S"}</AvatarFallback>
//       </Avatar>

//       <div className="flex-1 space-y-1">
//         <div className="flex items-center gap-2 flex-wrap">
//           <span className="font-medium text-sm">{activity.user?.name || "System"}</span>
//           <Badge className={cn("flex items-center gap-1.5 text-xs", meta.text, meta.bg)}>
//             <Icon className="h-3.5 w-3.5" />
//             {meta.label}
//           </Badge>
//           <span className="text-xs text-muted-foreground">
//             {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
//           </span>
//         </div>

//         {activity.comment && (
//           <p className="bg-muted p-3 text-sm rounded border border-border/40">
//             {activity.comment}
//           </p>
//         )}

//         <ActivityDetails activity={activity} />

//         <div className="flex items-center text-xs gap-1 text-muted-foreground mt-1">
//           <Clock className="h-3 w-3" />
//           {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
//         </div>
//       </div>
//     </div>
//   );
// }

// function ActivityDetails({ activity }: { activity: ActivityItem }) {
//   if (activity.action === WorkflowAction.STATUS_CHANGE && 
//       activity.fromStatus && 
//       activity.status && 
//       activity.fromStatus !== activity.status) {
//     return (
//       <p className="text-xs text-muted-foreground">
//         <strong>{activity.user?.name}</strong> changed status from{" "}
//         <strong>{activity.fromStatus}</strong> to <strong>{activity.status}</strong>
//       </p>
//     );
//   }

//   if (activity.action === WorkflowAction.APPROVAL && 
//       activity.previousApproverName && 
//       activity.newApproverName && 
//       activity.previousApproverName !== activity.newApproverName) {
//     return (
//       <p className="text-xs text-muted-foreground">
//         <strong>{activity.user?.name}</strong> changed approver from{" "}
//         <strong>{activity.previousApproverName}</strong> to{" "}
//         <strong>{activity.newApproverName}</strong>
//       </p>
//     );
//   }

//   if (activity.action === WorkflowAction.ASSIGNMENT && 
//       activity.previousAssigneeName && 
//       activity.newAssigneeName && 
//       activity.previousAssigneeName !== activity.newAssigneeName) {
//     return (
//       <p className="text-xs text-muted-foreground">
//         <strong>{activity.user?.name}</strong> reassigned the ticket from{" "}
//         <strong>{activity.previousAssigneeName}</strong> to{" "}
//         <strong>{activity.newAssigneeName}</strong>
//       </p>
//     );
//   }

//   return null;
// }


// "use client";

// import { useQuery } from "@tanstack/react-query";
// import { useEffect } from "react";
// import { format, formatDistanceToNow } from "date-fns";
// import { toast } from "sonner";
// import { cn } from "@/lib/utils";
// import { apiClient } from "@/lib/api/client";
// import {
//   MessageSquare,
//   RefreshCw,
//   UserRoundCog,
//   Plus,
//   CheckCircle2,
//   XCircle,
//   AlertCircle,
//   History,
//   Clock,
//   Activity,
// } from "lucide-react";
// import {
//   Avatar,
//   AvatarFallback,
//   AvatarImage,
// } from "@/components/ui/avatar";
// import {
//   Badge
// } from "@/components/ui/badge";
// import {
//   ScrollArea,
// } from "@/components/ui/scroll-area";
// import {
//   Skeleton,
// } from "@/components/ui/skeleton";

// enum WorkflowAction {
//   CREATED = "CREATED",
//   STATUS_CHANGE = "STATUS_CHANGE",
//   ASSIGNMENT = "ASSIGNMENT",
//   APPROVAL = "APPROVAL",
//   REJECTION = "REJECTION",
//   COMMENT = "COMMENT",
// }

// interface User {
//   id: string;
//   name: string;
//   email: string;
//   avatarUrl?: string | null;
// }

// interface ActivityItem {
//   id: string;
//   user: User | null;
//   action: WorkflowAction;
//   comment?: string | null;
//   status?: string | null;
//   fromStatus?: string | null;
//   createdAt: string;
//   previousAssigneeName?: string | null;
//   newAssigneeName?: string | null;
//   previousApproverName?: string | null;
//   newApproverName?: string | null;
// }

// interface TicketActivityTimelineProps {
//   ticketId: string;
//   refetchSignal?: number;
//   className?: string;
//   maxHeight?: string;
// }



// const ACTION_META = {
//   [WorkflowAction.COMMENT]: {
//     icon: MessageSquare,
//     label: "commented",
//     text: "text-blue-600 dark:text-blue-400",
//     bg: "bg-blue-50 dark:bg-blue-900/30",
//   },
//   [WorkflowAction.STATUS_CHANGE]: {
//     icon: RefreshCw,
//     label: "changed status",
//     text: "text-purple-600 dark:text-purple-400",
//     bg: "bg-purple-50 dark:bg-purple-900/30",
//   },
//   [WorkflowAction.ASSIGNMENT]: {
//     icon: UserRoundCog,
//     label: "reassigned",
//     text: "text-amber-600 dark:text-amber-400",
//     bg: "bg-amber-50 dark:bg-amber-900/30",
//   },
//   [WorkflowAction.CREATED]: {
//     icon: Plus,
//     label: "created ticket",
//     text: "text-green-600 dark:text-green-400",
//     bg: "bg-green-50 dark:bg-green-900/30",
//   },
//   [WorkflowAction.APPROVAL]: {
//     icon: CheckCircle2,
//     label: "approved",
//     text: "text-green-600 dark:text-green-400",
//     bg: "bg-green-50 dark:bg-green-900/30",
//   },
//   [WorkflowAction.REJECTION]: {
//     icon: XCircle,
//     label: "rejected",
//     text: "text-red-600 dark:text-red-400",
//     bg: "bg-red-50 dark:bg-red-900/30",
//   },
// } as const;

// // Status color mapping
// const STATUS_COLORS = {
//   OPEN: {
//     text: "text-blue-600 dark:text-blue-400",
//     bg: "bg-blue-50 dark:bg-blue-900/30",
//   },
//   IN_PROGRESS: {
//     text: "text-amber-600 dark:text-amber-400",
//     bg: "bg-amber-50 dark:bg-amber-900/30",
//   },
//   PENDING_REVIEW: {
//     text: "text-purple-600 dark:text-purple-400",
//     bg: "bg-purple-50 dark:bg-purple-900/30",
//   },
//   APPROVED: {
//     text: "text-green-600 dark:text-green-400",
//     bg: "bg-green-50 dark:bg-green-900/30",
//   },
//   REJECTED: {
//     text: "text-red-600 dark:text-red-400",
//     bg: "bg-red-50 dark:bg-red-900/30",
//   },
//   COMPLETED: {
//     text: "text-emerald-600 dark:text-emerald-400",
//     bg: "bg-emerald-50 dark:bg-emerald-900/30",
//   },
//   CLOSED: {
//     text: "text-gray-600 dark:text-gray-400",
//     bg: "bg-gray-50 dark:bg-gray-900/30",
//   },
//   // Default fallback
//   DEFAULT: {
//     text: "text-muted-foreground",
//     bg: "bg-muted",
//   },
// } as const;

// const DEFAULT_MAX_HEIGHT = "h-[calc(100%-1px)]";

// export default function TicketActivityTimeline({
//   ticketId,
//   refetchSignal,
//   className = "",
//   maxHeight = DEFAULT_MAX_HEIGHT,
// }: TicketActivityTimelineProps) {
//   const { data, isLoading, error, refetch } = useQuery<ActivityItem[]>({
//     queryKey: ["ticket-activity", ticketId],
//     queryFn: async () => {
//       const res = await apiClient.get(`/tickets/${ticketId}/history`);
//       if (!res?.data?.history) throw new Error("Invalid response");
//       return res.data.history;
//     },
//     staleTime: 300000,
//   });

//   useEffect(() => {
//     if (refetchSignal !== undefined) {
//       refetch().catch(() => toast.error("Failed to refresh history"));
//     }
//   }, [refetchSignal, refetch]);

//   if (isLoading) return <ActivitySkeleton className={className} />;
//   if (error) return <ErrorState className={className} />;
//   if (!data?.length) return <EmptyState className={className} />;

//   return (
//     <ScrollArea className={cn(maxHeight, className)}>
//       <div className="relative space-y-6 pr-4">
//         <div className="absolute left-[1.125rem] top-0 h-full w-px bg-border" />
        
//         {data.map((activity) => (
//           <ActivityItem key={activity.id} activity={activity} />
//         ))}
//       </div>
//     </ScrollArea>
//   );
// }

// function ActivityItem({ activity }: { activity: ActivityItem }) {
//   const meta = ACTION_META[activity.action] ?? {
//     icon: Activity,
//     label: activity.action,
//     text: "text-muted-foreground",
//     bg: "bg-muted",
//   };
//   const Icon = meta.icon;

//   // Get status colors if this is a status change
//   const fromStatusColor = activity.fromStatus 
//     ? STATUS_COLORS[activity.fromStatus as keyof typeof STATUS_COLORS] || STATUS_COLORS.DEFAULT
//     : null;
//   const toStatusColor = activity.status 
//     ? STATUS_COLORS[activity.status as keyof typeof STATUS_COLORS] || STATUS_COLORS.DEFAULT
//     : null;

//   return (
//     <div className="relative flex gap-4 group hover:bg-muted/40 rounded-lg px-2 py-3">
//       <div className="absolute left-[1.125rem] top-5 h-2 w-2 rounded-full bg-primary ring-4 ring-primary/10" />

//       <Avatar className="h-10 w-10 border border-background">
//         <AvatarImage src={activity.user?.avatarUrl || undefined} />
//         <AvatarFallback>{activity.user?.name?.[0].toLocaleUpperCase() || "S"}</AvatarFallback>
//       </Avatar>

//       <div className="flex-1 space-y-1">
//         <div className="flex items-center gap-2 flex-wrap">
//           <span className="font-medium text-sm">{activity.user?.name || "System"}</span>
//           <Badge className={cn("flex items-center gap-1.5 text-xs", meta.text, meta.bg)}>
//             <Icon className="h-3.5 w-3.5" />
//             {meta.label}
//           </Badge>
//           <span className="text-xs text-muted-foreground">
//             {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
//           </span>
//         </div>

//         {activity.comment && (
//           <p className="bg-muted p-3 text-sm rounded border border-border/40">
//             {activity.comment}
//           </p>
//         )}

//         <ActivityDetails 
//           activity={activity} 
//           fromStatusColor={fromStatusColor} 
//           toStatusColor={toStatusColor} 
//         />

//         <div className="flex items-center text-xs gap-1 text-muted-foreground mt-1">
//           <Clock className="h-3 w-3" />
//           {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
//         </div>
//       </div>
//     </div>
//   );
// }

// function ActivityDetails({ 
//   activity, 
//   fromStatusColor,
//   toStatusColor
// }: { 
//   activity: ActivityItem;
//   fromStatusColor?: typeof STATUS_COLORS[keyof typeof STATUS_COLORS];
//   toStatusColor?: typeof STATUS_COLORS[keyof typeof STATUS_COLORS];
// }) {
//   if (activity.action === WorkflowAction.STATUS_CHANGE && 
//       activity.fromStatus && 
//       activity.status && 
//       activity.fromStatus !== activity.status) {
//     return (
//       <p className="text-xs text-muted-foreground">
//         <strong>{activity.user?.name}</strong> changed status from{" "}
//         <Badge className={cn("px-1.5 py-0.5 text-xs", fromStatusColor?.text, fromStatusColor?.bg)}>
//           {activity.fromStatus}
//         </Badge>{" "}
//         to{" "}
//         <Badge className={cn("px-1.5 py-0.5 text-xs", toStatusColor?.text, toStatusColor?.bg)}>
//           {activity.status}
//         </Badge>
//       </p>
//     );
//   }

//   if (activity.action === WorkflowAction.APPROVAL && 
//       activity.previousApproverName && 
//       activity.newApproverName && 
//       activity.previousApproverName !== activity.newApproverName) {
//     return (
//       <p className="text-xs text-muted-foreground">
//         <strong>{activity.user?.name}</strong> changed approver from{" "}
//         <strong>{activity.previousApproverName}</strong> to{" "}
//         <strong>{activity.newApproverName}</strong>
//       </p>
//     );
//   }

//   if (activity.action === WorkflowAction.ASSIGNMENT && 
//       activity.previousAssigneeName && 
//       activity.newAssigneeName && 
//       activity.previousAssigneeName !== activity.newAssigneeName) {
//     return (
//       <p className="text-xs text-muted-foreground">
//         <strong>{activity.user?.name}</strong> reassigned the ticket from{" "}
//         <strong>{activity.previousAssigneeName}</strong> to{" "}
//         <strong>{activity.newAssigneeName}</strong>
//       </p>
//     );
//   }

//   return null;
// }

// // ... (keep the remaining ActivitySkeleton, ErrorState, and EmptyState components the same)

// function ActivitySkeleton({ className }: { className?: string }) {
//   return (
//     <div className={cn("space-y-6", className)}>
//       {[...Array(3)].map((_, i) => (
//         <div key={i} className="flex gap-4">
//           <Skeleton className="h-10 w-10 rounded-full" />
//           <div className="flex-1 space-y-2">
//             <Skeleton className="h-4 w-32" />
//             <Skeleton className="h-3 w-24" />
//             <Skeleton className="h-12 w-full" />
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }

// function ErrorState({ className }: { className?: string }) {
//   return (
//     <div className={cn("text-center py-10 space-y-3", className)}>
//       <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
//       <p className="font-medium text-red-600">Error loading activity</p>
//       <p className="text-sm text-muted-foreground">Please try again later.</p>
//     </div>
//   );
// }

// function EmptyState({ className }: { className?: string }) {
//   return (
//     <div className={cn("text-center py-10 space-y-3", className)}>
//       <History className="mx-auto h-8 w-8 text-muted-foreground" />
//       <p className="font-medium text-muted-foreground">No activity recorded</p>
//       <p className="text-sm text-muted-foreground">All ticket history will appear here.</p>
//     </div>
//   );
// }



"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { format, formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { apiClient } from "@/lib/api/client";
import {
  MessageSquare,
  RefreshCw,
  UserRoundCog,
  Plus,
  CheckCircle2,
  XCircle,
  AlertCircle,
  History,
  Clock,
  Activity,
} from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  Badge,
} from "@/components/ui/badge";
import {
  ScrollArea,
} from "@/components/ui/scroll-area";
import {
  Skeleton,
} from "@/components/ui/skeleton";

enum WorkflowAction {
  CREATED = "CREATED",
  STATUS_CHANGE = "STATUS_CHANGE",
  ASSIGNMENT = "ASSIGNMENT",
  APPROVAL = "APPROVAL",
  REJECTION = "REJECTION",
  COMMENT = "COMMENT",
}

interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
}

interface ActivityItem {
  id: string;
  user: User | null;
  action: WorkflowAction;
  comment?: string | null;
  status?: string | null;
  fromStatus?: string | null;
  createdAt: string;
  previousAssigneeName?: string | null;
  newAssigneeName?: string | null;
  previousApproverName?: string | null;
  newApproverName?: string | null;
}

interface TicketActivityTimelineProps {
  ticketId: string;
  refetchSignal?: number;
  className?: string;
  maxHeight?: string;
}

const ACTION_META = {
  [WorkflowAction.COMMENT]: {
    icon: MessageSquare,
    label: "commented",
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/30",
  },
  [WorkflowAction.STATUS_CHANGE]: {
    icon: RefreshCw,
    label: "changed status",
    text: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/30",
  },
  [WorkflowAction.ASSIGNMENT]: {
    icon: UserRoundCog,
    label: "reassigned",
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/30",
  },
  [WorkflowAction.CREATED]: {
    icon: Plus,
    label: "created ticket",
    text: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/30",
  },
  [WorkflowAction.APPROVAL]: {
    icon: CheckCircle2,
    label: "approved",
    text: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/30",
  },
  [WorkflowAction.REJECTION]: {
    icon: XCircle,
    label: "rejected",
    text: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/30",
  },
} as const;

const STATUS_COLORS = {
  OPEN: {
    text: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-900/30",
  },
  IN_PROGRESS: {
    text: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-50 dark:bg-amber-900/30",
  },
  PENDING_REVIEW: {
    text: "text-purple-600 dark:text-purple-400",
    bg: "bg-purple-50 dark:bg-purple-900/30",
  },
  APPROVED: {
    text: "text-green-600 dark:text-green-400",
    bg: "bg-green-50 dark:bg-green-900/30",
  },
  REJECTED: {
    text: "text-red-600 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-900/30",
  },
  COMPLETED: {
    text: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-900/30",
  },
  CLOSED: {
    text: "text-gray-600 dark:text-gray-400",
    bg: "bg-gray-50 dark:bg-gray-900/30",
  },
  DEFAULT: {
    text: "text-muted-foreground",
    bg: "bg-muted",
  },
} as const;

const DEFAULT_MAX_HEIGHT = "h-[calc(100%-1px)]";

type StatusColor = typeof STATUS_COLORS[keyof typeof STATUS_COLORS];

interface ActivityDetailsProps {
  activity: ActivityItem;
  fromStatusColor?: StatusColor;
  toStatusColor?: StatusColor;
}

export default function TicketActivityTimeline({
  ticketId,
  refetchSignal,
  className = "",
  maxHeight = DEFAULT_MAX_HEIGHT,
}: TicketActivityTimelineProps) {
  const { data, isLoading, error, refetch } = useQuery<ActivityItem[]>({
    queryKey: ["ticket-activity", ticketId],
    queryFn: async () => {
      const res = await apiClient.get(`/tickets/${ticketId}/history`);
      if (!res?.data?.history) throw new Error("Invalid response");
      return res.data.history;
    },
    staleTime: 300000,
  });

  useEffect(() => {
    if (refetchSignal !== undefined) {
      refetch().catch(() => toast.error("Failed to refresh history"));
    }
  }, [refetchSignal, refetch]);

  if (isLoading) return <ActivitySkeleton className={className} />;
  if (error) return <ErrorState className={className} />;
  if (!data?.length) return <EmptyState className={className} />;

  return (
    <ScrollArea className={cn(maxHeight, className)}>
      <div className="relative space-y-6 pr-4">
        <div className="absolute left-[1.125rem] top-0 h-full w-px bg-border" />
        
        {data.map((activity) => (
          <ActivityItem key={activity.id} activity={activity} />
        ))}
      </div>
    </ScrollArea>
  );
}

function ActivityItem({ activity }: { activity: ActivityItem }) {
  const meta = ACTION_META[activity.action] ?? {
    icon: Activity,
    label: activity.action,
    text: "text-muted-foreground",
    bg: "bg-muted",
  };
  const Icon = meta.icon;

  const fromStatusColor = activity.fromStatus 
    ? STATUS_COLORS[activity.fromStatus as keyof typeof STATUS_COLORS]
    : undefined;
  const toStatusColor = activity.status 
    ? STATUS_COLORS[activity.status as keyof typeof STATUS_COLORS]
    : undefined;

  return (
    <div className="relative flex gap-4 group hover:bg-muted/40 rounded-lg px-2 py-3">
      <div className="absolute left-[1.125rem] top-5 h-2 w-2 rounded-full bg-primary ring-4 ring-primary/10" />

      <Avatar className="h-10 w-10 border border-background">
        <AvatarImage src={activity.user?.avatarUrl || undefined} />
        <AvatarFallback>{activity.user?.name?.[0]?.toLocaleUpperCase() || "S"}</AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{activity.user?.name || "System"}</span>
          <Badge className={cn("flex items-center gap-1.5 text-xs", meta.text, meta.bg)}>
            <Icon className="h-3.5 w-3.5" />
            {meta.label}
          </Badge>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
          </span>
        </div>

        {activity.comment && (
          <p className="bg-muted p-3 text-sm rounded border border-border/40">
            {activity.comment}
          </p>
        )}

        <ActivityDetails 
          activity={activity} 
          fromStatusColor={fromStatusColor} 
          toStatusColor={toStatusColor} 
        />

        <div className="flex items-center text-xs gap-1 text-muted-foreground mt-1">
          <Clock className="h-3 w-3" />
          {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
        </div>
      </div>
    </div>
  );
}

function ActivityDetails({ 
  activity, 
  fromStatusColor = STATUS_COLORS.DEFAULT,
  toStatusColor = STATUS_COLORS.DEFAULT
}: ActivityDetailsProps) {
  if (activity.action === WorkflowAction.STATUS_CHANGE && 
      activity.fromStatus && 
      activity.status && 
      activity.fromStatus !== activity.status) {
    return (
      <p className="text-xs text-muted-foreground">
        <strong>{activity.user?.name}</strong> changed status from{" "}
        <Badge className={cn("px-1.5 py-0.5 text-xs", fromStatusColor.text, fromStatusColor.bg)}>
          {activity.fromStatus}
        </Badge>{" "}
        to{" "}
        <Badge className={cn("px-1.5 py-0.5 text-xs", toStatusColor.text, toStatusColor.bg)}>
          {activity.status}
        </Badge>
      </p>
    );
  }

  if (activity.action === WorkflowAction.APPROVAL && 
      activity.previousApproverName && 
      activity.newApproverName && 
      activity.previousApproverName !== activity.newApproverName) {
    return (
      <p className="text-xs text-muted-foreground">
        <strong>{activity.user?.name}</strong> changed approver from{" "}
        <strong>{activity.previousApproverName}</strong> to{" "}
        <strong>{activity.newApproverName}</strong>
      </p>
    );
  }

  if (activity.action === WorkflowAction.ASSIGNMENT && 
      activity.previousAssigneeName && 
      activity.newAssigneeName && 
      activity.previousAssigneeName !== activity.newAssigneeName) {
    return (
      <p className="text-xs text-muted-foreground">
        <strong>{activity.user?.name}</strong> reassigned the ticket from{" "}
        <strong>{activity.previousAssigneeName}</strong> to{" "}
        <strong>{activity.newAssigneeName}</strong>
      </p>
    );
  }

  return null;
}

function ActivitySkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-6", className)}>
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex gap-4">
          <Skeleton className="h-10 w-10 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      ))}
    </div>
  );
}

function ErrorState({ className }: { className?: string }) {
  return (
    <div className={cn("text-center py-10 space-y-3", className)}>
      <AlertCircle className="mx-auto h-8 w-8 text-red-500" />
      <p className="font-medium text-red-600">Error loading activity</p>
      <p className="text-sm text-muted-foreground">Please try again later.</p>
    </div>
  );
}

function EmptyState({ className }: { className?: string }) {
  return (
    <div className={cn("text-center py-10 space-y-3", className)}>
      <History className="mx-auto h-8 w-8 text-muted-foreground" />
      <p className="font-medium text-muted-foreground">No activity recorded</p>
      <p className="text-sm text-muted-foreground">All ticket history will appear here.</p>
    </div>
  );
}