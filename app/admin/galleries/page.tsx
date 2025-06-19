"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  Image as ImageIcon,
} from "lucide-react";
import galleryService from "@/services/galleryService";
import type { Gallery } from "@/types";
import GalleryForm from "./components/GalleryForm";
import GalleryDetail from "./components/GalleryDetail";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

export default function GalleriesPage() {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedGallery, setSelectedGallery] = useState<Gallery | null>(null);
  const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);

  const limit = 10;

  useEffect(() => {
    fetchGalleries();
  }, [currentPage, searchTerm]);

  const fetchGalleries = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit,
        search: searchTerm || undefined,
        includeImages: "false",
      };

      const response = await galleryService.getAll(params);
      if (response.success && response.data) {
        setGalleries(response.data.galleries || []);
        setTotalPages(response.data.pagination?.totalPages || 1);
      }
    } catch (error) {
      console.error("Error fetching galleries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateGallery = () => {
    setEditingGallery(null);
    setShowForm(true);
  };

  const handleEditGallery = (gallery: Gallery) => {
    setEditingGallery(gallery);
    setShowForm(true);
  };

  const handleViewGallery = (gallery: Gallery) => {
    setSelectedGallery(gallery);
    setShowDetail(true);
  };

  const handleDeleteGallery = async (gallery: Gallery) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa thư viện "${gallery.name}"?`)) {
      return;
    }

    try {
      const response = await galleryService.delete(gallery.id);
      if (response.success) {
        fetchGalleries();
      } else {
        alert("Có lỗi xảy ra khi xóa thư viện");
      }
    } catch (error) {
      console.error("Error deleting gallery:", error);
      alert("Có lỗi xảy ra khi xóa thư viện");
    }
  };

  const handleFormSubmit = async () => {
    setShowForm(false);
    fetchGalleries();
  };

  const handleCloseDetail = () => {
    setShowDetail(false);
    setSelectedGallery(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  if (showForm) {
    return (
      <GalleryForm
        gallery={editingGallery}
        onClose={() => setShowForm(false)}
        onSubmit={handleFormSubmit}
      />
    );
  }

  if (showDetail && selectedGallery) {
    return (
      <GalleryDetail
        gallery={selectedGallery}
        onClose={handleCloseDetail}
        onRefresh={fetchGalleries}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Quản lý Dự án</h1>
          <p className="text-gray-600 mt-2">Tạo và quản lý các Dự án</p>
        </div>
        <Button
          onClick={handleCreateGallery}
          className="flex items-center gap-2 text-primary-white"
        >
          <Plus size={20} />
          Tạo thư viện mới
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <Input
                  placeholder="Tìm kiếm thư viện..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Galleries List */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách thư viện</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-4">
                  <Skeleton className="h-12 w-12 rounded" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                  </div>
                  <Skeleton className="h-8 w-[100px]" />
                </div>
              ))}
            </div>
          ) : galleries.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                Không có thư viện nào
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Bắt đầu tạo Dự án đầu tiên của bạn.
              </p>
              <div className="mt-6">
                <Button onClick={handleCreateGallery}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tạo thư viện mới
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {galleries.map((gallery) => (
                <div
                  key={gallery.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <ImageIcon className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {gallery.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {gallery.description || "Không có mô tả"}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-primary-white">
                        <Badge
                          variant={gallery.isActive ? "default" : "secondary"}
                        >
                          {gallery.isActive ? "Hoạt động" : "Không hoạt động"}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {gallery._count?.images || 0} ảnh
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {gallery.tags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {gallery.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{gallery.tags.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewGallery(gallery)}
                    >
                      <Eye size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditGallery(gallery)}
                    >
                      <Edit size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteGallery(gallery)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  {currentPage > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage - 1);
                        }}
                      />
                    </PaginationItem>
                  )}
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            setCurrentPage(page);
                          }}
                          isActive={page === currentPage}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}
                  {currentPage < totalPages && (
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(currentPage + 1);
                        }}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
