"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ArrowLeft,
  Plus,
  Edit,
  Trash2,
  Upload,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import galleryService from "@/services/galleryService";
import type { Gallery, GalleryImage } from "@/types";
import ImageUploadModal from "./ImageUploadModal";
import ImageEditModal from "./ImageEditModal";

interface GalleryDetailProps {
  gallery: Gallery;
  onClose: () => void;
  onRefresh: () => void;
}

export default function GalleryDetail({
  gallery,
  onClose,
  onRefresh,
}: GalleryDetailProps) {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    fetchImages();
  }, [gallery.id]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const response = await galleryService.getImages(gallery.id);
      if (response.success && response.data) {
        setImages(response.data);
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadImages = () => {
    setShowUploadModal(true);
  };

  const handleEditImage = (image: GalleryImage) => {
    setSelectedImage(image);
    setShowEditModal(true);
  };

  const handleDeleteImage = async (image: GalleryImage) => {
    if (!confirm("Bạn có chắc chắn muốn xóa ảnh này?")) {
      return;
    }

    try {
      const response = await galleryService.deleteImage(gallery.id, image.id);
      if (response.success) {
        fetchImages();
      } else {
        alert("Có lỗi xảy ra khi xóa ảnh");
      }
    } catch (error) {
      console.error("Error deleting image:", error);
      alert("Có lỗi xảy ra khi xóa ảnh");
    }
  };

  const handleUploadComplete = () => {
    setShowUploadModal(false);
    fetchImages();
  };

  const handleEditComplete = () => {
    setShowEditModal(false);
    setSelectedImage(null);
    fetchImages();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={onClose}>
            <ArrowLeft size={16} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{gallery.name}</h1>
            <p className="text-gray-600 mt-2">
              {gallery.description || "Không có mô tả"}
            </p>
          </div>
        </div>
        <Button
          onClick={handleUploadImages}
          className="flex items-center gap-2 text-primary-white"
        >
          <Upload size={20} />
          Thêm ảnh
        </Button>
      </div>

      {/* Gallery Info */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin thư viện</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">
                Thông tin cơ bản
              </h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Tên thư viện
                  </dt>
                  <dd className="text-sm text-gray-900">{gallery.name}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Mô tả</dt>
                  <dd className="text-sm text-gray-900">
                    {gallery.description || "Không có mô tả"}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Trạng thái
                  </dt>
                  <dd className="text-primary-white">
                    <Badge variant={gallery.isActive ? "default" : "secondary"}>
                      {gallery.isActive ? "Hoạt động" : "Không hoạt động"}
                    </Badge>
                  </dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 mb-2">Thống kê</h3>
              <dl className="space-y-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Số lượng ảnh
                  </dt>
                  <dd className="text-sm text-gray-900">{images.length}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Ngày tạo
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {formatDate(gallery.createdAt)}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">
                    Cập nhật lần cuối
                  </dt>
                  <dd className="text-sm text-gray-900">
                    {formatDate(gallery.updatedAt)}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Tags */}
          {gallery.tags.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-900 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {gallery.tags.map((tag, index) => (
                  <Badge key={index} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Ảnh trong thư viện ({images.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-32 w-full rounded" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Chưa có ảnh nào
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Bắt đầu thêm ảnh vào thư viện này.
              </p>
              <div className="mt-6 text-primary-white">
                <Button onClick={handleUploadImages}>
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm ảnh đầu tiên
                </Button>
              </div>
            </div>
          ) : (
            <div className = "grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {images.map((image) => (
                <div key={image.id} className="group relative">
                  <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={image.imageUrl}
                      alt={image.altText || "Gallery image"}
                      width={200}
                      height={200}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 rounded-lg">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex space-x-2">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleEditImage(image)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteImage(image)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Image info */}
                  <div className="mt-2 text-center">
                    <p className="text-xs text-gray-500">
                      Vị trí: {image.position}
                    </p>
                    {image.altText && (
                      <p
                        className="text-xs text-gray-700 truncate"
                        title={image.altText}
                      >
                        {image.altText}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {showUploadModal && (
        <ImageUploadModal
          galleryId={gallery.id}
          onClose={() => setShowUploadModal(false)}
          onComplete={handleUploadComplete}
        />
      )}

      {showEditModal && selectedImage && (
        <ImageEditModal
          galleryId={gallery.id}
          image={selectedImage}
          onClose={() => setShowEditModal(false)}
          onComplete={handleEditComplete}
        />
      )}
    </div>
  );
}
