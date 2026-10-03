"use client";

import UserPagination from "@/components/user-management/UserPagination";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetAllCategoriesQuery,
  useUpdateCategoryMutation,
} from "@/features/category/categoryApi";
import { useUploadMutation } from "@/features/upload/uploadApi";
import {
  Image as ImageIcon,
  Loader2,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  Upload,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

export type CategoryItem = {
  _id: string;
  name: string;
  image: string;
  isDeleted?: boolean;
};

export default function CategoriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(null);

  // Form state
  const [categoryName, setCategoryName] = useState("");
  const [categoryImage, setCategoryImage] = useState("");

  // Delete modal state
  const [deletingCategory, setDeletingCategory] = useState<CategoryItem | null>(null);

  // File input ref
  const fileInputRef = useRef<HTMLInputElement>(null);

  // RTK Query Hooks
  const {
    data: response,
    isLoading,

  } = useGetAllCategoriesQuery({
    page: currentPage,
    limit: 10,
    searchTerm: searchTerm.trim(),
  });

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();
  const [uploadImage, { isLoading: isUploading }] = useUploadMutation();

  const categories: CategoryItem[] = response?.data || [];
  const totalPages = response?.pagination?.totalPage || response?.pagination?.totalPages || 1;

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingCategory(null);
    setCategoryName("");
    setCategoryImage("");
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (cat: CategoryItem) => {
    setEditingCategory(cat);
    setCategoryName(cat.name);
    setCategoryImage(cat.image);
    setIsModalOpen(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
    setCategoryName("");
    setCategoryImage("");
  };

  // Handle Image Upload via API
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("image", file);

      const uploadRes = await uploadImage(formData).unwrap();
      const uploadedUrl =
        uploadRes?.data?.images?.[0] || uploadRes?.data?.url || uploadRes?.images?.[0];

      if (uploadedUrl) {
        setCategoryImage(uploadedUrl);
        toast.success("Category image uploaded successfully!");
      } else {
        toast.error("Could not retrieve image URL from server.");
      }
    } catch (err: unknown) {
      console.error("Image upload failed:", err);
      toast.error((err as { data?: { message?: string } })?.data?.message || "Failed to upload image.");
    }
  };

  // Handle Form Submit (Create or Edit)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    const payload = {
      name: categoryName.trim(),
      image: categoryImage.trim(),
    };

    try {
      if (editingCategory) {
        const res = await updateCategory({
          id: editingCategory._id,
          data: payload,
        }).unwrap();
        toast.success(res?.message || "Category updated successfully!");
      } else {
        const res = await createCategory(payload).unwrap();
        toast.success(res?.message || "Category created successfully!");
      }
      handleCloseModal();
    } catch (err: unknown) {
      console.error("Category action failed:", err);
      toast.error((err as { data?: { message?: string } })?.data?.message || "Operation failed. Please try again.");
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!deletingCategory) return;
    try {
      const res = await deleteCategory({ id: deletingCategory._id }).unwrap();
      toast.success(res?.message || "Category deleted successfully!");
      setDeletingCategory(null);
    } catch (err: unknown) {
      console.error("Delete category failed:", err);
      toast.error((err as { data?: { message?: string } })?.data?.message || "Failed to delete category.");
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* ── Page Header Title ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif italic text-[#1E1E1E] font-medium tracking-tight">
            Categories
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-normal mt-1">
            Organize and manage all salon service categories.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 bg-[#AC6135] hover:bg-[#97532c] text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-xl transition-all shadow-xs cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add New Category
        </button>
      </div>

      {/* ── Search & Header Filter Bar ── */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-[#F3F0EA] p-4 rounded-xl border border-black/5">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search categories by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full bg-white border border-black/5 rounded-lg h-10 pl-10 pr-4 text-xs sm:text-sm text-[#1E1E1E] placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 transition-all"
          />
        </div>

        {searchTerm && (
          <button
            type="button"
            onClick={() => {
              setSearchTerm("");
              setCurrentPage(1);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-[#B07D2B] hover:text-[#916521] px-3 py-2 rounded-lg bg-white border border-black/5 transition-all cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Reset
          </button>
        )}
      </div>

      {/* ── Table Container ── */}
      <div className="bg-[#E1DDD4] rounded-xl shadow-xs border border-black/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            {/* Table Header */}
            <thead>
              <tr className="bg-[#F3F0EA] border-b border-black/5 text-neutral-600 text-[11px] font-semibold tracking-wider uppercase">
                <th className="py-4 px-6">IMAGE</th>
                <th className="py-4 px-6">CATEGORY NAME</th>
                <th className="py-4 px-6">CATEGORY ID</th>
                <th className="py-4 px-6 text-center">STATUS</th>
                <th className="py-4 px-6 text-right">ACTIONS</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-black/5 text-sm text-[#1E1E1E] bg-white">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500">
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin text-[#AC6135]" />
                      <span className="text-sm font-medium">Loading categories...</span>
                    </div>
                  </td>
                </tr>
              ) : categories.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-500 text-sm font-medium">
                    No categories found.
                  </td>
                </tr>
              ) : (
                categories.map((cat) => (
                  <tr
                    key={cat._id}
                    className="hover:bg-neutral-50/80 transition-colors"
                  >
                    {/* Image Column */}
                    <td className="py-4 px-6">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-neutral-200 border border-black/5 flex items-center justify-center shrink-0">
                        {cat.image ? (
                          /* eslint-disable-next-line @next/next/no-img-element */
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <ImageIcon className="w-5 h-5 text-neutral-400" />
                        )}
                      </div>
                    </td>

                    {/* Category Name */}
                    <td className="py-4 px-6">
                      <span className="font-semibold text-[#1E1E1E] text-sm sm:text-base">
                        {cat.name}
                      </span>
                    </td>

                    {/* Category ID */}
                    <td className="py-4 px-6">
                      <span className="text-xs text-neutral-500 font-mono">
                        #{cat._id.slice(-8)}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-medium bg-[#DDF0E4] text-[#2C7446]">
                        Active
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenEditModal(cat)}
                          className="p-2 rounded-lg bg-neutral-100 hover:bg-[#F3F0EA] text-neutral-700 hover:text-[#AC6135] transition-all cursor-pointer"
                          title="Edit Category"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeletingCategory(cat)}
                          className="p-2 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-all cursor-pointer"
                          title="Delete Category"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Pagination Component ── */}
      <UserPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(Number(page))}
      />

      {/* ── Create / Edit Category Modal ── */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 border border-black/10 shadow-2xl space-y-6 animate-in zoom-in-95 duration-200 relative">
            <button
              type="button"
              onClick={handleCloseModal}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 transition-colors p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-serif italic text-[#1E1E1E] font-medium">
              {editingCategory ? "Edit Category" : "Add New Category"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Category Name Input */}
              <div>
                <label
                  htmlFor="catName"
                  className="text-xs font-semibold text-[#2B2927] mb-1.5 block"
                >
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="catName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="e.g. Hair Care, Skin Care..."
                  required
                  className="bg-[#FAF8F4] border border-gray-200 rounded-lg px-4 py-3 text-sm text-[#1E1E1E] focus:outline-none focus:ring-2 focus:ring-[#AC6135]/50 w-full transition-all"
                />
              </div>

              {/* Category Image Upload / URL */}
              <div>
                <label className="text-xs font-semibold text-[#2B2927] mb-1.5 block">
                  Category Image
                </label>

                {/* Upload Preview & Button */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-[#FAF8F4] border border-gray-200 flex items-center justify-center shrink-0">
                    {categoryImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img
                        src={categoryImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-6 h-6 text-neutral-400" />
                    )}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-4 h-4 animate-spin text-white" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5 w-full">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                    />
                    <button
                      type="button"
                      disabled={isUploading}
                      onClick={() => fileInputRef.current?.click()}
                      className="flex items-center w-full gap-2 text-xs font-medium text-[#1E1E1E] bg-[#FAF8F4] hover:bg-neutral-100 border border-gray-200 px-3.5 py-2 rounded-lg transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#AC6135]" />
                      {isUploading ? "Uploading..." : "Upload Image File"}
                    </button>
                    <p className="text-[11px] text-neutral-400">
                      Supports JPG, PNG, WEBP.
                    </p>
                  </div>
                </div>
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
                  disabled={isCreating || isUpdating || isUploading}
                  className="bg-[#AC6135] hover:bg-[#97532c] text-white text-xs sm:text-sm font-medium px-5 py-2.5 rounded-lg transition-all shadow-2xs cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {(isCreating || isUpdating) && (
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                  )}
                  {editingCategory
                    ? isUpdating
                      ? "Updating..."
                      : "Update Category"
                    : isCreating
                      ? "Creating..."
                      : "Create Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Delete Confirmation Modal ── */}
      {deletingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-black/10 shadow-2xl space-y-4 animate-in zoom-in-95 duration-200">
            <h3 className="text-xl font-serif italic text-[#1E1E1E] font-medium">
              Delete Category?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              Are you sure you want to delete{" "}
              <strong className="text-[#1E1E1E]">{deletingCategory.name}</strong>? This
              action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingCategory(null)}
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
