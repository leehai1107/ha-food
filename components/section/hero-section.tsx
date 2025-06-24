"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import AnimatedCounter from "../animations/AnimatedCounter";
import {
  Building2,
  ChevronDown,
  Gift,
  MapPinned,
  UserRoundCheck,
} from "lucide-react";
import { HeroSlide } from "@/types";

interface HeroSectionProps {
  slides: HeroSlide[];
}

export default function HeroSection({ slides }: HeroSectionProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto slide change every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  return (
    <section className="relative w-full overflow-hidden">
      {/* Slider */}
      <div className="relative w-full aspect-video">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={slide.id}
              className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
                isActive ? "opacity-100 z-10" : "opacity-0 z-0"
              }`}
            >
              {slide.type === "image" && slide.imageUrl && (
                <Image
                  src={slide.imageUrl}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  {...(index !== 0 ? { loading: "lazy" } : {})}
                />
              )}

              {slide.type === "video" && slide.videoUrl && (
                <video
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  muted
                  playsInline
                >
                  <source src={slide.videoUrl} type="video/mp4" />
                  Trình duyệt của bạn không hỗ trợ video.
                </video>
              )}

              <div className="absolute inset-0 bg-black/40 flex items-center justify-center px-4 text-center">
                <div className="text-white max-w-3xl z-10">
                  <h2 className="text-3xl md:text-6xl font-bold mt-6 text-shadow-lg font-heading">
                    {slide.title}
                  </h2>
                  <p className="text-base md:text-xl mb-2 leading-relaxed text-shadow font-semibold font-primary">
                    {slide.subtitle}
                  </p>
                  {slide.ctaLink && (
                    <div className="flex flex-col items-center gap-2">
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
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Stats */}
      <div className="bg-primary backdrop-blur-sm py-2 text-primary-white">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center mx-auto">
            <StatItem
              icon={<Gift className="w-8 h-8 md:w-12 md:h-12" />}
              title="Giải Pháp Quà Tặng Doanh Nghiệp"
              value="Tinh Tế"
            />
            <StatItem
              icon={<Building2 className="w-8 h-8 md:w-12 md:h-12" />}
              title="Hạ Tầng - Đội Ngũ"
              value="Chuyên Nghiệp"
            />
            <StatItem
              icon={<MapPinned className="w-8 h-8 md:w-12 md:h-12" />}
              title="Phạm Vi Phân Phối"
              value="Toàn Quốc"
            />
            <StatItem
              icon={<UserRoundCheck className="w-8 h-8 md:w-12 md:h-12" />}
              title="Khách Hàng Tin Dùng"
            >
              <AnimatedCounter
                end={10000}
                suffix="+"
                className="lg:text-3xl font-bold uppercase"
                duration={3}
                delay={0.6}
                startOnView
              />
            </StatItem>
          </div>
        </div>
      </div>
    </section>
  );
}

// Reusable stat item
function StatItem({
  icon,
  title,
  value,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  value?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center animate-fade-in-up">
      <div className="text-secondary mb-2 font-heading">{icon}</div>
      <p className="text-base font-semibold font-primary">{title}</p>
      {value ? (
        <p className="uppercase font-bold lg:text-3xl">{value}</p>
      ) : (
        children
      )}
    </div>
  );
}
