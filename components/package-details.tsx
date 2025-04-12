import type { Package } from "@prisma/client"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"

interface PackageDetailsProps {
  package: Package
}

export function PackageDetails({ package: pkg }: PackageDetailsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Package Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Name</div>
            <div>{pkg.name}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Version</div>
            <div>{pkg.version}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Framework</div>
            <div className="capitalize">{pkg.framework}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Status</div>
            <div>
              <Badge
                variant={pkg.status === "PUBLISHED" ? "default" : pkg.status === "DRAFT" ? "outline" : "secondary"}
              >
                {pkg.status.toLowerCase()}
              </Badge>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Created</div>
            <div>{formatDate(pkg.createdAt)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">Updated</div>
            <div>{formatDate(pkg.updatedAt)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-sm font-medium text-muted-foreground">AI Model</div>
            <div>{pkg.aiModel}</div>
          </div>
          {pkg.repository && (
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">Repository</div>
              <div>
                <a
                  href={pkg.repository}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {pkg.repository.replace("https://github.com/", "")}
                </a>
              </div>
            </div>
          )}
          {pkg.npmUrl && (
            <div className="space-y-1">
              <div className="text-sm font-medium text-muted-foreground">NPM</div>
              <div>
                <a
                  href={pkg.npmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {pkg.name}
                </a>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
