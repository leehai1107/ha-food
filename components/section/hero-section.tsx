'use client'
import homepageService, { HeroSlide, HomepageContent } from "@/services/homepageService"
import { useCallback, useEffect, useState } from "react";
import AnimatedCounter from "../animations/AnimatedCounter"
import Link from "next/link"
import { Stat } from "@/types";
import { Building2, ChevronDown, Gift, MapPinned, UserRoundCheck } from "lucide-react";

export default function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false);
  const [primaryWhite, setPrimaryWhite] = useState("--color-primary-white");
  const [primary, setPrimary] = useState("--color-primary");

  useEffect(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    setPrimaryWhite(rootStyles.getPropertyValue('--color-primary-white').trim());
    setPrimary(rootStyles.getPropertyValue('--color-primary').trim());
  }, []);

  const overlayGradient = isHovered
    ? `linear-gradient(to bottom, ${primaryWhite}CC, ${primaryWhite}99, ${primary}CC)` // from bottom center
    : `linear-gradient(to bottom, ${primaryWhite}CC, ${primaryWhite}99, ${primaryWhite}CC)`; // default

  const fetchHomepageData = useCallback(async () => {
    // Move defaultSlides here to avoid changing dependencies
    const defaultSlides = [
      {
        id: 1,
        title: 'Tinh Hoa Ẩm Thực Việt Nam',
        subtitle: 'Khám phá hương vị truyền thống được chế biến từ những nguyên liệu tươi ngon nhất',
        ctaText: 'Xem Thêm',
        ctaLink: '/products',
        imageUrl: 'image/noimage.png',
        position: 0,
        isActive: true,
        createdAt: '',
        updatedAt: ''
      }
    ];
    try {
      const response = await homepageService.getHomepageContent();
      if (response.success) {
        const activeSlides = response.data.heroSlides.filter(slide => slide.isActive);
        setSlides(activeSlides);
      }
    } catch (error) {
      console.error('Failed to fetch homepage data:', error);
      setSlides(defaultSlides);
    } finally {
      setLoading(false);
      setSlides(defaultSlides);
    }
  }, []);

  useEffect(() => {
    fetchHomepageData();
  }, [fetchHomepageData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  if (loading) {
    return (
      <section className="relative w-full h-screen overflow-hidden mt-20 bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </section>
    )
  }

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Slider */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 flex items-center justify-center"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{ background: overlayGradient }}
          >
            <div className="w-full px-4 sm:px-6 lg:px-8">
              <div
                className={`
              text-center text-primary max-w-4xl mx-auto 
              transition-all duration-700 ease-out transform
              ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
            `}
              >
                <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow-lg font-heading">
                  {slide.title}
                </h1>
                <p className="text-lg md:text-xl mb-8 leading-relaxed text-shadow font-primary">
                  {slide.subtitle}
                </p>
                <div className="flex items-center justify-center mt-24">
                  {slide.ctaLink ? (
                    <div className="flex items-center justify-center flex-col">
                      <Link
                        href={slide.ctaLink}
                        className="inline-block text-primary px-10 py-4 rounded-theme text-lg font-bold uppercase tracking-wide hover:-translate-y-2 transition-all duration-300 font-primary"
                      >
                        {slide.ctaText}
                      </Link>
                      <ChevronDown
                        className="inline-block text-primary animate-bounce"
                        size={24}
                      />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center flex-col">
                      <button className="text-primary px-10 py-4 rounded-theme text-lg font-bold uppercase tracking-wide shadow-lg hover:-translate-y-2 transition-all duration-300 font-primary">
                        {slide.ctaText}
                      </button>
                      <ChevronDown
                        className="inline-block text-primary animate-bounce"
                        size={24}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>


        ))}
      </div>

      {/* Stats */}
      <div className="absolute bottom-0 left-0 right-0 bg-primary-white backdrop-blur-sm py-8 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mx-auto">
            <div className="text-primary flex flex-col items-center">
              <div className="text-secondary mb-2 font-heading">
                <Gift size={64} />
              </div>
              <p className="text-base md:text-base font-semibold font-primary">
                Giải Pháp Quà Tặng Doanh Nghiệp
              </p>
              <p className="uppercase font-bold text-3xl">Tinh Tế</p>
            </div>
            <div className="text-primary flex flex-col items-center">
              <div className="text-secondary mb-2 font-heading">
                <Building2 size={64} />
              </div>
              <p className="text-base md:text-base font-semibold font-primary">
                Hạ Tầng - Đội Ngũ
              </p>
              <p className="uppercase font-bold text-3xl">Chuyên Nghiệp</p>
            </div>
            <div className="text-primary flex flex-col items-center">
              <div className="text-secondary mb-2 font-heading">
                <MapPinned size={64} />
              </div>
              <p className="text-base md:text-base font-semibold font-primary">
                Phạm Vi Phân Phối
              </p>
              <p className="uppercase font-bold text-3xl">Toàn Quốc</p>
            </div>
            <div className="text-primary flex flex-col items-center">
              <div className="text-secondary mb-2 font-heading">
                <UserRoundCheck size={64} />
              </div>
              <p className="text-base md:text-base font-semibold font-primary">
                Khách Hàng Tin Dùng
              </p>
              <AnimatedCounter
                end={10000}
                suffix={"+"}
                className="text-3xl font-bold uppercase"
                duration={3}
                delay={(3 * 0.2)}
                startOnView={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}