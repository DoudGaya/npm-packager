import { randomUUID } from "crypto"
import { db } from "@/lib/db"

export async function generatePasswordResetToken(email: string) {
  const token = randomUUID()
  const expires = new Date(Date.now() + 3600 * 1000) // 1 hour from now

  // First delete any existing token for this email
  await db.verificationToken.deleteMany({
    where: {
      identifier: email
    }
  })

  // Create a new token
  const verificationToken = await db.verificationToken.create({
    data: {
      identifier: email,
      token,
      expires
    }
  })

  return verificationToken
}