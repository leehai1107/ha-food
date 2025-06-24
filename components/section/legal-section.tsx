export default function LegalSection() {
  return (
    <div className="flex flex-col gap-3">
      <h4 className="text-secondary font-semibold text-xl">
        BẢN QUYỀN & PHÁP LÝ
      </h4>
      <div className="flex flex-col gap-2">
        <p className="text-sm">
          © {new Date().getFullYear()} Hafood.vn. All rights reserved.
        </p>
        <div className="flex flex-row gap-1">
          <p className="text-sm">Điều khoản sử dụng</p>
          <span className="text-sm">|</span>
          <p className="text-sm">Chính sách bảo mật</p>
        </div>
      </div>
      {/* Google Maps */}
      <div className = "mt-4">
      <div className = "w-full h-[200px]">
          <iframe
            title  = "Address"
            src    = "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3918.3204167947715!2d106.672336!3d10.863216!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317529c501fd54a9%3A0xbc25368885a9579!2zSEFGT09EIC0gSOG7mFAgUVXDgCBU4bq2TkcgQ0FPIEPhuqRQIDIwMjU!5e0!3m2!1sen!2s!4v1749962723893!5m2!1sen!2s"
            width  = "100%"
            height = "100%"
            style  = {{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
}
