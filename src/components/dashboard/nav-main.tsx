// "use client";

// import { ChevronRight, type LucideIcon } from "lucide-react";

// import {
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarMenu,
//   SidebarMenuAction,
//   SidebarMenuButton,
//   SidebarMenuItem,
//   SidebarMenuSub,
//   SidebarMenuSubButton,
//   SidebarMenuSubItem,
// } from "@/components/ui/sidebar";
// import {
//   Collapsible,
//   CollapsibleContent,
//   CollapsibleTrigger,
// } from "../ui/collapsible";

// interface NavMainProps {
//   items: typeof data.navMain;
//   userRole: string[];
// }

// export function NavMain({
//   items,
//   userRole,
// }: {
//   items: {
//     title: string;
//     url: string;
//     icon: LucideIcon;
//     isActive?: boolean;
//     roles?: string[];
//     items?: {
//       title: string;
//       url: string;
//     }[];
//   }[];
//   userRole: string;
// }) {
//   return (
//     <SidebarGroup>
//       <SidebarGroupLabel>Platform</SidebarGroupLabel>
//       <SidebarMenu>
//         {items
//   .filter((item) => !item.roles || item.roles.includes(userRole))
//   .map((item) => (
//     <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
//       <SidebarMenuItem>
//         <SidebarMenuButton asChild tooltip={item.title}>
//           <a href={item.url}>
//             <item.icon />
//             <span>{item.title} </span>
//           </a>
//         </SidebarMenuButton>

//         {item.items?.length ? (
//           <>
//             <CollapsibleTrigger asChild>
//               <SidebarMenuAction className="data-[state=open]:rotate-90">
//                 <ChevronRight />
//                 <span className="sr-only">Toggle</span>
//               </SidebarMenuAction>
//             </CollapsibleTrigger>
//             <CollapsibleContent>
//               <SidebarMenuSub>
//                 {item.items.map((subItem) => (
//                   <SidebarMenuSubItem key={subItem.title}>
//                     <SidebarMenuSubButton asChild>
//                       <a href={subItem.url}>
//                         <span>{subItem.title}</span>
//                       </a>
//                     </SidebarMenuSubButton>
//                   </SidebarMenuSubItem>
//                 ))}
//               </SidebarMenuSub>
//             </CollapsibleContent>
//           </>
//         ) : null}
//       </SidebarMenuItem>
//     </Collapsible>
// ))}

//       </SidebarMenu>
//     </SidebarGroup>
//   );
// }

"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

interface NavMainProps {
  items: {
    title: string;
    url: string;
    icon: LucideIcon;
    isActive?: boolean;
    roles?: string[]; // ✅ roles allowed
    items?: {
      title: string;
      url: string;
    }[];
  }[];
  userRoles: string[]; // ✅ Accept array of roles
}

export function NavMain({ items, userRoles }: NavMainProps) {
  const filteredItems = items.filter((item) => {
    if (!item.roles) return true;
    return item.roles.some((role) => userRoles.includes(role));
  });

  return (
    <SidebarGroup>
      <SidebarMenu>
        {filteredItems.map((item) => (
          <Collapsible key={item.title} asChild defaultOpen={item.isActive}>
            <SidebarMenuItem>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>

              {item.items?.length ? (
                <>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuAction className="data-[state=open]:rotate-90">
                      <ChevronRight />
                      <span className="sr-only">Toggle</span>
                    </SidebarMenuAction>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild>
                            <a href={subItem.url}>
                              <span>{subItem.title}</span>
                            </a>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </>
              ) : null}
            </SidebarMenuItem>
          </Collapsible>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
