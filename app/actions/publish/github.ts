"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { publishToGitHubRepo } from "@/lib/github-publisher"

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

    // Check if repository already exists
    if (pkg.repository) {
      return {
        error: "Repository already exists",
      }
    }

    // Publish to GitHub
    const publishResult = await publishToGitHubRepo({
      packageName: pkg.name,
      packageCode: pkg.code,
      packageDescription: pkg.description,
      documentation: pkg.documentation,
      githubToken: user.githubToken,
      userName: user.name || "user",
    })

    if (!publishResult.success) {
      return {
        error: publishResult.error || "Failed to publish to GitHub",
      }
    }

    // Update package repository URL
    await db.package.update({
      where: {
        id: packageId,
      },
      data: {
        repository: publishResult.repoUrl,
      },
    })

    revalidatePath(`/packages/${packageId}`)
    revalidatePath("/packages")
    return {
      success: true,
      repoUrl: publishResult.repoUrl,
    }
  } catch (error) {
    console.error("Error publishing to GitHub:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to publish to GitHub",
    }
  }
}

// "use server"

// import { z } from "zod"
// import { db } from "@/lib/db"
// import { getCurrentUser } from "@/lib/session"

// const packageIdSchema = z.string().min(1)

// export async function publishToGithub(packageId: string) {
//   const validatedFields = packageIdSchema.safeParse(packageId)

//   if (!validatedFields.success) {
//     return {
//       error: "Invalid package ID",
//     }
//   }

//   const user = await getCurrentUser()

//   if (!user) {
//     return {
//       error: "Unauthorized",
//     }
//   }

//   // Check if user has GitHub token
//   if (!user.githubToken) {
//     return {
//       error: "GitHub token not found. Please connect your GitHub account in settings.",
//     }
//   }

//   try {
//     // Get package
//     const pkg = await db.package.findUnique({
//       where: {
//         id: packageId,
//         userId: user.id,
//       },
//     })

//     if (!pkg) {
//       return {
//         error: "Package not found",
//       }
//     }

//     // In a real implementation, this would create a GitHub repository
//     // and push the package code using the Octokit library
//     console.log("Publishing to GitHub:", pkg.name)

//     // Update package repository URL
//     await db.package.update({
//       where: {
//         id: packageId,
//       },
//       data: {
//         repository: `https://github.com/${user.name}/${pkg.name}`,
//       },
//     })

//     return {
//       success: true,
//     }
//   } catch (error) {
//     console.error("Error publishing to GitHub:", error)
//     return {
//       error: "Failed to publish to GitHub",
//     }
//   }
// }
