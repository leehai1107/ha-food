export default function LegalSection() {
    return (
        <div className="flex flex-col gap-3">
            <h4 className="text-secondary font-medium text-xl">BẢN QUYỀN & PHÁP LÝ</h4>
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
        </div>
    )
}
