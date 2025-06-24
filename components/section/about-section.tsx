import Image from "next/image";

interface AboutSectionProps {
  data: {
    imageUrl: string;
    imageUrlMd: string;
    imageUrlLg: string;
  };
}

export default function AboutSection({ data }: AboutSectionProps) {
  return (
    <section className="bg-primary-white animate-float-in-bottom">
      <div className="max-w-screen-xl mx-auto">
        <div className="relative w-full h-[50vh] sm:h-auto sm:aspect-[16/9] overflow-hidden">
          <picture>
            <source media="(min-width: 1024px)" srcSet={data.imageUrlLg} />
            <source media="(min-width: 640px)" srcSet={data.imageUrlMd} />
            <Image
              src={data.imageUrl}
              alt="Giới thiệu HAFOOD VN"
              fill
              className="sm:object-contain"
              priority
            />
          </picture>
        </div>
      </div>
    </section>
  );
}
