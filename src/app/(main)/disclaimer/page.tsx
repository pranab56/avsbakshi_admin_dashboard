"use client";

import { ChevronRight, FileText, Info, ShieldCheck, UserCheck } from "lucide-react";
import Link from "next/link";

export type DisclaimerItem = {
  id: string;
  slug: string;
  type: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  updatedAtText?: string;
};

const DISCLAIMER_ITEMS: DisclaimerItem[] = [
  {
    id: "1",
    slug: "privacy_policy",
    type: "privacy_policy",
    title: "Privacy Policy",
    description: "Manage privacy statements, data collection guidelines, and user data rights.",
    icon: ShieldCheck,
    updatedAtText: "Updated regularly",
  },
  {
    id: "2",
    slug: "terms_of_service",
    type: "terms_of_service",
    title: "Terms of Service",
    description: "Rules, guidelines, and terms governing platform usage for all users.",
    icon: FileText,
    updatedAtText: "Updated regularly",
  },
  {
    id: "3",
    slug: "about_us",
    type: "about_us",
    title: "About Us",
    description: "Company information, mission statement, and platform overview.",
    icon: Info,
    updatedAtText: "Updated regularly",
  },
  {
    id: "4",
    slug: "user_agreement",
    type: "user_agreement",
    title: "User Agreement",
    description: "Mutual agreements and compliance rules between users and salon operators.",
    icon: UserCheck,
    updatedAtText: "Updated regularly",
  },
];

export default function DisclaimerListPage() {
  return (
    <div className="space-y-6 select-none max-w-5xl">
      {/* ── Page Header Title ── */}
      <div>
        <h1 className="text-3xl sm:text-4xl font-serif italic text-[#1E1E1E] font-medium tracking-tight">
          Disclaimers & Legal Policies
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1">
          Select any legal document from the list below to view and edit its content.
        </p>
      </div>

      {/* ── Vertical List (Flex Col) of Disclaimers ── */}
      <div className="flex flex-col gap-4">
        {DISCLAIMER_ITEMS.map((item) => {
          const IconComp = item.icon;

          return (
            <Link
              key={item.id}
              href={`/disclaimer/${item.slug}`}
              className="bg-white hover:bg-[#F3F0EA]/70 rounded-2xl p-5 sm:p-6 border border-black/5 shadow-xs transition-all flex items-center justify-between gap-4 group cursor-pointer"
            >
              {/* Left Info Section */}
              <div className="flex items-center gap-4 sm:gap-5">
                <div className="w-12 h-12 rounded-xl bg-[#F3F0EA] group-hover:bg-[#AC6135] text-[#AC6135] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                  <IconComp className="w-6 h-6" />
                </div>

                <div className="space-y-1">
                  <h3 className="text-base sm:text-lg font-serif italic font-medium text-[#1E1E1E] group-hover:text-[#AC6135] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-neutral-500 font-normal max-w-2xl">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Right Action Chevron */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="hidden sm:inline-block text-xs font-semibold text-[#AC6135] opacity-0 group-hover:opacity-100 transition-opacity">
                  Edit Content
                </span>
                <div className="w-9 h-9 rounded-full bg-neutral-100 group-hover:bg-[#AC6135] text-neutral-600 group-hover:text-white flex items-center justify-center transition-all">
                  <ChevronRight className="w-5 h-5" />
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
