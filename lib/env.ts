export const env = {
    // Auth
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET!,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID!,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET!,
  
    // Email
    RESEND_API_KEY: process.env.RESEND_API_KEY!,
  
    // App
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL!,
    NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID!,
  
    // Database
    DATABASE_URL: process.env.DATABASE_URL!,
  
    // AI Models
    OPENAI_API_KEY: process.env.OPENAI_API_KEY!,
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY!,
    DEEPSEEK_API_KEY: process.env.DEEPSEEK_API_KEY!,
    GROQ_API_KEY: process.env.GROQ_API_KEY!,
  
    // Payments
    STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY!,
    STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET!,
    STRIPE_SUBSCRIPTION_WEBHOOK_SECRET: process.env.STRIPE_SUBSCRIPTION_WEBHOOK_SECRET!,
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID!,
    PAYPAL_CLIENT_SECRET: process.env.PAYPAL_CLIENT_SECRET!,
  }

  
// import { z } from "zod"

// const envSchema = z.object({
//   // Database
//   DATABASE_URL: z.string().min(1),

//   // NextAuth
//   NEXTAUTH_SECRET: z.string().min(1),
//   NEXTAUTH_URL: z.string().url().optional(),
//   NEXT_PUBLIC_APP_URL: z.string().url(),

//   // OAuth
//   GITHUB_CLIENT_ID: z.string().min(1),
//   GITHUB_CLIENT_SECRET: z.string().min(1),

//   // Email
//   RESEND_API_KEY: z.string().min(1),

//   // AI Models
//   OPENAI_API_KEY: z.string().min(1),
//   ANTHROPIC_API_KEY: z.string().optional(),
//   DEEPSEEK_API_KEY: z.string().optional(),
//   GROQ_API_KEY: z.string().optional(),

//   // Analytics
//   NEXT_PUBLIC_GA_ID: z.string().optional(),

//   // Payments
//   STRIPE_SECRET_KEY: z.string().min(1),
//   STRIPE_WEBHOOK_SECRET: z.string().min(1),
//   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().min(1),
//   PAYPAL_CLIENT_ID: z.string().min(1),
//   PAYPAL_CLIENT_SECRET: z.string().min(1),

//   // Rate Limiting
//   RATE_LIMIT_REQUESTS: z.coerce.number().default(100),
//   RATE_LIMIT_TIME_WINDOW: z.coerce.number().default(60),
// })

// export const env = envSchema.parse(process.env)
