'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import productService from '@/services/productService'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/CartContext'
import Breadcrumbs from '../custom/breadcums'
import { formatCurrency } from '@/utils/formatCurrency'
import QuantityInput from './quantity-input'
import RelatedProducts from './related-products'
import { Product } from '@/types'


export default function ProductDetailClient({ product }: { product: Product }) {
    const [quantity, setQuantity] = useState(1)
    const [related, setRelated] = useState<Product[]>([])
    const { addToCart } = useCart()

    useEffect(() => {
        productService.getProductsByType(product.productType).then(res => {
            if (res.success) {
                const filtered = res.data.products.filter(p => p.productSku !== product.productSku).slice(0, 4)
                setRelated(filtered)
            }
        })
    }, [product.productSku, product.productType])

    const handleAddToCart = () => {
        addToCart(product, quantity)
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <Breadcrumbs
                items={[
                    { label: 'Trang chủ', href: '/' },
                    { label: product.category?.name || 'Danh mục', href: `/categories/${product.category?.id}` },
                    { label: product.productName },
                ]}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                <Image
                    src={product.images?.[0]?.imageUrl || '/placeholder.png'}
                    alt={product.productName}
                    width={600}
                    height={600}
                    className="rounded-xl object-cover"
                />

                <div>
                    <h1 className="text-3xl font-bold mb-2">{product.productName}</h1>
                    <p className="text-muted-foreground mb-4">{product.productDescriptions}</p>

                    <p className="text-2xl font-semibold text-red-500 mb-2">
                        {formatCurrency(Number(product.currentPrice))}
                    </p>

                    <p className="text-sm text-muted-foreground mb-4">Kho: {product.quantity}</p>

                    <QuantityInput value={quantity} setValue={setQuantity} max={product.quantity} />

                    <Button className="mt-4" onClick={handleAddToCart} disabled={product.quantity === 0}>
                        Thêm vào giỏ hàng
                    </Button>
                </div>
            </div>

            {related.length > 0 && (
                <div className="mt-12">
                    <h2 className="text-xl font-semibold mb-4">Sản phẩm liên quan</h2>
                    <RelatedProducts products={related} />
                </div>
            )}
        </div>
    )
}
