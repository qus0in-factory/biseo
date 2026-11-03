import * as React from "react"
import { cn } from "../../lib/utils"

type CardSize = "default" | "sm"

function Card({ className, size = "default", ...props }: React.ComponentProps<"div"> & { size?: CardSize }) {
  return <div data-slot="card" data-size={size} className={cn("bg-card text-card-foreground border border-border rounded-lg", size === "sm" ? "[--card-spacing:0.5rem]" : "[--card-spacing:1rem]", className)} {...props} />
}
function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-header" className={cn("flex flex-col gap-1.5 p-[var(--card-spacing)]", className)} {...props} />
}
function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="card-content" className={cn("p-[var(--card-spacing)] pt-0", className)} {...props} />
}

export { Card, CardHeader, CardContent }
