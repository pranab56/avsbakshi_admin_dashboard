"use client";

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
import { logout } from "@/features/auth/authSlice";
import { cn } from "@/lib/utils";
import {
    CalendarCheck,
    DollarSign,
    FileText,
    LayoutGrid,
    LogOut,
    LucideIcon,
    Settings,
    Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "../ui/alert-dialog";

type MenuItem = {
    name: string;
    path: string;
    icon: LucideIcon;
    key?: string;
};

const menuItems: MenuItem[] = [
    { name: "Dashboard", path: "/", icon: LayoutGrid, key: "overview" },
    { name: "User Management", path: "/user-management", icon: Users, key: "customer" },
    { name: "Bookings Management", path: "/reservation-management", icon: CalendarCheck, key: "reservation" },
    { name: "Transactions History", path: "/revenue-management", icon: FileText, key: "revenue" },
    //   { name: "Pricing", path: "/pricing", icon: DollarSign, key: "pricing" },
    { name: "Settings", path: "/settings", icon: Settings, key: "settings" },
];

export default function AppSideBar() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    const { state } = useSidebar();
    const isCollapsed = state === "collapsed";

    const role = useSelector((s: { auth?: { role: string | null } }) => s.auth?.role);
    const permissions = useSelector((s: { auth?: { permissions: string[] } }) => s.auth?.permissions || []);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);


    const isPermitted = (item: MenuItem): boolean => {
        if (!role || role === "super_admin") return true;
        return item.key ? permissions.includes(item.key) : true;
    };

    const isActive = (path: string) => {
        if (path === "/") return pathname === "/";
        return pathname === path || pathname.startsWith(`${path}/`);
    };

    const handleLogout = () => {
        dispatch(logout());
        router.push("/auth/login");
    };

    return (
        <Sidebar collapsible="icon" className="border-none">
            <SidebarContent
                className="flex flex-col h-screen select-none"
                style={{ backgroundColor: "#161618", color: "#FFFFFF" }}
            >
                {/* ── Header / Logo ── */}
                <SidebarHeader className="pt-5 px-4 flex items-center justify-center">
                    <Link href="/" className="flex items-center justify-center">
                        <div
                            className={cn(
                                "relative flex items-center justify-center transition-all duration-200",
                                isCollapsed ? "w-12 h-12" : "w-full h-[120px]"
                            )}
                        >
                            <Image
                                src="/icons/logo.png"
                                width={1000}
                                height={1000}
                                alt="The Cloud Salon"
                                className="object-contain max-h-full max-w-full"
                                priority
                            />
                        </div>
                    </Link>
                </SidebarHeader>

                {/* ── Navigation Menu ── */}
                <SidebarGroup className="flex-1 px-0 min-h-0 overflow-y-auto">
                    <SidebarGroupContent>
                        <SidebarMenu className="gap-1">
                            {menuItems.filter(isPermitted).map((item) => {
                                const active = isActive(item.path);

                                return (
                                    <SidebarMenuItem key={item.name}>
                                        <SidebarMenuButton
                                            asChild
                                            isActive={active}
                                            tooltip={item.name}
                                            className={cn(
                                                "h-12 px-6 w-full rounded-none transition-all duration-150 cursor-pointer flex items-center gap-3.5 text-[15px]",
                                                "group-data-[collapsible=icon]:!h-12 group-data-[collapsible=icon]:!w-full group-data-[collapsible=icon]:!p-0 group-data-[collapsible=icon]:justify-center",
                                                active
                                                    ? "!bg-[#B07D2B] !text-white font-normal hover:!bg-[#9A6D24] active:!bg-[#B07D2B] focus:!bg-[#B07D2B] focus-visible:!bg-[#B07D2B] data-[active=true]:!bg-[#B07D2B] data-[active=true]:!text-white"
                                                    : "!text-white font-normal hover:!bg-zinc-800/60 hover:!text-white active:!bg-[#B07D2B] active:!text-white focus:!bg-zinc-800/60 focus:!text-white data-[active=true]:!bg-[#B07D2B] data-[active=true]:!text-white"
                                            )}
                                        >
                                            <Link
                                                href={item.path}
                                                className={cn(
                                                    "flex items-center gap-3.5 w-full !text-white active:!text-white hover:!text-white focus:!text-white",
                                                    isCollapsed && "justify-center gap-0"
                                                )}
                                            >
                                                <item.icon
                                                    className={cn(
                                                        "w-5 h-5 shrink-0 transition-colors",
                                                        active ? "!text-white" : "text-zinc-300 group-hover:!text-white"
                                                    )}
                                                    strokeWidth={1.8}
                                                />
                                                {!isCollapsed && <span className="truncate !text-white">{item.name}</span>}
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                {/* ── Logout Button ── */}
                <SidebarFooter className={cn("p-4 pb-6", isCollapsed && "p-2 pb-6")}>
                    <button
                        type="button"
                        onClick={() => setIsLogoutModalOpen(true)}
                        title={isCollapsed ? "Logout" : undefined}
                        className={cn(
                            "w-full h-12 text-white rounded-xl font-normal flex items-center justify-center gap-2.5 transition-all duration-150 cursor-pointer whitespace-nowrap shadow-sm text-base",
                            isCollapsed && "rounded-xl w-12 h-12 p-0 mx-auto"
                        )}
                        style={{ backgroundColor: "#D9383A" }}
                        onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#c53032")
                        }
                        onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLButtonElement).style.backgroundColor = "#D9383A")
                        }
                    >
                        <LogOut className="w-5 h-5 shrink-0" strokeWidth={1.8} />
                        {!isCollapsed && <span>Logout</span>}
                    </button>
                </SidebarFooter>
            </SidebarContent>

            {/* ── Logout Dialog ── */}
            <AlertDialog open={isLogoutModalOpen} onOpenChange={setIsLogoutModalOpen}>
                <AlertDialogContent className="sm:max-w-sm">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                        <AlertDialogDescription>
                            You will be redirected to the login page and your session will be cleared.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleLogout}
                            className="bg-[#D9383A] hover:bg-[#c53032] text-white"
                        >
                            Logout
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </Sidebar>
    );
}
