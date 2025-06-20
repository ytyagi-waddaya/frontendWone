export type Ticket = {
  id: string;
  code: string;
  title: string;
  description?: string;
  priority: string;
  status: string;
  createdAt: string;
  attachments?: string;
  department?: {
    id: string;
    name: string;
    isActive: boolean;
    deletedAt: string | null;
  };
  createdBy?: {
    id: string;
    name: string;
    email: string;
  };
  assignedTo?: {
    id: string;
    name: string;
    email?: string;
  } | null;
};
