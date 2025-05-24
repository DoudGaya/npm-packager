"use client"

import { Suspense } from "react"
import { LoginContent } from "./Login"



// Main page component
export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
