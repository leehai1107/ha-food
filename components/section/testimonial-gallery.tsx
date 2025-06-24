"use client";
import { Testimonial } from "@/types";
import Image from "next/image";
import { useRef } from "react";

// Move defaultTestimonials outside the component
const defaultTestimonials: Testimonial[] = [
  {
    id: 1,
    name: "Chị Nhung",
    location: "Trưởng phòng thu mua công ty Fuji VietNam",
    type: "",
    content:
      "Hộp quà được đóng gói cẩn thận, đảm bảo an toàn trong quá trình vận chuyển. Chúng tôi đã tặng hộp quà này cho đối tác và nhân viên trong công ty dịp trung thu năm ngoái. Năm nay lại tiếp tục đặt bên Hafood vì siêu chất lượng nhé!",
    avatarUrl: "/uploads/shared/images/customers/1.webp",
    rating: 5,
    position: 0,
    isActive: true,
  },
  {
    id: 2,
    name: "Chị Hà",
    location: "Giám Đốc Chuỗi Spa Thảo Ngọc",
    type: "",
    content:
      "Thiết kế hộp quà rất đẹp mắt và tinh tế, phù hợp với nhiều đối tượng khách hàng. Vị bánh phong phú và cũng có nhiều vị rất mới lạ, nhưng ngon lắm nha. Cảm ơn Hafood đã cùng tạo nên một mùa Trung Thu tuyệt vời.",
    avatarUrl: "/uploads/shared/images/customers/2.webp",
    rating: 5,
    position: 1,
    isActive: true,
  },
  {
    id: 3,
    name: "Chị Vân",
    location: "Giám đốc doanh nghiệp",
    type: "",
    content:
      "Chúng tôi rất thích sự chăm chút tỉ mỉ trong từng chi tiết của hộp quà. Nhận bánh về mọi người trong công ty đều khen bánh sang  quá, đáng tiền cực kì. Luôn ủng hộ Hafood.",
    avatarUrl: "/uploads/shared/images/customers/3.webp",
    rating: 5,
    position: 2,
    isActive: true,
  },
  {
    id: 4,
    name: "Chị Minh Anh",
    location: "HR công ty thực phẩm",
    type: "",
    content:
      "Hộp quà Trung thu của Hafood thật sự sang trọng và tinh tế, phù hợp làm quà tặng doanh nghiệp trong các dịp lễ, tết. Đợt trước có đặt quà tết cho công ty tại đây rồi, giờ thấy quảng cáo mẫu mới cho Trung thu phải tham khảo liền. Rất ưng ý.",
    avatarUrl: "/uploads/shared/images/customers/4.webp",
    rating: 5,
    position: 3,
    isActive: true,
  },
  {
    id: 5,
    name: "Chị Thu Hà",
    location: "Giám đốc doanh nghiệp",
    type: "",
    content:
      "Khách hàng của chúng tôi đều rất ấn tượng với hộp quà này. Tôi đã mua một số lượng để vừa trao quà dịp lễ cho nhân viên, vừa cho đối tác và khách hàng thân thiết. Vừa được ưu đãi tốt vừa chất lượng.",
    avatarUrl: "/uploads/shared/images/customers/5.webp",
    rating: 5,
    position: 4,
    isActive: true,
  },
  {
    id: 6,
    name: "Chị Lan Chi",
    location: "HR Công ty công nghệ",
    type: "",
    content:
      "Rất hài lòng với chất lượng hộp quà, nguyên liệu tươi ngon và an toàn. Trước khi đặt số lượng lớn cho công ty thì tôi đã đặt thử bánh lẻ, ăn vị khá ngon, không bị ngọt gắt như các dòng truyền thống. Mẫu mã đa dạng, phù hợp nhiều đối tượng. Rất recommend.",
    avatarUrl: "/uploads/shared/images/customers/6.webp",
    rating: 5,
    position: 5,
    isActive: true,
  },
];

const TestimonialsGallery = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    const container = scrollRef.current;
    if (container) {
      const scrollAmount = 650;
      container.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="py-10 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4 font-heading">
            Khách Hàng Nói Gì Về Chúng Tôi
          </h2>
        </div>

        {/* Scroll Arrows */}
        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="absolute left-2 sm:left-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 sm:p-3 shadow-md hover:shadow-lg transition-all text-primary"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white rounded-full p-2 shadow-md hover:shadow-lg transition-all text-primary"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>

          {/* Scrollable Testimonials */}
          <div
            ref={scrollRef}
            className="flex space-x-4 sm:space-x-6 overflow-x-auto scrollbar-hide px-2 py-4 scroll-smooth"
          >
            {defaultTestimonials.map((testimonial) => (
              <div
                key={testimonial.id}
                className="flex-none w-72 sm:w-1/2 md:w-1/3 bg-primary-white rounded-3xl p-6 shadow-md hover:shadow-xl transition duration-300"
                style={{ minHeight: "288px" }}
              >
                {/* Header */}
                <div className="flex items-start mb-4">
                  <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-gray-200 mr-4">
                    <Image
                      src={testimonial.avatarUrl || "/image/noimage.webp"}
                      alt={testimonial.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900">
                      {testimonial.name}
                    </h4>
                    <p className="text-md text-gray-500">
                      {testimonial.location}
                    </p>
                    <div className="flex mt-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < testimonial.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quote */}
                <div className="relative">
                  <div className="text-4xl text-secondary opacity-20 absolute top-0 left-0 font-serif">
                    &quot;
                  </div>
                  <p className="text-lg text-primary-black mt-4 font-primary">
                    {testimonial.content}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsGallery;
