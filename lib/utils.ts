/**
 * cn — merge class names (lightweight, no clsx dependency needed)
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * formatPrice — format a number as Romanian RON currency
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("ro-RO", {
    style: "currency",
    currency: "RON",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}
