import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import productService from '@/services/productService'
import ProductDetailClient from '@/components/items/product-detail-client'


export async function generateMetadata({ params }: {params:Promise<{slug:string}>}): Promise<Metadata> {
    const {slug} = await params;
    const product = await productService.getProductBySlug(slug)

    return {
        title: product?.data?.productName || 'Không tìm thấy sản phẩm',
        description: product?.data?.productDescriptions || 'Sản phẩm chất lượng từ HA Food',
        openGraph: {
            images: product?.data?.images?.[0]?.imageUrl ? [product.data.images[0].imageUrl] : undefined,
        },
    }
}

export default async function ProductDetailPage({ params }: {params:Promise<{slug:string}>}) {
    const {slug} = await params;
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
