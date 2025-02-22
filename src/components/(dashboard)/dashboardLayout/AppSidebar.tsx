"use client";

import {
  Baby,
  BookOpenCheck,
  Calculator,
  FileText,
  History,
  Home,
  MessageCircleIcon,
  ScrollText,
  SearchCheck,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import ThemeToggle from "./ThemeToggle";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/providers/AuthProvider";
import { useUser } from "@/providers/UserContext";
import LogoutDialog from "@/components/ui/LogoutDialog";
import { Capacitor } from "@capacitor/core";
import { getInitials } from "@/lib/utils";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Naya Hisab",
    url: "/dashboard/new",
    icon: Calculator,
  },
  {
    title: "Purano kharcha",
    url: "/dashboard/reports",
    icon: ScrollText,
  },
  {
    title: "Support",
    url: "/dashboard/support",
    icon: MessageCircleIcon,
  },
];

export function AppSidebar() {
  const pathname = usePathname();
  const { userDetails } = useUser();
  const { logout } = useAuth();
  const { state, toggleSidebar, isMobile } = useSidebar();

  // Determine active item based on pathname
  const determineActiveItem = (currentPath: string) => {
    // Exact match or starts with the path (for nested routes)
    const activeItem = items.find(
      (item) =>
        currentPath === item.url ||
        (item.url !== "/dashboard" && currentPath.startsWith(item.url))
    );

    // Default to Home if no match found
    return activeItem ? activeItem.title : "Home";
  };

  const [activeItem, setActiveItem] = useState(() =>
    determineActiveItem(pathname)
  );

  const isCollapsed = state === "collapsed";

  const avatar = userDetails?.personalDetails?.profileImage;
  const fullName = userDetails?.personalDetails?.fullName;

  const email = userDetails?.personalDetails?.email;

  const initials = getInitials(userDetails?.personalDetails?.fullName);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const truncateEmail = (email: string) => {
    return email?.length > 20 ? `${email.substring(0, 17)}...` : email;
  };

  // Update active item when pathname changes
  useEffect(() => {
    const newActiveItem = determineActiveItem(pathname);
    setActiveItem(newActiveItem);
  }, [pathname]);

  return (
    <Sidebar
      collapsible="icon"
      className={`min-h-screen bg-background shadow-sm ${
        isCollapsed ? "w-16" : "w-64"
      }`}
    >
      <SidebarHeader
        className="border-b h-16 pt-6 border-border"
        style={
          Capacitor.getPlatform() === "android"
            ? { marginTop: `calc(env(safe-area-inset-top))` }
            : undefined
        }
      >
        <div className="flex items-center justify-between h-8">
          <div className="flex items-center space-x-3">
            <Image
              height={200}
              width={200}
              src="/icon-only.png"
              alt="Website Favicon"
              className="w-8 h-8 ml-2"
            />
            {!isCollapsed && (
              <span className="text-xl font-semibold">Maile Kati Haldim</span>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2 flex-grow">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title} className="mb-2">
                  <SidebarMenuButton
                    asChild
                    className={`w-full transition-all duration-200 ease-in-out rounded-lg p-3
                    ${
                      activeItem === item.title
                        ? "bg-primary text-primary-foreground hover:bg-primary/90"
                        : "hover:bg-accent"
                    }`}
                    onClick={() => {
                      setActiveItem(item.title);
                      if (isMobile) {
                        toggleSidebar();
                      }
                    }}
                  >
                    <Link
                      href={item.url}
                      className={`flex items-center ${
                        isCollapsed ? "justify-center" : "space-x-3"
                      } text-sm font-medium`}
                    >
                      <item.icon
                        className={`w-5 h-5 ${
                          activeItem === item.title
                            ? "text-primary-foreground"
                            : "text-foreground"
                        }`}
                      />
                      {!isCollapsed && (
                        <span
                          className={
                            activeItem === item.title
                              ? "text-primary-foreground"
                              : "text-foreground"
                          }
                        >
                          {item.title}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter
        className={`border-t border-border 
        ${Capacitor.getPlatform() === "android" ? "pb-14" : "pb-6"}
      `}
      >
        <div className="flex flex-col gap-3 p-1">
          <div className="flex items-center justify-between gap-3 overflow-hidden">
            <Link
              href="/dashboard/profile"
              onClick={() => isMobile && toggleSidebar()}
            >
              <div className="flex items-center justify-center rounded-lg p-2 hover:bg-accent transition-all duration-200 ease-in-out">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={avatar}
                    alt={fullName}
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {!isCollapsed && (
                  <div className="flex flex-col min-w-0 flex-1 ml-3">
                    <p className="text-sm font-medium leading-none truncate text-foreground">
                      {fullName}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {truncateEmail(email as string)}
                    </p>
                  </div>
                )}
              </div>
            </Link>
            <ThemeToggle />
          </div>

          <div className="flex justify-center">
            <LogoutDialog onLogout={handleLogout} isCollapsed={isCollapsed} />
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default Sidebar;
