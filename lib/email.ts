import nodemailer from "nodemailer"

interface SendEmailProps {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailProps) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM } = process.env

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  })

  try {
    await transporter.sendMail({
      from: EMAIL_FROM,
      to,
      subject,
      html,
    })
    return { success: true }
  } catch (error) {
    console.error("Failed to send email:", error)
    return { error: "Failed to send email" }
  }
}