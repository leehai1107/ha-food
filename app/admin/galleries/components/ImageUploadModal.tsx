"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Upload, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import galleryService from "@/services/galleryService";
import { uploadApi } from "@/services/uploadApi";

interface ImageUploadModalProps {
  galleryId: number;
  onClose: () => void;
  onComplete: () => void;
}

interface ImageFile {
  file: File;
  preview: string;
  altText: string;
  position: number;
}

export default function ImageUploadModal({
  galleryId,
  onClose,
  onComplete,
}: ImageUploadModalProps) {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newImages: ImageFile[] = files.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      altText: "",
      position: images.length + index + 1,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const handleRemoveImage = (index: number) => {
    const image = images[index];
    URL.revokeObjectURL(image.preview);
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdateImage = (
    index: number,
    field: keyof ImageFile,
    value: any
  ) => {
    setImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, [field]: value } : img))
    );
  };

  const handleUpload = async () => {
    if (images.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      const uploadedImages = [];

      for (let i = 0; i < images.length; i++) {
        const image = images[i];

        // Upload file
        const formData = new FormData();
        formData.append("file", image.file);
        formData.append("uploadType", "galleries");

        const uploadResponse = await uploadApi.uploadFile(formData);

        if (uploadResponse.success && uploadResponse.data) {
          uploadedImages.push({
            imageUrl: uploadResponse.data.imageUrl,
            altText: image.altText,
            position: image.position,
          });
        } else {
          console.error("Upload failed:", uploadResponse);
        }

        // Update progress
        setUploadProgress(((i + 1) / images.length) * 100);
      }

      // Add images to gallery
      if (uploadedImages.length > 0) {
        const response = await galleryService.addImages(
          galleryId,
          uploadedImages
        );
        if (response.success) {
          onComplete();
        } else {
          alert("Có lỗi xảy ra khi thêm ảnh vào thư viện");
        }
      }
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Có lỗi xảy ra khi tải ảnh lên");
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    const newImages: ImageFile[] = imageFiles.map((file, index) => ({
      file,
      preview: URL.createObjectURL(file),
      altText: "",
      position: images.length + index + 1,
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Thêm ảnh vào thư viện</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Upload Area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Kéo thả ảnh vào đây hoặc
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Chọn ảnh từ máy tính của bạn
            </p>
            <Button
              type="button"
              variant="outline"
              className="mt-4"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Plus className="mr-2 h-4 w-4" />
              Chọn ảnh
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
              disabled={uploading}
            />
          </div>

          {/* Selected Images */}
          {images.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Ảnh đã chọn ({images.length})
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {images.map((image, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">
                        Ảnh {index + 1}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveImage(index)}
                        disabled={uploading}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>

                    <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                      <Image
                        src={image.preview}
                        alt="Preview"
                        width={200}
                        height={200}
                        className="h-full w-full object-cover"
                      />
                    </div>

                    <div className="space-y-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Alt text
                        </label>
                        <Input
                          value={image.altText}
                          onChange={(e) =>
                            handleUpdateImage(index, "altText", e.target.value)
                          }
                          placeholder="Mô tả ảnh (tùy chọn)"
                          disabled={uploading}
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Vị trí
                        </label>
                        <Input
                          type="number"
                          value={image.position}
                          onChange={(e) =>
                            handleUpdateImage(
                              index,
                              "position",
                              parseInt(e.target.value) || 1
                            )
                          }
                          min="1"
                          disabled={uploading}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upload Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Đang tải lên...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose} disabled={uploading}>
              Hủy
            </Button>
            <Button
              onClick={handleUpload}
              disabled={images.length === 0 || uploading}
              className="text-primary-white"
            >
              {uploading ? "Đang tải lên..." : `Tải lên ${images.length} ảnh`}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
