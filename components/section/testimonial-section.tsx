"use client";
import homepageService, { Testimonial } from '@/services/homepageService'
import { useState, useEffect } from 'react'


const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  // Default testimonials as fallback
  const defaultTestimonials = [
    {
      id: 1,
      name: 'Chị Hân',
      location: 'Hà Nội',
      type: '',
      content: 'Hộp vip của bánh trung thu Tại Thong năm nay rất sang trọng. Bánh có hương vị rất ngon, và mềm, nhân đậy đặn và phần trà kèm theo tham lắm. Bên cạnh đó, mẫu hộp vip có màu xanh navy bắt mắt, thiết kế mở phong tùi xách cũng rất sang tạo. Đặt trong tủ trưng bày của tôi không hề kém cạnh so với các thương hiệu nổi tiếng khác.',
      avatarUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      position: 0,
      isActive: true,
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 2,
      name: 'Giám Đốc Phòng Giao Dịch ngân hàng VCB',
      location: 'Quận 2',
      type: '',
      content: 'Bánh rất ngon và giá cả phù hợp với ngân sách để ra, có thể tặng cho khách hàng để tri ân khách hàng. Mình cũng chọn thêm cho nhân viên vì vị bánh mới lạ và khác biệt so với các loại từng ăn trước đây. Khi tặng bánh của Tại Thong, mình khá yên tâm để đem tặng cho khách hàng cũng như nhân viên, hộp quà tặng sang trọng thể hiện đẳng cấp của người tặng.',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      position: 1,
      isActive: true,
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 3,
      name: 'Anh Minh',
      location: 'Quận 7',
      type: 'Khách hàng cá nhân',
      content: 'Bánh Lava bên HA Food rất ngon, Minh có dịp được dùng thử thì quyết định mua vài hộp làm quà biếu gia đình, khách hàng trong dịp lễ này luôn. Mẫu quà hộp bên ngoài cũng quá đẹp, đóng gói chỉnh chu. Rất tin tưởng vào chất lượng bên HA Food.',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      position: 2,
      isActive: true,
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 4,
      name: 'Chị Mỹ',
      location: 'Quận 2',
      type: 'Khách hàng doanh nghiệp',
      content: 'Bên công đoàn ở Sài Gòn vừa nhận được bánh vào hôm nay. HA Food quá chuyên nghiệp, từ hương vị bánh đến khâu đóng gói không chê vào đâu được, công ty chị rất ưng ý nha. Năm nay công ty chị rất vui vì tìm được nhà cung cấp quà chất lượng như bên HA Food.',
      avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 5,
      position: 3,
      isActive: true,
      createdAt: '',
      updatedAt: ''
    }
  ]

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    try {
      const response = await homepageService.getHomepageContent()
      if (response.success) {
        const activeTestimonials = response.data.testimonials.filter(testimonial => testimonial.isActive)
        setTestimonials(activeTestimonials.length > 0 ? activeTestimonials : defaultTestimonials)
      }
    } catch (error) {
      console.error('Failed to fetch testimonials:', error)
      setTestimonials(defaultTestimonials)
    } finally {
      setLoading(false)
    }
  }

  // Calculate how many slides we can show (2 testimonials per slide)
  const testimonialsPerSlide = 2
  const totalSlides = Math.ceil(testimonials.length / testimonialsPerSlide)

  useEffect(() => {
    if (totalSlides > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % totalSlides)
      }, 6000)

      return () => clearInterval(timer)
    }
  }, [totalSlides])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-heading">
            Đánh giá của khách hàng
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed font-primary">
            Những phản hồi chân thực từ khách hàng đã tin tưởng và sử dụng sản phẩm của chúng tôi
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="max-w-7xl mx-auto relative">
          {/* Navigation Arrows */}
          {totalSlides > 1 && (
            <>
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 text-primary hover:text-secondary"
                aria-label="Previous testimonials"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 text-primary hover:text-secondary"
                aria-label="Next testimonials"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Testimonials Container */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {Array.from({ length: totalSlides }, (_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-8">
                    {testimonials
                      .slice(slideIndex * testimonialsPerSlide, (slideIndex + 1) * testimonialsPerSlide)
                      .map((testimonial) => (
                        <div
                          key={testimonial.id}
                          className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 relative"
                          style={{
                            borderRadius: '40px',
                            minHeight: '400px'
                          }}
                        >
                          {/* Header with Avatar and Info */}
                          <div className="flex items-start mb-6">
                            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200 mr-4 flex-shrink-0">
                              <img
                                src={testimonial.avatarUrl || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                                alt={testimonial.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face';
                                }}
                              />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-lg font-bold text-gray-900 mb-1 font-heading">
                                {testimonial.name}
                              </h4>
                              <p className="text-sm text-gray-600 mb-2 font-primary">
                                {testimonial.location}
                              </p>
                              {/* Rating Stars */}
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <svg key={i} className={`w-4 h-4 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            </div>
                          </div>

                          {/* Testimonial Content */}
                          <div className="mb-6">
                            <div className="text-4xl text-secondary opacity-30 font-serif leading-none mb-3">"</div>
                            <p className="text-gray-700 leading-relaxed font-primary text-sm">
                              {testimonial.content}
                            </p>
                          </div>

                          {/* Company Logo */}
                          <div className="absolute bottom-6 right-6">
                            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                              <img
                                src="https://placehold.co/48x48/f8f9fa/8B4513?text=HA&font=roboto"
                                alt="HA Food Logo"
                                className="w-8 h-8 object-contain"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Indicators */}
          {totalSlides > 1 && (
            <div className="flex justify-center space-x-3 mt-8">
              {Array.from({ length: totalSlides }, (_, index) => (
                <button
                  key={index}
                  className={`w-3 h-3 rounded-full border-2 border-secondary transition-all duration-300 hover:scale-125 ${
                    index === currentIndex ? 'bg-secondary' : 'bg-transparent'
                  }`}
                  onClick={() => goToSlide(index)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
