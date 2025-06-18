"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ImageIcon, Eye, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import galleryService from "@/services/galleryService";
import type { Gallery } from "@/types";

export default function GalleryPreview() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGalleries = async () => {
      try {
        const response = await galleryService.getAll({
          includeImages: "true",
          isActive: "true",
          limit: "3", // Show only 3 recent galleries
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

    fetchGalleries();
  }, []);

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Thư viện ảnh nổi bật
            </h2>
            <p className="text-lg text-gray-600">
              Khám phá những khoảnh khắc đẹp nhất của chúng tôi
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-48 bg-gray-200 animate-pulse" />
                <CardContent className="p-6">
                  <div className="h-6 bg-gray-200 rounded mb-2 animate-pulse" />
                  <div className="h-4 bg-gray-200 rounded mb-4 animate-pulse" />
                  <div className="h-10 bg-gray-200 rounded animate-pulse" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (galleries.length === 0) {
    return null; // Don't show section if no galleries
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Thư viện ảnh nổi bật
          </h2>
          <p className="text-lg text-gray-600">
            Khám phá những khoảnh khắc đẹp nhất của chúng tôi
          </p>
        </div>

        {/* Gallery Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
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
                <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                  {gallery.name}
                </h3>

                {/* Gallery Description */}
                {gallery.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">
                    {gallery.description}
                  </p>
                )}

                {/* View Gallery Button */}
                <Button asChild className="w-full" variant="outline">
                  <Link href="/gallery">
                    <Eye className="w-4 h-4 mr-2" />
                    Xem thư viện
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Galleries Button */}
        <div className="text-center">
          <Button asChild size="lg">
            <Link href="/gallery">
              Xem tất cả thư viện ảnh
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
