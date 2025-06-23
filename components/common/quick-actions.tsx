"use client";

import React, { useState, useEffect } from 'react';
import { ArrowUp, Phone, MessageCircle, MapPin } from 'lucide-react';
import Zalo from "../../public/uploads/shared/logos/zalo-white.svg";
import Image from 'next/image';


export default function QuickActions() {
    const [isVisible, setIsVisible] = useState(false);

    // Show button when page is scrolled down
    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    // Smooth scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => {
            window.removeEventListener('scroll', toggleVisibility);
        };
    }, []);

    // Placeholder functions for social media links.
    // REMEMBER TO REPLACE THESE WITH YOUR ACTUAL LINKS/IDS.
    const openZalo = () => {
        window.open('https://zalo.me/0972819379', '_blank');
    };

    const openFacebook = () => {
        window.open('https://www.facebook.com/hopquatet.hafood', '_blank');
    };

    const openLocation = () => {
        window.open('https://www.google.com/maps/place/HAFOOD+-+H%E1%BB%98P+QU%C3%80+T%E1%BA%B6NG+CAO+C%E1%BA%A4P+2025/@10.863216,106.672336,17z/data=!4m15!1m8!3m7!1s0x317529c501fd54a9:0xbc25368885a9579!2zSEFGT09EIC0gSOG7mFAgUVXDgCBU4bq2TkcgQ0FPIEPhuqRQIDIwMjU!8m2!3d10.863216!4d106.6749109!10e1!16s%2Fg%2F11y3t4cy8q!3m5!1s0x317529c501fd54a9:0xbc25368885a9579!8m2!3d10.863216!4d106.6749109!16s%2Fg%2F11y3t4cy8q?entry=ttu&g_ep=EgoyMDI1MDYxMS4wIKXMDSoASAFQAw%3D%3D', '_blank');
    };

    const openCall = () => {
        window.open('tel:0972819379', '_self'); // Replace with your phone number
    }

    return (
        <>
            {/* Desktop Quick Actions (vertical stack at bottom-right) */}
            <div className="hidden md:flex flex-col items-center space-y-3 fixed bottom-4 right-4 z-50">
                {isVisible && (
                    <button
                        onClick={scrollToTop}
                        className="bg-primary text-primary-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                        aria-label="Scroll to top"
                    >
                        <ArrowUp size={24} />
                    </button>
                )}
                <button
                    onClick={openCall}
                    className="bg-primary text-primary-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Call now"
                >
                    <Phone size={24} />
                </button>
                <button
                    onClick={openZalo}
                    className="bg-primary text-primary-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Chat on Zalo"
                >
                    <Image src={Zalo} alt="Zalo" width={24} height={24} />
                </button>
                <button
                    onClick={openFacebook}
                    className="bg-primary text-primary-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Open Facebook"
                >
                    <MessageCircle size={24} />
                </button>
                <button
                    onClick={openLocation}
                    className="bg-primary text-primary-white p-3 rounded-full shadow-lg transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Get directions"
                >
                    <MapPin size={24} />
                </button>
            </div>

            {/* Mobile Quick Actions Bar (fixed at bottom, horizontal) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-dark-red text-primary-white shadow-lg md:hidden">
                <div className="flex justify-around items-center h-16">
                    <button
                        onClick={openCall}
                        className="flex flex-col items-center text-xs font-medium space-y-1 p-2"
                    >
                        <Phone size={20} />
                        <span>Gọi ngay</span>
                    </button>
                    <button
                        onClick={openZalo}
                        className="flex flex-col items-center text-xs font-medium space-y-1 p-2"
                    >
                        <Image src={Zalo} alt="Zalo" width={20} height={20} unoptimized />
                        <span>Nhắn tin</span>
                    </button>
                    <button
                        onClick={openFacebook}
                        className="flex flex-col items-center text-xs font-medium space-y-1 p-2"
                    >
                        <MessageCircle size={20} />
                        <span>Facebook</span>
                    </button>
                    <button
                        onClick={openLocation}
                        className="flex flex-col items-center text-xs font-medium space-y-1 p-2"
                    >
                        <MapPin size={20} />
                        <span>Chỉ đường</span>
                    </button>
                </div>
            </div>

            {/* Mobile Scroll to Top Button (separate, at top-right for mobile) */}
            {isVisible && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-20 right-1 z-50 bg-dark-red text-primary-white p-3 rounded-full shadow-lg md:hidden transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={24} />
                </button>
            )}
        </>
    );
}
