import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer shadow-sm",
  {
    variants: {
      variant: {
        default:
          "bg-[#166534] text-white hover:bg-[#14532d] focus-visible:ring-[#166534]",
        secondary:
          "bg-[#22C55E] text-white hover:bg-[#16a34a] focus-visible:ring-[#22C55E]",
        outline:
          "border border-[#E2E8F0] bg-white text-[#1E293B] hover:bg-[#F0FDF4] hover:text-[#166534]",
        ghost:
          "hover:bg-[#DCFCE7] text-[#1E293B] hover:text-[#166534] shadow-none",
        destructive:
          "bg-[#EF4444] text-white hover:bg-[#DC2626] focus-visible:ring-[#EF4444]",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-md px-3 text-xs",
        lg: "h-11 rounded-lg px-8 text-base",
        icon: "h-10 w-10",
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
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }

