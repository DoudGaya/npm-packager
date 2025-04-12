"use server"

import { z } from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"

const packageIdSchema = z.string().min(1)

export async function publishToGithub(packageId: string) {
  const validatedFields = packageIdSchema.safeParse(packageId)

  if (!validatedFields.success) {
    return {
      error: "Invalid package ID",
    }
  }

  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "Unauthorized",
    }
  }

  // Check if user has GitHub token
  if (!user.githubToken) {
    return {
      error: "GitHub token not found. Please connect your GitHub account in settings.",
    }
  }

  try {
    // Get package
    const pkg = await db.package.findUnique({
      where: {
        id: packageId,
        userId: user.id,
      },
    })

    if (!pkg) {
      return {
        error: "Package not found",
      }
    }

    // In a real implementation, this would create a GitHub repository
    // and push the package code using the Octokit library
    console.log("Publishing to GitHub:", pkg.name)

    // Update package repository URL
    await db.package.update({
      where: {
        id: packageId,
      },
      data: {
        repository: `https://github.com/${user.name}/${pkg.name}`,
      },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error publishing to GitHub:", error)
    return {
      error: "Failed to publish to GitHub",
    }
  }
}
