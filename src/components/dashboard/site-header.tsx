import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
// import NotificationDropdown from "./notification";

export function SiteHeader() {
  return (
    <header className="flex flex-col h-10 shrink-0 p-1 gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-1 px-4">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="ml-auto lg:mr-28 ">
          {/* <NotificationDropdown /> */}
        </div>
      </div>

      <Separator />
    </header>
  );
}
