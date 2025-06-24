import { HeroSlide, CollectionContent, Testimonial } from "@/types";

export interface HomepageData {
  hero: {
    slides: HeroSlide[];
  };
  collection: CollectionContent;
  about: {
    imageUrl: string;
    imageUrlMd: string;
    imageUrlLg: string;
  };
  features: {
    clients: Array<{
      id: number;
      name: string;
      logoUrl: string;
      websiteUrl: string;
      description: string;
      position: number;
      isActive: boolean;
    }>;
  };
  testimonials: {
    items: Testimonial[];
  };
}

export async function getHomepageData(): Promise<HomepageData> {
  try {
    // For server-side rendering, we need to use the full URL
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const response = await fetch(`${baseUrl}/api/admin/homepage`, {
      cache: "no-store", // Disable caching for dynamic content
    });

    if (response.ok) {
      const result = await response.json();
      return result.data;
    }
  } catch (error) {
    console.error("Failed to load homepage data:", error);
  }

  // Return default data if API fails
  return {
    hero: {
      slides: [
        {
          id: 1,
          title: "Thiên Cầu Vượng Khí",
          subtitle:
            "Thiên Cầu Vượng Khí là biểu tượng của sự may mắn và vượng khí...",
          ctaText: "Xem Thêm",
          ctaLink: "/products",
          imageUrl: "/uploads/shared/images/banners/banner_1.webp",
          type: "image",
          position: 0,
        },
      ],
    },
    collection: {
      id: 1,
      mediaType: "image",
      mediaUrl: "/uploads/shared/images/banners/banner_tong_hop.webp",
      content: `## [color=#B0041A]BỘ SƯU TẬP TRUNG THU 2025[/color]:
### _[color=#FFC300]THIÊN HƯƠNG NGUYỆT DẠ[/color]_

Kính chào Quý doanh nghiệp và quý khách hàng,

Mùa trung thu 2025 đang đến gần, mang theo ánh trăng rằm sáng ngời và không khí đoàn viên ấm áp. Đây là thời điểm tuyệt vời để chúng ta cùng nhau tôn vinh những giá trị truyền thống, đồng thời khẳng định sự phát triển và thành công của đất nước.

Với tinh thần đó, chúng tôi hân hạnh giới thiệu bộ sưu tập
### [color=#B0041A]"THIÊN HƯƠNG NGUYỆT DẠ":[/color]

- [Khổng Tước Hướng Nguyệt](https://hafood.vn/)
- [Thiên Cầu Vượng Khí](https://hafood.vn/)
- [Ngọc Quý Tam Phương](https://hafood.vn/)
- [Nguyệt Quang Tam Miền](https://hafood.vn/)
- [Tam Ngư Cát Hạnh](https://hafood.vn/)
- [Hoàng Kim Phồn Thịnh](https://hafood.vn/)

Chúng tôi tin rằng, với bộ sưu tập bánh trung thu **[color=#B0041A]THIÊN HƯƠNG NGUYỆT DẠ[/color]**, quý khách hàng sẽ có những giây phút thưởng thức trọn vẹn và ý nghĩa bên gia đình và người thân yêu.`,
    },
    about: {
      imageUrl: "/uploads/shared/images/about/sm.webp",
      imageUrlMd: "/uploads/shared/images/about/md.webp",
      imageUrlLg: "/uploads/shared/images/about/lg.webp",
    },
    features: {
      clients: [
        {
          id: 1,
          name: "Bách Mỹ Group",
          logoUrl: "/uploads/shared/images/featureclients/BackMyLogo.webp",
          websiteUrl: "https://bachmygroup.vn",
          description: "Tập đoàn đa ngành hàng đầu Việt Nam",
          position: 0,
          isActive: true,
        },
        {
          id: 2,
          name: "DAVICOM",
          logoUrl: "/uploads/shared/images/featureclients/davicom.webp",
          websiteUrl: "https://davicom.com.vn",
          description: "CÔNG TY CP TRUYỀN THÔNG VÀ CÔNG NGHỆ ĐẠI VIỆT",
          position: 1,
          isActive: true,
        },
      ],
    },
    testimonials: {
      items: [
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
      ],
    },
  };
}
