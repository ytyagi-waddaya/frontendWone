
"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { 
  MessageSquare,
  RefreshCw,
  UserRoundCog,
  Activity,
  AlertCircle,
  History,
  Clock,
  CheckCircle2,
  XCircle,
  Plus
} from "lucide-react";
import { JSX, useEffect, useMemo } from "react";
import { getStyle } from "@/components/badgeStyles";
import { toast } from "sonner";

enum WorkflowAction {
  CREATED = "CREATED",
  STATUS_CHANGE = "STATUS_CHANGE",
  ASSIGNMENT = "ASSIGNMENT",
  APPROVAL = "APPROVAL",
  REJECTION = "REJECTION",
  COMMENT = "COMMENT"
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
  createdAt: string;
  metadata?: Record<string, unknown> | null;
}

interface TicketActivityTimelineProps {
  ticketId: string;
  refetchSignal?: number;
  className?: string;
  maxHeight?: string;
}

const DEFAULT_MAX_HEIGHT = "h-[calc(100%-1px)]";

const actionIcons: Record<WorkflowAction, JSX.Element> = {
  [WorkflowAction.COMMENT]: <MessageSquare className="h-3.5 w-3.5" />,
  [WorkflowAction.STATUS_CHANGE]: <RefreshCw className="h-3.5 w-3.5" />,
  [WorkflowAction.ASSIGNMENT]: <UserRoundCog className="h-3.5 w-3.5" />,
  [WorkflowAction.CREATED]: <Plus className="h-3.5 w-3.5" />,
  [WorkflowAction.APPROVAL]: <CheckCircle2 className="h-3.5 w-3.5" />,
  [WorkflowAction.REJECTION]: <XCircle className="h-3.5 w-3.5" />,
};

const actionLabels: Record<WorkflowAction, string> = {
  [WorkflowAction.COMMENT]: "commented",
  [WorkflowAction.STATUS_CHANGE]: "changed status",
  [WorkflowAction.ASSIGNMENT]: "reassigned",
  [WorkflowAction.CREATED]: "created ticket",
  [WorkflowAction.APPROVAL]: "approved",
  [WorkflowAction.REJECTION]: "rejected",
};

const actionVariant: Record<WorkflowAction, "default" | "secondary" | "destructive" | "outline"> = {
  [WorkflowAction.COMMENT]: "secondary",
  [WorkflowAction.STATUS_CHANGE]: "outline",
  [WorkflowAction.ASSIGNMENT]: "default",
  [WorkflowAction.CREATED]: "outline",
  [WorkflowAction.APPROVAL]: "default",
  [WorkflowAction.REJECTION]: "destructive",
};

const actionClasses: Record<WorkflowAction, string> = {
  [WorkflowAction.COMMENT]: "text-blue-600 bg-blue-50 hover:bg-blue-100",
  [WorkflowAction.STATUS_CHANGE]: "text-purple-600 bg-purple-50 hover:bg-purple-100",
  [WorkflowAction.ASSIGNMENT]: "text-amber-600 bg-amber-50 hover:bg-amber-100",
  [WorkflowAction.CREATED]: "text-green-600 bg-green-50 hover:bg-green-100",
  [WorkflowAction.APPROVAL]: "text-green-600 bg-green-50 hover:bg-green-100",
  [WorkflowAction.REJECTION]: "text-red-600 bg-red-50 hover:bg-red-100",
};

export default function TicketActivityTimeline({ 
  ticketId, 
  refetchSignal,
  className = "",
  maxHeight = DEFAULT_MAX_HEIGHT
}: TicketActivityTimelineProps) {
  const { data, isLoading, error, refetch } = useQuery<ActivityItem[]>({
    queryKey: ["ticket-activity", ticketId],
    queryFn: async () => {
      try {
        const response = await apiClient.get(`/tickets/${ticketId}/history`);
        
        if (!response?.data?.history) {
          throw new Error("Invalid response structure");
        }
        
        return response.data.history.map((item: unknown) => {
          if (typeof item !== 'object' || item === null) {
            throw new Error("Invalid activity item");
          }

          const activity = item as Record<string, unknown>;
          
          return {
            id: String(activity.id),
            user: activity.user ? {
              id: String((activity.user as any).id),
              name: String((activity.user as any).name),
              email: String((activity.user as any).email),
              avatarUrl: (activity.user as any).avatarUrl ? String((activity.user as any).avatarUrl) : null
            } : null,
            action: String(activity.action).toUpperCase() as WorkflowAction,
            comment: activity.comment ? String(activity.comment) : null,
            status: activity.status ? String(activity.status) : null,
            createdAt: String(activity.createdAt),
            metadata: activity.metadata ? activity.metadata as Record<string, unknown> : null
          };
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to fetch ticket history";
        toast.error("Error", {
          description: errorMessage
        });
        throw new Error(errorMessage);
      }
    },
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 300000, // 5 minutes
  });

  useEffect(() => {
    if (refetchSignal !== undefined) {
      refetch().catch(() => {
        toast.error("Refresh failed", {
          description: "Could not update ticket history"
        });
      });
    }
  }, [refetchSignal, refetch]);

  const sortedActivities = useMemo(() => {
    if (!data) return [];
    return [...data].sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [data]);

  if (isLoading) {
    return (
      <div className={`space-y-4 ${className}`} data-testid="activity-loading">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={`skeleton-${index}`} className="flex gap-3">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-3 w-[200px]" />
              <Skeleton className="h-3 w-[80px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex flex-col items-center justify-center py-8 gap-2 text-center ${className}`}>
        <AlertCircle className="h-5 w-5 text-destructive" />
        <p className="text-sm font-medium text-destructive">
          Failed to load activity
        </p>
        <p className="text-xs text-muted-foreground">
          Couldn't retrieve the ticket history
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className={`${maxHeight} ${className}`} data-testid="activity-scroll-area">
      <div className="relative pr-3">
        <div className="absolute left-4 top-0 h-full w-px bg-border" aria-hidden="true" />

        <div className="space-y-6">
          {sortedActivities.length > 0 ? (
            sortedActivities.map((activity) => (
              <div key={activity.id} className="relative flex gap-3">
                <div className="relative z-10 flex flex-col items-center">
                  <Avatar className="h-8 w-8 border-2 border-background">
                    <AvatarImage 
                      src={activity.user?.avatarUrl || undefined} 
                      alt={activity.user?.name ? `${activity.user.name}'s avatar` : "System avatar"} 
                    />
                    <AvatarFallback className="text-xs font-medium bg-muted">
                      {activity.user?.name?.charAt(0).toUpperCase() || "S"}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex-1 space-y-1.5 pb-6">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {activity.user?.name || "System"}
                    </span>
                    <Badge 
                      variant={actionVariant[activity.action]}
                      className={`flex items-center gap-1 ${actionClasses[activity.action]}`}
                      aria-label={`Action: ${activity.action}`}
                    >
                      {actionIcons[activity.action] || <Activity className="h-3.5 w-3.5" />}
                      {actionLabels[activity.action] || activity.action.toLowerCase().replace("_", " ")}
                    </Badge>
                  </div>

                  {activity.comment && (
                    <div className="rounded-lg bg-muted/50 p-3 text-sm whitespace-pre-wrap break-words">
                      {activity.comment}
                    </div>
                  )}

                  {activity.status && (
                    <Badge 
                      variant="outline" 
                      className={`mt-1 gap-1 ${getStyle("status", activity.status)}`}
                      aria-label={`Status: ${activity.status}`}
                    >
                      <RefreshCw className="h-3 w-3" />
                      Status: {activity.status.replace("_", " ")}
                    </Badge>
                  )}

                  <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                    <Clock className="h-3 w-3" />
                    {format(new Date(activity.createdAt), "MMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 gap-2">
              <History className="h-5 w-5 text-muted-foreground" />
              <p className="text-sm font-medium text-muted-foreground">
                No activity recorded
              </p>
              <p className="text-xs text-muted-foreground">
                This ticket has no history yet
              </p>
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}