import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/custom/icon";

export default function About() {
  return (
    <section className="w-full px-6 py-16">
      <div className="max-w-6xl mx-auto">
        <Card>
          <CardHeader className="flex items-center justify-between">
            <CardTitle className="text-primary">GIỚI THIỆU</CardTitle>
          </CardHeader>
          <CardContent className="text-primary-black font-medium ">
            <p className="text-muted-foreground mb-4">
              Thói quen biểu tặng quà là một văn hóa rất ý nghĩa và đáng trân trọng không chỉ ở Việt Nam mà còn phổ biến trên toàn thế giới. Đây là một cách tri ân cũng như một hình thức giúp gắn kết và phát triển các mối quan hệ mà các doanh nghiệp đang áp dụng rất hiệu quả. Hafood.vn là một trong những nhà tiên phong áp dụng hộp quà Tết thay thế cho giỏ quà Tết nhằm tăng tính tiện dụng và sang trọng hơn.
            </p>
            <p className="text-muted-foreground mb-4">
              Trải qua nhiều năm hình thành và phát triển, Hafood.vn sở hữu đầy đủ cơ sở hạ tầng, các thiết bị tân tiến, đội ngũ vận hành chuyên nghiệp và hệ thống phân phối trải dài từ các quận trung tâm TP.HCM đến khắp toàn quốc.            </p>
            <p className="text-muted-foreground mb-4">
              Với kinh nghiệm đã phục vụ hơn 10.000 khách hàng từ các doanh nghiệp lớn đến những cá nhân có yêu cầu khắt khe nhất, chúng tôi luôn tự tin và sẵn sàng đáp ứng được mọi nhu cầu của khách hàng.</p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
