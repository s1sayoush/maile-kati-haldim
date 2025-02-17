import React, { useState, useEffect } from "react";
import {
  Home,
  SearchCheck,
  FileText,
  History,
  MessageCircleIcon,
  BookOpenCheck,
  Baby,
  Calculator,
  ScrollText,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebar } from "@/components/ui/sidebar";
import { Capacitor } from "@capacitor/core";

const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
  },
  {
    title: "Naya Hisab",
    url: "/dashboard/naya",
    icon: Calculator,
  },
  {
    title: "Purano kharcha",
    url: "/dashboard/purano",
    icon: ScrollText,
  },
  {
    title: "Support",
    url: "/dashboard/support",
    icon: MessageCircleIcon,
  },
];

export function AppTabs() {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  const determineActiveItem = (currentPath: string) => {
    const activeItem = items.find(
      (item) =>
        currentPath === item.url ||
        (item.url !== "/dashboard" && currentPath.startsWith(item.url))
    );
    return activeItem ? activeItem.title : "Home";
  };

  const [activeItem, setActiveItem] = useState(() =>
    determineActiveItem(pathname)
  );

  useEffect(() => {
    const newActiveItem = determineActiveItem(pathname);
    setActiveItem(newActiveItem);
  }, [pathname]);

  return (
    isMobile && (
      <div
        className="fixed bottom-0  left-0 right-0   border-0"
        // style={
        //   Capacitor.getPlatform() === "android"
        //     ? {
        //         paddingBottom: `calc(env(safe-area-inset-bottom)+ 4rem)`,
        //         // paddingBottom: "12px",
        //       }
        //     : undefined
        // }
      >
        <Tabs value={activeItem} className="w-full ">
          <TabsList
            className={`grid w-full grid-cols-5 border-t ${
              Capacitor.getPlatform() === "android" ? "h-28 pb-10" : "h-24 pb-8"
            }`}
          >
            {items.map((item) => (
              <TabsTrigger
                key={item.title}
                value={item.title}
                asChild
                className="data-[state=active]:shadow-none"
              >
                <Link
                  href={item.url}
                  className="w-full h-full flex flex-col  items-center justify-center space-y-1"
                >
                  <item.icon
                    className={`w-5 h-5 transition-all duration-200 ${
                      activeItem === item.title
                        ? "text-primary stroke-[2.5px]"
                        : "text-muted-foreground stroke-[1.5px]"
                    }`}
                  />
                  <span
                    className={`text-xs transition-all duration-200 ${
                      activeItem === item.title
                        ? "text-primary font-semibold"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.title}
                  </span>
                </Link>
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
    )
  );
}

export default AppTabs;
