import { Octokit } from "@octokit/rest"

interface PublishToGitHubParams {
  packageName: string
  packageCode: string
  packageDescription: string
  documentation: string
  githubToken: string
  userName: string
}

export async function publishToGitHubRepo({
  packageName,
  packageCode,
  packageDescription,
  documentation,
  githubToken,
  userName,
}: PublishToGitHubParams) {
  try {
    const octokit = new Octokit({
      auth: githubToken,
    })

    // Create repository
    const { data: repo } = await octokit.repos.createForAuthenticatedUser({
      name: packageName,
      description: packageDescription,
      auto_init: true,
    })

    // Create package.json
    const packageJson = {
      name: packageName,
      version: "0.1.0",
      description: packageDescription,
      main: "index.js",
      scripts: {
        test: 'echo "Error: no test specified" && exit 1',
      },
      keywords: [],
      author: userName,
      license: "MIT",
    }

    // Create files
    await Promise.all([
      // Create package.json
      octokit.repos.createOrUpdateFileContents({
        owner: repo.owner.login,
        repo: packageName,
        path: "package.json",
        message: "Add package.json",
        content: Buffer.from(JSON.stringify(packageJson, null, 2)).toString("base64"),
      }),

      // Create index.js
      octokit.repos.createOrUpdateFileContents({
        owner: repo.owner.login,
        repo: packageName,
        path: "index.js",
        message: "Add index.js",
        content: Buffer.from(packageCode).toString("base64"),
      }),

      // Create README.md
      octokit.repos.createOrUpdateFileContents({
        owner: repo.owner.login,
        repo: packageName,
        path: "README.md",
        message: "Add README.md",
        content: Buffer.from(documentation).toString("base64"),
      }),

      // Create .gitignore
      octokit.repos.createOrUpdateFileContents({
        owner: repo.owner.login,
        repo: packageName,
        path: ".gitignore",
        message: "Add .gitignore",
        content: Buffer.from("node_modules\n.DS_Store\n.env\n").toString("base64"),
      }),
    ])

    return {
      success: true,
      repoUrl: repo.html_url,
    }
  } catch (error) {
    console.error("Error publishing to GitHub:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to publish to GitHub",
    }
  }
}
