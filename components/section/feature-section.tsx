"use client";
import Image from "next/image";
import { defaultClients } from "@/constants/clients";
import { useEffect, useRef, useState } from "react";

const FeaturedClientsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [duration, setDuration] = useState("30s");
  const speed = 100; // px/s

  const displayClients = defaultClients;

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scroll width includes both sets (duplicated), divide by 2
    const totalWidth = container.scrollWidth / 2;
    const calculatedDuration = totalWidth / speed;

    setDuration(`${calculatedDuration}s`);
  }, [displayClients]);

  return (
    <section className="py-16 bg-gray-50" id="clients">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center">
            {/* Title */}
            <div className="flex-shrink-0 mr-8 lg:mr-12">
              <h2 className="text-2xl md:text-3xl font-bold text-primary font-heading leading-tight text-right">
                <div>Khách hàng</div>
                <div>tiêu biểu</div>
              </h2>
            </div>

            {/* Divider */}
            <div className="w-px h-12 bg-gray-300 mr-8 lg:mr-12 flex-shrink-0"></div>

            {/* Client carousel */}
            <div className="flex-1 relative overflow-hidden">
              {/* Gradient overlay */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-10" />
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10" />

              {/* Animated scroll container */}
              <div
                ref={containerRef}
                className="flex whitespace-nowrap group"
                style={{ ["--duration" as any]: duration }}
              >
                <div className="flex items-center space-x-8 px-4 animate-scroll-left">
                  {[...displayClients, ...displayClients].map((client, i) => (
                    <ClientCard key={`${client.id}-${i}`} client={client} />
                  ))}
                </div>
              </div>
            </div>
          </div>
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
