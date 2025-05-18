"use server"

import { db } from "@/lib/db"
// import { sendEmail } from "@/lib/email"
import { sendEmail } from "../email"
// import { generatePasswordResetToken } from "@/lib/tokens"
import { generatePasswordResetToken } from "../tokens"

interface ResetPasswordActionProps {
  email: string
}

export async function resetPasswordAction({ email }: ResetPasswordActionProps) {
  try {
    // Check if user exists
    const user = await db.user.findUnique({
      where: {
        email,
      },
    })

    if (!user) {
      // Return success even if user doesn't exist for security reasons
      return { success: true }
    }

    // Generate password reset token (expires in 1 hour)
    const passwordResetToken = await generatePasswordResetToken(email)

    // Generate reset link
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${passwordResetToken.token}`

    // Send email with reset link
    await sendEmail({
      to: email,
      subject: "Reset your password",
      html: `
        <div>
          <h1>Reset your password</h1>
          <p>Click the link below to reset your password:</p>
          <a href="${resetLink}">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn't request this email, please ignore it.</p>
        </div>
      `,
    })

    return { success: true }
  } catch (error) {
    console.error(error)
    return { error: "Failed to send reset email. Please try again." }
  }
}

interface VerifyPasswordResetTokenProps {
  token: string
}

export async function verifyPasswordResetToken({ token }: VerifyPasswordResetTokenProps) {
  try {
    const existingToken = await db.verificationToken.findUnique({
      where: {
        token,
      },
    })

    if (!existingToken) {
      return { error: "Invalid token" }
    }

    // Check if token has expired
    const hasExpired = new Date(existingToken.expires) < new Date()
    if (hasExpired) {
      return { error: "Token has expired" }
    }

    return { success: true, email: existingToken.identifier }
  } catch (error) {
    return { error: "Failed to verify token" }
  }
}

interface UpdatePasswordProps {
  token: string
  password: string
}

export async function updatePasswordAction({ token, password }: UpdatePasswordProps) {
  try {
    // Verify token first
    const result = await verifyPasswordResetToken({ token })
    
    if (result.error) {
      return { error: result.error }
    }

    // Hash the new password
    const hashedPassword = await require("bcryptjs").hash(password, 10)

    // Update user password
    await db.user.update({
      where: {
        email: result.email,
      },
      data: {
        password: hashedPassword,
      },
    })

    // Delete the token after successful reset
    await db.verificationToken.delete({
      where: {
        token,
      },
    })

    return { success: true }
  } catch (error) {
    return { error: "Failed to update password" }
  }
}