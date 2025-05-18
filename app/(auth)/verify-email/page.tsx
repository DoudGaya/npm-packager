"use client"

import { useEffect, useState, Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

// Content component that uses useSearchParams
function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [isVerifying, setIsVerifying] = useState(true)
  const [isVerified, setIsVerified] = useState(false)

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setIsVerifying(false)
        return
      }

      try {
        // In a real implementation, this would call a server action to verify the email
        await new Promise((resolve) => setTimeout(resolve, 1500))

        setIsVerified(true)
        toast({
          title: "Email Verified",
          description: "Your email has been verified successfully.",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to verify email. The token may be invalid or expired.",
          variant: "destructive",
        })
      } finally {
        setIsVerifying(false)
      }
    }

    verifyEmail()
  }, [token])

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Email Verification</CardTitle>
        <CardDescription>Verify your email address to complete registration</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          {isVerifying ? (
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin" />
              <p className="text-sm text-muted-foreground">Verifying your email...</p>
            </div>
          ) : isVerified ? (
            <div className="text-center">
              <p className="mb-2">Email verified successfully!</p>
              <p className="text-sm text-muted-foreground">You can now log in to your account.</p>
            </div>
          ) : (
            <div className="text-center">
              <p className="mb-2">Verification failed</p>
              <p className="text-sm text-muted-foreground">
                The verification link may be invalid or expired. Please request a new verification email.
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button asChild variant={isVerified ? "default" : "outline"}>
          <Link href="/login">Go to Login</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// Main page component
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
