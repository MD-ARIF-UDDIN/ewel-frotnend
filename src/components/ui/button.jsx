import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95",
    {
        variants: {
            variant: {
                default: "bg-blue-600 text-white hover:bg-blue-700 dark:bg-primary dark:hover:bg-primary-light dark:text-slate-900 shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 ease-in-out",
                destructive:
                    "bg-red-500 text-white hover:bg-red-600 dark:bg-destructive dark:hover:bg-destructive-light dark:text-slate-900 shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 ease-in-out",
                outline:
                    "border-2 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 hover:border-gray-300 dark:hover:border-slate-500 hover:scale-105 shadow-sm hover:shadow-md transform transition-all duration-300 ease-in-out",
                secondary:
                    "bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-slate-100 hover:bg-gray-200 dark:hover:bg-slate-600 hover:scale-105 shadow-sm hover:shadow-md transform transition-all duration-300 ease-in-out",
                ghost: "hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-900 dark:hover:text-slate-100 hover:scale-105 transform transition-all duration-300 ease-in-out",
                link: "text-blue-600 dark:text-blue-400 underline-offset-4 hover:underline hover:text-blue-700 dark:hover:text-blue-300",
                success: "bg-green-500 text-white hover:bg-green-600 dark:bg-success dark:hover:bg-success-light dark:text-slate-900 shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 ease-in-out",
                warning: "bg-blue-500 text-white dark:text-slate-900 hover:bg-blue-600 dark:hover:bg-warning shadow-md hover:shadow-lg hover:scale-105 transform transition-all duration-300 ease-in-out",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3 text-xs",
                lg: "h-12 rounded-xl px-8 text-base font-semibold",
                xl: "h-14 rounded-xl px-10 text-lg font-semibold",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
        <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button, buttonVariants }