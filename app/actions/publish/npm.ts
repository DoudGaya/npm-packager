"use server"

import { z } from "zod"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { PackageStatus } from "@prisma/client"

const packageIdSchema = z.string().min(1)

export async function publishToNpm(packageId: string) {
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

  // Check if user has NPM token
  if (!user.npmToken) {
    return {
      error: "NPM token not found. Please connect your NPM account in settings.",
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

    // In a real implementation, this would publish the package to NPM
    // using the npm-registry-client or similar
    console.log("Publishing to NPM:", pkg.name)

    // Update package status and NPM URL
    await db.package.update({
      where: {
        id: packageId,
      },
      data: {
        status: PackageStatus.PUBLISHED,
        npmUrl: `https://www.npmjs.com/package/${pkg.name}`,
      },
    })

    return {
      success: true,
    }
  } catch (error) {
    console.error("Error publishing to NPM:", error)
    return {
      error: "Failed to publish to NPM",
    }
  }
}
