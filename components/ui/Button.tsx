"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive";
    size?: "sm" | "md" | "lg";
    children: ReactNode;
    isLoading?: boolean;
}

const Button = ({
    variant = "primary",
    size = "md",
    children,
    className = "",
    isLoading = false,
    disabled,
    ...props
}: ButtonProps) => {
    const baseStyles = "inline-flex items-center justify-center font-bold tracking-wide rounded-full transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
        primary: "bg-primary text-white hover:bg-primary-hover active:scale-[0.98]",
        secondary: "bg-gray-200 dark:bg-white text-black hover:bg-gray-300 dark:hover:bg-gray-200 active:bg-gray-400 dark:active:bg-gray-300",
        outline: "bg-transparent border border-gray-300 dark:border-white/20 text-black dark:text-white hover:border-primary hover:text-primary",
        ghost: "bg-transparent text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5",
        destructive: "bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500 hover:text-white",
    };

    const sizes = {
        sm: "text-xs px-3 py-1.5",
        md: "text-sm px-5 py-2", // Rebalanced padding
        lg: "text-base px-6 py-2.5", // Reduced from px-8 py-3
    };

    return (
        <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
            ) : null}
            {children}
        </motion.button>
    );
};

export default Button;
