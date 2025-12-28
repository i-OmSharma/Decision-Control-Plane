import { cn } from "@/lib/utils";

type DecisionType = "ALLOW" | "DENY" | "REVIEW";

interface DecisionBadgeProps {
  decision: DecisionType;
  className?: string;
}

export function DecisionBadge({ decision, className }: DecisionBadgeProps) {
  const styles: Record<DecisionType, string> = {
    ALLOW: "bg-decision-allow-bg text-decision-allow border-decision-allow/20",
    DENY: "bg-decision-deny-bg text-decision-deny border-decision-deny/20",
    REVIEW: "bg-decision-review-bg text-decision-review border-decision-review/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-4 py-2 rounded-md text-xl font-semibold border",
        styles[decision],
        className
      )}
    >
      {decision}
    </span>
  );
}
