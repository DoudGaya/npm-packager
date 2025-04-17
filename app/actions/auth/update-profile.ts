"use server"

import { z } from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
})

export async function updateProfile(data: z.infer<typeof profileSchema>) {
  const validatedFields = profileSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "Unauthorized",
    }
  }

  try {
    // Check if email is already in use by another user
    if (data.email !== user.email) {
      const existingUser = await db.user.findUnique({
        where: {
          email: data.email,
        },
      })

      if (existingUser && existingUser.id !== user.id) {
        return {
          error: "Email already in use",
        }
      }
    }

    // Update user profile
    await db.user.update({
      where: {
        id: user.id,
      },
      data: {
        name: data.name,
        email: data.email,
      },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error updating profile:", error)
    return {
      error: "Failed to update profile",
    }
  }
}
