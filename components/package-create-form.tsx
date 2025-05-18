"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { Card, CardContent } from "@/components/ui/card"
import { createPackage } from "@/app/actions/packages/create"
import { checkPackageName } from "@/app/actions/packages/check-name"
import { getCurrentUser } from "@/lib/session"
import { checkSubscriptionLimit } from "@/lib/subscription"

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Package name is required")
    .regex(
      /^[a-z0-9-_.]+$/,
      "Package name can only contain lowercase letters, numbers, hyphens, dots, and underscores",
    ),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters"),
  framework: z.string().min(1, "Framework is required"),
  aiModel: z.string().min(1, "AI model is required"),
  prompt: z
    .string()
    .min(20, "Prompt must be at least 20 characters")
    .max(2000, "Prompt must be less than 2000 characters"),
})

export function PackageCreateForm({ user }: { user: any }) {
  const router = useRouter()
  const [isCheckingName, setIsCheckingName] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  if (!user) {
    toast("Error", {
      description: "You must be logged in to create a package.",
    })
    return null
  }





  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      framework: "",
      aiModel: "gpt4o",
      prompt: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {

    try {
      setIsGenerating(true)

      // Check subscription limit
      const canCreate = await checkSubscriptionLimit(user.id, values.aiModel)

      if (!canCreate) {
        toast( "Error", {
          description: "You have reached your package creation limit. Please upgrade your subscription.",
        })
        setIsGenerating(false)
        return
      }

      // Check if package name is available
      const nameCheck = await checkPackageName(values.name)

      if (!nameCheck.available) {
        form.setError("name", {
          type: "manual",
          message: "Package name is already taken",
        })
        setIsGenerating(false)
        return
      }

      // Create package
      const result = await createPackage(values)

      console.log("Package creation result:", result)

      if (result.error) {
        toast( "Error", {
          description: result.error,
        })
        return
      }
 
      toast( "Success", {
        description: "Package created successfully",
      })

      router.push(`/packages/${result.packageId}`)
    } catch (error) {

      console.error("Error creating package:", error)
      toast( "Error", {
        description: "Failed to create package",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleNameCheck = async (name: string) => {
    if (!name) return

    try {
      setIsCheckingName(true)
      const result = await checkPackageName(name)

      if (!result.available) {
        form.setError("name", {
          type: "manual",
          message: "Package name is already taken",
        })
      } else {
        form.clearErrors("name")
      }
    } catch (error) {
      console.error("Error checking package name:", error)
    } finally {
      setIsCheckingName(false)
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Package Name</FormLabel>
                  <FormControl>
                    <div className="flex items-center space-x-2">
                      <Input
                        placeholder="my-awesome-package"
                        {...field}
                        onBlur={(e) => {
                          field.onBlur()
                          handleNameCheck(e.target.value)
                        }}
                      />
                      {isCheckingName && <Loader2 className="h-4 w-4 animate-spin" />}
                    </div>
                  </FormControl>
                  <FormDescription>The name of your NPM package</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="A brief description of your package" {...field} />
                  </FormControl>
                  <FormDescription>A short description of your package</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="framework"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Framework</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select framework" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="react">React</SelectItem>
                        <SelectItem value="nextjs">Next.js</SelectItem>
                        <SelectItem value="vue">Vue</SelectItem>
                        <SelectItem value="svelte">Svelte</SelectItem>
                        <SelectItem value="angular">Angular</SelectItem>
                        <SelectItem value="node">Node.js</SelectItem>
                        <SelectItem value="vanilla">Vanilla JS</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The framework your package will be used with</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="aiModel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>AI Model</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select AI model" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="gpt4o">GPT-4o (OpenAI)</SelectItem>
                        <SelectItem value="claude">Claude (Anthropic)</SelectItem>
                        <SelectItem value="deepseek">DeepSeek</SelectItem>
                        <SelectItem value="groq">Groq</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>The AI model to use for generating your package</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prompt</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the package you want to create in detail..."
                      className="min-h-[200px]"
                      {...field}
                    />
                  </FormControl>

                  <FormDescription>Describe the functionality, features, and purpose of your package</FormDescription>
                  <FormMessage /> 
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Package"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
