import FooterInfo from "../section/footer-info";
import FooterAbout from "../section/footer-about";
import SupportSection from "../section/support-section";
import LegalSection from "../section/legal-section";
import Image from "next/image";

export default function RootFooter() {
    return (
        <>
            <footer className="relative w-full lg:pt-10 pb-20 lg:pb-10 px-5 text-primary-white">
                {/* Background Image with Overlay */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-primary/90" /> {/* Dark overlay */}
                    <Image
                        src="/image/banners/footer-bg.jpg"
                        alt="Footer Background"
                        fill
                        priority
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-[1200px] mx-auto flex flex-col sm:flex-row md:flex-row lg:flex-row justify-center gap-6">
                    {/* Info section */}
                    <FooterInfo />
                    {/* About section */}
                    <FooterAbout />
                    {/* Support section */}
                    <SupportSection />
                    {/* Legal section */}
                    <LegalSection />
                </div>
            </footer>
        </>
    )
}
