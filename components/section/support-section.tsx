import { Facebook, Mail } from "lucide-react";
import Image from "next/image";
import Zalo from "../../public/uploads/shared/logos/zalo.svg";
import { useIsMobile } from "../../hooks/use-mobile";
import { useState } from "react";

export default function SupportSection() {
  const isMobile = useIsMobile();
  const [expanded, setExpanded] = useState(false);
  const showContent = !isMobile || expanded;

  return (
    <div className="flex flex-col gap-3">
      <h4>
        <button
          type="button"
          className={`text-secondary font-semibold text-xl flex items-center justify-between w-full focus:outline-none ${
            isMobile ? "cursor-pointer" : ""
          }`}
          onClick={() => isMobile && setExpanded((v) => !v)}
          aria-expanded={showContent}
        >
          HỖ TRỢ KHÁCH HÀNG
          {isMobile && <span className="ml-2">{expanded ? "−" : "+"}</span>}
        </button>
      </h4>
      {showContent && (
        <div>
          <div className="flex flex-col gap-2 animate-fade-in">
            <p className="text-sm">Chính sách giao hàng</p>
            <p className="text-sm">Chính sách đổi trả</p>
            <p className="text-sm">Hướng dẫn đặt hàng</p>
            <p className="text-sm">Câu hỏi thường gặp (FAQ)</p>
          </div>
          {/* Social Media Buttons */}
          <div className="flex gap-3 mt-2">
            <a
              href="https://zalo.me/0972819379"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <Image src={Zalo} alt="Zalo" width={20} height={20} />
            </a>
            <a
              href="https://www.facebook.com/hopquatet.hafood"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <Facebook size={20} className="text-primary-black" />
            </a>
            {/* Email */}
            <a
              href="mailto:info@hafood.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <Mail size={20} className="text-primary-black" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
