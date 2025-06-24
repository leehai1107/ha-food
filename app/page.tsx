import { Metadata } from "next";
import HeroSection from "@/components/section/hero-section";
import AboutSection from "@/components/section/about-section";
import FeaturedClientsSection from "@/components/section/feature-section";
import ProductsSection from "@/components/section/product-section";
import TestimonialsSection from "@/components/section/testimonial-section";
import CollectionSection from "@/components/section/collection-section";
import { ScrollAnimation } from "@/components/ui/scroll-animation";
import { getHomepageData } from "@/services/homepageService";

export const metadata: Metadata = {
  title: "hafood - Quà tặng doanh nghiệp | Thiên Cầu Vượng Khí",
  description:
    "Thiên Cầu Vượng Khí là biểu tượng của sự may mắn và vượng khí, đem lại niềm vui, sự bình an và thịnh vượng trong cuộc sống.",
  keywords:
    "quà tặng doanh nghiệp, thiên cầu vượng khí, bánh trung thu, hafood",
  openGraph: {
    title: "hafood - Quà tặng doanh nghiệp",
    description: "Thiên Cầu Vượng Khí - Biểu tượng may mắn và vượng khí",
    images: [
      {
        url: "/uploads/shared/images/banners/banner_1.webp",
        width: 1200,
        height: 630,
        alt: "hafood - Quà tặng doanh nghiệp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "hafood - Quà tặng doanh nghiệp",
    description: "Thiên Cầu Vượng Khí - Biểu tượng may mắn và vượng khí",
    images: ["/uploads/shared/images/banners/banner_1.webp"],
  },
};

export default async function Home() {
  const homepageData = await getHomepageData();

  return (
    <>
      <h1 className="hidden">hafood - Quà tặng doanh nghiệp</h1>

      {/* Hero Section - No suspense needed for LCP optimization */}
      <HeroSection slides={homepageData.hero.slides} />

      {/* Collection Section */}
      <ScrollAnimation>
        <CollectionSection data={homepageData.collection} />
      </ScrollAnimation>

      {/* Products Section */}
      <ScrollAnimation>
        <ProductsSection />
      </ScrollAnimation>

      {/* About Section */}
      <ScrollAnimation>
        <AboutSection data={homepageData.about} />
      </ScrollAnimation>

      {/* Featured Section */}
      <ScrollAnimation>
        <FeaturedClientsSection clients={homepageData.features.clients} />
      </ScrollAnimation>

      {/* Testimonials Section */}
      <ScrollAnimation>
        <TestimonialsSection testimonials={homepageData.testimonials.items} />
      </ScrollAnimation>
    </>
  );
}
