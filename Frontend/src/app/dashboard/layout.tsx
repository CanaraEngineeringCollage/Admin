import type { ReactNode } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { SidebarNavItems } from '@/components/sidebar-nav-items';
import { LogOut, Bell } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <Sidebar collapsible="icon" variant="sidebar" side="left" className="border-r">
        <SidebarHeader className="h-16 flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
             <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-sidebar-foreground"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
            <h1 className="text-lg font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
              Canara Engineering College
            </h1>
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarNavItems />
        </SidebarContent>
        <SidebarFooter className="p-4 group-data-[collapsible=icon]:p-2">
            <div className="flex items-center gap-2 group-data-[collapsible=icon]:hidden">
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-sidebar-foreground">Admin User</span>
                    <span className="text-xs text-sidebar-foreground/70">admin@example.com</span>
                </div>
            </div>
            <Button variant="ghost" size="icon" className="h-9 w-9 group-data-[collapsible=icon]:flex hidden mx-auto text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
                <LogOut className="h-5 w-5" />
            </Button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex flex-col">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 px-6 backdrop-blur-md">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-4 ml-auto">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                </Button>
                <Avatar className="h-9 w-9">
                    <AvatarImage src="https://placehold.co/40x40.png" alt="Admin" />
                    <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                 <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                    <LogOut className="h-5 w-5" />
                    <span className="sr-only">Log Out</span>
                </Button>
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
