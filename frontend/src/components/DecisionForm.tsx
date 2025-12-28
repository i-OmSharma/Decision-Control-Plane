import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { InputField } from "./InputField";
import { Loader2 } from "lucide-react";

interface DecisionFormProps {
  onSubmit: (data: {
    request: { amount: number; type: string };
    signals: { risk_score: number; source_reputation: number; is_verified: boolean };
  }) => void;
  isLoading: boolean;
}

export function DecisionForm({ onSubmit, isLoading }: DecisionFormProps) {
  const [amount, setAmount] = useState("1000");
  const [type, setType] = useState("payment");
  const [riskScore, setRiskScore] = useState("50");
  const [sourceReputation, setSourceReputation] = useState("75");
  const [isVerified, setIsVerified] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      request: {
        amount: parseFloat(amount) || 0,
        type: type.trim(),
      },
      signals: {
        risk_score: parseFloat(riskScore) || 0,
        source_reputation: parseFloat(sourceReputation) || 0,
        is_verified: isVerified,
      },
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Parameters</CardTitle>
        <CardDescription>Configure the decision input values</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2">
            <InputField
              label="Request Amount"
              id="amount"
              type="number"
              value={amount}
              onChange={setAmount}
              placeholder="e.g., 1000"
            />
            <InputField
              label="Request Type"
              id="type"
              value={type}
              onChange={setType}
              placeholder="e.g., payment"
            />
          </div>

          <div className="border-t border-border pt-6">
            <p className="text-sm font-medium text-foreground mb-4">Signal Parameters</p>
            <div className="grid gap-6 sm:grid-cols-2">
              <InputField
                label="Risk Score"
                id="riskScore"
                type="number"
                value={riskScore}
                onChange={setRiskScore}
                placeholder="0-100"
              />
              <InputField
                label="Source Reputation"
                id="sourceReputation"
                type="number"
                value={sourceReputation}
                onChange={setSourceReputation}
                placeholder="0-100"
              />
            </div>
          </div>

          <div className="flex items-center space-x-3 pt-2">
            <Checkbox
              id="isVerified"
              checked={isVerified}
              onCheckedChange={(checked) => setIsVerified(checked === true)}
            />
            <Label htmlFor="isVerified" className="text-sm font-medium cursor-pointer">
              Is Verified
            </Label>
          </div>

          <Button type="submit" className="w-full sm:w-auto" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Evaluating...
              </>
            ) : (
              "Evaluate Decision"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
