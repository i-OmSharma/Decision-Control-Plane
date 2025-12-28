import { useState } from "react";
import { DecisionForm } from "@/components/DecisionForm";
import { DecisionResult } from "@/components/DecisionResult";
import { ErrorCard } from "@/components/ErrorCard";
import { Activity } from "lucide-react";

interface DecisionResponse {
  decision: {
    final: "ALLOW" | "DENY" | "REVIEW";
    source: "RULE" | "AI_RECOMMENDED" | "AI_FLAGGED_REVIEW";
    confidence: number | null;
  };
  ruleEvaluation: {
    outcome: "SAFE_ALLOW" | "SAFE_DENY" | "GREY_ZONE";
    matchedRule: {
      id: string;
      name: string;
    } | null;
    evaluationTimeMs: number;
  };
  aiAnalysis: {
    recommendation: string;
    confidence: number;
    reasoning: string;
  } | null;
  meta: {
    processingTimeMs: number;
    requestId: string;
  };
}

const Index = () => {
  const [result, setResult] = useState<DecisionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: {
    request: { amount: number; type: string };
    signals: { risk_score: number; source_reputation: number; is_verified: boolean };
  }) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/decide`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }

      const resultData: DecisionResponse = await response.json();
      setResult(resultData);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
              <Activity className="h-5 w-5 text-primary" />
            </div>
            <h1 className="text-2xl font-semibold text-foreground">
              Decision Evaluation
            </h1>
          </div>
          <p className="text-muted-foreground ml-[52px]">
            Rule engine + AI assisted decision platform
          </p>
        </header>

        {/* Main Content */}
        <main className="space-y-6">
          <DecisionForm onSubmit={handleSubmit} isLoading={isLoading} />

          {error && <ErrorCard message={error} />}

          {result && <DecisionResult result={result} />}
        </main>
      </div>
    </div>
  );
};

export default Index;
