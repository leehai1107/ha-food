import { useIsMobile } from "../../hooks/use-mobile";
import { useState } from "react";

export default function FooterAbout() {
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
          GIỚI THIỆU
          {isMobile && <span className="ml-2">{expanded ? "−" : "+"}</span>}
        </button>
      </h4>
      {showContent && (
        <div className="flex flex-col gap-2 animate-fade-in">
          <p className="text-sm">Về Hafood.vn</p>
          <p className="text-sm">Tầm nhìn - Sứ mệnh</p>
          <p className="text-sm">Cam kết chất lượng</p>
        </div>
      )}
    </div>
  );
}
