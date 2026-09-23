import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../lib/utils";

const buttonVariants = cva(
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer select-none",
    {
        variants: {
            variant: {
                default:
                    "bg-zinc-50 text-zinc-900 shadow-sm hover:bg-zinc-200/90",
                destructive:
                    "bg-rose-500/15 text-rose-400 border border-rose-500/30 hover:bg-rose-500/25",
                outline:
                    "border border-zinc-800 bg-zinc-950/40 hover:bg-zinc-800 hover:text-zinc-50 text-zinc-300",
                secondary:
                    "bg-zinc-800 text-zinc-100 hover:bg-zinc-700/80",
                ghost:
                    "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-50",
                link:
                    "text-indigo-400 underline-offset-4 hover:underline",
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
);

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button, buttonVariants };
