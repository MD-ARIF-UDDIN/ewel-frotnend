import * as React from "react"
import { cn } from "@/lib/utils"

const Separator = React.forwardRef(
  ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => {
    // Remove decorative from props that go to DOM
    const { decorative: _, ...domProps } = { decorative, ...props };

    return (
      <div
        ref={ref}
        role={decorative ? "none" : "separator"}
        aria-orientation={orientation}
        className={cn(
          "shrink-0 bg-gradient-to-r from-transparent via-gray-300 to-transparent",
          orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
          className
        )}
        {...domProps}
      />
    );
  }
)
Separator.displayName = "Separator"

export { Separator }