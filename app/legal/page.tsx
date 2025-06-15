"use client";
import { useState } from "react";
import LegalList from "@/components/section/legal-list";
import LegalInformation from "@/components/section/legal-infomation";
import Link from "next/link";

const LEGAL_ITEMS = [
    "Chính sách bảo mật",
    "Chính sách thanh toán",
    "Chính sách vận chuyển",
    "Chính sách đổi trả",
    "Chính sách chiết khấu",
];

export default function LegalPage() {
    const [selected, setSelected] = useState<string>(LEGAL_ITEMS[0]);

    return (
        <>
            <h1 className="hidden">hafood - Quà tặng doanh nghiệp</h1>
            {/* Breadcrumb */}
            <div className="bg-gray-50 py-4">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link href="/" className="text-red-600 hover:text-red-700">Trang chủ</Link>
                        <span className="text-gray-500">/</span>
                        <span className="text-gray-900 font-medium">Chính sách</span>
                    </nav>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-center w-full h-full py-6 px-4 md:px-10 lg:px-20 gap-4">
                {/* List of legal */}
                <div className="w-full md:w-1/3 shadow-lg rounded-lg bg-primary-white p-4">
                    <LegalList
                        items={LEGAL_ITEMS}
                        selected={selected}
                        onSelect={setSelected}
                    />
                </div>

                {/* Legal information with animation */}
                <div className="w-full md:w-2/3 shadow-lg rounded-lg bg-primary-white p-4">
                    <div key={selected} className="animate-float-in-top mt-5">
                        <LegalInformation selected={selected} />
                    </div>
                </div>
            </div>
        </>
    );
}
