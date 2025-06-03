'use client'
import { useState } from 'react';
import AnimatedCounter from '../animations/AnimatedCounter';
import Image from 'next/image';
import { GalleryImage } from '@/types';

const AboutSection = () => {
  const [loading] = useState(false);

  // Default content as fallback
  const defaultContent = {
    title: 'Giá Trị Của Những Tinh Hoa Thời Đại',
    subtitle: 'Hành trình khám phá và bảo tồn ẩm thực Việt Nam',
    content: {
      description: 'HA Food được thành lập với sứ mệnh bảo tồn và phát triển ẩm thực truyền thống Việt Nam. Chúng tôi cam kết mang đến những sản phẩm chất lượng cao, an toàn và ngon miệng, đồng thời giữ gìn những giá trị văn hóa ẩm thực đặc sắc của dân tộc.',
      mission: 'Bảo tồn và phát triển ẩm thực truyền thống Việt Nam, mang đến những sản phẩm chất lượng cao với hương vị đậm đà bản sắc dân tộc.',
      vision: 'Trở thành thương hiệu ẩm thực hàng đầu Việt Nam, được khách hàng tin tưởng và yêu mến trên toàn thế giới.',

      images: {
        main: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop',
        gallery: [
          {
            url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
            alt: 'Ẩm thực truyền thống Việt Nam'
          },
          {
            url: 'https://images.unsplash.com/photo-1555507036-ab794f4afe5a?w=400&h=300&fit=crop',
            alt: 'Quà tặng doanh nghiệp cao cấp'
          },
          {
            url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
            alt: 'Không gian sản xuất hiện đại'
          }
        ]
      }
    }
  };

  const content = defaultContent;

  if (loading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-white to-gray-50" id="about">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6">
              <span className="text-2xl text-white">🏮</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-primary mb-4 leading-tight font-heading">
              {content.title || 'Giá Trị Của Những Tinh Hoa Thời Đại'}
            </h2>
            {content.subtitle && (
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed font-primary">
                {content.subtitle}
              </p>
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-2 gap-16 items-start mb-20">
            {/* Text Content */}
            <div className="space-y-8">
              {/* Description */}
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300" style={{ borderRadius: 'var(--border-radius)' }}>
                <div className="flex items-start space-x-4 mb-6">
                  <div className="flex-shrink-0 w-12 h-12 bg-primary rounded-lg flex items-center justify-center" style={{ borderRadius: 'var(--border-radius)' }}>
                    <span className="text-white text-xl">📖</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary mb-3 font-heading">Câu chuyện của chúng tôi</h3>
                    <p className="text-lg text-gray-600 leading-relaxed font-primary">
                      {content.content?.description}
                    </p>
                  </div>
                </div>
              </div>

              {/* Mission & Vision */}
              <div className="grid md:grid-cols-2 gap-6">
                {content.content?.mission && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-theme" style={{ borderRadius: 'var(--border-radius)' }}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center" style={{ borderRadius: 'var(--border-radius)' }}>
                        <span className="text-white text-lg">🎯</span>
                      </div>
                      <h4 className="text-xl font-bold text-primary font-heading">Sứ mệnh</h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed font-primary">
                      {content.content.mission}
                    </p>
                  </div>
                )}

                {content.content?.vision && (
                  <div className="bg-gray-50 rounded-2xl p-6 border border-theme" style={{ borderRadius: 'var(--border-radius)' }}>
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-10 h-10 bg-secondary rounded-lg flex items-center justify-center" style={{ borderRadius: 'var(--border-radius)' }}>
                        <span className="text-white text-lg">🌟</span>
                      </div>
                      <h4 className="text-xl font-bold text-secondary font-heading">Tầm nhìn</h4>
                    </div>
                    <p className="text-gray-700 leading-relaxed font-primary">
                      {content.content.vision}
                    </p>
                  </div>
                )}
              </div>

            </div>

            {/* Enhanced Images Section */}
            <div className="space-y-6">
              {/* Main Image */}
              <div className="relative group">
                <div className="rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
                  <Image
                    src={content.content?.images?.main || 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&h=400&fit=crop'}
                    alt="HA Food - Tinh hoa ẩm thực"
                    className="w-full h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-6 left-6 text-white">
                      <h5 className="text-xl font-bold mb-2">HA Food</h5>
                      <p className="text-sm opacity-90">Tinh hoa ẩm thực Việt Nam</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="grid grid-cols-2 gap-4">
                {
                  (content.content?.images?.gallery || [
                    { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop', alt: 'Ẩm thực truyền thống' },
                    { url: 'https://images.unsplash.com/photo-1555507036-ab794f4afe5a?w=400&h=300&fit=crop', alt: 'Quà tặng doanh nghiệp' },
                    { url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop', alt: 'Không gian sản xuất' }
                  ] as GalleryImage[]).slice(0, 3).map((image: GalleryImage, index: number) => (
                    <div key={index} className={`relative group ${index === 2 ? 'col-span-2' : ''}`}>
                      <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                        <Image
                          src={image.url}
                          alt={image.alt}
                          className={`w-full object-cover group-hover:scale-105 transition-transform duration-300 ${index === 2 ? 'h-32' : 'h-40'
                            }`}
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-white text-sm font-medium bg-black/50 px-3 py-1 rounded-full">
                              {image.alt}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>



          {/* Statistics Section */}
          <div className="bg-primary rounded-3xl p-8 md:p-12 text-white" style={{ borderRadius: 'var(--border-radius)' }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-secondary font-heading">
                  <AnimatedCounter
                    end={10}
                    suffix="+"
                    duration={1}
                    delay={1}
                    startOnView={true}
                  />
                </div>
                <div className="text-sm md:text-base opacity-90 font-primary">Năm kinh nghiệm</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-secondary font-heading">
                  <AnimatedCounter
                    end={1000}
                    suffix="+"
                    duration={1}
                    delay={0 + 0.2}
                    startOnView={true}
                  />
                </div>
                <div className="text-sm md:text-base opacity-90 font-primary">Khách hàng tin tưởng</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-secondary font-heading">
                  <AnimatedCounter
                    end={50}
                    suffix="+"
                    duration={1}
                    delay={0 + 0.4}
                    startOnView={true}
                  />
                </div>
                <div className="text-sm md:text-base opacity-90 font-primary">Sản phẩm đa dạng</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-secondary font-heading">
                  <AnimatedCounter
                    end={24}
                    suffix="/7"
                    duration={1}
                    delay={0 + 0.6}
                    startOnView={true}
                  />
                </div>
                <div className="text-sm md:text-base opacity-90 font-primary">Hỗ trợ khách hàng</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutSection
