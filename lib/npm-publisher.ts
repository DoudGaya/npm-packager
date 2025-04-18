import fs from "fs"
import path from "path"
import { exec } from "child_process"
import { promisify } from "util"
import os from "os"
import { randomUUID } from "crypto"

const execAsync = promisify(exec)

interface PublishToNpmParams {
  packageName: string
  packageVersion: string
  packageCode: string
  packageDescription: string
  npmToken: string
}

export async function publishToNpmRegistry({
  packageName,
  packageVersion,
  packageCode,
  packageDescription,
  npmToken,
}: PublishToNpmParams) {
  try {
    // Create a temporary directory
    const tempDir = path.join(os.tmpdir(), `npm-package-${randomUUID()}`)
    await fs.promises.mkdir(tempDir, { recursive: true })

    // Create package.json
    const packageJson = {
      name: packageName,
      version: packageVersion,
      description: packageDescription,
      main: "index.js",
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
      },
      keywords: [],
      author: "",
      license: "MIT",
    }

    await fs.promises.writeFile(path.join(tempDir, "package.json"), JSON.stringify(packageJson, null, 2))

    // Create index.js with the package code
    await fs.promises.writeFile(path.join(tempDir, "index.js"), packageCode)

    // Create .npmrc with the token
    await fs.promises.writeFile(path.join(tempDir, ".npmrc"), `//registry.npmjs.org/:_authToken=${npmToken}`)

    // Create README.md
    await fs.promises.writeFile(path.join(tempDir, "README.md"), `# ${packageName}\n\n${packageDescription}`)

    // Publish to NPM
    const { stdout, stderr } = await execAsync("npm publish", {
      cwd: tempDir,
    })

    // Clean up
    await fs.promises.rm(tempDir, { recursive: true, force: true })

    if (stderr && stderr.includes("ERR!")) {
      return {
        success: false,
        error: stderr,
      }
    }

    return {
      success: true,
      output: stdout,
    }
  } catch (error) {
    console.error("Error publishing to NPM:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to publish to NPM",
    }
  }
}
