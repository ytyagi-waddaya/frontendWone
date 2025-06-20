// "use client";

// import {
//   BellIcon,
//   CreditCardIcon,
//   LogOutIcon,
//   MoreVerticalIcon,
//   UserCircleIcon,
// } from "lucide-react";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   SidebarMenu,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   useSidebar,
// } from "@/components/ui/sidebar";
// import { useRouter } from "next/navigation";
// import { useMutation, useQuery } from "@tanstack/react-query";
// import { toast } from "sonner";
// import axios from "axios";
// import { logoutUserAction } from "@/app/actions/logout";


// interface NavUserProps {
//   name: string;
//   email: string;
// //   role: string[];
// //   profilePic?: string;
// }

// export function NavUser({ name, email }: NavUserProps) {
//   const { isMobile } = useSidebar();
//   const router = useRouter();

//   const logoutMutation = useMutation({
//   mutationFn: logoutUserAction, // call server action instead of API
//   onSuccess: () => {
//     toast.success("Logged out successfully");
//     router.push("/"); // redirect to homepage or login
//   },
//   onError: (error: any) => {
//     console.error("Logout error:", error);
//     toast.error(error?.error || "Logout failed."); // adapt to server action response shape
//   },
// });


//   return (
//     <SidebarMenu>
//       <SidebarMenuItem>
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <SidebarMenuButton size="lg">
//               <Avatar className="h-8 w-8 rounded-lg">
//                 {/* <AvatarImage src={profilePic} alt={name} /> */}
//                 <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
//               </Avatar>
//               <div className="grid flex-1 text-left text-sm leading-tight">
//                 <span className="truncate font-medium">{name}</span>
//                 <span className="truncate text-xs text-muted-foreground">
//                   {email}
//                 </span>
//               </div>
//               <MoreVerticalIcon className="ml-auto size-4" />
//             </SidebarMenuButton>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent
//             className="min-w-56 rounded-lg"
//             side={isMobile ? "bottom" : "right"}
//             align="end"
//             sideOffset={4}
//           >
//             <DropdownMenuLabel className="p-0 font-normal">
//               <div className="flex items-center gap-2 px-1 py-1.5">
//                 <Avatar className="h-8 w-8 rounded-lg">
//                   {/* <AvatarImage src={profilePic} alt={name} /> */}
//                   <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
//                 </Avatar>
//                 <div className="grid flex-1 text-left text-sm leading-tight">
//                   <span className="truncate font-medium">{name}</span>
//                   <span className="truncate text-xs text-muted-foreground">
//                     {email}
//                   </span>
//                 </div>
//               </div>
//             </DropdownMenuLabel>
//             <DropdownMenuSeparator />
//             <DropdownMenuItem onSelect={(e) => { e.preventDefault(); logoutMutation.mutate(); }}>
//               <LogOutIcon className="mr-2 h-4 w-4" />
//               {logoutMutation.isPending ? "Logging out..." : "Log out"}
//             </DropdownMenuItem>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       </SidebarMenuItem>
//     </SidebarMenu>
//   );
// }


"use client";

import {
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
} from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import axios from "axios";
import { useRouter } from "next/navigation";

import { logoutUserAction } from "@/app/actions/logout";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChangePasswordDialog } from "./dialog/ChangePasswordDialog";

interface NavUserProps {
  name: string;
  email: string;
}

export function NavUser({ name, email }: NavUserProps) {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const [openChangePassword, setOpenChangePassword] = useState(false);
  const [formData, setFormData] = useState({
    email: email,
    newPassword: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const changePasswordMutation = useMutation({
    mutationFn: async () => {
      const res = await axios.post("/auth/change-password", formData); // your API endpoint
      return res.data;
    },
    onSuccess: () => {
      toast.success("Password updated");
      setOpenChangePassword(false);
    },
    onError: () => {
      toast.error("Password update failed");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: logoutUserAction,
    onSuccess: () => {
      toast.success("Logged out successfully");
      router.push("/");
    },
    onError: (error: any) => {
      console.error("Logout error:", error);
      toast.error(error?.error || "Logout failed.");
    },
  });

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <SidebarMenuButton size="lg">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {email}
                  </span>
                </div>
                <MoreVerticalIcon className="ml-auto size-4" />
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="min-w-56 rounded-lg"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5">
                  <Avatar className="h-8 w-8 rounded-lg">
                    <AvatarFallback>{name?.charAt(0).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{name}</span>
                    <span className="truncate text-xs text-muted-foreground">
                      {email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onSelect={() => setOpenChangePassword(true)}>
                <UserCircleIcon className="mr-2 h-4 w-4" />
                Change Password
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={(e) => {
                e.preventDefault();
                logoutMutation.mutate();
              }}>
                <LogOutIcon className="mr-2 h-4 w-4" />
                {logoutMutation.isPending ? "Logging out..." : "Log out"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
      <ChangePasswordDialog
        open={openChangePassword}
        onOpenChange={setOpenChangePassword}
        defaultEmail={email}
      />
    </>
  );
}
