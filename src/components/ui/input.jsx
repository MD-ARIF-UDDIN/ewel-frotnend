import * as React from "react"
import { cn } from "@/lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-lg border border-white/20 dark:border-slate-600/70 bg-white/10 dark:bg-slate-700/70 backdrop-blur-md px-3 py-2 text-sm text-gray-900 dark:text-slate-100 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 dark:placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 dark:focus-visible:ring-primary-light/50 focus-visible:ring-offset-2 focus-visible:bg-white/20 dark:focus-visible:bg-slate-700/80 focus-visible:border-blue-300/50 dark:focus-visible:border-primary-light/50 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 hover:bg-white/15 dark:hover:bg-slate-700/80 shadow-sm",
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Input.displayName = "Input"

export { Input }


