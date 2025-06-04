import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/custom/icon"
import { Phone } from "lucide-react"

export default function Contact() {
    return (
        <section className="w-full px-6 py-16">
            <div className="flex flex-col md:flex-row justify-center items-stretch gap-6 max-w-[1200px] mx-auto w-full h-full">

                {/* Left section */}
                <div className="w-full md:w-1/3 flex flex-col gap-6 bg-white p-6 border rounded-md">
                    {/* Address */}
                    <div className="pb-4 border-b border-gray-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Icons.mapPin className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-semibold uppercase text-sm">Địa chỉ</h3>
                        </div>
                        <p className="text-sm">Giờ làm việc : 8h - 20h, T2-T7</p>
                        <p className="text-sm">816/30 Quốc lộ 1A, Phường Thạnh Xuân, Quận 12, TP.HCM</p>
                    </div>

                    {/* Hotline */}
                    <div className="pb-4 border-b border-gray-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Phone className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-semibold uppercase text-sm">Tổng đài hỗ trợ</h3>
                        </div>
                        <p className="text-sm">Giờ làm việc : 8h - 20h, T2-T7</p>
                        <p className="text-sm">SĐT: 0972819379</p>
                    </div>

                    {/* Email */}
                    <div className="pb-4 border-b border-gray-300">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Icons.mail className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-semibold uppercase text-sm">Email</h3>
                        </div>
                        <p className="text-sm">Giờ làm việc : 8h - 20h, T2-T7</p>
                        <p className="text-sm">Emails: info@hafood.vn</p>
                    </div>
                </div>

                {/* Right section */}
                <Card className="w-full md:w-2/3 bg-white border rounded-md">
                    <CardContent className="py-8 px-6">
                        <form className="space-y-4 w-full">
                            <div className="flex flex-col md:flex-row gap-4">
                                <Input id="name" placeholder="Họ và Tên *" className="bg-gray-100 text-sm" required />
                                <Input id="email" type="email" placeholder="Địa chỉ Email *" className="bg-gray-100 text-sm" required />
                                <Input id="phone" type="tel" placeholder="Số điện thoại *" className="bg-gray-100 text-sm" required />
                            </div>
                            <Textarea
                                id="message"
                                placeholder="Nội dung"
                                className="bg-gray-100 text-sm min-h-[360px]"
                                required
                            />
                            <div className="flex justify-center">
                                <Button type="submit" className="bg-primary text-white px-6 py-2 text-sm rounded">
                                    Gửi thông tin
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </section>
    )
}
