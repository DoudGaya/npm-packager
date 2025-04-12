import type * as React from "react"
import { cn } from "@/lib/utils"
import { Icons } from "@/components/icons"
import { cva, type VariantProps } from "class-variance-authority"

const placeholderVariants = cva(
  "flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50",
  {
    variants: {
      variant: {
        default: "border-muted-foreground/50 bg-transparent",
        destructive: "border-destructive/50 text-destructive",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

interface EmptyPlaceholderProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof placeholderVariants> {}

export function EmptyPlaceholder({ className, variant, ...props }: EmptyPlaceholderProps) {
  return <div className={cn(placeholderVariants({ variant }), className)} {...props} />
}

interface EmptyPlaceholderIconProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "name"> {
  name: keyof typeof Icons
}

EmptyPlaceholder.Icon = function EmptyPlaceholderIcon({ name, className, ...props }: EmptyPlaceholderIconProps) {
  const Icon = Icons[name]

  if (!Icon) {
    return null
  }

  return (
    <div className={cn("flex h-20 w-20 items-center justify-center rounded-full bg-muted", className)} {...props}>
      <Icon className="h-10 w-10" />
    </div>
  )
}

interface EmptyPlaceholderTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}

EmptyPlaceholder.Title = function EmptyPlaceholderTitle({ className, ...props }: EmptyPlaceholderTitleProps) {
  return <h2 className={cn("mt-6 text-xl font-semibold", className)} {...props} />
}

interface EmptyPlaceholderDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

EmptyPlaceholder.Description = function EmptyPlaceholderDescription({
  className,
  ...props
}: EmptyPlaceholderDescriptionProps) {
  return (
    <p
      className={cn("mb-8 mt-2 text-center text-sm font-normal leading-6 text-muted-foreground", className)}
      {...props}
    />
  )
}
