"use client";
import newsService from '@/services/newsService';
import { News } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect, use } from 'react';
import ReactMarkdown from 'react-markdown';


const NewsDetailPage = ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = use(params);
    const [news, setNews] = useState<News | null>(null);
    const [relatedNews, setRelatedNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (slug) {
            fetchNews(slug);
        }
    }, [slug]);

    useEffect(() => {
        if (news) {
            fetchRelatedNews();
        }
    }, [news]);

    const fetchNews = async (newsSlug: string) => {
        try {
            setLoading(true);
            const response = await newsService.getNewsBySlug(newsSlug);

            if (response.success) {
                setNews(response.data);
                setError(null);
            }
        } catch (err: any) {
            setError(err.message || 'Failed to fetch news');
        } finally {
            setLoading(false);
        }
    };

    const fetchRelatedNews = async () => {
        try {
            // Fetch related news based on tags
            const response = await newsService.getPublishedNews({
                limit: 3,
                tag: news?.tags[0] // Use first tag for related news
            });

            if (response.success) {
                // Filter out current news
                const filtered = response.data.news.filter(item => item.id !== news?.id);
                setRelatedNews(filtered.slice(0, 3));
            }
        } catch (err) {
            console.error('Failed to fetch related news:', err);
        }
    };

    if (loading) {
        return (
            <>
                <div className="min-h-screen bg-gray-50 py-6">
                    <div className="container-limited">
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    if (error || !news) {
        return (
            <>
                <div className="min-h-screen bg-gray-50 py-6">
                    <div className="container-limited">
                        <div className="text-center">
                            <h1 className="text-2xl font-bold text-gray-900 mb-4 font-heading">
                                {error || 'Không tìm thấy tin tức'}
                            </h1>
                            <Link
                                href="/news"
                                className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-secondary transition-colors font-primary"
                                style={{ borderRadius: 'var(--border-radius)' }}
                            >
                                ← Quay lại danh sách tin tức
                            </Link>
                        </div>
                    </div>
                </div>
            </>
        );
    }

    const readingTime = newsService.getReadingTime(news.content);

    return (
        <>

            <div className="min-h-screen bg-gray-50 px-4">
                {/* Breadcrumb */}
                <div className="bg-gray-50 py-4">
                    <div className="max-w-7xl mx-auto px-6 lg:px-8">
                        <nav className="flex items-center space-x-2 text-sm">
                            <Link href="/" className="text-red-600 hover:text-red-700">Trang chủ</Link>
                            <span className="text-gray-500">/</span>
                            <Link href="/news" className="text-red-600 hover:text-red-700">Tin tức</Link>
                            <span className="text-gray-500">/</span>
                            <span className="text-gray-900 font-medium">{news.title}</span>
                        </nav>
                    </div>
                </div>

                {/* Article Content */}
                <article className="container-limited py-12">
                    <div className="max-w-4xl mx-auto">
                        {/* Article Header */}
                        <header className="mb-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight font-heading">
                                {news.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 font-primary">
                                <time className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    {newsService.formatDate(news.publishedAt || news.createdAt)}
                                </time>

                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                    </svg>
                                    {readingTime} phút đọc
                                </span>

                                {news.author && (
                                    <span className="flex items-center">
                                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                        {news.author.name}
                                    </span>
                                )}

                                <span className="flex items-center">
                                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    {news.viewCount} lượt xem
                                </span>
                            </div>

                            {/* Tags */}
                            {news.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-6">
                                    {news.tags.map((tag) => (
                                        <Link
                                            key={tag}
                                            href={`/news?tag=${encodeURIComponent(tag)}`}
                                            className="inline-block bg-gray-100 text-primary text-sm px-3 py-1 rounded-full hover:bg-gray-200 transition-colors font-primary"
                                            style={{ borderRadius: 'var(--border-radius)' }}
                                        >
                                            #{tag}
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Featured Image */}
                            {news.featuredImage && (
                                <div className="aspect-video overflow-hidden rounded-lg mb-8" style={{ borderRadius: 'var(--border-radius)' }}>
                                    <Image
                                        src={news.featuredImage}
                                        alt={news.title}
                                        className="w-full h-full object-cover"
                                        width={1280}
                                        height={720}
                                    />
                                </div>
                            )}

                            {/* Excerpt */}
                            {news.excerpt && (
                                <div className="bg-gray-50 border-l-4 border-primary p-6 mb-8" style={{ borderRadius: 'var(--border-radius)' }}>
                                    <p className="text-lg text-gray-700 italic leading-relaxed font-primary">
                                        {news.excerpt}
                                    </p>
                                </div>
                            )}
                        </header>

                        {/* Article Body */}
                        <div className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary prose-strong:text-gray-900">
                            <ReactMarkdown
                                components={{
                                    h1: ({ children }) => <h1 className="text-3xl font-bold text-gray-900 mb-4 font-heading">{children}</h1>,
                                    h2: ({ children }) => <h2 className="text-2xl font-bold text-gray-900 mb-3 mt-6 font-heading">{children}</h2>,
                                    h3: ({ children }) => <h3 className="text-xl font-bold text-gray-900 mb-2 mt-5 font-heading">{children}</h3>,
                                    p: ({ children }) => <p className="text-gray-700 mb-4 leading-relaxed font-primary">{children}</p>,
                                    ul: ({ children }) => <ul className="list-disc list-inside mb-4 text-gray-700 font-primary">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal list-inside mb-4 text-gray-700 font-primary">{children}</ol>,
                                    li: ({ children }) => <li className="mb-1 font-primary">{children}</li>,
                                    blockquote: ({ children }) => <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600 mb-4 font-primary">{children}</blockquote>,
                                    code: ({ children }) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
                                    pre: ({ children }) => <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4">{children}</pre>,
                                    a: ({ href, children }) => <a href={href} className="text-primary hover:text-secondary underline font-primary">{children}</a>,
                                    img: ({ src, alt }) => src ? <Image src={src} alt={alt || ''} className="max-w-full h-auto rounded-lg shadow-md mb-4" width={1280} height={720} /> : null,
                                }}
                            >
                                {news.content}
                            </ReactMarkdown>
                        </div>

                        {/* Share Section */}
                        <div className="mt-12 pt-8 border-t border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2 font-heading">Chia sẻ bài viết</h3>
                                    <div className="flex space-x-4">
                                        <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-primary" style={{ borderRadius: 'var(--border-radius)' }}>
                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                                            </svg>
                                            Twitter
                                        </button>
                                        <button className="flex items-center px-4 py-2 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-primary" style={{ borderRadius: 'var(--border-radius)' }}>
                                            <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                            </svg>
                                            Facebook
                                        </button>
                                    </div>
                                </div>
                                <Link
                                    href="/news"
                                    className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-primary"
                                    style={{ borderRadius: 'var(--border-radius)' }}
                                >
                                    ← Quay lại danh sách
                                </Link>
                            </div>
                        </div>
                    </div>
                </article>

                {/* Related News */}
                {relatedNews.length > 0 && (
                    <section className="bg-white py-12">
                        <div className="container-limited">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 font-heading">Tin tức liên quan</h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                {relatedNews.map((article) => (
                                    <Link key={article.id} href={`/news/${article.slug}`} className="group">
                                        <article className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-md transition-shadow" style={{ borderRadius: 'var(--border-radius)' }}>
                                            {article.featuredImage && (
                                                <div className="aspect-video overflow-hidden">
                                                    <Image
                                                        src={article.featuredImage}
                                                        alt={article.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                        width={1280}
                                                        height={720}
                                                    />
                                                </div>
                                            )}
                                            <div className="p-6">
                                                <time className="text-sm text-gray-500 font-primary">
                                                    {newsService.formatDate(article.publishedAt || article.createdAt)}
                                                </time>
                                                <h3 className="text-lg font-semibold text-gray-900 mt-2 group-hover:text-primary transition-colors line-clamp-2 font-heading">
                                                    {article.title}
                                                </h3>
                                                {article.excerpt && (
                                                    <p className="text-gray-600 mt-2 line-clamp-2 font-primary">
                                                        {article.excerpt}
                                                    </p>
                                                )}
                                            </div>
                                        </article>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}
            </div>
        </>
    );
};

export default NewsDetailPage;
