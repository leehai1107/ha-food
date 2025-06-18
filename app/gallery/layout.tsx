import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Thư viện ảnh - Ha Food',
  description: 'Khám phá bộ sưu tập ảnh đẹp của Ha Food, nơi lưu giữ những khoảnh khắc đáng nhớ và hình ảnh chất lượng cao',
  keywords: 'thư viện ảnh, bộ sưu tập, hình ảnh, ha food, gallery',
  openGraph: {
    title: 'Thư viện ảnh - Ha Food',
    description: 'Khám phá bộ sưu tập ảnh đẹp của Ha Food',
    type: 'website',
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 