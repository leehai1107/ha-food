import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

const HOMEPAGE_DATA_FILE = path.join(process.cwd(), "data", "homepage.json");

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(HOMEPAGE_DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Load homepage data from JSON file
async function loadHomepageData() {
  try {
    await ensureDataDirectory();
    const data = await fs.readFile(HOMEPAGE_DATA_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    // Return default data if file doesn't exist
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
        content:
          "## BỘ SƯU TẬP TRUNG THU 2025\n### THIÊN HƯƠNG NGUYỆT DẠ\n\nKính chào Quý doanh nghiệp và quý khách hàng...",
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
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
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
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ],
      },
    };
  }
}

// Save homepage data to JSON file
async function saveHomepageData(data: any) {
  await ensureDataDirectory();
  await fs.writeFile(
    HOMEPAGE_DATA_FILE,
    JSON.stringify(data, null, 2),
    "utf-8"
  );
}

export async function GET() {
  try {
    const data = await loadHomepageData();
    return NextResponse.json({
      success: true,
      data,
      message: "Homepage data loaded successfully",
    });
  } catch (error) {
    console.error("Failed to load homepage data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to load homepage data",
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the data structure
    if (!body || typeof body !== "object") {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid data format",
          message: "Request body must be a valid JSON object",
        },
        { status: 400 }
      );
    }

    // Save the data
    await saveHomepageData(body);

    return NextResponse.json({
      success: true,
      data: body,
      message: "Homepage data saved successfully",
    });
  } catch (error) {
    console.error("Failed to save homepage data:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to save homepage data",
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
