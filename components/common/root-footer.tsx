import FooterInfo from "../section/footer-info";
import FooterAbout from "../section/footer-about";
import SupportSection from "../section/support-section";
import LegalSection from "../section/legal-section";

export default function RootFooter() {
    return (
        <>{/* Footer */}
            <footer className="w-full px-24 py-10 bg-primary flex flex-row justify-evenly text-primary-white md:flex-row">
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
