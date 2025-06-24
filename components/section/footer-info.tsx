import { Mail, MapPin, Phone } from "lucide-react";
import Image from "next/image";

export default function FooterInfo() {
  return (
    <div className="flex flex-col gap-2">
      <Image
        src="/uploads/shared/logos/logo-primary.webp"
        alt="Logo Ha Food"
        width={245}
        height={69}
      />
      <div className="flex flex-col gap-2 py-2">
        <h4 className="text-secondary font-semibold text-xl">
          CÔNG TY TNHH HA FOOD VN
        </h4>
        <p className="text-sm">
          Quà Tặng Doanh Nghiệp Uy Tín <br />
          Mã số thuế: 0317042993
        </p>
        <div className="flex items-center justify-center gap-1">
          <MapPin className="text-secondary" />
          <p className="text-sm">
            816/30 Quốc lộ 1A, Phường Thạnh Xuân, Quận 12, TP.HCM
          </p>
        </div>
        <div className="flex gap-4 text-secondary">
          <div className="flex items-center justify-center gap-1">
            <Phone />
            <a href="tel:0972819379" className="text-sm">
              0972819379
            </a>
          </div>
          <div className="flex items-center justify-center gap-1">
            <Mail />
            <a href="mailto:info@hafood.com" className="text-sm">
              info@hafood.vn
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
