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
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { UserAvatar } from "@/components/user-avatar"
import { updateProfile } from "@/app/actions/auth/update-profile"

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
})

interface ProfileFormProps {
  user: Pick<User, "id" | "name" | "email" | "image" | "bio">
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: user.name || "",
      email: user.email || "",
      bio: user.bio || "",
    },
  })

  const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
    try {
      setIsLoading(true)

      // Create FormData object
      const formData = new FormData()
      formData.append("name", values.name)
      formData.append("email", values.email)
      formData.append("bio", values.bio || "")

      const result = await updateProfile(formData)

      if (result.error) {
        toast({
          title: "Error",
          description: result.error,
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Manage your profile information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-4 mb-6">
          <UserAvatar user={user} className="h-16 w-16" />
          <div>
            <p className="text-sm text-muted-foreground">
              Your avatar is synced with {user.email ? "your email via Gravatar" : "your GitHub account"}
            </p>
          </div>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormDescription>This is your public display name.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="example@example.com" {...field} />
                  </FormControl>
                  <FormDescription>This is your email address.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Tell us about yourself" className="resize-none" {...field} />
                  </FormControl>
                  <FormDescription>Brief description for your profile.</FormDescription>
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


// "use client"

// import { useState } from "react"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import type { User } from "@prisma/client"
// import { Loader2 } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { toast } from "@/components/ui/use-toast"
// import { UserAvatar } from "@/components/user-avatar"

// const profileFormSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   email: z.string().email("Invalid email address"),
//   bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
// })

// interface ProfileFormProps {
//   user: Pick<User, "id" | "name" | "email" | "image">
// }

// export function ProfileForm({ user }: ProfileFormProps) {
//   const [isLoading, setIsLoading] = useState(false)

//   const form = useForm<z.infer<typeof profileFormSchema>>({
//     resolver: zodResolver(profileFormSchema),
//     defaultValues: {
//       name: user.name || "",
//       email: user.email || "",
//       bio: "",
//     },
//   })

//   const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
//     try {
//       setIsLoading(true)

//       // In a real implementation, this would call a server action to update the profile
//       await new Promise((resolve) => setTimeout(resolve, 1000))

//       toast({
//         title: "Success",
//         description: "Profile updated successfully",
//       })
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update profile",
//         variant: "destructive",
//       })
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Profile</CardTitle>
//         <CardDescription>Manage your profile information</CardDescription>
//       </CardHeader>
//       <CardContent>
//         <div className="flex items-center space-x-4 mb-6">
//           <UserAvatar user={user} className="h-16 w-16" />
//           <div>
//             <p className="text-sm text-muted-foreground">
//               Your avatar is synced with {user.email ? "your email via Gravatar" : "your GitHub account"}
//             </p>
//           </div>
//         </div>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//             <FormField
//               control={form.control}
//               name="name"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Name</FormLabel>
//                   <FormControl>
//                     <Input placeholder="John Doe" {...field} />
//                   </FormControl>
//                   <FormDescription>This is your public display name.</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="email"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Email</FormLabel>
//                   <FormControl>
//                     <Input placeholder="example@example.com" {...field} />
//                   </FormControl>
//                   <FormDescription>This is your email address.</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="bio"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Bio</FormLabel>
//                   <FormControl>
//                     <Textarea placeholder="Tell us about yourself" className="resize-none" {...field} />
//                   </FormControl>
//                   <FormDescription>Brief description for your profile.</FormDescription>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//             <Button type="submit" disabled={isLoading}>
//               {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//               Save Changes
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   )
// }


// "use client"

// import { useState } from "react"
// import { zodResolver } from "@hookform/resolvers/zod"
// import { useForm } from "react-hook-form"
// import { z } from "zod"
// import type { User } from "@prisma/client"
// import { Form } from "@/components/ui/form"
// import { toast } from "@/components/ui/use-toast"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { updateProfile } from "@/app/actions/auth/update-profile"

// const profileFormSchema = z.object({
//   name: z.string().min(1, "Name is required"),
//   email: z.string().email("Invalid email address"),
// })

// interface ProfileFormProps {
//   user: Pick<User, "id" | "name" | "email" | "image">
// }

// export function ProfileForm({ user }: ProfileFormProps) {
//   const [isLoading, setIsLoading] = useState(false);

//   const form = useForm<z.infer<typeof profileFormSchema>>({
//     resolver: zodResolver(profileFormSchema),
//     defaultValues: {
//       name: user.name || "",
//       email: user.email || "",
//     },
//   });

//   const onSubmit = async (values: z.infer<typeof profileFormSchema>) => {
//     try {
//       setIsLoading(true);
//       const result = await updateProfile(values);
      
//       if (result.error) {
//         toast({
//           title: "Error",
//           description: result.error,
//           variant: "destructive",
//         });
//         return;
//       }
      
//       toast({
//         title: "Success",
//         description: "Profile updated successfully",
//       });
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "Failed to update profile",
//         variant: "destructive",
//       });
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Profile</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form
//             onSubmit={form.handleSubmit(onSubmit)}
//             className="space-y-8"\
