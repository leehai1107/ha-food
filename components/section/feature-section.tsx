"use client";
import Image from "next/image";
import { defaultClients } from "@/constants/clients";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const FeaturedClientsSection = () => {
  const displayClients = defaultClients;

  // Check if window is mobile (ssr safe)
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="py-16 bg-gray-50" id="clients">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Centered Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-primary font-heading leading-tight text-center mb-10">
            Khách hàng tiêu biểu
          </h2>
          {/* Mobile: Swiper carousel */}
          {isMobile ? (
            <Swiper
              spaceBetween={16}
              slidesPerView={2}
              loop={true}
              className="w-full"
            >
              {displayClients.map((client) => (
                <SwiperSlide key={client.id}>
                  <ClientCard client={client} />
                </SwiperSlide>
              ))}
            </Swiper>
          ) : (
            // Desktop: grid
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

const ClientCard = ({
  client,
}: {
  client: { id: number; name: string; logoUrl: string };
}) => (
  <div className="flex-shrink-0 group">
    <div className="w-44 h-36 flex items-center justify-center bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-5">
      <Image
        src={client.logoUrl}
        alt={client.name}
        width={400}
        height={400}
        className="max-w-full max-h-full object-contain filter transition-all duration-300 "
        onError={(e) => {
          const target = e.target as HTMLImageElement;
          target.src = "/image/noimage.png";
        }}
      />
    </div>
  </div>
);

export default FeaturedClientsSection;
