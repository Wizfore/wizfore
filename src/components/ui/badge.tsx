import * as React from "react"
import { cn } from "@/lib/utils"

const badgeVariants = {
  default: "border-transparent bg-blue-600 text-white hover:bg-blue-700",
  secondary: "border-transparent bg-gray-100 text-gray-900 hover:bg-gray-200",
  destructive: "border-transparent bg-red-600 text-white hover:bg-red-700",
  outline: "text-gray-900 border-gray-300",
  gcf: "border border-gcf-border bg-gcf-accent text-gcf-accent-foreground hover:bg-gcf-secondary hover:text-gcf-secondary-foreground shadow-gcf-sm hover:shadow-gcf-md hover:-translate-y-0.5 transition-all duration-200",
  "gcf-secondary": "border border-gcf-border bg-gcf-secondary text-gcf-secondary-foreground hover:bg-gcf-primary hover:text-gcf-primary-foreground shadow-gcf-sm hover:shadow-gcf-md hover:-translate-y-0.5 transition-all duration-200",
  "gcf-outline": "border-2 border-gcf-accent bg-transparent text-gcf-accent-foreground hover:bg-gcf-accent hover:text-gcf-accent-foreground shadow-gcf-sm hover:shadow-gcf-md hover:-translate-y-0.5 transition-all duration-200",
  heart: "bg-heart-primary text-heart-primary-foreground rounded-heart-full shadow-heart-subtle hover:bg-heart-primary-hover hover:shadow-heart-card hover:-translate-y-0.5 transition-all duration-300",
  "heart-outline": "border-2 border-heart-primary bg-transparent text-heart-primary hover:bg-heart-primary hover:text-heart-primary-foreground rounded-heart-full shadow-heart-subtle hover:shadow-heart-card hover:-translate-y-0.5 transition-all duration-300",
}

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div 
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        badgeVariants[variant],
        className
      )} 
      {...props} 
    />
  )
}

export { Badge, badgeVariants }