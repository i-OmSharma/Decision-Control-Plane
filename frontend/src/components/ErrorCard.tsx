import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface ErrorCardProps {
  message: string;
}

export function ErrorCard({ message }: ErrorCardProps) {
  return (
    <Card className="border-destructive/50 bg-destructive/5">
      <CardContent className="flex items-start gap-3 pt-6">
        <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
        <div>
          <p className="font-medium text-destructive">Error</p>
          <p className="text-sm text-muted-foreground mt-1">{message}</p>
        </div>
      </CardContent>
    </Card>
  );
}
