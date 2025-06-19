import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dự án | HA Food",
  description: "Khám phá Dự án đẹp của chúng tôi",
};

export default function GalleryDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
