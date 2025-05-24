"use server"

import { z } from "zod"
import { db } from "@/lib/db"

const nameSchema = z.string().min(1).regex(/^[a-z0-9-_.]+$/, {
  message: "Package name can only contain lowercase letters, numbers, hyphens, underscores, and dots",
})

export async function checkPackageName(name: string) {
  // Validate the name format
  const validatedName = nameSchema.safeParse(name)

  if (!validatedName.success) {
    return {
      available: false,
      error: validatedName.error.errors[0].message || "Invalid package name",
    }
  }

  try {
    // Normalize the name to match npm's format
    const normalizedName = name.trim().toLowerCase()
    
    // Check if name exists in our database
    const existingPackage = await db.package.findUnique({
      where: {
        name: normalizedName,
      },
    })

    if (existingPackage) {
      return {
        available: false,
        error: "Package name already exists in our database",
      }
    }

    // Check if name exists in NPM registry
    try {
      const response = await fetch(`https://registry.npmjs.org/${encodeURIComponent(normalizedName)}`, {
        method: 'HEAD',  // Use HEAD to just check existence without downloading data
        headers: {
          'Accept': 'application/json',
        },
        cache: 'no-store', // Don't use cached results
      })

      // Status code 404 means package doesn't exist (available)
      // Any other status (including 200) means it exists or there was an error
      if (response.status !== 404) {
        return {
          available: false,
          error: "Package name already exists in NPM registry",
        }
      }
      
      // If we got a 404, package name is available
      return {
        available: true,
      }
    } catch (npmError) {
      console.error("Error checking NPM registry:", npmError)
      // If we can't check NPM, assume it's available but log the error
      return {
        available: true,
        warning: "Could not verify availability in NPM registry",
      }
    }
  } catch (error) {
    console.error("Error checking package name:", error)
    return {
      available: false,
      error: "Failed to check package name",
    }
  }
}
