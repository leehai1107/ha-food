"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface HomepageData {
  hero: {
    slides: any[];
  };
  collection: any;
  about: any;
  features: {
    clients: any[];
  };
  testimonials: {
    items: any[];
  };
}

export default function HomepageManager() {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("hero");

  useEffect(() => {
    loadHomepageData();
  }, []);

  const loadHomepageData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/admin/homepage");
      if (response.ok) {
        const data = await response.json();
        setHomepageData(data.data);
      } else {
        // Load default data if API fails
        setHomepageData(getDefaultData());
      }
    } catch (error) {
      console.error("Failed to load homepage data:", error);
      setHomepageData(getDefaultData());
    } finally {
      setIsLoading(false);
    }
  };

  const getDefaultData = (): HomepageData => ({
    hero: {
      slides: [
        {
          id: 1,
          title: "Thiên Cầu Vượng Khí",
          subtitle:
            "Thiên Cầu Vượng Khí là biểu tượng của sự may mắn và vượng khí...",
          ctaText: "Xem Thêm",
          ctaLink: "/products",
          imageUrl: "/uploads/shared/images/banners/banner_1.webp",
          type: "image",
          position: 0,
        },
      ],
    },
    collection: {
      id: 1,
      mediaType: "image",
      mediaUrl: "/uploads/shared/images/banners/banner_tong_hop.webp",
      content:
        "## BỘ SƯU TẬP TRUNG THU 2025\n### THIÊN HƯƠNG NGUYỆT DẠ\n\nKính chào Quý doanh nghiệp và quý khách hàng...",
    },
    about: {
      imageUrl: "/uploads/shared/images/about/sm.webp",
      imageUrlMd: "/uploads/shared/images/about/md.webp",
      imageUrlLg: "/uploads/shared/images/about/lg.webp",
    },
    features: {
      clients: [],
    },
    testimonials: {
      items: [],
    },
  });

  const handleSave = async () => {
    if (!homepageData) return;

    try {
      setIsSaving(true);
      const response = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(homepageData),
      });

      if (response.ok) {
        toast.success("Lưu thành công!");
      } else {
        toast.error("Lưu thất bại!");
      }
    } catch (error) {
      console.error("Failed to save homepage data:", error);
      toast.error("Lưu thất bại!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleExport = () => {
    if (!homepageData) return;

    const dataStr = JSON.stringify(homepageData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "homepage-data.json";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Xuất file thành công!");
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        setHomepageData(data);
        toast.success("Import thành công!");
      } catch (error) {
        toast.error("File không hợp lệ!");
      }
    };
    reader.readAsText(file);
  };

  const updateSection = (section: keyof HomepageData, data: any) => {
    setHomepageData((prev) => (prev ? { ...prev, [section]: data } : null));
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Quản lý Trang chủ
          </h1>
          <p className="text-gray-600 mt-2">
            Chỉnh sửa nội dung các section trên trang chủ
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
            id="import-file"
          />
          <label htmlFor="import-file">
            <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              📤 Import
            </button>
          </label>

          <button
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            onClick={handleExport}
          >
            📥 Export
          </button>

          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            onClick={handleSave}
            disabled={isSaving}
          >
            {isSaving ? "Đang lưu..." : "💾 Lưu thay đổi"}
          </button>
        </div>
      </div>

      {/* Preview Card */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-2">👁️ Xem trước</h3>
        <p className="text-gray-600 mb-4">
          Xem trước trang chủ với dữ liệu hiện tại
        </p>
        <button
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          onClick={() => window.open("/", "_blank")}
        >
          Mở trang chủ trong tab mới
        </button>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: "hero", name: "Hero Section" },
            { id: "collection", name: "Collection" },
            { id: "about", name: "About" },
            { id: "features", name: "Features" },
            { id: "testimonials", name: "Testimonials" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white border border-gray-200 rounded-lg p-6">
        {activeTab === "hero" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Hero Section - Slides
            </h3>
            <p className="text-gray-600 mb-4">
              Quản lý các slide trong hero section
            </p>
            <div className="space-y-4">
              {homepageData?.hero.slides.map((slide, index) => (
                <div
                  key={slide.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Slide {index + 1}</h4>
                    <button
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        const updatedSlides = homepageData.hero.slides.filter(
                          (_, i) => i !== index
                        );
                        updateSection("hero", { slides: updatedSlides });
                      }}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Tiêu đề
                      </label>
                      <input
                        type="text"
                        value={slide.title}
                        onChange={(e) => {
                          const updatedSlides = [...homepageData.hero.slides];
                          updatedSlides[index].title = e.target.value;
                          updateSection("hero", { slides: updatedSlides });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Loại media
                      </label>
                      <select
                        value={slide.type}
                        onChange={(e) => {
                          const updatedSlides = [...homepageData.hero.slides];
                          updatedSlides[index].type = e.target.value;
                          updateSection("hero", { slides: updatedSlides });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      >
                        <option value="image">Hình ảnh</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">
                      Mô tả
                    </label>
                    <textarea
                      value={slide.subtitle}
                      onChange={(e) => {
                        const updatedSlides = [...homepageData.hero.slides];
                        updatedSlides[index].subtitle = e.target.value;
                        updateSection("hero", { slides: updatedSlides });
                      }}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        URL media
                      </label>
                      <input
                        type="text"
                        value={
                          slide.type === "image"
                            ? slide.imageUrl || ""
                            : slide.videoUrl || ""
                        }
                        onChange={(e) => {
                          const updatedSlides = [...homepageData.hero.slides];
                          if (slide.type === "image") {
                            updatedSlides[index].imageUrl = e.target.value;
                          } else {
                            updatedSlides[index].videoUrl = e.target.value;
                          }
                          updateSection("hero", { slides: updatedSlides });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Text CTA
                      </label>
                      <input
                        type="text"
                        value={slide.ctaText}
                        onChange={(e) => {
                          const updatedSlides = [...homepageData.hero.slides];
                          updatedSlides[index].ctaText = e.target.value;
                          updateSection("hero", { slides: updatedSlides });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">
                      Link CTA
                    </label>
                    <input
                      type="text"
                      value={slide.ctaLink}
                      onChange={(e) => {
                        const updatedSlides = [...homepageData.hero.slides];
                        updatedSlides[index].ctaLink = e.target.value;
                        updateSection("hero", { slides: updatedSlides });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              ))}
              <button
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                onClick={() => {
                  const newSlide = {
                    id: Date.now(),
                    title: "Tiêu đề mới",
                    subtitle: "Mô tả mới",
                    ctaText: "Xem thêm",
                    ctaLink: "/products",
                    imageUrl: "",
                    type: "image",
                    position: homepageData?.hero.slides.length || 0,
                  };
                  const updatedSlides = [
                    ...(homepageData?.hero.slides || []),
                    newSlide,
                  ];
                  updateSection("hero", { slides: updatedSlides });
                }}
              >
                ➕ Thêm slide mới
              </button>
            </div>
          </div>
        )}

        {activeTab === "collection" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Collection Section</h3>
            <p className="text-gray-600 mb-4">
              Chỉnh sửa nội dung section collection
            </p>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Loại media
                  </label>
                  <select
                    value={homepageData?.collection.mediaType}
                    onChange={(e) =>
                      updateSection("collection", {
                        ...homepageData?.collection,
                        mediaType: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="image">Hình ảnh</option>
                    <option value="video">Video</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    URL media
                  </label>
                  <input
                    type="text"
                    value={homepageData?.collection.mediaUrl}
                    onChange={(e) =>
                      updateSection("collection", {
                        ...homepageData?.collection,
                        mediaUrl: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nội dung (Markdown)
                </label>
                <textarea
                  value={homepageData?.collection.content}
                  onChange={(e) =>
                    updateSection("collection", {
                      ...homepageData?.collection,
                      content: e.target.value,
                    })
                  }
                  rows={15}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md font-mono text-sm"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Hỗ trợ Markdown với các plugin màu sắc. Ví dụ:
                  [color=#B0041A]Văn bản màu đỏ[/color]
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "about" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">About Section</h3>
            <p className="text-gray-600 mb-4">
              Chỉnh sửa hình ảnh cho section giới thiệu
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  Hình ảnh Mobile (Small)
                </label>
                <input
                  type="text"
                  value={homepageData?.about.imageUrl}
                  onChange={(e) =>
                    updateSection("about", {
                      ...homepageData?.about,
                      imageUrl: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Hình ảnh Tablet (Medium)
                </label>
                <input
                  type="text"
                  value={homepageData?.about.imageUrlMd}
                  onChange={(e) =>
                    updateSection("about", {
                      ...homepageData?.about,
                      imageUrlMd: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Hình ảnh Desktop (Large)
                </label>
                <input
                  type="text"
                  value={homepageData?.about.imageUrlLg}
                  onChange={(e) =>
                    updateSection("about", {
                      ...homepageData?.about,
                      imageUrlLg: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "features" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Feature Section - Khách hàng tiêu biểu
            </h3>
            <p className="text-gray-600 mb-4">
              Quản lý danh sách khách hàng tiêu biểu
            </p>
            <div className="space-y-4">
              {homepageData?.features.clients.map((client, index) => (
                <div
                  key={client.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Khách hàng {index + 1}</h4>
                    <button
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        const updatedClients =
                          homepageData.features.clients.filter(
                            (_, i) => i !== index
                          );
                        updateSection("features", { clients: updatedClients });
                      }}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Tên khách hàng
                      </label>
                      <input
                        type="text"
                        value={client.name}
                        onChange={(e) => {
                          const updatedClients = [
                            ...homepageData.features.clients,
                          ];
                          updatedClients[index].name = e.target.value;
                          updateSection("features", {
                            clients: updatedClients,
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        URL logo
                      </label>
                      <input
                        type="text"
                        value={client.logoUrl}
                        onChange={(e) => {
                          const updatedClients = [
                            ...homepageData.features.clients,
                          ];
                          updatedClients[index].logoUrl = e.target.value;
                          updateSection("features", {
                            clients: updatedClients,
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">
                      Website
                    </label>
                    <input
                      type="text"
                      value={client.websiteUrl}
                      onChange={(e) => {
                        const updatedClients = [
                          ...homepageData.features.clients,
                        ];
                        updatedClients[index].websiteUrl = e.target.value;
                        updateSection("features", { clients: updatedClients });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">
                      Mô tả
                    </label>
                    <input
                      type="text"
                      value={client.description}
                      onChange={(e) => {
                        const updatedClients = [
                          ...homepageData.features.clients,
                        ];
                        updatedClients[index].description = e.target.value;
                        updateSection("features", { clients: updatedClients });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={client.isActive}
                        onChange={(e) => {
                          const updatedClients = [
                            ...homepageData.features.clients,
                          ];
                          updatedClients[index].isActive = e.target.checked;
                          updateSection("features", {
                            clients: updatedClients,
                          });
                        }}
                        className="mr-2"
                      />
                      Hiển thị
                    </label>
                  </div>
                </div>
              ))}
              <button
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                onClick={() => {
                  const newClient = {
                    id: Date.now(),
                    name: "Tên khách hàng mới",
                    logoUrl: "",
                    websiteUrl: "",
                    description: "Mô tả khách hàng",
                    position: homepageData?.features.clients.length || 0,
                    isActive: true,
                  };
                  const updatedClients = [
                    ...(homepageData?.features.clients || []),
                    newClient,
                  ];
                  updateSection("features", { clients: updatedClients });
                }}
              >
                ➕ Thêm khách hàng mới
              </button>
            </div>
          </div>
        )}

        {activeTab === "testimonials" && (
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Testimonial Section - Đánh giá khách hàng
            </h3>
            <p className="text-gray-600 mb-4">
              Quản lý các đánh giá từ khách hàng
            </p>
            <div className="space-y-4">
              {homepageData?.testimonials.items.map((testimonial, index) => (
                <div
                  key={testimonial.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium">Đánh giá {index + 1}</h4>
                    <button
                      className="text-red-600 hover:text-red-700"
                      onClick={() => {
                        const updatedTestimonials =
                          homepageData.testimonials.items.filter(
                            (_, i) => i !== index
                          );
                        updateSection("testimonials", {
                          items: updatedTestimonials,
                        });
                      }}
                    >
                      🗑️ Xóa
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Tên khách hàng
                      </label>
                      <input
                        type="text"
                        value={testimonial.name}
                        onChange={(e) => {
                          const updatedTestimonials = [
                            ...homepageData.testimonials.items,
                          ];
                          updatedTestimonials[index].name = e.target.value;
                          updateSection("testimonials", {
                            items: updatedTestimonials,
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Vị trí công việc
                      </label>
                      <input
                        type="text"
                        value={testimonial.location}
                        onChange={(e) => {
                          const updatedTestimonials = [
                            ...homepageData.testimonials.items,
                          ];
                          updatedTestimonials[index].location = e.target.value;
                          updateSection("testimonials", {
                            items: updatedTestimonials,
                          });
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">
                      URL avatar
                    </label>
                    <input
                      type="text"
                      value={testimonial.avatarUrl || ""}
                      onChange={(e) => {
                        const updatedTestimonials = [
                          ...homepageData.testimonials.items,
                        ];
                        updatedTestimonials[index].avatarUrl = e.target.value;
                        updateSection("testimonials", {
                          items: updatedTestimonials,
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">
                      Đánh giá (1-5 sao)
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={testimonial.rating}
                      onChange={(e) => {
                        const updatedTestimonials = [
                          ...homepageData.testimonials.items,
                        ];
                        updatedTestimonials[index].rating = parseInt(
                          e.target.value
                        );
                        updateSection("testimonials", {
                          items: updatedTestimonials,
                        });
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="block text-sm font-medium mb-1">
                      Nội dung đánh giá
                    </label>
                    <textarea
                      value={testimonial.content}
                      onChange={(e) => {
                        const updatedTestimonials = [
                          ...homepageData.testimonials.items,
                        ];
                        updatedTestimonials[index].content = e.target.value;
                        updateSection("testimonials", {
                          items: updatedTestimonials,
                        });
                      }}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div className="mt-4">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={testimonial.isActive}
                        onChange={(e) => {
                          const updatedTestimonials = [
                            ...homepageData.testimonials.items,
                          ];
                          updatedTestimonials[index].isActive =
                            e.target.checked;
                          updateSection("testimonials", {
                            items: updatedTestimonials,
                          });
                        }}
                        className="mr-2"
                      />
                      Hiển thị
                    </label>
                  </div>
                </div>
              ))}
              <button
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
                onClick={() => {
                  const newTestimonial = {
                    id: Date.now(),
                    name: "Tên khách hàng mới",
                    location: "Vị trí công việc",
                    type: "",
                    content: "Nội dung đánh giá...",
                    avatarUrl: "",
                    rating: 5,
                    position: homepageData?.testimonials.items.length || 0,
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                  };
                  const updatedTestimonials = [
                    ...(homepageData?.testimonials.items || []),
                    newTestimonial,
                  ];
                  updateSection("testimonials", { items: updatedTestimonials });
                }}
              >
                ➕ Thêm đánh giá mới
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
