"use client";

import TipTapEditor from "@/TipTapEditor/TipTapEditor";
import {
  useCreateDisclaimerMutation,
  useGetDisclaimerByTypeQuery,
} from "@/features/disclaimer/disclaimerApi";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function normalizeType(slug: string): string {
  const s = (slug || "").toLowerCase().replace(/-/g, "_");
  if (s === "privacy" || s === "privacy_policy") return "privacy_policy";
  if (s === "terms" || s === "terms_of_service") return "terms_of_service";
  if (s === "about" || s === "about_us") return "about_us";
  if (s === "user" || s === "user_agreement") return "user_agreement";
  return s;
}

function getTitleFromType(apiType: string): string {
  switch (apiType) {
    case "privacy_policy":
      return "Privacy Policy";
    case "terms_of_service":
      return "Terms of Service";
    case "about_us":
      return "About Us";
    case "user_agreement":
      return "User Agreement";
    default:
      return apiType
        .split("_")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
  }
}

export default function DisclaimerEditorPage() {
  const params = useParams();
  const rawType = (params?.type as string) || "privacy_policy";
  const apiType = normalizeType(rawType);
  const title = getTitleFromType(apiType);

  const [editorContent, setEditorContent] = useState<string>("");

  // RTK Query Hooks
  const { data: response, isLoading } = useGetDisclaimerByTypeQuery(apiType);
  const [createDisclaimer, { isLoading: isSaving }] = useCreateDisclaimerMutation();

  // Populate editor content when API data changes
  useEffect(() => {
    if (response?.data?.content !== undefined) {
      setEditorContent(response.data.content || "");
    }
  }, [response]);

  const handleSave = async () => {
    if (!editorContent.trim()) {
      toast.error("Content cannot be empty");
      return;
    }

    try {
      const res = await createDisclaimer({
        type: apiType,
        content: editorContent,
      }).unwrap();

      toast.success(res?.message || `${title} saved successfully!`);
    } catch (err: unknown) {
      console.error("Save disclaimer error:", err);
      toast.error((err as { data?: { message?: string } })?.data?.message || "Failed to save disclaimer.");
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* ── Top Back Button & Page Header ── */}
      <div className="space-y-3">
        <Link
          href="/disclaimer"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#AC6135] hover:text-[#8e4f2a] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Disclaimers
        </Link>

        <div>
          <h1 className="text-3xl sm:text-4xl font-serif italic text-[#1E1E1E] font-medium tracking-tight">
            {title}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1">
            Edit and publish updated {title} content using the TipTap Rich Text Editor.
          </p>
        </div>
      </div>

      {/* ── Main Editor Card Container ── */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-black/5 shadow-xs space-y-6">
        {/* Editor Card Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-black/5 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif italic text-[#1E1E1E] font-medium">
              {title} Content
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Make changes below and click save to publish.
            </p>
          </div>

          <button
            type="button"
            disabled={isSaving || isLoading}
            onClick={handleSave}
            className="bg-[#AC6135] hover:bg-[#97532c] text-white text-xs sm:text-sm font-medium px-6 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer disabled:opacity-50 flex items-center gap-2 shrink-0"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? "Saving..." : "Save Changes"}
          </button>
        </div>

        {/* TipTap Rich Text Editor */}
        {isLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-neutral-500">
            <Loader2 className="w-7 h-7 animate-spin text-[#AC6135] mb-2" />
            <span className="text-sm font-medium">Loading {title}...</span>
          </div>
        ) : (
          <div className="space-y-4">
            <TipTapEditor
              content={editorContent}
              onChange={(html) => setEditorContent(html)}
              minHeight="350px"
              maxHeight="600px"
              placeholder={`Type ${title} content here...`}
            />

            <div className="flex items-center justify-between text-xs text-neutral-400 pt-2">
              <span>Supports HTML formatting, headers, lists, links & text colors.</span>
              <button
                type="button"
                disabled={isSaving || isLoading}
                onClick={handleSave}
                className="text-[#AC6135] font-semibold hover:underline cursor-pointer disabled:opacity-50"
              >
                Save {title}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
