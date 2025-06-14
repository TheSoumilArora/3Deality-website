
import { 
  ContactFormData, 
  OrderConfirmationData, 
  WelcomeEmailData, 
  PasswordResetData, 
  EmailResponse 
} from '@/types/email'

// TODO: Replace with your actual Resend API key
// This should be stored in Supabase secrets when you integrate with Supabase
const RESEND_API_KEY = 'your-resend-api-key-here'
const FROM_EMAIL = 'noreply@yourdomain.com' // Replace with your verified domain
const ADMIN_EMAIL = 'admin@yourdomain.com' // Replace with your admin email

class EmailService {
  private apiKey: string
  private baseUrl = 'https://api.resend.com'

  constructor(apiKey: string) {
    this.apiKey = apiKey
  }

  private async sendEmail(to: string, subject: string, html: string, from?: string): Promise<EmailResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/emails`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: from || FROM_EMAIL,
          to: [to],
          subject,
          html
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to send email')
      }

      const data = await response.json()
      return {
        success: true,
        messageId: data.id
      }
    } catch (error) {
      console.error('Email sending failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  async sendContactForm(data: ContactFormData): Promise<EmailResponse> {
    const subject = `New Contact Form Submission from ${data.name}`
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Contact Form Submission</h2>
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
          ${data.subject ? `<p><strong>Subject:</strong> ${data.subject}</p>` : ''}
          <p><strong>Message:</strong></p>
          <div style="background: white; padding: 15px; border-radius: 4px; margin-top: 10px;">
            ${data.message.replace(/\n/g, '<br>')}
          </div>
        </div>
        <p style="color: #666; font-size: 12px; margin-top: 20px;">
          This email was sent from your 3Deality contact form.
        </p>
      </div>
    `

    return this.sendEmail(ADMIN_EMAIL, subject, html)
  }

  async sendOrderConfirmation(data: OrderConfirmationData): Promise<EmailResponse> {
    const subject = `Order Confirmation - #${data.orderId}`
    const itemsHtml = data.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price.toFixed(2)}</td>
      </tr>
    `).join('')

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Thank you for your order!</h2>
        <p>Hi ${data.customerName},</p>
        <p>Your order has been confirmed and is being processed.</p>
        
        <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Order Details</h3>
          <p><strong>Order ID:</strong> #${data.orderId}</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
            <thead>
              <tr style="background: #333; color: white;">
                <th style="padding: 10px; text-align: left;">Item</th>
                <th style="padding: 10px; text-align: center;">Qty</th>
                <th style="padding: 10px; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
            <tfoot>
              <tr style="background: #f0f0f0; font-weight: bold;">
                <td colspan="2" style="padding: 10px;">Total</td>
                <td style="padding: 10px; text-align: right;">₹${data.total.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>

          <h4>Shipping Address</h4>
          <p>
            ${data.shippingAddress.street}<br>
            ${data.shippingAddress.city}, ${data.shippingAddress.state} ${data.shippingAddress.zipCode}<br>
            ${data.shippingAddress.country}
          </p>
        </div>

        <p>We'll send you another email when your order ships.</p>
        <p>Thank you for choosing 3Deality!</p>
      </div>
    `

    return this.sendEmail(data.customerEmail, subject, html)
  }

  async sendWelcomeEmail(data: WelcomeEmailData): Promise<EmailResponse> {
    const subject = 'Welcome to 3Deality!'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Welcome to 3Deality!</h2>
        <p>Hi ${data.customerName},</p>
        <p>Thank you for creating an account with us. We're excited to help you with all your 3D printing needs!</p>
        
        ${data.verificationLink ? `
          <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p><strong>Please verify your email address:</strong></p>
            <a href="${data.verificationLink}" 
               style="background: #007cba; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Verify Email Address
            </a>
          </div>
        ` : ''}

        <h3>What's Next?</h3>
        <ul>
          <li>Browse our store for ready-to-print designs</li>
          <li>Upload your own files for custom printing</li>
          <li>Get instant quotes for your projects</li>
        </ul>

        <p>If you have any questions, feel free to contact us!</p>
        <p>Best regards,<br>The 3Deality Team</p>
      </div>
    `

    return this.sendEmail(data.customerEmail, subject, html)
  }

  async sendPasswordReset(data: PasswordResetData): Promise<EmailResponse> {
    const subject = 'Reset Your 3Deality Password'
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${data.customerName},</p>
        <p>We received a request to reset your password for your 3Deality account.</p>
        
        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
          <p><strong>Click the button below to reset your password:</strong></p>
          <a href="${data.resetLink}" 
             style="background: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Reset Password
          </a>
          <p style="font-size: 14px; color: #666; margin-top: 15px;">
            This link will expire in 1 hour for security reasons.
          </p>
        </div>

        <p>If you didn't request this password reset, you can safely ignore this email.</p>
        <p>Best regards,<br>The 3Deality Team</p>
      </div>
    `

    return this.sendEmail(data.email, subject, html)
  }
}

// Create a singleton instance
// Note: In production, you should get the API key from environment variables or Supabase secrets
export const emailService = new EmailService(RESEND_API_KEY)
