import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function About() {
  return (
    <>
      <h1 className="hidden">hafood - Quà tặng doanh nghiệp</h1>
      {/* Breadcrumb */}
      <div className="bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-red-600 hover:text-red-700">
              Trang chủ
            </Link>
            <span className="text-gray-500">/</span>
            <span className="text-gray-900 font-medium">Giới thiệu</span>
          </nav>
        </div>
      </div>
      <section className="w-full px-6 py-16">
        <div className="max-w-6xl mx-auto">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <CardTitle className="text-primary">GIỚI THIỆU</CardTitle>
            </CardHeader>
            <CardContent className="text-primary-black font-medium ">
              <p className="mb-4">
                <strong>
                  Hafood – Khi Một Chiếc Bánh Trở Thành Câu Chuyện Của Văn Hóa
                </strong>
                <br />
                Có lẽ không ai còn nhớ chính xác chiếc bánh Trung thu đầu tiên
                mình ăn là khi nào. Nhưng người ta luôn nhớ cảm giác: mùi bánh
                nướng thơm bốc lên từ mâm cỗ, tiếng cười của trẻ con rước đèn,
                và khoảnh khắc cả gia đình ngồi quây quần bên nhau dưới ánh
                trăng.
              </p>
              <p className="mb-4">
                Tại Hafood, chúng tôi bắt đầu từ chính ký ức đó - không phải để
                lặp lại, mà để làm mới nó. Không chỉ làm ra những chiếc bánh,
                Hafood còn kể lại câu chuyện của một nền văn hóa lâu đời bằng
                ngôn ngữ ẩm thực. Bằng cách tôn vinh truyền thống trong hình hài
                hiện đại, Hafood biến chiếc bánh Trung thu thành một sứ giả -
                vừa gần gũi, vừa mới mẻ.
              </p>
              <p className="mb-4">
                <strong>
                  🎨 Tạo Ra Một &quot;Ngôn Ngữ Mới&quot; Cho Bánh Trung Thu
                </strong>
                <br />
                Chúng tôi tin rằng chiếc bánh Trung thu không nên chỉ đứng yên
                trong ký ức. Nó cần được sống trong hiện tại - nơi người trẻ cần
                món ăn lành mạnh, nơi quà tặng cần sự thẩm mỹ, nơi văn hóa cần
                được kể lại theo một cách tinh tế hơn.
              </p>
              <p className="mb-4">Vì vậy, Hafood không ngại đổi mới:</p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Công thức truyền thống vẫn được giữ gìn - nhưng đường giảm,
                  nhân nhẹ, nguyên liệu organic.
                </li>
                <li>
                  Cấu trúc bánh được nâng cấp - mềm nhưng chắc, tơi nhưng mịn,
                  ngọt thanh nhưng tròn vị.
                </li>
                <li>
                  Thiết kế hộp quà như một tác phẩm nghệ thuật: sử dụng ngôn ngữ
                  thiết kế tối giản Á Đông kết hợp chi tiết ánh kim, hiệu ứng 3D
                  hiện đại, giúp mỗi hộp quà trở thành món quà tinh thần thực
                  sự.
                </li>
              </ul>
              <p className="mb-4">
                <strong>
                  🔬 Không Phải Bánh - Là Quy Trình Kỹ Lưỡng Đến Từng Milimet
                </strong>
                <br />
                Hafood xây dựng một hệ thống sản xuất theo chuẩn quốc tế, với
                máy móc từ Nhật Bản và Đức, nhưng vẫn dành chỗ cho bàn tay thủ
                công trong các công đoạn cuối - nơi kỹ thuật, cảm xúc và sự chỉn
                chu được hòa quyện.
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>
                  Vỏ bánh được làm từ bột nguyên cám hoặc bột mì giàu dinh
                  dưỡng, giữ được độ mềm mịn nhưng không ngấy.
                </li>
                <li>
                  Nhân bánh tươi mỗi ngày: sen Đồng Tháp, trứng muối muối tay,
                  hạt óc chó, yến sào, vi cá - tất cả được kiểm tra nguyên liệu
                  đầu vào nghiêm ngặt.
                </li>
                <li>
                  Kiểm soát chất lượng đa tầng với các chứng nhận HACCP, ISO, và
                  VSATTP do Bộ Y tế kiểm định.
                </li>
                <li>
                  Không có chỗ cho sự cẩu thả. Bởi mỗi chiếc bánh ra đời không
                  chỉ là một sản phẩm, mà là một lời cam kết.
                </li>
              </ul>
              <p className="mb-4">
                <strong>
                  🌍 Một Chiếc Bánh - Một Hành Trình Đưa Văn Hóa Việt Ra Thế
                  Giới
                </strong>
                <br />
                Năm 2024, Hafood chính thức xuất hiện trên các chuyến bay quốc
                tế của Vietnam Airlines và Vietjet Air, mang theo hàng ngàn hộp
                bánh trung thu đến tay hành khách từ khắp năm châu. Đó không chỉ
                là một hoạt động quảng bá - mà là một cách chúng tôi mang hình
                ảnh văn hóa Việt ra thế giới một cách trang trọng và đúng nghĩa.
              </p>
              <p className="mb-4">
                <strong>
                  ❤️ Hafood Không Chỉ Là Bánh, Hafood Là Một Thái Độ Làm Nghề
                </strong>
                <br />
                Với Hafood, bánh Trung thu không phải là một sản phẩm theo mùa.
                Đó là một thái độ sống - làm gì cũng phải chỉn chu, tôn trọng
                khách hàng như tôn trọng chính di sản của mình. Chúng tôi không
                tạo ra những chiếc bánh đại trà - mà tạo ra những trải nghiệm
                đáng nhớ.
              </p>
              <p className="mb-4">
                Vì một chiếc bánh ngon không phải chỉ để ăn.
                <br />
                Mà để gợi nhớ, để gắn kết, để khiến người ta muốn gửi tặng.
              </p>
              <p className="mb-4">
                <strong>
                  🌕 Hafood - Gửi Trọn Tinh Hoa Việt Trong Từng Mùa Trăng
                </strong>
                <br />
                Từ một xưởng bánh nhỏ ở miền Nam, Hafood đã trở thành biểu tượng
                của sự kết hợp giữa truyền thống và hiện đại trong ngành bánh
                Trung thu Việt. Chúng tôi không chỉ bán bánh - mà bán một không
                gian văn hóa, một trải nghiệm thưởng thức, một câu chuyện để kể
                lại.
              </p>
              <p>
                Mỗi mùa trăng, Hafood lại viết tiếp một chương mới - không chỉ
                trong lòng người Việt, mà trong hành trình mang hồn Việt đến thế
                giới.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
