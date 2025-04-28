import { clsx } from "clsx"
import type { ButtonHTMLAttributes } from "react"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
}

export const Button = ({ variant = "default", size = "md", className, children, ...props }: ButtonProps) => {
  const sizeClasses = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  }

  const variantClasses = {
    default: "bg-primary text-white hover:bg-primary-dark",
    outline: "border border-primary text-primary hover:bg-primary hover:text-white",
    ghost: "text-primary hover:bg-primary/10",
  }

  return (
    <button
      className={clsx(
        className,
        sizeClasses[size],
        variantClasses[variant],
        "rounded-lg font-medium focus:outline-none focus:ring-2 focus:ring-primary",
      )}
      {...props}
    >
      {children}
    </button>
  )
}

