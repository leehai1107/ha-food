'use client'
import homepageService, { HeroSlide, HomepageContent } from "@/services/homepageService"
import { useEffect, useState } from "react"
import AnimatedCounter from "../animations/AnimatedCounter"
import Link from "next/link"

export default function HeroSection() {
    const [currentSlide, setCurrentSlide] = useState(0)
  const [slides, setSlides] = useState<HeroSlide[]>([])
  const [statsContent, setStatsContent] = useState<HomepageContent | null>(null)
  const [loading, setLoading] = useState(true)

//   / Default slides as fallback
  const defaultSlides = [
    {
      id: 1,
      title: 'Tinh Hoa Ẩm Thực Việt Nam',
      subtitle: 'Khám phá hương vị truyền thống được chế biến từ những nguyên liệu tươi ngon nhất',
      ctaText: 'Khám phá ngay',
      ctaLink: '/products',
      imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1200&h=600&fit=crop',
      position: 0,
      isActive: true,
      createdAt: '',
      updatedAt: ''
    }
  ]

  useEffect(() => {
    fetchHomepageData()
  }, [])

  const fetchHomepageData = async () => {
    try {
      const response = await homepageService.getHomepageContent()
      if (response.success) {
        const activeSlides = response.data.heroSlides.filter(slide => slide.isActive)
        setSlides(activeSlides)
        const stats = response.data.content.find(content => content.section === 'stats')
        setStatsContent(stats || null)
      }else {
        console.log("Response data:", response)
        console.error('Failed to fetch homepage content:', response.message)
        setSlides(defaultSlides)
      }
    } catch (error) {
      console.error('Failed to fetch homepage data:', error)
      setSlides(defaultSlides)
    } finally {
      setLoading(false)
    }
  }

   useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)

    return () => clearInterval(timer)
  }, [slides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  if (loading) {
    return (
      <section className="relative w-full h-screen overflow-hidden mt-20 bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </section>
    )
  }

  return(
    <section className="relative w-full h-screen overflow-hidden mt-20">
      {/* Slider */}
      <div className="relative w-full h-full">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ backgroundImage: `url(${slide.imageUrl})` }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 flex items-center justify-center" style={{
              background: `linear-gradient(to bottom right, ${getComputedStyle(document.documentElement).getPropertyValue('--color-primary')}CC, ${getComputedStyle(document.documentElement).getPropertyValue('--color-primary')}99, ${getComputedStyle(document.documentElement).getPropertyValue('--color-primary')}CC)`
            }}>
              <div className="w-full px-4 sm:px-6 lg:px-8">
                <div className="text-center text-white max-w-4xl mx-auto">
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 text-shadow-lg animate-fade-in-up font-heading">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-xl mb-8 leading-relaxed text-shadow animate-fade-in-up animation-delay-300 font-primary">
                    {slide.subtitle}
                  </p>
                  {slide.ctaLink ? (
                    <Link
                      href={slide.ctaLink}
                      className="inline-block bg-secondary text-white px-10 py-4 rounded-theme text-lg font-bold uppercase tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up animation-delay-600 font-primary"
                    >
                      {slide.ctaText}
                    </Link>
                  ) : (
                    <button className="bg-secondary text-white px-10 py-4 rounded-theme text-lg font-bold uppercase tracking-wide shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in-up animation-delay-600 font-primary">
                      {slide.ctaText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Indicators */}
      <div className="absolute bottom-32 left-1/2 transform -translate-x-1/2 flex space-x-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full border-2 border-white transition-all duration-300 hover:scale-125 ${
              index === currentSlide ? 'bg-white' : 'bg-transparent'
            }`}
            onClick={() => goToSlide(index)}
          />
        ))}
      </div>

      {/* Stats */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm py-8 z-10">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center max-w-6xl mx-auto">
            {statsContent?.content?.stats ? (
              statsContent.content.stats.map((stat: any, index: number) => {
                // Extract number from value string (e.g., "15+" -> 15, "10,000+" -> 10000)
                const numericValue = parseInt(stat.value.replace(/[^\d]/g, '')) || 0;
                const suffix = stat.value.replace(/[\d,]/g, '');

                return (
                  <div key={index} className="text-primary">
                    <div className="text-3xl md:text-4xl font-bold mb-2 text-primary font-heading">
                      {stat.icon && <span className="mr-2">{stat.icon}</span>}
                      <AnimatedCounter
                        end={numericValue}
                        suffix={suffix}
                        duration={1}
                        delay={(index * 0.2)}
                        startOnView={true}
                      />
                    </div>
                    <div className="text-sm md:text-base font-medium uppercase tracking-wide font-primary">
                      {stat.label}
                    </div>
                  </div>
                );
              })
            ) : (
              // Default stats as fallback
              <>
                <div className="text-primary">
                  <div className="text-3xl md:text-4xl font-bold mb-2 text-primary font-heading">
                    <AnimatedCounter
                      end={15}
                      suffix="+"
                      duration={1}
                      delay={1}
                      startOnView={true}
                    />
                  </div>
                  <div className="text-sm md:text-base font-medium uppercase tracking-wide font-primary">
                    Năm Kinh Nghiệm
                  </div>
                </div>
                <div className="text-primary">
                  <div className="text-3xl md:text-4xl font-bold mb-2 text-primary font-heading">
                    <AnimatedCounter
                      end={500}
                      suffix="+"
                      duration={1}
                      delay={1}
                      startOnView={true}
                    />
                  </div>
                  <div className="text-sm md:text-base font-medium uppercase tracking-wide font-primary">
                    Sản Phẩm Chất Lượng
                  </div>
                </div>
                <div className="text-primary">
                  <div className="text-3xl md:text-4xl font-bold mb-2 text-primary font-heading">
                    <AnimatedCounter
                      end={10000}
                      suffix="+"
                      duration={1}
                      delay={0 + 0.4}
                      startOnView={true}
                    />
                  </div>
                  <div className="text-sm md:text-base font-medium uppercase tracking-wide font-primary">
                    Khách Hàng Hài Lòng
                  </div>
                </div>
                <div className="text-primary">
                  <div className="text-3xl md:text-4xl font-bold mb-2 text-primary font-heading">
                    <AnimatedCounter
                      end={200}
                      suffix="+"
                      duration={1}
                      delay={0 + 0.6}
                      startOnView={true}
                    />
                  </div>
                  <div className="text-sm md:text-base font-medium uppercase tracking-wide font-primary">
                    Đối Tác Tin Cậy
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}