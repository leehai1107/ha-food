"use client";
import homepageService, { Client } from '@/services/homepageService';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const FeaturedClientsSection = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await homepageService.getHomepageContent();
      if (response.success) {
        setClients(response.data.clients || []);
      }
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  // Default clients as fallback
  const defaultClients = [
    {
      id: 1,
      name: 'Vingroup',
      logoUrl: 'https://placehold.co/200x80/f8f9fa/333333?text=VINGROUP&font=roboto',
      websiteUrl: 'https://vingroup.net',
      description: 'Tập đoàn đa ngành hàng đầu Việt Nam',
      position: 0,
      isActive: true,
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 2,
      name: 'FPT Corporation',
      logoUrl: 'https://placehold.co/200x80/f8f9fa/ff6600?text=FPT&font=roboto',
      websiteUrl: 'https://fpt.com.vn',
      description: 'Công ty công nghệ thông tin hàng đầu',
      position: 1,
      isActive: true,
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 3,
      name: 'Techcombank',
      logoUrl: 'https://placehold.co/200x80/f8f9fa/0066cc?text=TECHCOMBANK&font=roboto',
      websiteUrl: 'https://techcombank.com.vn',
      description: 'Ngân hàng Kỹ thương Việt Nam',
      position: 2,
      isActive: true,
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 4,
      name: 'Saigon Co.op',
      logoUrl: 'https://placehold.co/200x80/f8f9fa/00aa44?text=SAIGON+COOP&font=roboto',
      websiteUrl: 'https://saigoncoop.com.vn',
      description: 'Hệ thống siêu thị hàng đầu TP.HCM',
      position: 3,
      isActive: true,
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 5,
      name: 'Lotte Mart',
      logoUrl: 'https://placehold.co/200x80/f8f9fa/cc0000?text=LOTTE&font=roboto',
      websiteUrl: 'https://lottemart.com.vn',
      description: 'Hệ thống siêu thị Hàn Quốc tại Việt Nam',
      position: 4,
      isActive: true,
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 6,
      name: 'Big C',
      logoUrl: 'https://placehold.co/200x80/f8f9fa/0099ff?text=BIG+C&font=roboto',
      websiteUrl: 'https://bigc.vn',
      description: 'Hệ thống siêu thị lớn tại Việt Nam',
      position: 5,
      isActive: true,
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 7,
      name: 'Viettel',
      logoUrl: 'https://placehold.co/200x80/f8f9fa/ff3333?text=VIETTEL&font=roboto',
      websiteUrl: 'https://viettel.com.vn',
      description: 'Tập đoàn viễn thông quân đội',
      position: 6,
      isActive: true,
      createdAt: '',
      updatedAt: ''
    },
    {
      id: 8,
      name: 'BIDV',
      logoUrl: 'https://placehold.co/200x80/f8f9fa/004d99?text=BIDV&font=roboto',
      websiteUrl: 'https://bidv.com.vn',
      description: 'Ngân hàng Đầu tư và Phát triển Việt Nam',
      position: 7,
      isActive: true,
      createdAt: '',
      updatedAt: ''
    }
  ];

  const displayClients = clients.length > 0 ? clients : defaultClients;

  if (loading) {
    return (
      <section className="py-20 bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gray-50" id="clients">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Horizontal Layout: Title | Scrolling Items */}
          <div className="flex items-center">
            {/* Left side - Title */}
            <div className="flex-shrink-0 mr-8 lg:mr-12">
              <h2 className="text-2xl md:text-3xl font-bold text-primary font-heading leading-tight text-right">
                <div>Khách hàng</div>
                <div>tiêu biểu</div>
              </h2>
            </div>

            {/* Vertical divider */}
            <div className="w-px h-12 bg-gray-300 mr-8 lg:mr-12 flex-shrink-0"></div>

            {/* Right side - Infinite Scrolling Clients */}
            <div className="flex-1 relative overflow-hidden">
              {/* Gradient overlays for smooth fade effect */}
              <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>

              {/* Scrolling container */}
              <div className="flex animate-scroll-left">
                {/* First set of clients */}
                <div className="flex items-center space-x-8 px-4">
                  {displayClients.map((client) => (
                    <div
                      key={`first-${client.id}`}
                      className="flex-shrink-0 group"
                    >
                      <div className="w-24 h-16 flex items-center justify-center bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-3">
                        <Image
                          src={client.logoUrl}
                          alt={client.name}
                          className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://placehold.co/200x80/f8f9fa/666666?text=' + encodeURIComponent(client.name) + '&font=roboto';
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Duplicate set for seamless loop */}
                <div className="flex items-center space-x-8 px-4">
                  {displayClients.map((client) => (
                    <div
                      key={`second-${client.id}`}
                      className="flex-shrink-0 group"
                    >
                      <div className="w-24 h-16 flex items-center justify-center bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 p-3">
                        <Image
                          src={client.logoUrl}
                          alt={client.name}
                          className="max-w-full max-h-full object-contain filter grayscale hover:grayscale-0 transition-all duration-300 opacity-70 hover:opacity-100"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = 'https://placehold.co/200x80/f8f9fa/666666?text=' + encodeURIComponent(client.name) + '&font=roboto';
                          }}
                        />
                      </div>
                    </div>
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

export default FeaturedClientsSection;
