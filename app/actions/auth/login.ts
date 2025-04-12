"use server"

import { z } from "zod"
import { signIn } from "next-auth/react"
import { AuthError } from "next-auth"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  code: z.string().optional(),
})

export async function login(formData: FormData) {
  const validatedFields = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    code: formData.get("code"),
  })

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { email, password, code } = validatedFields.data

  try {
    await signIn("credentials", {
      email,
      password,
      code,
      redirect: false,
    })

    return { success: true }
  } catch (error) {
    if (error instanceof AuthError) {
      if (error.message === "2FA_REQUIRED") {
        return { requires2FA: true }
      }

      if (error.message === "INVALID_2FA") {
        return { error: "Invalid 2FA code" }
      }

      return { error: "Invalid credentials" }
    }

    return { error: "Something went wrong" }
  }
}
