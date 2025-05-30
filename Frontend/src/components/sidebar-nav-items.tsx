"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  UsersRound,
  Newspaper,
  FileText,
  UserCog,
  type LucideIcon,
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/faculty', label: 'Faculty', icon: UsersRound },
  { href: '/dashboard/buzz', label: 'Buzz', icon: Newspaper },
  { href: '/dashboard/inquiries', label: 'Inquiries', icon: FileText },
  { href: '/dashboard/profile', label: 'Profile', icon: UserCog },
];

export function SidebarNavItems() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href))}
              className={cn(
                "justify-start",
                (pathname === item.href || (item.href !== '/dashboard' && pathname.startsWith(item.href)))
                  ? "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
                  : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              tooltip={item.label}
            >
              <a>
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </a>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
