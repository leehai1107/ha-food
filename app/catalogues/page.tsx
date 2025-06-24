"use client";
import { useEffect, useState } from "react";
import { fetchCatalogues } from "../../services/api";
import type { Catalogue } from "../../types";
import Link from "next/link";
import Image from "next/image";

export default function CataloguesPage() {
  const [catalogues, setCatalogues] = useState<Catalogue[]>([]);

  useEffect(() => {
    fetchCatalogues().then(setCatalogues);
  }, []);

  return (
    <>
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-red-600 hover:text-red-700">
              Trang chủ
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-900 font-medium">Catalogue</span>
          </nav>
        </div>
      </div>
      <div className="bg-primary text-white py-20">
        <div className="container-limited">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 font-heading">
              Catalogue
            </h1>
          </div>
        </div>
      </div>
      <div className="max-w-3xl mx-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {catalogues.map((cat) => (
            <Link
              key={cat.id}
              href={`/catalogues/${cat.id}`}
              className="group flex flex-col md:block border rounded-lg overflow-hidden transition duration-300 hover:shadow-lg hover:scale-[1.02]"
            >
              {/* Image section */}
              <div className="w-full h-48 md:h-64 relative flex-shrink-0">
                <Image
                  src={cat.coverImage}
                  alt={cat.name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Text section */}
              <div className="p-4 flex flex-col justify-center">
                <h2 className="text-lg font-semibold mb-1 text-primary text-center group-hover:text-secondary transition">
                  {cat.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
