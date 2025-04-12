"use server"

import { z } from "zod"
import { hash } from "bcrypt"
import { db } from "@/lib/db"
import { Resend } from "resend"
import { redirect } from "next/navigation"

const resend = new Resend(process.env.RESEND_API_KEY)

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function register(formData: FormData) {
  const validatedFields = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, email, password } = validatedFields.data

  // Check if user already exists
  const existingUser = await db.user.findUnique({
    where: {
      email,
    },
  })

  if (existingUser) {
    return {
      error: "Email already in use",
    }
  }

  // Hash password
  const hashedPassword = await hash(password, 10)

  // Create user
  const user = await db.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
    },
  })

  // Generate verification token
  const token = crypto.randomUUID()
  const expires = new Date(Date.now() + 3600 * 1000) // 1 hour

  await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires,
    },
  })

  // Send verification email
  await resend.emails.send({
    from: "noreply@npmpackager.com",
    to: email,
    subject: "Verify your email address",
    html: `
      <h1>Verify your email address</h1>
      <p>Click the link below to verify your email address:</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}">Verify Email</a>
    `,
  })

  redirect("/login?verified=false")
}
