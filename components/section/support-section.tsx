import { Facebook, Mail } from "lucide-react";
import Image from "next/image";
import Zalo from "../../public/logo/zalo.svg";


export default function SupportSection() {
    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-secondary font-semibold text-xl">HỖ TRỢ KHÁCH HÀNG</h4>
            <div className="flex flex-col gap-2">
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
    )
}
