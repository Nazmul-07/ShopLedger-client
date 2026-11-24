import { formatCurrency } from "@/lib/currency";
import { cn } from "@/lib/utils";

interface CurrencyDisplayProps {
  paisa: number;
  className?: string;
  positiveHighlight?: boolean;
  negativeHighlight?: boolean;
}

export function CurrencyDisplay({
  paisa,
  className,
  positiveHighlight = false,
  negativeHighlight = false,
}: CurrencyDisplayProps) {
  const isNegative = paisa < 0;
  return (
    <span
      className={cn(
        "tabular-nums font-medium",
        positiveHighlight && paisa > 0 && "text-emerald-600 dark:text-emerald-400",
        negativeHighlight && isNegative && "text-rose-600 dark:text-rose-400",
        className
      )}
    >
      {formatCurrency(paisa)}
    </span>
  );
}
