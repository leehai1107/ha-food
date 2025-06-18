import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thư viện ảnh | HA Food",
  description: "Khám phá thư viện ảnh đẹp của chúng tôi",
};

export default function GalleryDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 