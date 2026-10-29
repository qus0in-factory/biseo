import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-60 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground border border-primary",
        ghost: "bg-transparent border-none text-muted-foreground hover:text-foreground",
        outline: "bg-transparent border border-border text-foreground",
      },
      size: {
        default: "min-h-11 px-4 py-2",
        icon: "min-h-11 min-w-11 w-11 h-11 p-0",
        pill: "min-h-11 min-w-11 px-4 rounded-full",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)
