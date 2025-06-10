import { NextResponse } from 'next/server'
import emailService from '@/services/emailService'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { name, email, phone, message } = body

        // Validate required fields
        if (!name || !email || !phone || !message) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            )
        }

        // Send email using the email service
        const emailSent = await emailService.sendContactFormEmail({
            name,
            email,
            phone,
            message
        })

        if (!emailSent) {
            return NextResponse.json(
                { error: 'Failed to send email' },
                { status: 500 }
            )
        }

        return NextResponse.json({ message: 'Contact form submitted successfully' })
    } catch (error) {
        console.error('Error processing contact form:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
} 