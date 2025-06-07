import { ReactNode } from "react";

interface FeatureCardProps {
    icon: ReactNode;
    title: string;
    description: string;
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
    return (
        <div className="flex items-start gap-4 max-w-full">
            <div className="text-primary text-3xl">{icon}</div>
            <div>
                <h3 className="text-primary font-semibold uppercase text-sm">{title}</h3>
                <p className="text-primary-black text-sm">{description}</p>
            </div>
        </div>
    );
}
