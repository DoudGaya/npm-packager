"use server"

import { z } from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

const feedbackSchema = z.object({
  type: z.enum(["bug", "feature", "general"]),
  message: z.string().min(10),
})

export async function submitFeedback(data: z.infer<typeof feedbackSchema>) {
  const validatedFields = feedbackSchema.safeParse(data)

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
    }
  }

  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "Unauthorized",
    }
  }

  try {
    // Create feedback in database
    await db.feedback.create({
      data: {
        content: data.message,
        rating: 0,
        user: {
            connect: {
                id: user.id,
            },
        },
        createdAt: new Date(),
      },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error submitting feedback:", error)
    return {
      error: "Failed to submit feedback",
    }
  }
}
