import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-base font-extrabold transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-400 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-5 [&_svg]:shrink-0",
    "shadow-lg hover:shadow-green-400/30 active:scale-95",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-gradient-to-r from-[#022d2b] via-green-700 to-green-500",
          "text-white",
          "hover:brightness-110 hover:shadow-green-400/60 hover:scale-105",
          "active:brightness-95",
          "border-2 border-green-900/60",
          "backdrop-blur-sm",
        ].join(" "),
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 border-2 border-red-900/40 shadow-lg",
        outline: [
          "bg-[#022d2b80] border-2 border-green-700 text-green-200",
          "hover:bg-green-900/30 hover:text-white hover:shadow-green-400/30",
          "active:bg-green-900/50",
          "backdrop-blur-md",
        ].join(" "),
        secondary:
          "bg-green-900/80 text-green-100 hover:bg-green-800/90 border-2 border-green-900/40 shadow-md",
        ghost: [
          "bg-transparent text-green-200 hover:bg-green-900/30 hover:text-white hover:shadow-green-400/30",
          "active:bg-green-900/50",
          "backdrop-blur-md",
        ].join(" "),
        link: "text-green-400 underline-offset-4 hover:underline font-bold",
        success: "bg-green-600 text-white animate-pulse hover:bg-green-700 border-2 border-green-900/60 shadow-green-400/40 shadow-lg",
      },
      size: {
        default: "h-12 px-7 py-2.5",
        sm: "h-10 rounded-xl px-5 py-2 text-sm",
        lg: "h-14 rounded-2xl px-12 py-4 text-xl",
        icon: "h-12 w-12",
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
