import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dự án - Ha Food",
  description:
    "Khám phá bộ sưu tập ảnh đẹp của Ha Food, nơi lưu giữ những khoảnh khắc đáng nhớ và hình ảnh chất lượng cao",
  keywords: "Dự án, bộ sưu tập, hình ảnh, ha food, gallery",
  openGraph: {
    title: "Dự án - Ha Food",
    description: "Khám phá bộ sưu tập ảnh đẹp của Ha Food",
    type: "website",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
