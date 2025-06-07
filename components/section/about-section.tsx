import { CirclePercent, Gem, Gift, ShieldCheck, Users } from "lucide-react";
import FeatureCard from "../items/feature-card";

export default function AboutSection() {
  return (
    <section className="py-12  bg-primary-white animate-float-in-bottom">
      <div className="max-w-screen-xl mx-auto grid md:grid-cols-3 gap-10">
        <FeatureCard
          icon={<Gift size={48} />}
          title="Hương vị đa dạng"
          description="Nhân Bánh đa dạng, phong phú: Từ truyền thống đến hiện đại, đáp ứng mọi nhu cầu của quý khách hàng."
        />
        <FeatureCard
          icon={<ShieldCheck size={48} />}
          title="Chất lượng vượt trội"
          description="Tiêu chuẩn ISO, HACCP: Đảm bảo an toàn vệ sinh thực phẩm và sức khỏe của khách hàng."
        />
        <FeatureCard
          icon={<CirclePercent size={48} />}
          title="Giá cả cạnh tranh"
          description="Chiết khấu lên đến 30% là giải pháp quà tặng chất lượng và tối ưu chi phí cho quý doanh nghiệp."
        />
        <FeatureCard
          icon={<Users size={48} />}
          title="Dịch vụ chuyên nghiệp"
          description="Tư vấn nhiệt tình, giao hàng toàn quốc: Hỗ trợ từ lựa chọn sản phẩm đến giao hàng. Chính sách đổi trả linh hoạt, đảm bảo sự hài lòng tuyệt đối."
        />
        <FeatureCard
          icon={<Gem size={48} />}
          title="Thiết kế sang trọng và tuỳ chỉnh linh hoạt"
          description="Logo nhận diện thương hiệu: Tùy chỉnh hợp quà và in ấn theo màu nhận diện, nâng cao thương hiệu. Thiết kế độc quyền: Hộp bánh trung thu được thiết kế bởi những họa sĩ chuyên nghiệp tài năng."
        />
      </div>
      <div className="bg-primary text-center py-6 mt-10 text-secondary font-semibold uppercase">
        <p>Hãy chọn HAFOOD VN để mang đến những hộp quà Trung thu <br />
          tuyệt vời và ý nghĩa, khẳng định đẳng cấp và uy tín của bạn</p>

      </div>
    </section>
  );
}
