"use client";

import * as React from "react";
import {
  LayersIcon,
  LayoutDashboardIcon,
  PlusCircleIcon,
  TicketIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import { NavMain } from "./nav-main";
// import { NavUser } from "./nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "../ui/separator";
import { NavUser } from "./nav-user";
import Image from "next/image";
import AuthImage from "./AuthImage";

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  roles: string[]; // 👈 explicitly define roles prop
  userName?: string;
  userEmail?: string;
  image: string;
}

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard/home",
      icon: LayoutDashboardIcon,
      roles: ["ADMIN", "AGENT", "CLIENT"],
    },
    {
      title: "My Tickets",
      url: "/dashboard/my-ticket",
      icon: TicketIcon,
      roles: ["ADMIN", "AGENT", "CLIENT"],
    },
    {
      title: "Create Ticket",
      url: "/dashboard/ticket",
      icon: PlusCircleIcon,
      roles: ["ADMIN", "AGENT", "CLIENT"],
    },
    {
      title: "Ticket Pool",
      url: "/dashboard/ticket-pool",
      icon: LayersIcon,
      roles: ["ADMIN", "AGENT"],
    },
    {
      title: "Add User",
      url: "/dashboard/register",
      icon: UserPlusIcon,
      roles: ["ADMIN", "AGENT"],
    },
    {
      title: "All Members",
      url: "/dashboard/users",
      icon: UsersIcon,
      roles: ["ADMIN", "AGENT"],
    },
  ],
};

export function AppSidebar({ roles =[],  userName, userEmail, image, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="mb-4">
            <SidebarMenuButton asChild size="lg">
              <a href="#" className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center">
                    {/* <Image src={image} alt="auth image" width={100} height={80}/> */}
                    <AuthImage/>
                </div>
                <div className="flex flex-col items-start">
                    <span className="text-xs font-bold leading-none">WONE</span>
                    <span className="text-2xl font-extrabold text-[#0055CC] tracking-[0.3em] leading-none">
                    ITSM
                    </span>
                </div>

                </a>
            </SidebarMenuButton>
            <Separator className="bg-[#DCDFE4] h-[1px] w-full mt-3" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} userRoles={roles} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser name={userName ?? ""} email={userEmail ?? ""}/>
      </SidebarFooter>
    </Sidebar>
  );
}


