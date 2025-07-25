import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-primary-foreground shadow hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
        outline:
          "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        gcf: "bg-gcf-primary text-gcf-primary-foreground border border-gcf-border shadow-gcf-sm hover:bg-gcf-accent hover:text-gcf-accent-foreground hover:shadow-gcf-md hover:-translate-y-0.5 transition-all duration-200",
        "gcf-secondary": "bg-gcf-secondary text-gcf-secondary-foreground border border-gcf-border shadow-gcf-sm hover:bg-gcf-primary hover:text-gcf-primary-foreground hover:shadow-gcf-md hover:-translate-y-0.5 transition-all duration-200",
        "gcf-outline": "border-2 border-gcf-accent bg-transparent text-gcf-accent-foreground hover:bg-gcf-accent hover:text-gcf-accent-foreground shadow-gcf-sm hover:shadow-gcf-md hover:-translate-y-0.5 transition-all duration-200",
        heart: "bg-heart-primary text-heart-primary-foreground rounded-heart-2xl shadow-heart-subtle hover:bg-heart-primary-hover hover:shadow-heart-card hover:-translate-y-0.5 transition-all duration-300",
        "heart-outline": "border-2 border-heart-primary bg-transparent text-heart-primary hover:bg-heart-primary hover:text-heart-primary-foreground rounded-heart-2xl shadow-heart-subtle hover:shadow-heart-card hover:-translate-y-0.5 transition-all duration-300",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-10 rounded-md px-8",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
