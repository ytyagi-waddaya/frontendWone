// "use client"
// import React, { createContext, useContext, useEffect, useState } from "react";
// import { useNotificationSocket } from "@/hooks/useNotificationSocket";
// import { getUserIDFromToken } from "@/lib/auth/getUserRoleFromToken";

// type Notification = { id: number; message: string; time: string; read: boolean };

// const NotificationContext = createContext<{
//   notifications: Notification[];
//   markAllRead: () => void;
// }>({ notifications: [], markAllRead: () => {} });

// export const NotificationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [userId, setUserId] = useState<string | null>(null);

//   useEffect(() => {
//     const id = getUserIDFromToken();
//     if (id) setUserId(id);
//   }, []);

//   useNotificationSocket(userId || "", (data) => {
//     const newNotification = {
//       id: Date.now(),
//       message: data.message,
//       time: "Just now",
//       read: false,
//     };
//     setNotifications((prev) => [newNotification, ...prev]);
//   });

//   const markAllRead = () => {
//     setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//   };

//   return (
//     <NotificationContext.Provider value={{ notifications, markAllRead }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotifications = () => useContext(NotificationContext);


// src/lib/Providers/NotificationProvider.tsx
// "use client";

// import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
// import { useNotificationSocket } from "@/hooks/useNotificationSocket";
// import { getUserIDFromToken } from "@/lib/auth/getUserRoleFromToken";

// type Notification = {
//   id: number;
//   message: string;
//   time: string;
//   read: boolean;
// };

// type NotificationContextType = {
//   notifications: Notification[];
//   markAllAsRead: () => void;
// };

// const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
//   const [notifications, setNotifications] = useState<Notification[]>([]);
//   const [userId, setUserId] = useState<string | null>(null);

//   useEffect(() => {
//     const id = getUserIDFromToken();
//     if (id) setUserId(id);
//   }, []);

//   const handleNotification = useCallback((data: { message: string }) => {
//     const newNotification: Notification = {
//       id: Date.now(),
//       message: data.message,
//       time: "Just now",
//       read: false,
//     };
//     setNotifications((prev) => [newNotification, ...prev]);
//   }, []);

//   useNotificationSocket(userId ?? "", handleNotification);

//   const markAllAsRead = () => {
//     setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//   };

//   return (
//     <NotificationContext.Provider value={{ notifications, markAllAsRead }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotifications = () => {
//   const context = useContext(NotificationContext);
//   if (!context) {
//     throw new Error("useNotifications must be used within a NotificationProvider");
//   }
//   return context;
// };

// "use client";

// import React, { createContext, useContext } from "react";
// import { useQuery } from "@tanstack/react-query";
// import { fetchNotifications } from "../api/route";


// type Notification = {
//   id: string;
//   title: string;
//   message: string;
//   isRead: boolean;
//   createdAt: string;
//   ticketId:string
// };

// type NotificationContextType = {
//   notifications: Notification[];
//   isLoading: boolean;
//   isError: boolean;
// };

// const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
//   // Use React Query to fetch notifications
//   const { data: notifications = [], isLoading, isError } = useQuery<Notification[]>({
//     queryKey: ["notifications"],
//     queryFn: fetchNotifications,
//     staleTime: 5 * 60 * 1000,
//   });

//   return (
//     <NotificationContext.Provider value={{ notifications, isLoading, isError }}>
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotifications = () => {
//   const context = useContext(NotificationContext);
//   if (!context) {
//     throw new Error("useNotifications must be used within a NotificationProvider");
//   }
//   return context;
// };


// "use client";

// import React, { createContext, useContext } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { fetchNotifications, markNotificationAsRead, markAllNotificationsAsRead } from "../api/route";

// export type Notification = {
//   id: string;
//   title: string;
//   message: string;
//   isRead: boolean;
//   createdAt: string;
//   ticketId: string;
// };

// type NotificationContextType = {
//   notifications: Notification[];
//   isLoading: boolean;
//   isError: boolean;
//   markAsRead: (id: string) => Promise<void>;
//   markAllAsRead: () => Promise<void>;
// };

// const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
//   const queryClient = useQueryClient();

//   // Fetch notifications with React Query
//   const { data: notifications = [], isLoading, isError } = useQuery<Notification[]>({
//     queryKey: ["notifications"],
//     queryFn: fetchNotifications,
//     staleTime: 5 * 60 * 1000,
//   });

//   // Mutation to mark a single notification as read
//   const markReadMutation = useMutation({
//     mutationFn: (id: string) => markNotificationAsRead(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["notifications"] });
//     },
//   });

//   // Mutation to mark all notifications as read
//   const markAllReadMutation = useMutation({
//     mutationFn: () => markAllNotificationsAsRead(),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["notifications"] });
//     },
//   });

//   // Wrapper functions to expose in context
//   const markAsRead = async (id: string) => {
//     await markReadMutation.mutateAsync(id);
//   };

//   const markAllAsRead = async () => {
//     await markAllReadMutation.mutateAsync();
//   };

//   return (
//     <NotificationContext.Provider
//       value={{ notifications, isLoading, isError, markAsRead, markAllAsRead }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotifications = () => {
//   const context = useContext(NotificationContext);
//   if (!context) {
//     throw new Error("useNotifications must be used within a NotificationProvider");
//   }
//   return context;
// };

// "use client";

// import React, { createContext, useContext } from "react";
// import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   fetchNotifications,
//   markNotificationAsRead,
//   markAllNotificationsAsRead,
// } from "../api/route";

// export type Notification = {
//   id: string;
//   title: string;
//   message: string;
//   isRead: boolean;
//   createdAt: string;
//   ticketId: string;
// };

// type NotificationContextType = {
//   notifications: Notification[];
//   isLoading: boolean;
//   isError: boolean;
//   markAsRead: (id: string) => Promise<void>;
//   markAllAsRead: () => Promise<void>;
// };

// const NotificationContext = createContext<NotificationContextType | undefined>(
//   undefined
// );

// export const NotificationProvider = ({
//   children,
// }: {
//   children: React.ReactNode;
// }) => {
//   const queryClient = useQueryClient();

//   const {
//     data: notifications = [],
//     isLoading,
//     isError,
//   } = useQuery<Notification[]>({
//     queryKey: ["notifications"],
//     queryFn: fetchNotifications,
//     staleTime: 5 * 60 * 1000,
//   });

//   const markReadMutation = useMutation({
//     mutationFn: (id: string) => markNotificationAsRead(id),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["notifications"] });
//     },
//   });

//   const markAllReadMutation = useMutation({
//     mutationFn: () => markAllNotificationsAsRead(),
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ["notifications"] });
//     },
//   });

//   const markAsRead = async (id: string) => {
//     await markReadMutation.mutateAsync(id);
//   };

//   const markAllAsRead = async () => {
//     await markAllReadMutation.mutateAsync();
//   };

//   return (
//     <NotificationContext.Provider
//       value={{ notifications, isLoading, isError, markAsRead, markAllAsRead }}
//     >
//       {children}
//     </NotificationContext.Provider>
//   );
// };

// export const useNotifications = (): NotificationContextType => {
//   const context = useContext(NotificationContext);
//   if (!context) {
//     throw new Error("useNotifications must be used within NotificationProvider");
//   }
//   return context;
// };
