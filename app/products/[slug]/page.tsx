import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import productService from '@/services/productService'
import ProductDetailClient from '@/components/items/product-detail-client'

interface ProductDetailPageProps {
    params: { slug: string }
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
    const slug = await params.slug
    const product = await productService.getProductBySlug(slug)

    return {
        title: product?.data?.productName || 'Không tìm thấy sản phẩm',
        description: product?.data?.productDescriptions || 'Sản phẩm chất lượng từ HA Food',
        openGraph: {
            images: product?.data?.images?.[0]?.imageUrl ? [product.data.images[0].imageUrl] : undefined,
        },
    }
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
    const slug = await params.slug
    const response = await productService.getProductBySlug(slug)

    if (!response?.success || !response.data) {
        notFound()
    }

    const product = response.data

    return (
        <>
            <ProductDetailClient product={product} />
        </>
    )
}
