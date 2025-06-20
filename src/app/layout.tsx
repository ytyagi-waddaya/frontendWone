
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "./globals.css";
import { ReactQueryProvider } from "@/lib/Providers/react-query";
import { Toaster } from "sonner";
// import { NotificationProvider } from "@/lib/Providers/NotificationProvider";

const inter = Inter({
 subsets: ["latin"],
});

export const metadata: Metadata = {
 title: "Wone ITSM",
 description: "ITSM Platform",
 icons: {
    icon: "/Vector.svg",
  },
};

export default function RootLayout({
 children,
}: Readonly<{ children: React.ReactNode }>) {
 return (
   <html lang="en">
     <body className={`${inter} antialiased min-h-screen`}>
       <ReactQueryProvider>
         {/* <NotificationProvider> */}
           {children}
           <Toaster richColors position="top-center" />
         {/* </NotificationProvider> */}
       </ReactQueryProvider>
     </body>
   </html>
 );
}
