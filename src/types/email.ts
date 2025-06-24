export interface ContactFormData {
  name: string
  email: string
  message: string
  phone?: string
  subject?: string
}

export interface OrderConfirmationData {
  orderId: string
  customerEmail: string
  customerName: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  shippingAddress: {
    street: string
    city: string
    state: string
    zipCode: string
    country: string
  }
}

export interface WelcomeEmailData {
  customerEmail: string
  customerName: string
  verificationLink?: string
}

export interface PasswordResetData {
  email: string
  resetLink: string
  customerName: string
}

export interface EmailResponse {
  success: boolean
  messageId?: string
  error?: string
}