import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DecisionBadge } from "./DecisionBadge";
import { MetadataRow } from "./MetadataRow";
import { Separator } from "@/components/ui/separator";
import { Brain, Clock, Shield, Sparkles } from "lucide-react";

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

interface DecisionResultProps {
  result: DecisionResponse;
}

export function DecisionResult({ result }: DecisionResultProps) {
  const outcomeLabels: Record<string, string> = {
    SAFE_ALLOW: "Safe Allow",
    SAFE_DENY: "Safe Deny",
    GREY_ZONE: "Grey Zone",
  };

  const sourceLabels: Record<string, string> = {
    RULE: "Rule Engine",
    AI_RECOMMENDED: "AI Recommended",
    AI_FLAGGED_REVIEW: "AI Flagged for Review",
  };

  return (
    <div className="space-y-4">
      {/* Final Decision Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Final Decision</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <DecisionBadge decision={result.decision.final} />
            <div className="text-right space-y-1">
              <p className="text-sm text-muted-foreground">
                Source: <span className="font-medium text-foreground">{sourceLabels[result.decision.source]}</span>
              </p>
              {result.decision.confidence !== null && (
                <p className="text-sm text-muted-foreground">
                  Confidence: <span className="font-medium text-foreground">{(result.decision.confidence * 100).toFixed(1)}%</span>
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Rule Evaluation Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Rule Evaluation</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-0">
          <MetadataRow
            label="Outcome"
            value={outcomeLabels[result.ruleEvaluation.outcome]}
          />
          <Separator />
          {result.ruleEvaluation.matchedRule && (
            <>
              <MetadataRow
                label="Matched Rule"
                value={result.ruleEvaluation.matchedRule.name}
              />
              <Separator />
              <MetadataRow
                label="Rule ID"
                value={result.ruleEvaluation.matchedRule.id}
                mono
              />
              <Separator />
            </>
          )}
          <MetadataRow
            label="Evaluation Time"
            value={`${result.ruleEvaluation.evaluationTimeMs}ms`}
            mono
          />
        </CardContent>
      </Card>

      {/* AI Analysis Card */}
      {result.aiAnalysis && (
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-muted-foreground" />
              <CardTitle>AI Analysis</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-0">
              <MetadataRow
                label="Recommendation"
                value={result.aiAnalysis.recommendation}
              />
              <Separator />
              <MetadataRow
                label="Confidence"
                value={`${(result.aiAnalysis.confidence * 100).toFixed(1)}%`}
              />
            </div>
            <div className="pt-2">
              <p className="text-sm text-muted-foreground mb-2">Reasoning</p>
              <p className="text-sm text-foreground leading-relaxed bg-muted/50 rounded-md p-3">
                {result.aiAnalysis.reasoning}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Metadata Card */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <CardTitle>Processing Details</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-0">
          <MetadataRow
            label="Total Processing Time"
            value={`${result.meta.processingTimeMs}ms`}
            mono
          />
          <Separator />
          <MetadataRow
            label="Request ID"
            value={result.meta.requestId}
            mono
          />
        </CardContent>
      </Card>
    </div>
  );
}
