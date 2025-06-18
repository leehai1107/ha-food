"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ImageIcon, Eye, Calendar, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import galleryService from "@/services/galleryService";
import type { Gallery } from "@/types";

export default function GalleryPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const response = await galleryService.getAll({
        includeImages: "true",
        isActive: "true",
      });
      if (response.success && response.data) {
        setGalleries(response.data.galleries || []);
      }
    } catch (error) {
      console.error("Error fetching galleries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewGallery = (gallery: Gallery) => {
    setSelectedGallery(gallery);
    setShowModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-4 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <CardContent className="p-6">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <div className="flex gap-2 mb-4">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-20" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Thư viện ảnh
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Khám phá bộ sưu tập ảnh đẹp của chúng tôi, nơi lưu giữ những
              khoảnh khắc đáng nhớ và hình ảnh chất lượng cao
            </p>
          </div>

          {/* Galleries Grid */}
          {galleries.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có thư viện ảnh nào
              </h3>
              <p className="text-gray-500">
                Thư viện ảnh sẽ được cập nhật sớm nhất.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {galleries.map((gallery) => (
                <Card
                  key={gallery.id}
                  className="overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* Gallery Cover Image */}
                  <div className="relative h-48 bg-gray-200">
                    {gallery.images && gallery.images.length > 0 ? (
                      <Image
                        src={gallery.images[0].imageUrl}
                        alt={gallery.images[0].altText || gallery.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <ImageIcon className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge
                        variant="secondary"
                        className="bg-white/90 text-gray-900"
                      >
                        {gallery._count?.images || 0} ảnh
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    {/* Gallery Title */}
                    <CardTitle className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                      {gallery.name}
                    </CardTitle>

                    {/* Gallery Description */}
                    {gallery.description && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {gallery.description}
                      </p>
                    )}

                    {/* Tags */}
                    {gallery.tags && gallery.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {gallery.tags.slice(0, 3).map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            <Tag className="w-3 h-3 mr-1" />
                            {tag}
                          </Badge>
                        ))}
                        {gallery.tags.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{gallery.tags.length - 3}
                          </Badge>
                        )}
                      </div>
                    )}

                    {/* Gallery Info */}
                    <div className="flex items-center text-sm text-gray-500 mb-4">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(gallery.createdAt)}</span>
                    </div>

                    {/* View Gallery Button */}
                    <Button asChild className="w-full" variant="outline">
                      <Link href={`/gallery/${gallery.id}`}>
                        <Eye className="w-4 h-4 mr-2" />
                        Xem thư viện
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Gallery Modal */}
      {showModal && selectedGallery && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {selectedGallery.name}
                </h2>
                {selectedGallery.description && (
                  <p className="text-gray-600 mt-1">
                    {selectedGallery.description}
                  </p>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowModal(false)}
              >
                ✕
              </Button>
            </div>

            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              {selectedGallery.images && selectedGallery.images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedGallery.images.map((image, index) => (
                    <div key={index} className="group relative">
                      <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                        <Image
                          src={image.imageUrl}
                          alt={
                            image.altText ||
                            `${selectedGallery.name} - Ảnh ${index + 1}`
                          }
                          width={300}
                          height={300}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      {image.altText && (
                        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-2 text-sm">
                          {image.altText}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">
                    Chưa có ảnh nào trong thư viện này.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
