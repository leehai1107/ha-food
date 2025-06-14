import nodemailer from 'nodemailer';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface OrderEmailData {
  orderId: number;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  customerAddress?: string;
  orderItems: Array<{
    productName: string;
    quantity: number;
    productPrice: number;
    totalPrice: number;
  }>;
  totalPrice: number;
  createdAt: Date;
}

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private configMap: Record<string, string> = {};
  private isInitializing: boolean = false;
  private initializationPromise: Promise<boolean> | null = null;

  async initializeTransporter(): Promise<boolean> {
    if (this.transporter) {
      return true;
    }

    if (this.isInitializing) {
      return this.initializationPromise || Promise.resolve(false);
    }

    this.isInitializing = true;
    this.initializationPromise = (async () => {
      try {
        const config = await this.getEmailConfig();
        
        if (!config.smtp_host || !config.smtp_username || !config.smtp_password) {
          throw new Error('Email configuration incomplete');
        }

        this.transporter = nodemailer.createTransport({
          host: config.smtp_host,
          port: parseInt(config.smtp_port || '587'),
          secure: false,
          auth: {
            user: config.smtp_username,
            pass: config.smtp_password,
          },
        });

        await this.transporter.verify();
        this.configMap = config;
        console.log('Email service initialized successfully');
        return true;
      } catch (error) {
        console.error('Failed to initialize email service:', error);
        this.transporter = null;
        return false;
      } finally {
        this.isInitializing = false;
        this.initializationPromise = null;
      }
    })();

    return this.initializationPromise;
  }

  private async ensureTransporter(): Promise<nodemailer.Transporter> {
    if (!this.transporter) {
      const initialized = await this.initializeTransporter();
      if (!initialized || !this.transporter) {
        throw new Error('Failed to initialize email transporter');
      }
    }
    return this.transporter;
  }

  async sendOrderNotificationToAdmin(orderData: OrderEmailData): Promise<boolean> {
    try {
      const transporter = await this.ensureTransporter();
      // Get admin email from system config
      const adminEmailConfig = await prisma.systemConfig.findUnique({
        where: { key: 'email_from_address', isActive: true }
      });

      if (!adminEmailConfig) {
        console.warn('Admin email not configured. Skipping order notification.');
        return false;
      }

      const adminEmail = adminEmailConfig.value;
      const emailHtml = this.generateOrderEmailTemplate(orderData);

      const mailOptions = {
        from: `"${this.configMap.email_from_name}" <${this.configMap.email_from_address}>`,
        to: adminEmail,
        subject: `Đơn hàng mới #${orderData.orderId} - HA Food`,
        html: emailHtml,
      };

      const result = await transporter.sendMail(mailOptions);
      console.log('Order notification email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send order notification email:', error);
      return false;
    }
  }

  async sendContactFormEmail(contactData: ContactFormData) {
    if (!this.transporter) {
      await this.initializeTransporter();
    }

    if (!this.transporter) {
      console.warn('Email service not available. Skipping contact form email.');
      return false;
    }

    try {
      const adminEmailConfig = await prisma.systemConfig.findUnique({
        where: { key: 'email_from_address', isActive: true }
      });

      if (!adminEmailConfig) {
        console.warn('Admin email not configured. Skipping contact form email.');
        return false;
      }

      const adminEmail = adminEmailConfig.value;
      const emailHtml = this.generateContactFormEmailTemplate(contactData);

      const mailOptions = {
        from: `"${this.configMap.email_from_name}" <${this.configMap.email_from_address}>`,
        to: adminEmail,
        subject: `Liên hệ mới từ ${contactData.name} - HA Food`,
        html: emailHtml,
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('Contact form email sent successfully:', result.messageId);
      return true;
    } catch (error) {
      console.error('Failed to send contact form email:', error);
      return false;
    }
  }

  private generateOrderEmailTemplate(orderData: OrderEmailData): string {
    const formatPrice = (price: number) => {
      return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
      }).format(price);
    };

    const formatDate = (date: Date) => {
      return new Intl.DateTimeFormat('vi-VN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(date);
    };

    return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Đơn hàng mới - HA Food</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .order-info { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
          .customer-info { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
          .order-items { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
          .item { border-bottom: 1px solid #eee; padding: 10px 0; }
          .item:last-child { border-bottom: none; }
          .total { font-weight: bold; font-size: 18px; color: #dc2626; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Ha Food - Đơn hàng mới</h1>
          </div>
          
          <div class="content">
            <div class="order-info">
              <h2>Thông tin đơn hàng</h2>
              <p><strong>Mã đơn hàng:</strong> #${orderData.orderId}</p>
              <p><strong>Thời gian đặt:</strong> ${formatDate(orderData.createdAt)}</p>
              <p><strong>Trạng thái:</strong> Chờ xử lý</p>
            </div>

            <div class="customer-info">
              <h2>Thông tin khách hàng</h2>
              <p><strong>Tên:</strong> ${orderData.customerName}</p>
              <p><strong>Email:</strong> ${orderData.customerEmail}</p>
              ${orderData.customerPhone ? `<p><strong>Số điện thoại:</strong> ${orderData.customerPhone}</p>` : ''}
              ${orderData.customerAddress ? `<p><strong>Địa chỉ:</strong> ${orderData.customerAddress}</p>` : ''}
            </div>

            <div class="order-items">
              <h2>Chi tiết đơn hàng</h2>
              ${orderData.orderItems.map(item => `
                <div class="item">
                  <p><strong>${item.productName}</strong></p>
                  <p>Số lượng: ${item.quantity} x ${formatPrice(item.productPrice)} = ${formatPrice(item.totalPrice)}</p>
                </div>
              `).join('')}
              
              <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #dc2626;">
                <p class="total">Tổng cộng: ${formatPrice(orderData.totalPrice)}</p>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>Đây là email tự động từ hệ thống HA Food.</p>
            <p>Vui lòng đăng nhập vào trang quản trị để xử lý đơn hàng.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private generateContactFormEmailTemplate(contactData: ContactFormData): string {
    return `
      <!DOCTYPE html>
      <html lang="vi">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Liên hệ mới - Ha Food</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background-color: #dc2626; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background-color: #f9f9f9; }
          .contact-info { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
          .message { background-color: white; padding: 15px; margin: 10px 0; border-radius: 5px; }
          .footer { text-align: center; padding: 20px; color: #666; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Ha Food - Liên hệ mới</h1>
          </div>
          
          <div class="content">
            <div class="contact-info">
              <h2>Thông tin người liên hệ</h2>
              <p><strong>Tên:</strong> ${contactData.name}</p>
              <p><strong>Email:</strong> ${contactData.email}</p>
              <p><strong>Số điện thoại:</strong> ${contactData.phone}</p>
            </div>

            <div class="message">
              <h2>Nội dung tin nhắn</h2>
              <p>${contactData.message.replace(/\n/g, '<br>')}</p>
            </div>
          </div>

          <div class="footer">
            <p>Đây là email tự động từ hệ thống HA Food.</p>
            <p>Vui lòng phản hồi email này để liên hệ với khách hàng.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }

  private async getEmailConfig(): Promise<Record<string, string>> {
    const emailConfigs = await prisma.systemConfig.findMany({
      where: {
        key: {
          in: ['smtp_host', 'smtp_port', 'smtp_username', 'smtp_password', 'email_from_address', 'email_from_name']
        },
        isActive: true
      }
    });

    return emailConfigs.reduce((acc, config) => {
      acc[config.key] = config.value;
      return acc;
    }, {} as Record<string, string>);
  }
}

export default new EmailService();
