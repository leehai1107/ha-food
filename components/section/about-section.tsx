import Image from "next/image";

export default function AboutSection() {
  return (
    <section className="bg-primary-white animate-float-in-bottom">
      <div className="max-w-screen-xl mx-auto">
        <div className = "relative w-full h-[50vh] sm:h-auto sm:aspect-[16/9] overflow-hidden">
          <picture>
            <source
              media="(min-width: 1024px)"
              srcSet="/uploads/shared/images/about/lg.webp"
            />
            <source
              media="(min-width: 640px)"
              srcSet="/uploads/shared/images/about/md.webp"
            />
            <Image
              src="/uploads/shared/images/about/sm.webp"
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
