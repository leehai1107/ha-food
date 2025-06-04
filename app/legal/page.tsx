"use client";
import { useState } from "react";
import LegalList from "@/components/section/legal-list";
import LegalInformation from "@/components/section/legal-infomation";

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
    );
}
