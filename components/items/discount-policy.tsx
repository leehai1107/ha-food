"use client";
import React, { useEffect, useState } from 'react';
import { Discount } from '@/types/product';
import { getDiscounts } from '@/services/productService';

export default function DiscountPolicy() {
    const [discounts, setDiscounts] = useState<Discount[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDiscounts = async () => {
            try {
                const response = await getDiscounts();
                if (response.success) {
                    setDiscounts(response.data);
                }
            } catch (err) {
                console.error('Failed to load discounts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDiscounts();
    }, []);

    if (loading) {
        return (
            <div className="px-4">
                <h2 className="font-semibold text-5xl capitalize text-primary mb-8">Chính Sách Chiết Khấu</h2>
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded mb-4"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="px-4">
            <h2 className="font-semibold text-5xl capitalize text-primary mb-8">Chính Sách Chiết Khấu</h2>
            <table className="w-full text-center border-separate border-spacing-y-2">
                <thead>
                    <tr>
                        <th className="text-lg text-primary font-semibold border-b border-primary pb-2">Số lượng combo</th>
                        <th className="text-lg text-primary font-semibold border-b border-primary pb-2">Mức chiết khấu</th>
                    </tr>
                </thead>
                <tbody className="text-primary text-lg font-medium">
                    {discounts
                        .filter(d => d.isActive)
                        .sort((a, b) => a.minQuantity - b.minQuantity)
                        .map((discount) => (
                            <tr key={discount.id}>
                                <td className="py-2 border-b border-primary">≥ {discount.minQuantity}</td>
                                <td className="py-2 border-b border-primary">{discount.discountPercent}%</td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <h3 className="font-semibold text-xl uppercase text-primary pt-4">
                Ưu đãi đi kèm
            </h3>
            <ul className="list-disc pl-6 text-lg">
                <li>Miễn phí thiết kế logo doanh nghiệp lên hộp quà, bao gồm nhiều hình thức như in trực tiếp, in decal, ép kim, dập nổi,...</li>
                <li>Thời gian thiết kế & sản xuất linh hoạt theo yêu cầu (thông thường hoàn thành trong 3-5 ngày).</li>
                <li>Giao hàng tận nơi toàn quốc, chuyên nghiệp và đúng hẹn.</li>
                <li>Nhiều ưu đãi & đặc quyền riêng cho khách hàng thân thiết.</li>
            </ul>
            <h3 className="font-semibold text-xl uppercase text-primary pt-4">
                Miễn Phí Thiết Kế Logo Lên Hộp Quà
            </h3>
            <p className="text-lg ">
                In & Gia Công Logo Với Đa Dạng Chất Liệu:
            </p>
            <ul className="list-disc pl-6 text-lg ">
                <li>Nhanh chóng - Tiện lợi - Sang trọng.</li>
                <li>Thời gian thực hiện: 24 - 48 giờ.</li>
                <li>Các hình thức:</li>
                <ul className="list-disc pl-6">
                    <li>Decal sữa.</li>
                    <li>Logo thiếc.</li>
                </ul>
            </ul>
            <h3 className="font-semibold text-xl uppercase text-primary pt-4">
                In Logo Trực Tiếp Lên Hộp & Túi
            </h3>
            <ul className="list-disc pl-6 text-lg ">
                <li>Chuyên nghiệp - Tinh tế.</li>
                <li>Thời gian thực hiện: 2 - 3 tuần.
                    <br />
                    (Chỉ áp dụng cho đơn đặt hàng sớm)
                </li>
            </ul>
            <h3 className="font-semibold text-xl text-center uppercase text-primary pt-4">
                Vui lòng liên hệ bộ phận Dịch Vụ Khách Hàng để được hỗ trợ tốt nhất!
            </h3>
        </div>
    );
}
