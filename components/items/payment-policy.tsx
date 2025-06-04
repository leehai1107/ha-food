export default function PaymentPolicy() {
    return (
        <div>
            <h2 className="font-semibold text-5xl capitalize text-primary">Chính sách thanh toán</h2>
            <h3 className="font-semibold text-xl uppercase text-primary pt-4">
                1. Phương thức thanh toán
            </h3>
            <ul className="list-disc pl-6">
                <li>Thanh toán tại cửa hàng: 816/30 Quốc Lộ 1A, Phường Thạnh Xuân, Quận 12, TPHCM.</li>
                <li>Thanh toán khi nhận hàng (COD): Quý khách xem hàng và thanh toán tiền mặt hoặc chuyển khoản cho nhân viên giao hàng.</li>
                <li>Chuyển khoản ngân hàng: Quý khách có thể thanh toán đơn hàng qua tài khoản ngân hàng của Hafood.
                    Thông tin chi tiết về tài khoản ngân hàng sẽ được hiển thị trên trang thanh toán.</li>
            </ul>
            <h3 className="font-semibold text-xl uppercase text-primary pt-4">
                2. Thời hạn thanh toán
            </h3>
            <ul className="list-disc pl-6">
                <li>Đối với đơn hàng thanh toán khi nhận hàng (COD): Quý khách cần thanh toán ngay khi nhận được hàng.</li>
                <li>Đối với đơn hàng thanh toán bằng chuyển khoản ngân hàng: Quý khách cần chuyển khoản trong vòng 24 giờ kể từ khi nhận được thông tin đơn hàng.</li>
            </ul>
            <h3 className="font-semibold text-xl uppercase text-primary pt-4">
                3. Hóa đơn và biên lai
            </h3>
            <ul className="list-disc pl-6">
                <li>Khi mua hàng tại Hafood, quý khách sẽ nhận được đầy đủ hóa đơn hoặc biên lai theo yêu cầu.
                    Đây là bằng chứng mua hàng giúp quý khách dễ dàng đổi trả, bảo hành sản phẩm, đảm bảo quyền lợi của khách hàng.
                    Mỗi giao dịch tại Hafood đều được xuất hóa đơn hoặc biên lai bao gồm đầy đủ thông tin: tên sản phẩm, số lượng, đơn giá, tổng tiền, ngày mua hàng và thông tin người mua.</li>
                <li>Hóa đơn đỏ VAT: Hafood sẽ hỗ trợ xuất hóa hơn đỏ cho quý khách nếu có nhu cầu.</li>
            </ul>
        </div>
    );
}
