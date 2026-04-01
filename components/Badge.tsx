type BadgeVariant = "promo" | "reducere" | "nou" | "default";

interface BadgeProps {
  label: string;
  variant?: BadgeVariant;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  promo: "bg-amber-100 text-amber-800 border border-amber-200",
  reducere: "bg-red-100 text-red-700 border border-red-200",
  nou: "bg-emerald-100 text-emerald-700 border border-emerald-200",
  default: "bg-gray-100 text-gray-700 border border-gray-200",
};

export default function Badge({ label, variant = "default", className = "" }: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase",
        variantStyles[variant],
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </span>
  );
}
