"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import type { User } from "@prisma/client"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { toast } from "@/components/ui/use-toast"
import { updateAccount } from "@/app/actions/auth/update-account"
import {toast} from 'sonner'

const accountFormSchema = z.object({
  twoFactorEnabled: z.boolean(),
  npmToken: z.string().optional(),
  githubToken: z.string().optional(),
})

interface AccountFormProps {
  user: Pick<User, "id" | "twoFactorEnabled" | "npmToken" | "githubToken">
}

export function AccountForm({ user }: AccountFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof accountFormSchema>>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: {
      twoFactorEnabled: user.twoFactorEnabled,
      npmToken: user.npmToken || "",
      githubToken: user.githubToken || "",
    },
  })

  const onSubmit = async (values: z.infer<typeof accountFormSchema>) => {
    try {
      setIsLoading(true)
      
      const result = await updateAccount(values)
      
      if (result.error) {
      toast("Success", {
        description: result.error,
      })
        return
      }

      toast("Success", {
        description: "Account settings updated successfully"
      })
    } catch (error) {
    toast("Error", {
        description: "Account settings updated successfully"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Manage your account settings and connected services</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="twoFactorEnabled"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Two-Factor Authentication</FormLabel>
                    <FormDescription>Enhance your account security with two-factor authentication.</FormDescription>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="npmToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>NPM Token</FormLabel>
                  <FormControl>
                    <Input placeholder="npm_xxxxxxxxxxxxxxxx" {...field} type="password" />
                  </FormControl>
                  <FormDescription>Your NPM token for publishing packages.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="githubToken"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>GitHub Token</FormLabel>
                  <FormControl>
                    <Input placeholder="ghp_xxxxxxxxxxxxxxxx" {...field} type="password" />
                  </FormControl>
                  <FormDescription>Your GitHub token for repository creation and code pushing.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}
