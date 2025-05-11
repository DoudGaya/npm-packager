import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Package, Sparkles, Zap } from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="w-full h-[90vh] items-center justify-center flex py-12 md:py-24 dark:bg-black lg:py-32 xl:py-48 ">
        <div className="container mx-auto px-4 md:px-6">
          <div className=" flex items-center justify-center text-center">
          {/* <div className="grid gap-6 lg:grid-cols-2 dark:bg-black lg:gap-12 xl:grid-cols-2"> */}
            <div className="flex flex-col w-full max-w-4xl items-center justify-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold max-w-[600px] mx-auto text-primary tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Create and Deploy NPM Packages with AI
                </h1>
                <p className=" text-muted-foreground md:text-xl">
                  NPM-Packager helps you build, document, and publish NPM packages in minutes using AI. Save time and
                  focus on what matters.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Link href="/register">
                  <Button size="lg" className="gap-1">
                    Get Started
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/features">
                  <Button size="lg" className=" border-primary text-primary" variant="outline">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            {/* <div className="hidden lg:block">
              <div className="relative h-full">
                <div className="absolute inset-0 bg-gradient-to-r from-black to-transparent z-10"></div>
                <img
                  src="/dark-theme-package-generation.png"
                  alt="NPM-Packager Dashboard"
                  className="w-full h-auto rounded-lg shadow-2xl"
                />
              </div>
            </div> */}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full dark:bg-black py-12 md:py-24 lg:py-32 bg-background">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-primary/10 text-primary px-3 py-1 text-sm">Key Features</div>
              <h2 className="text-3xl font-bold text-primary tracking-tighter sm:text-5xl">Everything You Need</h2>
              <p className="max-w-[900px] text-secondary md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                NPM-Packager provides all the tools you need to create, manage, and publish NPM packages.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl text-primary grid-cols-1 gap-6 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-2 rounded-lg  shadow-sm">
              <div className="rounded-full bg-primary p-2">
                <Sparkles className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">AI Package Generator</h3>
              <p className="text-center text-muted-foreground">
                Describe your package and let AI generate the complete code and documentation.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg  shadow-sm">
              <div className="rounded-full bg-primary p-2">
                <Zap className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">One-Click Publishing</h3>
              <p className="text-center text-muted-foreground">
                Publish your packages to NPM and GitHub with a single click.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2 rounded-lg  shadow-sm">
              <div className="rounded-full bg-primary p-2">
                <Package className="h-6 w-6 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-bold">Package Management</h3>
              <p className="text-center text-muted-foreground">
                Organize and manage all your packages in one place with detailed analytics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full bg-stone-950 text-primary py-12 md:py-24 lg:py-32">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
              <p className="max-w-[900px] text-secondary md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Create and publish NPM packages in three simple steps.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 py-12 md:grid-cols-3">
            <div className="flex flex-col items-center space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                1
              </div>
              <h3 className="text-xl font-bold">Describe Your Package</h3>
              <p className="text-center text-muted-foreground">
                Provide a description of your package, select frameworks, and choose an AI model.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                2
              </div>
              <h3 className="text-xl font-bold">Generate Code</h3>
              <p className="text-center text-muted-foreground">
                Our AI generates the complete package code and documentation based on your description.
              </p>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground">
                3
              </div>
              <h3 className="text-xl font-bold">Publish Your Package</h3>
              <p className="text-center text-muted-foreground">
                Review the generated code and publish your package to NPM and GitHub with one click.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 dark:bg-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter text-primary sm:text-5xl">What Our Users Say</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Hear from developers who use NPM-Packager to streamline their workflow.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-between rounded-lg border p-6 border-primary shadow-sm">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  "NPM-Packager has completely transformed how I create and publish packages. What used to take days now
                  takes minutes."
                </p>
              </div>
              <div className="flex items-center space-x-4 pt-4">
                <div className="rounded-full bg-muted h-10 w-10"></div>
                <div>
                  <p className="text-sm font-medium">Alex Johnson</p>
                  <p className="text-sm text-muted-foreground">Senior Developer</p>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-between rounded-lg border p-6 border-primary shadow-sm">
              <div className="space-y-2">
                <p className="text-muted-foreground">
                  "The AI-generated code is surprisingly good. It saved me countless hours of boilerplate writing and
                  documentation."
                </p>
              </div>
              <div className="flex items-center space-x-4 pt-4">
                <div className="rounded-full bg-muted h-10 w-10"></div>
                <div>
                  <p className="text-sm font-medium">Sarah Miller</p>
                  <p className="text-sm text-muted-foreground">Frontend Engineer</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 dark:bg-black">
        <div className="container mx-auto px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-primary tracking-tighter sm:text-5xl">Ready to Get Started?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of developers who use NPM-Packager to streamline their workflow.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Link href="/register">
                <Button size="lg" className="gap-1">
                  Sign Up Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
