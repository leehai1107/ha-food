import FooterInfo from "../section/footer-info";
import FooterAbout from "../section/footer-about";
import SupportSection from "../section/support-section";
import LegalSection from "../section/legal-section";

export default function RootFooter() {
    return (
        <>
            <footer className="w-full py-10 px-5 bg-primary flex flex-col sm:flex-row md:flex-row lg:flex-row justify-center gap-6 text-primary-white">
                {/* Info section */}
                <FooterInfo />
                {/* About section */}
                <FooterAbout />
                {/* Support section */}
                <SupportSection />
                {/* Legal section */}
                <LegalSection />
            </footer>
        </>
    )
}
