import AppSidebar from "./groups/Sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        {/* Sidebar Fixa */}
        <AppSidebar />

        {/* Container Principal */}
        <div className="flex-1 p-4">
          <SidebarInset>{children}</SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
