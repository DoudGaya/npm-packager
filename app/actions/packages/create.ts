"use server"

import { z } from "zod"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { getCurrentUser } from "@/lib/session"
import { PackageStatus } from "@prisma/client"

const packageSchema = z.object({
  name: z.string().min(1, "Package name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  framework: z.string().min(1, "Framework is required"),
  aiModel: z.string().min(1, "AI model is required"),
  prompt: z.string().min(20, "Prompt must be at least 20 characters"),
})

export async function createPackage(formData: FormData) {
  const validatedFields = packageSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    framework: formData.get("framework"),
    aiModel: formData.get("aiModel"),
    prompt: formData.get("prompt"),
  })

  if (!validatedFields.success) {
    return {
      error: "Invalid fields",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { name, description, framework, aiModel, prompt } = validatedFields.data

  const user = await getCurrentUser()

  if (!user) {
    return {
      error: "Unauthorized",
    }
  }

  try {
    // Check subscription limits for package creation
    const monthStart = new Date()
    monthStart.setDate(1)
    monthStart.setHours(0, 0, 0, 0)

    const nextMonth = new Date(monthStart)
    nextMonth.setMonth(nextMonth.getMonth() + 1)

    const packageCount = await db.package.count({
      where: {
        userId: user.id,
        createdAt: {
          gte: monthStart,
          lt: nextMonth,
        },
      },
    })

    const subscriptionDetails = await db.user.findUnique({
      where: { id: user.id },
      select: { subscriptionPlan: true },
    })

    const plan = subscriptionDetails?.subscriptionPlan || "FREE"
    const packageLimit = plan === "FREE" ? 5 : Number.POSITIVE_INFINITY

    if (packageCount >= packageLimit) {
      return {
        error: `You've reached your monthly limit of ${packageLimit} packages. Upgrade your plan to create more.`,
      }
    }

    // Generate mock code and documentation based on the prompt
    // In a real implementation, this would call an AI service
    const code = generateMockCode(name, description, framework)
    const documentation = generateMockDocumentation(name, description)

    // Create package in database
    const newPackage = await db.package.create({
      data: {
        name,
        description,
        framework,
        aiModel,
        code,
        documentation,
        userId: user.id,
        status: PackageStatus.DRAFT,
      },
    })

    // Create initial version
    await db.packageVersion.create({
      data: {
        packageId: newPackage.id,
        version: "0.1.0",
        code,
        documentation,
      },
    })

    revalidatePath("/packages")
    revalidatePath("/dashboard")

    return {
      success: true,
      packageId: newPackage.id,
    }
  } catch (error) {
    console.error("Error creating package:", error)
    return {
      error: error instanceof Error ? error.message : "Failed to create package",
    }
  }
}

// Helper function to generate mock code
function generateMockCode(name: string, description: string, framework: string) {
  const frameworkSpecificCode = {
    react: `import React, { useState, useEffect } from 'react';

/**
 * ${description}
 */
export function ${toPascalCase(name)}({ initialValue = 0 }) {
  const [value, setValue] = useState(initialValue);
  
  useEffect(() => {
    console.log('Component mounted');
    return () => console.log('Component unmounted');
  }, []);

  return (
    <div className="package-container">
      <h2>${name}</h2>
      <p>{value}</p>
      <button onClick={() => setValue(value + 1)}>Increment</button>
    </div>
  );
}

export default ${toPascalCase(name)};`,
    nextjs: `'use client';

import { useState, useEffect } from 'react';

/**
 * ${description}
 */
export function ${toPascalCase(name)}({ initialValue = 0 }) {
  const [value, setValue] = useState(initialValue);
  
  useEffect(() => {
    console.log('Component mounted');
    return () => console.log('Component unmounted');
  }, []);

  return (
    <div className="package-container">
      <h2>${name}</h2>
      <p>{value}</p>
      <button onClick={() => setValue(value + 1)}>Increment</button>
    </div>
  );
}

export default ${toPascalCase(name)};`,
    vue: `<template>
  <div class="package-container">
    <h2>${name}</h2>
    <p>{{ value }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>

<script>
/**
 * ${description}
 */
export default {
  name: '${toPascalCase(name)}',
  props: {
    initialValue: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      value: this.initialValue
    }
  },
  methods: {
    increment() {
      this.value += 1
    }
  },
  mounted() {
    console.log('Component mounted')
  },
  beforeUnmount() {
    console.log('Component unmounted')
  }
}
</script>`,
    svelte: `<script>
  /**
   * ${description}
   */
  export let initialValue = 0;
  let value = initialValue;
  
  function increment() {
    value += 1;
  }
</script>

<div class="package-container">
  <h2>${name}</h2>
  <p>{value}</p>
  <button on:click={increment}>Increment</button>
</div>`,
    angular: `import { Component, Input, OnInit, OnDestroy } from '@angular/core';

/**
 * ${description}
 */
@Component({
  selector: 'app-${name}',
  template: \`
    <div class="package-container">
      <h2>${name}</h2>
      <p>{{ value }}</p>
      <button (click)="increment()">Increment</button>
    </div>
  \`
})
export class ${toPascalCase(name)}Component implements OnInit, OnDestroy {
  @Input() initialValue = 0;
  value = this.initialValue;
  
  increment() {
    this.value += 1;
  }
  
  ngOnInit() {
    console.log('Component initialized');
  }
  
  ngOnDestroy() {
    console.log('Component destroyed');
  }
}`,
    node: `/**
 * ${description}
 * @module ${name}
 */

/**
 * Main class for ${name}
 */
class ${toPascalCase(name)} {
  /**
   * Create a new instance
   * @param {Object} options - Configuration options
   */
  constructor(options = {}) {
    this.options = options;
    this.value = options.initialValue || 0;
  }
  
  /**
   * Increment the value
   * @returns {number} The new value
   */
  increment() {
    this.value += 1;
    return this.value;
  }
  
  /**
   * Get the current value
   * @returns {number} The current value
   */
  getValue() {
    return this.value;
  }
}

module.exports = ${toPascalCase(name)};`,
    vanilla: `/**
 * ${description}
 * @module ${name}
 */

/**
 * Creates a new ${toPascalCase(name)} instance
 * @param {Object} options - Configuration options
 * @returns {Object} The ${toPascalCase(name)} instance
 */
function ${toCamelCase(name)}(options = {}) {
  let value = options.initialValue || 0;
  
  return {
    /**
     * Increment the value
     * @returns {number} The new value
     */
    increment() {
      value += 1;
      return value;
    },
    
    /**
     * Get the current value
     * @returns {number} The current value
     */
    getValue() {
      return value;
    }
  };
}

// For CommonJS
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ${toCamelCase(name)};
}

// For ES modules
export default ${toCamelCase(name)};`,
  }

  return frameworkSpecificCode[framework as keyof typeof frameworkSpecificCode] || frameworkSpecificCode.vanilla
}

// Helper function to generate mock documentation
function generateMockDocumentation(name: string, description: string) {
  return `# ${name}

${description}

## Installation

\`\`\`bash
npm install ${name}
\`\`\`

## Usage

\`\`\`javascript
import ${toPascalCase(name)} from '${name}';

// Create a new instance
const instance = new ${toPascalCase(name)}({ initialValue: 10 });

// Use the methods
console.log(instance.getValue()); // 10
console.log(instance.increment()); // 11
\`\`\`

## API

### Constructor

\`\`\`javascript
new ${toPascalCase(name)}(options)
\`\`\`

#### Options

- \`initialValue\` (number): The initial value. Default: 0.

### Methods

#### increment()

Increments the value by 1.

Returns: \`number\` - The new value.

#### getValue()

Gets the current value.

Returns: \`number\` - The current value.

## License

MIT
`
}

// Helper functions for string manipulation
function toPascalCase(str: string) {
  return str
    .split(/[-_]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("")
}

function toCamelCase(str: string) {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}


// "use server"

// import { z } from "zod"
// import { revalidatePath } from "next/cache"
// import { db } from "@/lib/db"
// import { getCurrentUser } from "@/lib/session"
// import { generatePackage } from "@/app/actions/ai/generate"
// import { checkSubscriptionLimit } from "@/lib/subscription"

// const packageSchema = z.object({
//   name: z.string().min(1),
//   description: z.string().min(10),
//   framework: z.string().min(1),
//   aiModel: z.string().min(1),
//   prompt: z.string().min(20),
// })

// export async function createPackage(data: z.infer<typeof packageSchema>) {
//   const validatedFields = packageSchema.safeParse(data)

//   if (!validatedFields.success) {
//     return {
//       error: "Invalid fields",
//     }
//   }

//   const user = await getCurrentUser()

//   if (!user) {
//     return {
//       error: "Unauthorized",
//     }
//   }

//   try {
//     // Check subscription limits for package creation
//     const monthStart = new Date()
//     monthStart.setDate(1)
//     monthStart.setHours(0, 0, 0, 0)

//     const nextMonth = new Date(monthStart)
//     nextMonth.setMonth(nextMonth.getMonth() + 1)

//     const packageCount = await db.package.count({
//       where: {
//         userId: user.id,
//         createdAt: {
//           gte: monthStart,
//           lt: nextMonth,
//         },
//       },
//     })

//     const subscriptionDetails = await db.user.findUnique({
//       where: { id: user.id },
//       select: { subscriptionPlan: true },
//     })

//     const plan = subscriptionDetails?.subscriptionPlan || "FREE"
//     const packageLimit = plan === "FREE" ? 5 : Number.POSITIVE_INFINITY

//     if (packageCount >= packageLimit) {
//       return {
//         error: `You've reached your monthly limit of ${packageLimit} packages. Upgrade your plan to create more.`,
//       }
//     }

//     // Check if user can use the selected AI model
//     const canUseAI = await checkSubscriptionLimit(user.id, data.aiModel)

//     if (!canUseAI.allowed) { 
//       return {
//         error: canUseAI.message,
//       }
//     }

//     // Generate package code and documentation using AI
//     const { code, documentation } = await generatePackage({
//       name: data.name,
//       description: data.description,
//       framework: data.framework,
//       prompt: data.prompt,
//       model: data.aiModel,
//     })

//     // Create package in database
//     const newPackage = await db.package.create({
//       data: {
//         name: data.name,
//         description: data.description,
//         framework: data.framework,
//         aiModel: data.aiModel,
//         code,
//         documentation,
//         userId: user.id,
//       },
//     })

//     // Create initial version
//     await db.packageVersion.create({
//       data: {
//         packageId: newPackage.id,
//         version: "0.1.0",
//         code,
//         documentation,
//       },
//     })

//     // Deduct credits if not on free tier or if using premium models
//     //@ts-ignore
//     if (user.subscriptionPlan !== "FREE" || data.aiModel !== "gpt4o") {
//       await db.wallet.update({
//         where: { userId: user.id },
//         data: {
//           credits: { decrement: 1 },
//         },
//       })
//     }

//     revalidatePath("/packages")
//     revalidatePath("/dashboard")

//     return {
//       packageId: newPackage.id,
//     }
//   } catch (error) {
//     console.error("Error creating package:", error)
//     return {
//       error: error instanceof Error ? error.message : "Failed to create package",
//     }
//   }
// }

