import { getServerSession } from "next-auth"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { authOptions } from "./auth"
import { db } from "@/lib/db"

export async function getCurrentUser() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return null
    }

    const user = await db.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        bio: true,
        role: true,
        npmToken: true,
        githubToken: true,
        twoFactorEnabled: true,
        subscriptionPlan: true,
        subscriptionStatus: true,
      },
    })

    return user
  } catch (error) {
    console.error("Session error:", error)
    return null
  }
}
