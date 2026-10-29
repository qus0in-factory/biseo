import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils"

const alertVariants = cva("rounded-md border px-3 py-2 text-sm", {
  variants: { variant: { default: "bg-card border-border", error: "bg-card border-[#b91c1c] text-[#b91c1c]" } },
  defaultVariants: { variant: "default" },
})

function Alert({ className, variant, ...props }: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>) {
  return <div data-slot="alert" role="alert" className={cn(alertVariants({ variant }), className)} {...props} />
}

export { Alert, alertVariants }
