"use server"

import { z } from "zod"
import { db } from "@/lib/db"

const nameSchema = z.string().min(1)

export async function checkPackageName(name: string) {
  const validatedName = nameSchema.safeParse(name)

  if (!validatedName.success) {
    return {
      available: false,
      error: "Invalid package name",
    }
  }

  try {
    // Check if name exists in our database
    const existingPackage = await db.package.findUnique({
      where: {
        name,
      },
    })

    if (existingPackage) {
      return {
        available: false,
        error: "Package name already exists in our database",
      }
    }

    // Check if name exists in NPM registry
    const response = await fetch(`https://registry.npmjs.org/${name}`)

    if (response.status === 200) {
      return {
        available: false,
        error: "Package name already exists in NPM registry",
      }
    }

    return {
      available: true,
    }
  } catch (error) {
    console.error("Error checking package name:", error)
    return {
      available: false,
      error: "Failed to check package name",
    }
  }
}
