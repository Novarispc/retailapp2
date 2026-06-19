import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-semibold tracking-tight transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--accent)] text-[var(--on-accent)] shadow-[0_6px_24px_-10px_var(--accent)] hover:brightness-105 hover:shadow-[0_10px_36px_-10px_var(--accent)]",
        secondary:
          "glass text-foreground hover:border-[var(--border-strong)] hover:bg-[var(--surface-2)]",
        ghost: "text-muted hover:text-foreground hover:bg-[var(--surface-2)]",
        outline:
          "border border-[var(--border-strong)] text-foreground hover:border-[var(--accent)] hover:text-[var(--accent)]",
        accent3:
          "bg-[var(--accent-3)] text-[var(--on-accent)] hover:brightness-105",
        danger: "bg-[var(--danger)] text-white hover:brightness-110",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  ),
);
Button.displayName = "Button";

export { buttonVariants };
