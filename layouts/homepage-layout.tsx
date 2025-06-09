import RootFooter from "@/components/common/root-footer";
import RootHeader from "@/components/common/root-header";

export default function HomepageLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <RootHeader />
            <main>{children}</main>
            <RootFooter />
        </>
    )
}