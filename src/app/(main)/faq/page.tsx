"use client";

import {
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useGetFaqQuery,
  useUpdateFaqMutation,
} from "@/features/faq/faqApi";
import {
  HelpCircle,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

export type FaqItem = {
  _id: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
};

export default function FaqManagementPage() {
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  // Delete modal state
  const [deletingFaq, setDeletingFaq] = useState<FaqItem | null>(null);

  // RTK Query Hooks
  const { data: response, isLoading } = useGetFaqQuery({});
  const [createFaq, { isLoading: isCreating }] = useCreateFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();

  const faqs: FaqItem[] = response?.data || [];

  // Filter FAQs based on search
  const filteredFaqs = faqs.filter(
    (item) =>
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (faq: FaqItem) => {
    setEditingFaq(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingFaq(null);
    setQuestion("");
    setAnswer("");
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!question.trim()) {
      toast.error("Question is required");
      return;
    }
    if (!answer.trim()) {
      toast.error("Answer is required");
      return;
    }

    const payload = {
      question: question.trim(),
      answer: answer.trim(),
    };

    try {
      if (editingFaq) {
        const res = await updateFaq({
          id: editingFaq._id,
          data: payload,
        }).unwrap();
        toast.success(res?.message || "FAQ updated successfully!");
      } else {
        const res = await createFaq(payload).unwrap();
        toast.success(res?.message || "FAQ created successfully!");
      }
      handleCloseModal();
    } catch (err: unknown) {
      console.error("FAQ submit error:", err);
      toast.error((err as { data?: { message?: string } })?.data?.message || "Failed to save FAQ.");
    }
  };

  // Delete Handler
  const handleDeleteConfirm = async () => {
    if (!deletingFaq) return;
    try {
      const res = await deleteFaq({ id: deletingFaq._id }).unwrap();
      toast.success(res?.message || "FAQ deleted successfully!");
      setDeletingFaq(null);
    } catch (err: unknown) {
      console.error("Delete FAQ error:", err);
      toast.error((err as { data?: { message?: string } })?.data?.message || "Failed to delete FAQ.");
    }
  };

  return (
    <div className="space-y-6 select-none max-w-5xl">
      {/* ── Page Header Title ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif italic text-[#1E1E1E] font-medium tracking-tight">
            FAQ Management
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1">
            Create, update, and manage frequently asked questions and answers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 bg-[#AC6135] hover:bg-[#97532c] text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New FAQ
        </button>
      </div>

      {/* ── Search Bar ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#F3F0EA] p-4 rounded-xl border border-black/5">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search questions or answers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-black/5 rounded-lg h-10 pl-10 pr-4 text-xs sm:text-sm text-[#1E1E1E] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 transition-all"
          />
        </div>

        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm("")}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#B07D2B] hover:text-[#916521] px-3 py-2 rounded-lg bg-white border border-black/5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* ── FAQ List Accordion ── */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="bg-white rounded-2xl p-12 border border-black/5 shadow-xs flex flex-col items-center justify-center">
            <Loader2 className="w-7 h-7 animate-spin text-[#AC6135] mb-2" />
            <span className="text-sm font-medium text-neutral-600">Loading FAQs...</span>
          </div>
        ) : filteredFaqs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 border border-black/5 shadow-xs text-center text-neutral-500">
            <HelpCircle className="w-10 h-10 text-neutral-300 mx-auto mb-2" />
            <p className="text-sm font-medium">No FAQs found.</p>
          </div>
        ) : (
          filteredFaqs.reverse().map((faq, index) => {
            return (
              <div
                key={faq._id}
                className="bg-white rounded-2xl border border-black/5 shadow-xs overflow-hidden transition-all hover:border-black/10"
              >
                {/* Accordion Header */}
                <div className="p-5 sm:p-6 flex items-start justify-between gap-4">
                  <div
                    className="flex items-start gap-3.5 flex-1 group"
                  >
                    <span className="w-7 h-7 rounded-lg bg-[#F3F0EA] text-[#AC6135] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      Q{index + 1}
                    </span>
                    <div className="space-y-1">
                      <h3 className="text-base sm:text-lg font-serif italic font-medium text-[#1E1E1E] group-hover:text-[#AC6135] transition-colors leading-snug">
                        {faq.question}
                      </h3>
                      {faq.answer && (
                        <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal pt-1">
                          {faq.answer}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(faq)}
                      className="p-2 rounded-lg bg-neutral-100 hover:bg-[#F3F0EA] text-neutral-700 hover:text-[#AC6135] transition-all cursor-pointer"
                      title="Edit FAQ"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeletingFaq(faq)}
                      className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all cursor-pointer"
                      title="Delete FAQ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Create / Edit FAQ Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 border border-black/10 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 relative">
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-serif italic text-[#1E1E1E] font-medium">
              {editingFaq ? "Edit FAQ" : "Add New FAQ"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Question Input */}
              <div>
                <label
                  htmlFor="question"
                  className="text-xs font-semibold text-[#2B2927] mb-1.5 block"
                >
                  Question <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="question"
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g. Do you accept walk-ins?"
                  required
                  className="bg-[#FAF8F4] border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 w-full transition-all"
                />
              </div>

              {/* Answer Textarea */}
              <div>
                <label
                  htmlFor="answer"
                  className="text-xs font-semibold text-[#2B2927] mb-1.5 block"
                >
                  Answer <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="answer"
                  rows={4}
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  placeholder="Type the detailed answer here..."
                  required
                  className="bg-[#FAF8F4] border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 w-full transition-all resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="text-xs font-medium text-neutral-700 hover:text-neutral-900 px-4 py-2.5 rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="bg-[#AC6135] hover:bg-[#97532c] text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-lg transition-all shadow-2xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {(isCreating || isUpdating) && (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  )}
                  {editingFaq
                    ? isUpdating
                      ? "Updating..."
                      : "Update FAQ"
                    : isCreating
                      ? "Creating..."
                      : "Create FAQ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deletingFaq && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-black/10 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-serif italic text-[#1E1E1E] font-medium">
              Delete FAQ?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Are you sure you want to delete this FAQ question? This action cannot be
              undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingFaq(null)}
                className="text-xs font-medium text-neutral-700 hover:text-neutral-900 px-4 py-2 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium px-5 py-2 rounded-lg transition-all shadow-2xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
              >
                {isDeleting && <Loader2 className="w-4 h-4 animate-spin text-white" />}
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
