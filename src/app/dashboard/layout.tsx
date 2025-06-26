
// import { AppSidebar } from "@/components/dashboard/Sidebar";
// import { SiteHeader } from "@/components/dashboard/site-header";

// import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import { headers } from "next/headers";



// export default async function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//     const headersList = await headers();
//     const rolesString = headersList.get("x-user-role") || "";
//     const roles = rolesString.split(",").filter(Boolean); 

//   return (
//       <SidebarProvider>
//       <AppSidebar roles={roles} variant="inset"  />
//       <SidebarInset >
//         <SiteHeader/>
//         <div className="flex flex-1 flex-col">
//           <div className="@container/main flex flex-1 flex-col"> 
//               {children} 
//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

// import { AppSidebar } from "@/components/dashboard/Sidebar";
// import { SiteHeader } from "@/components/dashboard/site-header";
// import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
// import { headers } from "next/headers";
// import { Skeleton } from "@/components/skeleton"; // Assuming you have a Skeleton component

// export default async function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const headersList = await headers();
//   const rolesString = headersList.get("x-user-role") || "";
//   const roles = rolesString.split(",").filter(Boolean);

//   // If roles are loading, show skeleton
//   if (!rolesString) {
//     return (
//       <SidebarProvider>
//         <div className="flex h-screen w-full">
//           {/* Sidebar Skeleton */}
//           <div className="hidden w-16 border-r md:block">
//             <div className="flex h-full flex-col items-center space-y-4 py-4">
//               {[...Array(6)].map((_, i) => (
//                 <Skeleton key={i} className="h-10 w-10 rounded-full" />
//               ))}
//             </div>
//           </div>
          
//           {/* Main Content Skeleton */}
//           <div className="flex flex-1 flex-col">
//             <div className="flex h-16 items-center border-b px-4"> 
//             </div>
            
//             {/* Content Skeleton */}
//             <div className="flex-1 p-4">
//               <div className="grid gap-4">
//                 <div className="grid grid-cols-3 gap-4">
//                   {[...Array(3)].map((_, i) => (
//                     <Skeleton key={i} className="h-32 w-full" />
//                   ))}
//                 </div>
//                 <div className="grid grid-cols-2 gap-4">
//                 <Skeleton className="h-96 w-full" />
//                 <Skeleton className="h-96 w-full" />
                
//                 </div>
//                 <Skeleton className="h-72 w-full" />
//               </div>
//             </div>
//           </div>
//         </div>
//       </SidebarProvider>
//     );
//   }

//   return (
//     <SidebarProvider>
//       <AppSidebar roles={roles} variant="inset" />
//       <SidebarInset>
//         <SiteHeader />
//         <div className="flex flex-1 flex-col">
//           <div className="@container/main flex flex-1 flex-col"> 
//             {children} 
//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }


import { AppSidebar } from "@/components/dashboard/Sidebar";
import { SiteHeader } from "@/components/dashboard/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { headers } from "next/headers";
import { Skeleton } from "@/components/skeleton";


const image = "/vector.svg";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const rolesString = headersList.get("x-user-role") || "";
  const roles = rolesString.split(",").filter(Boolean);
  const userName = headersList.get("x-user-name") || "";
  const userEmail = headersList.get("x-user-email") || "";
  const userId = headersList.get("x-user-id") || "";

  // If roles are loading, show skeleton
  if (!rolesString) {
    return (
      <SidebarProvider>
        <div className="flex h-screen w-full bg-background">
          {/* Sidebar Skeleton */}
          <div className="hidden w-16 border-r md:block bg-muted/20">
            <div className="flex h-full flex-col items-center space-y-4 py-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-10 rounded-full" />
              ))}
            </div>
          </div>
          
          {/* Main Content Skeleton */}
          <div className="flex flex-1 flex-col">
            {/* Header Skeleton */}
            <div className="flex h-16 items-center justify-between border-b px-4">

            </div>
            
            {/* Content Skeleton */}
            <div className="flex-1 p-4 space-y-6">
              {/* Top Cards Row */}
              <div className="grid grid-cols-3 gap-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-32 rounded-lg" />
                ))}
              </div>
              
              {/* Middle Content Area */}
              <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-96 rounded-lg" />
                <Skeleton className="h-96 rounded-lg" />
              </div>
              
              {/* Bottom Section */}
              <Skeleton className="h-72 rounded-lg" />
            </div>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  // return (
  //   <SidebarProvider>
  //     <AppSidebar roles={roles} userName={userName} userEmail={userEmail} variant="inset" />
  //     <SidebarInset>
  //       <SiteHeader />
  //       <div className="flex flex-1 flex-col">
  //         <div className="@container/main flex flex-1 flex-col"> 
  //           {children} 
  //         </div>
  //       </div>
  //     </SidebarInset>
  //   </SidebarProvider>
  // );

  return (
  <SidebarProvider>
      <AppSidebar
        roles={roles}
        userName={userName}
        userEmail={userEmail}
        image={image}
        variant="inset"

      />
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col">{children}</div>
        </div>
      </SidebarInset>
  </SidebarProvider>
);
}