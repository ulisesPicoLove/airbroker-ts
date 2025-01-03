import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/utils/authOptions";
import { LayoutChildren } from "@/lib/utils/types";

export default async function Layout({ children }: LayoutChildren) {
  const session = await getServerSession(authOptions);

  return (
    <SidebarProvider>
      <AppSidebar name={session?.name} email={session?.email} />
      <main className="p-3">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
}
