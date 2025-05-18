import type { Metadata } from "next"
import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "Documentation | NPM-Packager",
  description: "Learn how to use NPM-Packager to create and publish NPM packages",
}

export default function DocumentationPage() {
  return (
    <div className="container mx-auto py-12 md:py-24 lg:py-32">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Documentation</h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Learn how to use NPM-Packager to create and publish NPM packages
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl py-12">
        <Tabs defaultValue="getting-started" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="getting-started">Getting Started</TabsTrigger>
            <TabsTrigger value="creating-packages">Creating Packages</TabsTrigger>
            <TabsTrigger value="publishing">Publishing</TabsTrigger>
            <TabsTrigger value="api">API</TabsTrigger>
          </TabsList>

          {/* Getting Started */}
          <TabsContent value="getting-started" className="space-y-8 pt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Getting Started with NPM-Packager</h2>
              <p className="text-muted-foreground">
                NPM-Packager is a platform that helps you create, manage, and publish NPM packages using AI. This guide
                will help you get started with the platform.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Creating an Account</h3>
              <p className="text-muted-foreground">
                To use NPM-Packager, you need to create an account. You can sign up using your email address or GitHub
                account.
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>
                  Go to the{" "}
                  <Link href="/register" className="text-primary hover:underline">
                    registration page
                  </Link>
                  .
                </li>
                <li>
                  Enter your name, email address, and password, or click "Continue with GitHub" to sign up with your
                  GitHub account.
                </li>
                <li>
                  If you sign up with email, you'll receive a verification email. Click the link in the email to verify
                  your account.
                </li>
                <li>Once your account is verified, you can log in to NPM-Packager.</li>
              </ol>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Dashboard Overview</h3>
              <p className="text-muted-foreground">
                After logging in, you'll be taken to your dashboard. Here's what you'll find:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Dashboard:</strong> Overview of your packages, usage statistics, and recent activity.
                </li>
                <li>
                  <strong>Create Package:</strong> Create a new NPM package using AI.
                </li>
                <li>
                  <strong>My Packages:</strong> View and manage your existing packages.
                </li>
                <li>
                  <strong>Settings:</strong> Manage your account settings, subscription, and API keys.
                </li>
                <li>
                  <strong>Wallet:</strong> Manage your credits and transactions.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Subscription Plans</h3>
              <p className="text-muted-foreground">NPM-Packager offers three subscription plans:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Free:</strong> 5 packages per month, GPT-4o access (10 prompts/day), GitHub publishing, basic
                  package analytics.
                </li>
                <li>
                  <strong>Pro:</strong> Unlimited packages, all AI models, NPM and GitHub publishing, advanced package
                  analytics, priority support.
                </li>
                <li>
                  <strong>Team:</strong> Everything in Pro, plus 5 team members, team collaboration features, advanced
                  permissions, dedicated support.
                </li>
              </ul>
              <p className="text-muted-foreground">
                You can upgrade your subscription plan at any time from the{" "}
                <Link href="/settings/subscription" className="text-primary hover:underline">
                  Subscription page
                </Link>
                .
              </p>
            </div>

            <div className="mt-8">
              <Button asChild>
                <Link href="/register">
                  Get Started
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>

          {/* Creating Packages */}
          <TabsContent value="creating-packages" className="space-y-8 pt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Creating Packages</h2>
              <p className="text-muted-foreground">
                NPM-Packager makes it easy to create NPM packages using AI. This guide will walk you through the process
                of creating a package.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Creating a New Package</h3>
              <p className="text-muted-foreground">To create a new package, follow these steps:</p>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Click on "Create Package" in the sidebar or the "New Package" button on the dashboard.</li>
                <li>
                  Fill out the package creation form:
                  <ul className="list-disc pl-6 mt-2 space-y-1">
                    <li>
                      <strong>Package Name:</strong> A unique name for your package. This will be the name used when
                      publishing to NPM.
                    </li>
                    <li>
                      <strong>Description:</strong> A brief description of your package.
                    </li>
                    <li>
                      <strong>Framework:</strong> The framework your package will be used with (React, Next.js, Vue,
                      etc.).
                    </li>
                    <li>
                      <strong>AI Model:</strong> The AI model to use for generating your package.
                    </li>
                    <li>
                      <strong>Prompt:</strong> A detailed description of the functionality, features, and purpose of
                      your package.
                    </li>
                  </ul>
                </li>
                <li>Click "Generate Package" to create your package.</li>
                <li>The AI will generate the code and documentation for your package based on your prompt.</li>
                <li>Once the package is generated, you'll be taken to the package details page.</li>
              </ol>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Package Details</h3>
              <p className="text-muted-foreground">
                The package details page shows information about your package, including:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Package Name:</strong> The name of your package.
                </li>
                <li>
                  <strong>Description:</strong> The description of your package.
                </li>
                <li>
                  <strong>Version:</strong> The current version of your package.
                </li>
                <li>
                  <strong>Framework:</strong> The framework your package is designed for.
                </li>
                <li>
                  <strong>Status:</strong> The current status of your package (draft, published, archived).
                </li>
                <li>
                  <strong>Created:</strong> The date your package was created.
                </li>
                <li>
                  <strong>Updated:</strong> The date your package was last updated.
                </li>
                <li>
                  <strong>AI Model:</strong> The AI model used to generate your package.
                </li>
                <li>
                  <strong>Repository:</strong> The GitHub repository URL (if published to GitHub).
                </li>
                <li>
                  <strong>NPM:</strong> The NPM package URL (if published to NPM).
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Package Documentation and Code</h3>
              <p className="text-muted-foreground">
                The package details page also includes tabs for viewing the package documentation and code:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>Documentation:</strong> The generated documentation for your package, including installation
                  instructions, usage examples, and API reference.
                </li>
                <li>
                  <strong>Code:</strong> The generated code for your package. You can copy the code to use in your own
                  projects.
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">AI Models</h3>
              <p className="text-muted-foreground">NPM-Packager supports several AI models for package generation:</p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>
                  <strong>GPT-4o (OpenAI):</strong> Available on all plans. Free tier users get 10 prompts per day.
                </li>
                <li>
                  <strong>Claude (Anthropic):</strong> Available on Pro and Team plans.
                </li>
                <li>
                  <strong>DeepSeek:</strong> Available on Pro and Team plans.
                </li>
                <li>
                  <strong>Groq:</strong> Available on Pro and Team plans.
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <Button asChild>
                <Link href="/create">
                  Create a Package
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>

          {/* Publishing */}
          <TabsContent value="publishing" className="space-y-8 pt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">Publishing Packages</h2>
              <p className="text-muted-foreground">
                NPM-Packager makes it easy to publish your packages to GitHub and NPM. This guide will walk you through
                the process of publishing a package.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Publishing to GitHub</h3>
              <p className="text-muted-foreground">To publish your package to GitHub, follow these steps:</p>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Go to the package details page for the package you want to publish.</li>
                <li>Click the "Publish to GitHub" button.</li>
                <li>If you haven't connected your GitHub account, you'll be prompted to do so in the settings.</li>
                <li>NPM-Packager will create a new GitHub repository for your package and push the code to it.</li>
                <li>
                  Once the package is published, the repository URL will be displayed on the package details page.
                </li>
              </ol>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Publishing to NPM</h3>
              <p className="text-muted-foreground">To publish your package to NPM, follow these steps:</p>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>Go to the package details page for the package you want to publish.</li>
                <li>Click the "Publish to NPM" button.</li>
                <li>If you haven't connected your NPM account, you'll be prompted to do so in the settings.</li>
                <li>NPM-Packager will publish your package to the NPM registry.</li>
                <li>
                  Once the package is published, the NPM package URL will be displayed on the package details page.
                </li>
              </ol>
              <p className="text-muted-foreground">Note: Publishing to NPM is only available on Pro and Team plans.</p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Connecting Your Accounts</h3>
              <p className="text-muted-foreground">
                To publish packages to GitHub and NPM, you need to connect your accounts:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-muted-foreground">
                <li>
                  Go to the{" "}
                  <Link href="/settings" className="text-primary hover:underline">
                    Settings page
                  </Link>
                  .
                </li>
                <li>Click on the "Account" tab.</li>
                <li>Enter your GitHub token and NPM token in the respective fields.</li>
                <li>Click "Save Changes" to save your tokens.</li>
              </ol>
              <p className="text-muted-foreground">
                You can generate a GitHub token from the{" "}
                <a
                  href="https://github.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  GitHub tokens page
                </a>{" "}
                and an NPM token from the{" "}
                <a
                  href="https://www.npmjs.com/settings/tokens"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  NPM tokens page
                </a>
                .
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Package Versions</h3>
              <p className="text-muted-foreground">
                NPM-Packager automatically creates a new version of your package when you publish it. The initial
                version is 0.1.0.
              </p>
              <p className="text-muted-foreground">
                You can view the version history of your package on the package details page.
              </p>
            </div>

            <div className="mt-8">
              <Button asChild>
                <Link href="/packages">
                  View Your Packages
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>

          {/* API */}
          <TabsContent value="api" className="space-y-8 pt-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-bold">API Reference</h2>
              <p className="text-muted-foreground">
                NPM-Packager provides a RESTful API for programmatic access to your packages. This guide will help you
                get started with the API.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Authentication</h3>
              <p className="text-muted-foreground">
                To use the API, you need to authenticate using an API key. You can generate an API key from the{" "}
                <Link href="/settings/api-keys" className="text-primary hover:underline">
                  API Keys page
                </Link>
                .
              </p>
              <p className="text-muted-foreground">
                Include your API key in the <code>Authorization</code> header of your requests:
              </p>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>Authorization: Bearer YOUR_API_KEY</code>
              </pre>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Base URL</h3>
              <p className="text-muted-foreground">All API requests should be made to the following base URL:</p>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>https://api.npmpackager.com/v1</code>
              </pre>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Endpoints</h3>
              <p className="text-muted-foreground">The API provides the following endpoints:</p>

              <Card>
                <CardHeader>
                  <CardTitle>GET /packages</CardTitle>
                  <CardDescription>Get a list of your packages</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Returns a list of all your packages.</p>
                  <h4 className="font-bold mt-4">Query Parameters</h4>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      <code>page</code> (optional): Page number (default: 1)
                    </li>
                    <li>
                      <code>limit</code> (optional): Number of packages per page (default: 10)
                    </li>
                    <li>
                      <code>status</code> (optional): Filter by status (draft, published, archived)
                    </li>
                    <li>
                      <code>framework</code> (optional): Filter by framework
                    </li>
                  </ul>
                  <h4 className="font-bold mt-4">Example Response</h4>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`{
  "packages": [
    {
      "id": "package_id",
      "name": "package-name",
      "description": "Package description",
      "status": "DRAFT",
      "framework": "react",
      "version": "0.1.0",
      "createdAt": "2023-01-01T00:00:00.000Z",
      "updatedAt": "2023-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}`}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>GET /packages/:id</CardTitle>
                  <CardDescription>Get a specific package</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Returns details for a specific package.</p>
                  <h4 className="font-bold mt-4">Path Parameters</h4>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      <code>id</code>: Package ID
                    </li>
                  </ul>
                  <h4 className="font-bold mt-4">Example Response</h4>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`{
  "id": "package_id",
  "name": "package-name",
  "description": "Package description",
  "status": "DRAFT",
  "framework": "react",
  "version": "0.1.0",
  "code": "// Package code",
  "documentation": "# Package documentation",
  "createdAt": "2023-01-01T00:00:00.000Z",
  "updatedAt": "2023-01-01T00:00:00.000Z",
  "repository": null,
  "npmUrl": null
}`}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>POST /packages</CardTitle>
                  <CardDescription>Create a new package</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Creates a new package.</p>
                  <h4 className="font-bold mt-4">Request Body</h4>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      <code>name</code>: Package name
                    </li>
                    <li>
                      <code>description</code>: Package description
                    </li>
                    <li>
                      <code>framework</code>: Framework (react, nextjs, vue, svelte, angular, node, vanilla)
                    </li>
                    <li>
                      <code>aiModel</code>: AI model (gpt4o, claude, deepseek, groq)
                    </li>
                    <li>
                      <code>prompt</code>: Prompt for the AI
                    </li>
                  </ul>
                  <h4 className="font-bold mt-4">Example Request</h4>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`{
                    "name": "my-awesome-package",
                    "description": "An awesome package",
                    "framework": "react",
                    "aiModel": "gpt4o",
                    "prompt": "Create a React component that displays a counter with increment and decrement buttons."
                    }`}</code>
                  </pre>
                  <h4 className="font-bold mt-4">Example Response</h4>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`{
  "success": true,
  "packageId": "package_id"
}`}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>POST /packages/:id/publish/github</CardTitle>
                  <CardDescription>Publish a package to GitHub</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Publishes a package to GitHub.</p>
                  <h4 className="font-bold mt-4">Path Parameters</h4>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      <code>id</code>: Package ID
                    </li>
                  </ul>
                  <h4 className="font-bold mt-4">Example Response</h4>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`{
  "success": true,
  "repoUrl": "https://github.com/username/my-awesome-package"
}`}</code>
                  </pre>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>POST /packages/:id/publish/npm</CardTitle>
                  <CardDescription>Publish a package to NPM</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">Publishes a package to NPM.</p>
                  <h4 className="font-bold mt-4">Path Parameters</h4>
                  <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                    <li>
                      <code>id</code>: Package ID
                    </li>
                  </ul>
                  <h4 className="font-bold mt-4">Example Response</h4>
                  <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                    <code>{`{
  "success": true,
  "npmUrl": "https://www.npmjs.com/package/my-awesome-package"
}`}</code>
                  </pre>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Rate Limiting</h3>
              <p className="text-muted-foreground">
                The API is rate limited to 100 requests per minute per API key. If you exceed this limit, you'll receive
                a 429 Too Many Requests response.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-bold">Error Handling</h3>
              <p className="text-muted-foreground">
                The API returns standard HTTP status codes to indicate the success or failure of a request. In case of
                an error, the response body will include an error message.
              </p>
              <h4 className="font-bold mt-4">Example Error Response</h4>
              <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                <code>{`{
  "error": "Invalid package name"
}`}</code>
              </pre>
            </div>

            <div className="mt-8">
              <Button asChild>
                <Link href="/settings/api-keys">
                  Manage API Keys
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <div className="mx-auto max-w-5xl space-y-8 mt-12">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Need Help?</h2>
          <p className="text-muted-foreground">If you need help with NPM-Packager, you can:</p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>
              Check the{" "}
              <Link href="/docs" className="text-primary hover:underline">
                documentation
              </Link>{" "}
              for more information.
            </li>
            <li>
              Contact us at{" "}
              <a href="mailto:support@npmpackager.com" className="text-primary hover:underline">
                support@npmpackager.com
              </a>
              .
            </li>
            <li>
              Join our{" "}
              <a
                href="https://discord.gg/npmpackager"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                Discord community
              </a>{" "}
              for help from other users.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
