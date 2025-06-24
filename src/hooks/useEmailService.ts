'use client'
import { useState } from 'react'
import { emailService } from '@/services/emailService'
import { 
  ContactFormData, 
  OrderConfirmationData, 
  WelcomeEmailData, 
  PasswordResetData 
} from '@/types/email'
import { toast } from 'sonner'

export const useEmailService = () => {
  const [isLoading, setIsLoading] = useState(false)

  const sendContactForm = async (data: ContactFormData) => {
    setIsLoading(true)
    try {
      const result = await emailService.sendContactForm(data)
      if (result.success) {
        toast.success('Message sent successfully! We\'ll get back to you soon.')
        return true
      } else {
        toast.error('Failed to send message. Please try again.')
        console.error('Contact form email failed:', result.error)
        return false
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.')
      console.error('Contact form error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const sendOrderConfirmation = async (data: OrderConfirmationData) => {
    setIsLoading(true)
    try {
      const result = await emailService.sendOrderConfirmation(data)
      if (result.success) {
        console.log('Order confirmation email sent successfully')
        return true
      } else {
        console.error('Order confirmation email failed:', result.error)
        return false
      }
    } catch (error) {
      console.error('Order confirmation error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const sendWelcomeEmail = async (data: WelcomeEmailData) => {
    setIsLoading(true)
    try {
      const result = await emailService.sendWelcomeEmail(data)
      if (result.success) {
        console.log('Welcome email sent successfully')
        return true
      } else {
        console.error('Welcome email failed:', result.error)
        return false
      }
    } catch (error) {
      console.error('Welcome email error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const sendPasswordReset = async (data: PasswordResetData) => {
    setIsLoading(true)
    try {
      const result = await emailService.sendPasswordReset(data)
      if (result.success) {
        toast.success('Password reset email sent! Check your inbox.')
        return true
      } else {
        toast.error('Failed to send password reset email. Please try again.')
        console.error('Password reset email failed:', result.error)
        return false
      }
    } catch (error) {
      toast.error('Failed to send password reset email. Please try again.')
      console.error('Password reset error:', error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    sendContactForm,
    sendOrderConfirmation,
    sendWelcomeEmail,
    sendPasswordReset
  }
}