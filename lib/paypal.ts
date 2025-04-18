import { env } from "@/lib/env"
import { db } from "@/lib/db"

interface CreatePayPalOrderParams {
  amount: number
  credits: number
  transactionId: string
  userId: string
}

export async function createPayPalOrder({ amount, credits, transactionId, userId }: CreatePayPalOrderParams) {
  // Get access token
  const accessToken = await getPayPalAccessToken()

  // Create order
  const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: amount.toString(),
          },
          description: `${credits} Credits for NPM-Packager`,
          custom_id: `${transactionId}|${userId}|${credits}`,
        },
      ],
      application_context: {
        return_url: `${env.NEXT_PUBLIC_APP_URL}/settings/wallet?success=true`,
        cancel_url: `${env.NEXT_PUBLIC_APP_URL}/settings/wallet?canceled=true`,
      },
    }),
  })

  const data = await response.json()

  if (data.error) {
    throw new Error(data.error.message)
  }

  // Find approval URL
  const approvalUrl = data.links.find((link: any) => link.rel === "approve").href

  return approvalUrl
}

export async function capturePayPalOrder(orderId: string) {
  // Get access token
  const accessToken = await getPayPalAccessToken()

  // Capture order
  const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
  })

  const data = await response.json()

  if (data.error) {
    throw new Error(data.error.message)
  }

  // Get transaction details from custom_id
  const customId = data.purchase_units[0].payments.captures[0].custom_id
  const [transactionId, userId, credits] = customId.split("|")

  // Update transaction status
  await updateTransactionStatus(transactionId, data.id)

  // Add credits to user's wallet
  await addCreditsToWallet(userId, Number.parseInt(credits))

  return data
}

async function getPayPalAccessToken() {
  const auth = Buffer.from(`${env.PAYPAL_CLIENT_ID}:${env.PAYPAL_CLIENT_SECRET}`).toString("base64")

  const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${auth}`,
    },
    body: "grant_type=client_credentials",
  })

  const data = await response.json()

  if (data.error) {
    throw new Error(data.error.message)
  }

  return data.access_token
}

async function updateTransactionStatus(transactionId: string, paymentId: string) {
  await db.transaction.update({
    where: { id: transactionId },
    data: {
      status: "completed",
      paymentId,
    },
  })
}

async function addCreditsToWallet(userId: string, credits: number) {
  // Check if wallet exists
  const wallet = await db.wallet.findUnique({
    where: { userId },
  })

  if (wallet) {
    // Update existing wallet
    await db.wallet.update({
      where: { userId },
      data: {
        credits: { increment: credits },
      },
    })
  } else {
    // Create new wallet
    await db.wallet.create({
      data: {
        userId,
        credits,
      },
    })
  }
}
