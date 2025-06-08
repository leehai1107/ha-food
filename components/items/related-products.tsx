'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatCurrency } from '@/utils/formatCurrency'
import { Product } from '@/types'

interface Props {
    products: Product[]
}

export default function RelatedProducts({ products }: Props) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
                <Link key={product.productSku} href={`/products/${product.slug}`} className="group">
                    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition overflow-hidden">
                        <Image
                            src={product.images?.[0]?.imageUrl || '/placeholder.png'}
                            alt={product.productName}
                            width={400}
                            height={300}
                            className="w-full h-48 object-cover"
                        />
                        <div className="p-3">
                            <h3 className="text-sm font-medium group-hover:underline line-clamp-2">
                                {product.productName}
                            </h3>
                            <p className="text-red-500 font-semibold text-sm mt-1">
                                {formatCurrency(Number(product.currentPrice))}
                            </p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    )
}
