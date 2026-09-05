import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import OptimusSidebar from "@/components/appSidebar/AppsideBar";
import Header from "@/components/header/Header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import "../globals.css";

export const metadata: Metadata = {
  title: "avsbakshi Admin Dashboard",
  description: "avsbakshi Admin Dashboard",
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // <ProtectedRoute>
    <SidebarProvider>
      <OptimusSidebar />
      <SidebarInset className="bg-[#FFFDF9] flex flex-col overflow-hidden h-screen">
        <Header />
        <main className="flex-1 p-4 md:p-8 overflow-y-auto min-w-0 flex flex-col">{children}</main>
      </SidebarInset>
    </SidebarProvider>
    // </ProtectedRoute>
  );
}
