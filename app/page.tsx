import HeroSection from "@/components/section/hero-section"
import AboutSection from "@/components/section/about-section"
import FeaturedClientsSection from "@/components/section/feature-section"
import ProductsSection from "@/components/section/product-section"
import TestimonialsSection from "@/components/section/testimonial-section"
import CollectionSection from "@/components/section/collection-section"

export default async function Home() {
  return (
    <>
      {/* Hero Section */}
      <HeroSection/>
      {/* Collection Section */}
      <CollectionSection/>
      {/* About Section */}
      <AboutSection/>
      {/* Featured Section */}
      <FeaturedClientsSection/>
      {/* Products Section */}
      <ProductsSection/>
      {/* Testimonials Section */}
      <TestimonialsSection/>
    </>
  )
}
