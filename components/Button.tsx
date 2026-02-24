import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
};

const styles = {
  base:
    "inline-flex items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold tracking-wide transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
  primary:
    "bg-slate-900 text-white hover:bg-slate-800 focus-visible:outline-slate-500",
  secondary:
    "border border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-slate-50 focus-visible:outline-slate-400",
  ghost: "text-slate-600 hover:text-slate-900 hover:bg-slate-100",
};

export const Button = ({ variant = "primary", className = "", ...props }: ButtonProps) => (
  <button
    className={`${styles.base} ${styles[variant]} ${className}`}
    type={props.type ?? "button"}
    {...props}
  />
);
