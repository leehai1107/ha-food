"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import Image from "next/image";
import galleryService from "@/services/galleryService";
import type { GalleryImage } from "@/types";

interface ImageEditModalProps {
  galleryId: number;
  image: GalleryImage;
  onClose: () => void;
  onComplete: () => void;
}

export default function ImageEditModal({
  galleryId,
  image,
  onClose,
  onComplete,
}: ImageEditModalProps) {
  const [formData, setFormData] = useState({
    altText: image.altText || "",
    position: image.position,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await galleryService.updateImage(
        galleryId,
        image.id,
        formData
      );
      if (response.success) {
        onComplete();
      } else {
        alert("Có lỗi xảy ra khi cập nhật ảnh");
      }
    } catch (error) {
      console.error("Error updating image:", error);
      alert("Có lỗi xảy ra khi cập nhật ảnh");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle>Chỉnh sửa ảnh</CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X size={20} />
          </Button>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image Preview */}
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={image.imageUrl}
                alt={image.altText || "Gallery image"}
                width={300}
                height={300}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Alt Text */}
            <div>
              <label
                htmlFor="altText"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Alt text
              </label>
              <Input
                id="altText"
                value={formData.altText}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, altText: e.target.value }))
                }
                placeholder="Mô tả ảnh (tùy chọn)"
              />
            </div>

            {/* Position */}
            <div>
              <label
                htmlFor="position"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Vị trí
              </label>
              <Input
                id="position"
                type="number"
                value={formData.position}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    position: parseInt(e.target.value) || 1,
                  }))
                }
                min="1"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Hủy
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Đang cập nhật..." : "Cập nhật"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
