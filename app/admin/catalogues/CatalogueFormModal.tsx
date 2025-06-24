"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import Image from "next/image";
import type { Catalogue } from "@/types";
import { createCatalogue, updateCatalogue } from "@/services/api";
import { uploadApi } from "@/services/uploadApi";

interface CatalogueFormModalProps {
  catalogue?: Catalogue | null;
  onClose: () => void;
  onSubmit: () => void;
}

export default function CatalogueFormModal({
  catalogue,
  onClose,
  onSubmit,
}: CatalogueFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    coverImage: "",
    pdfLink: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploading, setUploading] = useState<{
    coverImage: boolean;
    pdfLink: boolean;
  }>({ coverImage: false, pdfLink: false });
  const [dragActive, setDragActive] = useState<{
    coverImage: boolean;
    pdfLink: boolean;
  }>({ coverImage: false, pdfLink: false });
  const [selectedFiles, setSelectedFiles] = useState<{
    coverImage?: File;
    pdfLink?: File;
  }>({});
  const [imagePreview, setImagePreview] = useState<string>("");
  const isEditing = !!catalogue;

  useEffect(() => {
    if (catalogue) {
      setFormData({
        name: catalogue.name,
        coverImage: catalogue.coverImage,
        pdfLink: catalogue.pdfLink,
      });
      setImagePreview(catalogue.coverImage);
    } else {
      setFormData({ name: "", coverImage: "", pdfLink: "" });
      setImagePreview("");
    }
  }, [catalogue]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Tên catalogue là bắt buộc";
    if (!formData.coverImage.trim() && !selectedFiles.coverImage)
      newErrors.coverImage = "Ảnh bìa là bắt buộc";
    if (!formData.pdfLink.trim() && !selectedFiles.pdfLink)
      newErrors.pdfLink = "File PDF là bắt buộc";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileSelect = (file: File, field: "coverImage" | "pdfLink") => {
    if (field === "coverImage") {
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh");
        return;
      }
      setSelectedFiles((prev) => ({ ...prev, coverImage: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target?.result as string);
      reader.readAsDataURL(file);
    } else {
      if (file.type !== "application/pdf") {
        alert("Vui lòng chọn file PDF");
        return;
      }
      setSelectedFiles((prev) => ({ ...prev, pdfLink: file }));
    }
  };

  const handleDragOver = (
    e: React.DragEvent,
    field: "coverImage" | "pdfLink"
  ) => {
    e.preventDefault();
    setDragActive((prev) => ({ ...prev, [field]: true }));
  };

  const handleDragLeave = (
    e: React.DragEvent,
    field: "coverImage" | "pdfLink"
  ) => {
    e.preventDefault();
    setDragActive((prev) => ({ ...prev, [field]: false }));
  };

  const handleDrop = (e: React.DragEvent, field: "coverImage" | "pdfLink") => {
    e.preventDefault();
    setDragActive((prev) => ({ ...prev, [field]: false }));
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file, field);
  };

  const removeSelectedFile = (field: "coverImage" | "pdfLink") => {
    setSelectedFiles((prev) => ({ ...prev, [field]: null }));
    if (field === "coverImage") {
      setImagePreview("");
      setFormData((prev) => ({ ...prev, coverImage: "" }));
    } else {
      setFormData((prev) => ({ ...prev, pdfLink: "" }));
    }
  };

  const uploadFile = async (field: "coverImage" | "pdfLink") => {
    const file = selectedFiles[field];
    if (!file) return "";

    setUploading((prev) => ({ ...prev, [field]: true }));
    const formData = new FormData();
    formData.append("file", file);
    formData.append("uploadType", "catalogues");

    console.log(`Starting upload for ${field}:`, {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    });

    try {
      const res = await uploadApi.uploadFile(formData);
      console.log(`Upload response for ${field}:`, res);

      if (res.success && res.data?.imageUrl) {
        setSelectedFiles((prev) => ({ ...prev, [field]: undefined }));
        console.log(`Upload successful for ${field}:`, res.data.imageUrl);
        return res.data.imageUrl;
      } else {
        console.error(
          "Upload error:",
          res.error || res.message || "Unknown upload error"
        );
        alert(
          `Lỗi upload: ${res.error || res.message || "Không thể upload file"}`
        );
        return "";
      }
    } catch (err: any) {
      console.error("Upload error:", err?.message || err || "Unknown error");
      alert(`Lỗi upload: ${err?.message || "Không thể upload file"}`);
      return "";
    } finally {
      setUploading((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    let coverImageUrl = formData.coverImage;
    let pdfLinkUrl = formData.pdfLink;

    // Upload new files if selected
    if (selectedFiles.coverImage) {
      const url = await uploadFile("coverImage");
      if (url) coverImageUrl = url;
    }
    if (selectedFiles.pdfLink) {
      const url = await uploadFile("pdfLink");
      if (url) pdfLinkUrl = url;
    }

    // If files were removed (empty strings), keep them empty
    if (selectedFiles.coverImage === null) {
      coverImageUrl = "";
    }
    if (selectedFiles.pdfLink === null) {
      pdfLinkUrl = "";
    }

    setLoading(true);
    try {
      const dataToSend = {
        name: formData.name,
        coverImage: coverImageUrl,
        pdfLink: pdfLinkUrl,
      };

      if (isEditing && catalogue) {
        await updateCatalogue(catalogue.id, dataToSend);
      } else {
        await createCatalogue(dataToSend);
      }
      onSubmit();
      onClose();
    } catch (error) {
      console.error("Error saving catalogue:", error);
      alert("Có lỗi xảy ra khi lưu catalogue");
    } finally {
      setLoading(false);
    }
  };

  const renderUploadArea = (
    field: "coverImage" | "pdfLink",
    title: string,
    accept: string,
    fileType: string
  ) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {title} *
      </label>
      <div
        className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          dragActive[field]
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={(e) => handleDrop(e, field)}
        onDragOver={(e) => handleDragOver(e, field)}
        onDragLeave={(e) => handleDragLeave(e, field)}
      >
        {field === "coverImage" && imagePreview ? (
          <div className="space-y-4">
            <div className="relative inline-block">
              <Image
                width={128}
                height={128}
                src={imagePreview}
                alt="Preview"
                className="h-32 w-auto rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => removeSelectedFile(field)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors z-10"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-600">
              {selectedFiles[field]?.name} (
              {Math.round((selectedFiles[field]?.size || 0) / 1024)} KB)
            </p>
            <button
              type="button"
              onClick={() => uploadFile(field)}
              disabled={uploading[field]}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
            >
              {uploading[field] ? "Đang upload..." : "Upload ảnh"}
            </button>
          </div>
        ) : field === "pdfLink" && selectedFiles[field] ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <button
                type="button"
                onClick={() => removeSelectedFile(field)}
                className="ml-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
              >
                ×
              </button>
            </div>
            <p className="text-sm text-gray-600">
              {selectedFiles[field]?.name} (
              {Math.round((selectedFiles[field]?.size || 0) / 1024)} KB)
            </p>
            <button
              type="button"
              onClick={() => uploadFile(field)}
              disabled={uploading[field]}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50"
            >
              {uploading[field] ? "Đang upload..." : "Upload PDF"}
            </button>
          </div>
        ) : field === "pdfLink" && formData.pdfLink ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center">
              <svg
                className="h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
            </div>
            <a
              href={formData.pdfLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline"
            >
              Xem PDF hiện tại
            </a>
            <button
              type="button"
              onClick={() => document.getElementById(`${field}-input`)?.click()}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Chọn file khác
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div>
              <p className="text-gray-600">
                <button
                  type="button"
                  onClick={() =>
                    document.getElementById(`${field}-input`)?.click()
                  }
                  className="font-medium text-blue-600 hover:text-blue-500 cursor-pointer underline"
                >
                  Nhấp để chọn {fileType}
                </button>{" "}
                hoặc kéo thả {fileType} vào đây
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {field === "coverImage"
                  ? "PNG, JPG, GIF, WebP tối đa 5MB"
                  : "PDF tối đa 10MB"}
              </p>
            </div>
          </div>
        )}

        <input
          id={`${field}-input`}
          type="file"
          accept={accept}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileSelect(file, field);
          }}
          className="hidden"
        />
      </div>
      {errors[field] && (
        <p className="text-red-500 text-sm mt-1">{errors[field]}</p>
      )}
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>
            {isEditing ? "Chỉnh sửa catalogue" : "Tạo catalogue mới"}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Tên catalogue *
              </label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Nhập tên catalogue"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Cover Image Upload */}
            {renderUploadArea("coverImage", "Ảnh bìa", "image/*", "ảnh")}

            {/* PDF Upload */}
            {renderUploadArea("pdfLink", "File PDF", "application/pdf", "PDF")}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading || uploading.coverImage || uploading.pdfLink}
              >
                Hủy
              </Button>
              <Button
                type = "submit"
                className="text-primary-white"
                disabled={loading || uploading.coverImage || uploading.pdfLink}
              >
                {loading
                  ? isEditing
                    ? "Đang cập nhật..."
                    : "Đang tạo..."
                  : isEditing
                  ? "Cập nhật"
                  : "Tạo mới"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
