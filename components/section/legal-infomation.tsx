import React, { useEffect, useState } from "react";
import ReturnPolicy from "../items/return-policy";
import PrivacyPolicy from "../items/privacy-policy";
import DiscountPolicy from "../items/discount-policy";
import ShippingPolicy from "../items/shipping-policy";
import PaymentPolicy from "../items/payment-policy";

interface LegalInformationProps {
    selected: string;
}

const INFO_MAP: Record<string, React.ReactNode> = {
    "Chính sách bảo mật": <PrivacyPolicy />,
    "Chính sách thanh toán": <PaymentPolicy />,
    "Chính sách vận chuyển": <ShippingPolicy />,
    "Chính sách đổi trả": <ReturnPolicy />,
    "Chính sách chiết khấu": <DiscountPolicy />,
};

export default function LegalInformation({ selected }: LegalInformationProps) {

    return (
        <div style={{ marginTop: 20 }}>
            {INFO_MAP[selected]}
        </div>
    );
}