'use client'
import { useCallback, useEffect, useState } from "react";
import AnimatedCounter from "../animations/AnimatedCounter"
import Link from "next/link"
import { Building2, ChevronDown, Gift, MapPinned, UserRoundCheck } from "lucide-react";
import { HeroSlide } from "@/types";

export default function HeroSection() {
  const [_currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [loading, setLoading] = useState(true)
  const [isHovered, setIsHovered] = useState(false);

  const fetchHomepageData = useCallback(async () => {
    const defaultSlides = [
      {
        id: 1,
        title: 'Thiên Cầu Vượng Khí',
        subtitle: 'Thiên Cầu Vượng Khí là biểu tượng của sự may mắn và vượng khí, như một lời chúc phúc gửi đến người nhận, đem lại niềm vui, sự bình an và thịnh vượng trong cuộc sống.',
        ctaText: 'Xem Thêm',
        ctaLink: '/products',
        imageUrl: '/image/banners/banner_1.png',
        position: 0,
        isActive: true,
        createdAt: '',
        updatedAt: ''
      }
    ];
    setSlides(defaultSlides);
    setLoading(false);
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
      <section className="relative w-full h-screen overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </section>
    )
  }

  return (
    <section className="relative w-full h-screen overflow-hidden">
      {/* Slider */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${index === _currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            backgroundImage: `url(${slide.imageUrl})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
          }}
        >
          {/* Lớp phủ trắng khi hover */}
          <div
            className={`absolute inset-0 bg-white transition-opacity duration-500 ${isHovered ? 'opacity-40' : 'opacity-0'
              }`}
            style={{ pointerEvents: 'none' }}
          />

          {/* Nội dung text */}
          <div className="absolute inset-0 flex flex-col items-center justify-start sm:justify-center px-4 text-center z-10 mt-52 sm:mt-0">
            <div
              className={`text-primary max-w-3xl transition-all duration-700 ease-out transform ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
            >
              <h1 className="text-3xl md:text-6xl font-bold mb-4 text-shadow-lg font-heading">
                {slide.title}
              </h1>
              <p className="text-base md:text-xl mb-6 leading-relaxed text-shadow font-semibold font-primary">
                {slide.subtitle}
              </p>

              {/* CTA */}
              <div className="flex flex-col items-center justify-center gap-2">
                {slide.ctaLink ? (
                  <>
                    <Link
                      href={slide.ctaLink}
                      className="text-primary px-6 py-3 rounded-theme text-base md:text-lg font-bold uppercase tracking-wide hover:-translate-y-1 transition-all duration-300 font-primary"
                    >
                      {slide.ctaText}
                    </Link>
                    <ChevronDown className="text-primary animate-bounce" size={24} />
                  </>
                ) : (
                  <>
                    <button className="text-primary px-6 py-3 rounded-theme text-base md:text-lg font-bold uppercase tracking-wide shadow-lg hover:-translate-y-1 transition-all duration-300 font-primary">
                      {slide.ctaText}
                    </button>
                    <ChevronDown className="text-primary animate-bounce" size={24} />
                  </>
                )}
              </div>
            </div>
          </div>

        </div>
      ))}

      {/* Stats */}
      <div className="absolute bottom-0 left-0 right-0 bg-primary backdrop-blur-sm py-2 z-10 text-primary-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mx-auto">
            <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0s' }}>
              <div className="text-secondary mb-2 font-heading">
                <Gift size={48} />
              </div>
              <p className="text-base md:text-base font-semibold font-primary">
                Giải Pháp Quà Tặng Doanh Nghiệp
              </p>
              <p className="uppercase font-bold text-3xl">Tinh Tế</p>
            </div>
            <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
              <div className="text-secondary mb-2 font-heading">
                <Building2 size={48} />
              </div>
              <p className="text-base md:text-base font-semibold font-primary">
                Hạ Tầng - Đội Ngũ
              </p>
              <p className="uppercase font-bold text-3xl">Chuyên Nghiệp</p>
            </div>
            <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="text-secondary mb-2 font-heading">
                <MapPinned size={48} />
              </div>
              <p className="text-base md:text-base font-semibold font-primary">
                Phạm Vi Phân Phối
              </p>
              <p className="uppercase font-bold text-3xl">Toàn Quốc</p>
            </div>
            <div className="flex flex-col items-center animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
              <div className="text-secondary mb-2 font-heading">
                <UserRoundCheck size={48} />
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