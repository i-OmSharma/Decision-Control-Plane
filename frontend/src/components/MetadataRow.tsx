import { cn } from "@/lib/utils";

interface MetadataRowProps {
  label: string;
  value: string | number | null | undefined;
  className?: string;
  mono?: boolean;
}

export function MetadataRow({ label, value, className, mono = false }: MetadataRowProps) {
  if (value === null || value === undefined) return null;

  return (
    <div className={cn("flex items-center justify-between py-2", className)}>
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={cn("text-sm font-medium text-foreground", mono && "font-mono")}>
        {value}
      </span>
    </div>
  );
}
