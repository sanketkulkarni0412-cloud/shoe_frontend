"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface ButtonProps extends HTMLMotionProps<"button"> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
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
        primary: "bg-primary text-white hover:bg-red-700 active:bg-red-800",
        secondary: "bg-white text-black hover:bg-gray-200 active:bg-gray-300",
        outline: "bg-transparent border border-white/20 text-white hover:border-primary hover:text-primary",
        ghost: "bg-transparent text-gray-300 hover:text-white hover:bg-white/5",
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
