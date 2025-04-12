import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "About | NPM-Packager",
  description: "Learn about NPM-Packager and our mission",
}

export default function AboutPage() {
  return (
    <div className="container py-12 md:py-24 lg:py-32">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">About NPM-Packager</h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Our mission is to simplify the process of creating and publishing NPM packages.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-3xl space-y-8 py-12">
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Our Story</h2>
          <p className="text-muted-foreground">
            NPM-Packager was founded in 2023 by a team of developers who were frustrated with the time-consuming process
            of creating, documenting, and publishing NPM packages. We believed that AI could streamline this process and
            make it more accessible to developers of all skill levels.
          </p>
          <p className="text-muted-foreground">
            After months of development and testing, we launched NPM-Packager with a simple goal: to help developers
            create and publish high-quality NPM packages in minutes, not days.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Our Mission</h2>
          <p className="text-muted-foreground">
            Our mission is to democratize package development by making it faster, easier, and more accessible. We
            believe that by removing the barriers to creating and publishing packages, we can help developers focus on
            what matters most: building great software.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Our Team</h2>
          <p className="text-muted-foreground">
            We're a small team of passionate developers, designers, and AI enthusiasts based around the world. We're
            united by our love for open source and our belief in the power of AI to transform software development.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Our Values</h2>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2">
            <li>
              <span className="font-medium text-foreground">Quality:</span> We're committed to helping developers create
              high-quality packages that follow best practices.
            </li>
            <li>
              <span className="font-medium text-foreground">Accessibility:</span> We believe that package development
              should be accessible to developers of all skill levels.
            </li>
            <li>
              <span className="font-medium text-foreground">Innovation:</span> We're constantly exploring new ways to
              use AI to improve the package development process.
            </li>
            <li>
              <span className="font-medium text-foreground">Community:</span> We're building a community of developers
              who share our passion for open source and AI.
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}
