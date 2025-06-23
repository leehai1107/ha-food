"use client";
import newsService from "@/services/newsService";
import { News } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback, Suspense } from "react";

// Separate the main content into its own component
const NewsContent = () => {
  const searchParams = useSearchParams();
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [tags, setTags] = useState<string[]>([]);
  const router = useRouter();

  const currentPage = parseInt(searchParams.get("page") || "1");
  const currentTag = searchParams.get("tag") || "";
  const currentSearch = searchParams.get("search") || "";

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await newsService.getPublishedNews({
        page: currentPage,
        limit: 9,
        tag: currentTag || undefined,
        search: currentSearch || undefined,
      });

      if (response.success) {
        setNews(response.data.news);
        setTotalPages(response.data.totalPages);
        setError(null);
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch news");
    } finally {
      setLoading(false);
    }
  }, [currentPage, currentTag, currentSearch]);

  const fetchTags = useCallback(async () => {
    try {
      const response = await newsService.getAllTags();
      if (response.success) {
        setTags(response.data);
      }
    } catch (err) {
      console.error("Failed to fetch tags:", err);
    }
  }, []);

  useEffect(() => {
    fetchNews();
    fetchTags();
  }, [fetchNews, fetchTags]);

  const updateSearchParams = (key: string, value?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    if (key !== "page") {
      params.delete("page");
    }
    router.push(`?${params.toString()}`);
  };

  const handlePageChange = (page: number) =>
    updateSearchParams("page", page.toString());
  const handleTagFilter = (tag: string) => updateSearchParams("tag", tag);
  const handleSearch = (search: string) => updateSearchParams("search", search);

  if (loading) {
    return (
      <>
        <h1 className="hidden">hafood - Quà tặng doanh nghiệp</h1>
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-red-600 hover:text-red-700">
                Trang chủ
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-gray-900 font-medium">Tin tức</span>
            </nav>
          </div>
        </div>
        {/* Hero Section */}
        <div className="bg-primary text-white py-20">
          <div className="container-limited">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">
                Tin Tức
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto font-primary">
                Cập nhật những thông tin mới nhất về <br /> sản phẩm và hoạt
                động của HA Food
              </p>
            </div>
          </div>
        </div>
        {/* Filters Section */}
        <div className="bg-white shadow-sm border-b">
          <div className="container-limited py-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="w-full lg:w-96">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Tìm kiếm tin tức..."
                    value={currentSearch}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-primary"
                    style={{ borderRadius: "var(--border-radius)" }}
                  />
                  <svg
                    className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
              </div>

              {/* Tags Filter */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleTagFilter("")}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors font-primary ${
                    !currentTag
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  style={{ borderRadius: "var(--border-radius)" }}
                >
                  Tất cả
                </button>
                {tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => handleTagFilter(tag)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors font-primary ${
                      currentTag === tag
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    style={{ borderRadius: "var(--border-radius)" }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="min-h-screen bg-gray-50 py-20">
          <div className="container-limited">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <h1 className="hidden">hafood - Quà tặng doanh nghiệp</h1>
      <div className="px-2">
        {/* Breadcrumb */}
        <div className="bg-gray-50 py-4">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <nav className="flex items-center space-x-2 text-sm">
              <Link href="/" className="text-red-600 hover:text-red-700">
                Trang chủ
              </Link>
              <span className="text-gray-500">/</span>
              <span className="text-gray-900 font-medium">Tin tức</span>
            </nav>
          </div>
        </div>

        {/* Hero Section */}
        <div className="bg-primary text-white py-20">
          <div className="container-limited">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">
                Tin Tức
              </h1>
              <p className="text-xl text-gray-200 max-w-2xl mx-auto font-primary">
                Cập nhật những thông tin mới nhất về <br /> sản phẩm và hoạt
                động của HA Food
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Filters Section */}
          <div className="bg-white shadow-sm border-b">
            <div className="container-limited py-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
                {/* Search */}
                <div className="w-full lg:w-96">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Tìm kiếm tin tức..."
                      value={currentSearch}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent font-primary"
                      style={{ borderRadius: "var(--border-radius)" }}
                    />
                    <svg
                      className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Tags Filter */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => handleTagFilter("")}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors font-primary ${
                      !currentTag
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                    style={{ borderRadius: "var(--border-radius)" }}
                  >
                    Tất cả
                  </button>
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => handleTagFilter(tag)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors font-primary ${
                        currentTag === tag
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                      style={{ borderRadius: "var(--border-radius)" }}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* News Grid */}
          <div className="container-limited py-12">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
                {error}
              </div>
            )}

            {news.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900 font-heading">
                  Không có tin tức
                </h3>
                <p className="mt-1 text-sm text-gray-500 font-primary">
                  {currentSearch || currentTag
                    ? "Không tìm thấy tin tức phù hợp với bộ lọc."
                    : "Chưa có tin tức nào được đăng."}
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {news.map((article) => (
                  <NewsCard key={article.id} news={article} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <nav className="flex space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors font-primary ${
                          page === currentPage
                            ? "bg-primary text-white"
                            : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-300"
                        }`}
                        style={{ borderRadius: "var(--border-radius)" }}
                      >
                        {page}
                      </button>
                    )
                  )}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// Main page component with Suspense boundary
const NewsPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 py-20">
          <div className="container-limited">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      }
    >
      <NewsContent />
    </Suspense>
  );
};

// News Card Component
const NewsCard = ({ news }: { news: News }) => {
  const readingTime = newsService.getReadingTime(news.content);
  const excerpt =
    news.excerpt ||
    newsService.truncateContent(newsService.stripHtml(news.content));

  return (
    <Link href={`/news/${news.slug}`} className="group">
      <article
        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
        style={{ borderRadius: "var(--border-radius)" }}
      >
        {news.featuredImage && (
          <div className="aspect-video overflow-hidden">
            <Image
              src={news.featuredImage}
              alt={news.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              width={1280}
              height={720}
            />
          </div>
        )}
        <div className="p-6">
          <div className="flex items-center text-sm text-gray-500 mb-3 font-primary">
            <time>
              {newsService.formatDate(news.publishedAt || news.createdAt)}
            </time>
            <span className="mx-2">•</span>
            <span>{readingTime} phút đọc</span>
            {news.author && (
              <>
                <span className="mx-2">•</span>
                <span>{news.author.name}</span>
              </>
            )}
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-primary transition-colors font-heading">
            {news.title}
          </h3>
          <p className="text-gray-600 mb-4 line-clamp-3 font-primary">
            {excerpt}
          </p>
          {news.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {news.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-primary"
                  style={{ borderRadius: "var(--border-radius)" }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default NewsPage;
