import GroqChat from "groq-sdk"
import { env } from "@/lib/env"

// Initialize the Groq client
export const groqClient = new GroqChat({
  apiKey: env.GROQ_API_KEY,
})

// Define the available models
export const groqModels = {
  llama3: "llama3-8b-8192",
  mixtral: "mixtral-8x7b-32768",
  gemma: "gemma-7b-it",
  gpt4o: "gpt4o-8b-8192",
}

// Helper function to generate package code using Groq
export async function generateWithGroq({
  prompt,
  model = "llama3",
  systemPrompt,
}: {
  prompt: string
  model?: keyof typeof groqModels
  systemPrompt?: string
}) {
  try {
    const completion = await groqClient.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt || "You are an expert JavaScript developer specializing in creating NPM packages.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: groqModels[model],
      temperature: 0.7,
      max_tokens: 8000,
      top_p: 1,
    })

    return completion.choices[0]?.message?.content || ""
  } catch (error) {
    console.error("Error generating with Groq:", error)
    throw new Error("Failed to generate content with Groq")
  }
}

// Helper function to parse package response
export function parsePackageResponse(response: string) {
  try {
    const trimmedResponse = response.trim()
    if (trimmedResponse.startsWith("```json") && trimmedResponse.endsWith("```")) {
      const jsonContent = trimmedResponse.slice(6, -3).trim()
      return JSON.parse(jsonContent)
    }
    return JSON.parse(trimmedResponse)
  } catch (error) {
    console.error("Error parsing package response:", error)
    throw new Error("Failed to parse package response")
  }
}
