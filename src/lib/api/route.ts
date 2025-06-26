import { LoginSchemaType,  RegisterSchemaType, TicketSchemaType, UpdateTicketSchemaType } from "../validations/auth";
import { apiClient } from "./client";

export const registerUser = async (data: RegisterSchemaType) => {
  const response = await apiClient.post("/auth/register", data);
  return response.data;
};

export const loginUser = async (data: LoginSchemaType) => {
  const response = await apiClient.post("/auth/login", data, {
    withCredentials: true,  
  });
  return response.data;
};

export const logout = async () => {
  const response = await apiClient.post("/auth/logout");
  return response.data;
};

export const changePassword = async (data: { email: string; newPassword: string }) => {
  const response = await apiClient.post("/auth/change-password", data);
  return response.data;
};


// export const me = async (cookie: string) => {
//   const response = await apiClient.get("/auth/me" )
//   return response.data;
// };


// export const me = async (cookie: string) => {
//   return await apiClient.get("/auth/me", {
//     headers: {
//       Cookie: cookie, // forward cookies from SSR
//     },
//     withCredentials: true, // ensures cookie is sent
//   }).then(res => res.data);
// };

export const createTicket = async (formData:FormData) => {
  const response = await apiClient.post("/tickets", formData);
  return response.data;
};

export const getTickets = async () => {
  const response = await apiClient.get("/tickets/tickets");
  return response.data;
};

// export const TicketsByUserId = async () => {
//   const response = await apiClient.get("/tickets/users");
//   console.log(response.data);
  
//   return response.data;
// };

export const TicketsByUserId = async (activeOnly = false) => {
  const response = await apiClient.get("/tickets/users", {
    params: { activeOnly }
  });

  console.log("BY USER:",response.data);
  
  return response.data;
};


export const getTicket = async (id: string)=> {
  const response = await apiClient.get(`/tickets/${id}`);
  console.log(response.data.tickets);
  
  return response.data.tickets;
};

export const assignTicket = async (ticketId: string, assignedToId: string) => {
  const response = await apiClient.put(`/tickets/${ticketId}/assign`, {
    assignedToId,
  });
  return response.data.ticket;
};

// export const updateTicketStatus = async (ticketId: string, status: string, assignedToId?: string) => {
//   const response = await apiClient.put(`/tickets/${ticketId}/status`, {
//     status,
//     assignedToId
//   });

//   return response.data.ticket;
// };

export const updateTicketStatus = async (
  ticketId: string,
  newStatus: string,
  assignedToId?: string,
  approverId?: string,
  comment?: string
) => {
  const response = await apiClient.put(`/tickets/${ticketId}/status`, {
    newStatus,
    assignedToId,
    approverId,
    comment,
  });
    console.log("TICKET STATUS:",response.data);
    
  return response.data;
};

export const getTicketHistory = async (ticketId: string) => {
  const response = await apiClient.get(`/tickets/${ticketId}/history`);
  console.log("HISTORY:",response.data.history);
  
  return response.data.history; 
};

export const getTicketComments = async (ticketId: string) => {
  const response = await apiClient.get(`/tickets/${ticketId}/comments`);
  return response.data.comments;
};

export const postTicketComment = async (
  ticketId: string,
  payload: { comment: string; mentions?: string[] }
) => {
  const response = await apiClient.post(`/tickets/${ticketId}/comments`, payload);
  return response.data.comment;
};

// export const updateTicket = async (
//   ticketId: string,
//   status: string,
//   userId?: string
// ) => {
//   const response = await apiClient.post(`/tickets/${ticketId}/reassign`, {
//     status,
//     userId, 
//   });
//   return response.data;
// };


export const updateTicket = async (
  ticketId: string,
  newStatus: string,
  assignedToId?: string,
  approverId?: string
) => {
  const response = await apiClient.post(`/tickets/${ticketId}/reassign`, {
    newStatus,
    assignedToId,
    approverId,
  });
  return response.data;
};







// export const fetchUserTickets = async () => {
//   const response = await apiClient.get("/tickets/user");    
//   return response.data;
// };

// export const fetchTicketById = async (id:string) => {
//     const response = await apiClient.get(`/tickets/${id}`);
//     return response.data;
// }

// users
export const listAllUsers = async () => {
    const response = await apiClient.get("/users");
    return response.data;
}

export const getUser = async (id:string) => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
}

// export const updateUserRole = (id: string, roleId: string) =>
//   apiClient.patch(`/users/${id}/roles`, { roleId });

// export const updateUserDepartment = (id: string, departmentId: string) =>
//   apiClient.patch(`/users/${id}/departments`, { departmentId });

export const deleteUser = (id: string) =>
  apiClient.patch(`/users/${id}/delete`);

export const restoreUser = (id: string) =>
  apiClient.patch(`/users/${id}/restore`);


// export const updateTicket = async (id: string, data: UpdateTicketSchemaType) => {
//   const response = await apiClient.put(`/tickets/${id}`, data);
//   return response.data;
// };

// export const updateTicket = async (id: string, data: UpdateTicketSchemaType): Promise<void> => {
//   await apiClient.put(`/tickets/${id}`, data);
// };

// export const addcomment = async (formData: FormData) => {
//   const response = await apiClient.post("/comment", formData);
//   return response.data;
// };



// export const addComment = async (commentData: {
//   ticketId: string;
//   updatedBy: string;
//   comment: string;
//   mentions: string[];
// }) => {
//   const response = await apiClient.post("/comment", commentData);
//   return response.data; // your backend comment object
// };


// export const addComment = async ({
//   ticketId,
//   updatedBy,
//   comment,
//   mentions,
// }: {
//   ticketId: string;
//   updatedBy: string;
//   comment: string;
//   mentions: string[];
// }) => {
//   const response = await apiClient.post("/comment", {
//     ticketId,
//     updatedBy,
//     comment,
//     mentions,
//   });
//   return response.data;
// };


// export const fetchCommentsByTicketId = async (ticketId: string) => {
//   const response = await apiClient.get(`/comment/${ticketId}`);
//   return response.data;
// };


// export const fetchNotifications = async () => {
//   const response = await apiClient.get("/notifications");
//   return response.data; 
// };

// export const markNotificationAsRead = async (notificationId: string) => {
//   const response = await apiClient.patch(`/notifications/${notificationId}/read`);
//   return response.data;
// };

// export const markAllNotificationsAsRead = async () => {
//   const response = await apiClient.patch("/notifications/read-all");
//   return response.data;
// };



// roles

export const getAllRoles = async () => {
  const response = await apiClient.get("/roles"); 
  return response.data;
};


//  departments

export const getAllDepartments = async () => {
  const response = await apiClient.get("/departments"); 
  console.log(response.data);
  
  return response.data;
}; 