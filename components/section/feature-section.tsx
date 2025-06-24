"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid"; // thêm CSS cho grid

interface Client {
  id: number;
  name: string;
  logoUrl: string;
  websiteUrl: string;
  description: string;
  position: number;
  isActive: boolean;
}

interface FeaturedClientsSectionProps {
  clients: Client[];
}

const FeaturedClientsSection = ({ clients }: FeaturedClientsSectionProps) => {
  const displayClients = clients.filter((client) => client.isActive);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="py-4 bg-primary-white" id="clients">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-primary font-heading leading-tight text-center mb-10">
            Khách hàng tiêu biểu
          </h2>

          {isMobile ? (
            <Swiper
              spaceBetween={16}
              slidesPerView={3}
              grid={{ rows: 2, fill: "row" }}
              loop={false}
              modules={[Grid]}
              className="w-full"
            >
              {displayClients.map((client) => (
                <SwiperSlide key={client.id}>
                  <ClientCard client={client} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 justify-items-center">
              {displayClients.map((client) => (
                <ClientCard key={client.id} client={client} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

const ClientCard = ({ client }: { client: Client }) => (
  <div className="h-full w-full flex items-center justify-center p-2">
    <div className="w-full h-full flex items-center justify-center bg-primary-white transition-all duration-300 p-4">
      <Image
        src={client.logoUrl}
        alt={client.name}
        width={400}
        height={400}
        className="max-w-full max-h-full object-contain"
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/image/noimage.webp";
        }}
      />
    </div>
  </div>
);

export default FeaturedClientsSection;
