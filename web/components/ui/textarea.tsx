import * as React from "react"
import { cn } from "../../lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea data-slot="textarea" className={cn("w-full min-w-0 bg-transparent outline-none text-base leading-[1.4] resize-none overflow-y-auto", className)} {...props} />
}

export { Textarea }
