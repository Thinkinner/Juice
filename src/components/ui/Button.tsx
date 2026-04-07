import { forwardRef, type ButtonHTMLAttributes } from "react";

type Variant = "primary" | "secondary" | "ghost";

const styles: Record<Variant, string> = {
  primary:
    "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 hover:bg-emerald-700 active:scale-[0.99]",
  secondary:
    "bg-white text-stone-900 ring-1 ring-stone-200 hover:bg-stone-50 active:scale-[0.99]",
  ghost: "text-stone-700 hover:bg-stone-100 active:scale-[0.99]",
};

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; fullWidth?: boolean }
>(function Button({ className = "", variant = "primary", fullWidth, disabled, ...props }, ref) {
  return (
    <button
      ref={ref}
      disabled={disabled}
      className={`inline-flex items-center justify-center rounded-2xl px-5 py-3.5 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 disabled:pointer-events-none disabled:opacity-50 ${fullWidth ? "w-full" : ""} ${styles[variant]} ${className}`}
      {...props}
    />
  );
});
