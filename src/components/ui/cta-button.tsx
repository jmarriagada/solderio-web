import React from "react";
import Link, { LinkProps } from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface CtaButtonBaseProps {
  children: React.ReactNode;
  variant?: "orange" | "white" | "dark" | "outline";
  size?: "default" | "sm" | "lg";
  showArrow?: boolean;
  arrowClassName?: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
}

export type CtaButtonProps = CtaButtonBaseProps &
  (
    | ({
        href: string;
      } & Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof CtaButtonBaseProps | "href"> &
        Omit<LinkProps, "href" | "as">)
    | ({
        href?: undefined;
      } & Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CtaButtonBaseProps | "href">)
  );

const variantStyles: Record<NonNullable<CtaButtonBaseProps["variant"]>, string> = {
  orange:
    "bg-[#FF8300] text-white hover:bg-[#e07300] shadow-xl hover:shadow-[0_0_30px_rgba(255,131,0,0.5)] border border-transparent",
  white:
    "bg-white text-black hover:bg-[#FF8300] hover:text-white shadow-xl hover:shadow-[0_0_30px_rgba(255,131,0,0.5)] border border-transparent",
  dark:
    "bg-[#1F1F1F] text-white hover:bg-[#2B2B2B] shadow-xl hover:shadow-black/20 border border-white/10",
  outline:
    "bg-transparent text-black border border-black/20 hover:border-[#FF8300] hover:text-[#FF8300]",
};

const sizeStyles: Record<NonNullable<CtaButtonBaseProps["size"]>, string> = {
  sm: "px-6 py-2.5 text-xs",
  default: "px-9 py-3.5 text-xs md:text-sm",
  lg: "px-10 py-4 text-sm md:text-base",
};

export const CtaButton = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  CtaButtonProps
>(function CtaButton(props, ref) {
  const {
    children,
    variant = "orange",
    size = "default",
    showArrow = true,
    arrowClassName,
    icon,
    iconPosition = "right",
    className,
    ...restProps
  } = props;

  const baseClasses = cn(
    "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full font-light transition-all duration-300 cursor-pointer select-none group shrink-0",
    variantStyles[variant],
    sizeStyles[size],
    className
  );

  const defaultArrow = showArrow ? (
    <ArrowRight
      className={cn(
        "w-4 h-4 shrink-0 transition-transform duration-300 group-hover:translate-x-1",
        arrowClassName
      )}
    />
  ) : null;

  const renderedIcon = icon || defaultArrow;

  const content = (
    <>
      {renderedIcon && iconPosition === "left" && renderedIcon}
      <span className="whitespace-nowrap">{children}</span>
      {renderedIcon && iconPosition === "right" && renderedIcon}
    </>
  );

  if ("href" in props && typeof props.href === "string") {
    const { href, ...anchorProps } = restProps as React.AnchorHTMLAttributes<HTMLAnchorElement> & {
      href: string;
    };
    return (
      <Link
        href={href}
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={baseClasses}
        {...anchorProps}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={baseClasses}
      {...(restProps as React.ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {content}
    </button>
  );
});

export default CtaButton;
