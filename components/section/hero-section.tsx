"use client";
import { useCallback, useEffect, useState } from "react";
import AnimatedCounter from "../animations/AnimatedCounter";
import Link from "next/link";
import {
  Building2,
  ChevronDown,
  Gift,
  MapPinned,
  UserRoundCheck,
} from "lucide-react";
import { HeroSlide } from "@/types";
import Image from "next/image";

export default function HeroSection() {
  const [_currentSlide, setCurrentSlide] = useState(0);
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const fetchHomepageData = useCallback(async () => {
    const defaultSlides = [
      {
        id: 1,
        title: "Thiên Cầu Vượng Khí",
        subtitle:
          "Thiên Cầu Vượng Khí là biểu tượng của sự may mắn và vượng khí, như một lời chúc phúc gửi đến người nhận, đem lại niềm vui, sự bình an và thịnh vượng trong cuộc sống.",
        ctaText: "Xem Thêm",
        ctaLink: "/products",
        imageUrl: "/image/banners/banner_1.png",
        position: 0,
        isActive: true,
        createdAt: "",
        updatedAt: "",
      },
    ];
    setSlides(defaultSlides);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchHomepageData();
  }, [fetchHomepageData]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [slides.length]);

  if (loading) {
    return (
      <section className="relative w-full h-screen overflow-hidden bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden">
      {/* Slider container with aspect ratio */}
      <div className="relative w-full aspect-video">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${
              index === _currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              fill
              className="object-cover"
              priority={index === 0}
            />
            {/* The overlay */}
            <div
              className={`absolute inset-0 bg-black transition-opacity duration-500 ${
                isHovered ? "opacity-70" : "opacity-0"
              }`}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center z-10">
                <div className={`text-white max-w-3xl`}>
                  <h2 className="text-3xl md:text-6xl font-bold mt-6 text-shadow-lg font-heading">
                    {slide.title}
                  </h2>
                  <p className="text-base md:text-xl mb-2 leading-relaxed text-shadow font-semibold font-primary">
                    {slide.subtitle}
                  </p>

                  {/* CTA */}
                  <div className="flex flex-col items-center justify-center gap-2">
                    {slide.ctaLink ? (
                      <>
                        <Link
                          href={slide.ctaLink}
                          className="text-white px-6 py-3 rounded-theme text-base md:text-lg font-bold uppercase tracking-wide hover:-translate-y-1 transition-all duration-300 font-primary"
                        >
                          {slide.ctaText}
                        </Link>
                        <ChevronDown
                          className="text-white animate-bounce"
                          size={24}
                        />
                      </>
                    ) : (
                      <>
                        <button className="text-white px-6 py-3 rounded-theme text-base md:text-lg font-bold uppercase tracking-wide shadow-lg hover:-translate-y-1 transition-all duration-300 font-primary">
                          {slide.ctaText}
                        </button>
                        <ChevronDown
                          className="text-white animate-bounce"
                          size={24}
                        />
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Nội dung text */}
          </div>
        ))}
      </div>

      {/* Stats - now in normal flow */}
      <div className="bg-primary backdrop-blur-sm py-2 text-primary-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mx-auto">
            <div
              className="flex flex-col items-center animate-fade-in-up"
              style={{ animationDelay: "0s" }}
            >
              <div className="text-secondary mb-2 font-heading">
                <Gift size={48} />
              </div>
              <p className="text-base md:text-base font-semibold font-primary">
                Giải Pháp Quà Tặng Doanh Nghiệp
              </p>
              <p className="uppercase font-bold text-3xl">Tinh Tế</p>
            </div>
            <div
              className="flex flex-col items-center animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="text-secondary mb-2 font-heading">
                <Building2 size={48} />
              </div>
              <p className="text-base md:text-base font-semibold font-primary">
                Hạ Tầng - Đội Ngũ
              </p>
              <p className="uppercase font-bold text-3xl">Chuyên Nghiệp</p>
            </div>
            <div
              className="flex flex-col items-center animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="text-secondary mb-2 font-heading">
                <MapPinned size={48} />
              </div>
              <p className="text-base md:text-base font-semibold font-primary">
                Phạm Vi Phân Phối
              </p>
              <p className="uppercase font-bold text-3xl">Toàn Quốc</p>
            </div>
            <div
              className="flex flex-col items-center animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            >
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
                delay={3 * 0.2}
                startOnView={true}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
