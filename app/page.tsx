import HeroSection from "@/components/section/hero-section"
import AboutSection from "@/components/section/about-section"
import FeaturedClientsSection from "@/components/section/feature-section"
import ProductsSection from "@/components/section/product-section"
import TestimonialsSection from "@/components/section/testimonial-section"
import CollectionSection from "@/components/section/collection-section"
import { ScrollAnimation } from "@/components/ui/scroll-animation"

export default async function Home() {
  return (
    <>
    <h1 className="hidden">hafood - Quà tặng doanh nghiệp</h1>
      {/* Hero Section */}
      <ScrollAnimation>
        <HeroSection/>
      </ScrollAnimation>
      {/* Collection Section */}
      <ScrollAnimation>
        <CollectionSection/>
      </ScrollAnimation>
      {/* About Section */}
      <ScrollAnimation>
        <AboutSection/>
      </ScrollAnimation>
      {/* Featured Section */}
      <ScrollAnimation>
        <FeaturedClientsSection/>
      </ScrollAnimation>
      {/* Products Section */}
      <ScrollAnimation>
        <ProductsSection/>
      </ScrollAnimation>
      {/* Testimonials Section */}
      <ScrollAnimation>
        <TestimonialsSection/>
      </ScrollAnimation>
    </>
  )
}
