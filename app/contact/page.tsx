"use client";
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Icons } from "@/components/custom/icon"
import { Phone } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import Link from "next/link"

export default function Contact() {
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)

        const form = e.currentTarget
        const formData = new FormData(form)
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            message: formData.get('message')
        }

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                throw new Error('Failed to send message')
            }

            toast.success('Gửi thông tin thành công!')
            form.reset()
        } catch (error) {
            toast.error('Có lỗi xảy ra. Vui lòng thử lại sau. Err: ' + error)
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <>
            <h1 className="hidden">hafood - Quà tặng doanh nghiệp</h1>
            {/* Breadcrumb */}
            <div className="bg-gray-50 py-4">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link href="/" className="text-red-600 hover:text-red-700">Trang chủ</Link>
                        <span className="text-gray-500">/</span>
                        <span className="text-gray-900 font-medium">Liên hệ</span>
                    </nav>
                </div>
            </div>

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
                            <form onSubmit={handleSubmit} className="space-y-4 w-full">
                                <div className="flex flex-col md:flex-row gap-4">
                                    <Input name="name" id="name" placeholder="Họ và Tên *" className="bg-gray-100 text-sm" required />
                                    <Input name="email" id="email" type="email" placeholder="Địa chỉ Email *" className="bg-gray-100 text-sm" required />
                                    <Input name="phone" id="phone" type="tel" placeholder="Số điện thoại *" className="bg-gray-100 text-sm" required />
                                </div>
                                <Textarea
                                    name="message"
                                    id="message"
                                    placeholder="Nội dung"
                                    className="bg-gray-100 text-sm min-h-[360px]"
                                    required
                                />
                                <div className="flex justify-center">
                                    <Button 
                                        type="submit" 
                                        className="bg-primary text-white px-6 py-2 text-sm rounded"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Đang gửi...' : 'Gửi thông tin'}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </>
    )
}
