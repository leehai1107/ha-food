import Image from "next/image";

export default function CollectionSection() {
  return (
    <section className="px-4 pt-5 bg-primary-white animate-float-in-bottom">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-5">
        {/* Left Image */}
        <div className="md:w-1/2 w-full relative aspect-video">
          <Image
            src="/image/banners/banner_tong_hop.png"
            alt="Bộ sưu tập Thiên Hương Nguyệt Dạ"
            fill
            priority
            className="object-cover rounded-lg shadow-md"
          />
        </div>

        {/* Right Text Content */}
        <div className="md:w-1/2 w-full space-y-4 pt-6 text-primary-black">
          <h2 className="text-2xl md:text-3xl font-bold text-primary">
            BỘ SƯU TẬP TRUNG THU 2025:
          </h2>
          <h3 className="text-2xl md:text-4xl font-semibold text-dark-yellow italic">
            THIÊN HƯƠNG NGUYỆT DẠ
          </h3>
          <p className="text-xl">
            Kính chào Quý doanh nghiệp và quý khách hàng,
            <br />
            Mùa trung thu 2025 đang đến gần, mang theo ánh trăng rằm sáng ngời
            và không khí đoàn viên ấm áp. Đây là thời điểm tuyệt vời để chúng ta
            cùng nhau tôn vinh những giá trị truyền thống, đồng thời khẳng định
            sự phát triển và thành công của đất nước. Với tinh thần đó, chúng
            tôi hân hạnh giới thiệu bộ sưu tập
            <br />
            <strong className="text-primary">
              " THIÊN HƯƠNG NGUYỆT DẠ "
            </strong>{" "}
            gồm có:
          </p>
          <ul className="list-disc pl-5 text-primary font-semibold">
            <li>Khổng Tước Hương Nguyệt</li>
            <li>Thiên Cầu Vượng Khí</li>
            <li>Ngọc Quý Tam Phương</li>
            <li>Nguyệt Quang Tam Miền</li>
            <li>Tam Ngư Cát Hạnh</li>
            <li>Hoàng Kim Phồn Thịnh</li>
          </ul>
          <p className="text-xl">
            Chúng tôi tin rằng, với bộ sưu tập bánh trung thu{" "}
            <strong className="text-primary">THIÊN HƯƠNG NGUYỆT DẠ</strong>, quý
            khách hàng sẽ có những giây phút thưởng thức trọn vẹn và ý nghĩa bên
            gia đình và người thân yêu.
          </p>
        </div>
      </div>
    </section>
  );
}
