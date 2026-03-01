import type { ModalState } from '@/components/custom/modal.component';
import Modal from '@/components/custom/modal.component';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import type { Requirement, User } from '@rest/models';
import {
  AlertTriangle,
  Check,
  CheckCircle2,
  ExternalLink,
  FileText,
  Loader2,
  Save,
  Sparkles,
  Target,
  X,
  XCircle,
} from 'lucide-react';
import type React from 'react';
import { useCallback, useMemo, useState } from 'react';

export type CriteriaSubmission = {
  id: number;
  label: string;
  description: string;
  min: number;
  max: number;
  weight: number;
  score?: number;
  file: string | File;
  requirement: Requirement;
};

export type EvaluationData = {
  applicationId: number;
  user: User;
  criteriaSubmissions: CriteriaSubmission[];
};

interface EvaluationModalProps {
  controller: ModalState<EvaluationData>;
  onSubmit?: (scores: CriteriaSubmission[]) => void;
  onApprove?: (applicationId: number) => void;
  onReject?: (applicationId: number) => void;
  isSubmitting?: boolean;
}

export default function EvaluationModal({
  controller,
  onSubmit,
  onApprove,
  onReject,
  isSubmitting = false,
}: EvaluationModalProps): React.ReactNode {
  const { data } = controller;
  const [scores, setScores] = useState<Record<number, number>>({});
  const [errors, setErrors] = useState<Record<number, string>>({});

  const criteriaList = useMemo(() => data?.criteriaSubmissions ?? [], [data]);

  const currentScores = useMemo(() => {
    return criteriaList.map((c) => ({
      ...c,
      score: scores[c.id] ?? c.score ?? 0,
    }));
  }, [criteriaList, scores]);

  const totalWeight = useMemo(() => {
    return criteriaList.reduce((sum, c) => sum + c.weight, 0);
  }, [criteriaList]);

  const weightedScore = useMemo(() => {
    if (totalWeight === 0) return 0;
    return currentScores.reduce((sum, c) => {
      const s = Number(c.score) || 0;
      const lo = Number(c.min) || 0;
      const hi = Number(c.max) || 0;
      const range = hi - lo;
      const pct = range > 0 ? ((s - lo) / range) * 100 : hi > 0 ? (s / hi) * 100 : 0;
      const normalized = Math.max(0, Math.min(100, pct));
      return sum + (normalized * c.weight) / totalWeight;
    }, 0);
  }, [currentScores, totalWeight]);

  const hasErrors = useMemo(() => Object.keys(errors).length > 0, [errors]);

  const allScored = useMemo(() => {
    return currentScores.every((c) => {
      const s = Number(c.score) || 0;
      return s >= (Number(c.min) || 0) && s <= (Number(c.max) || 0);
    });
  }, [currentScores]);

  const scoredCount = useMemo(() => {
    return currentScores.filter((c) => {
      const s = Number(c.score) || 0;
      return s > 0 && s >= (Number(c.min) || 0) && s <= (Number(c.max) || 0);
    }).length;
  }, [currentScores]);

  const scoreColor = useMemo(() => {
    if (weightedScore >= 75)
      return {
        text: 'text-emerald-600 dark:text-emerald-400',
        ring: 'stroke-emerald-500',
        bg: 'bg-emerald-500',
      };
    if (weightedScore >= 50)
      return {
        text: 'text-amber-600 dark:text-amber-400',
        ring: 'stroke-amber-500',
        bg: 'bg-amber-500',
      };
    return { text: 'text-red-600 dark:text-red-400', ring: 'stroke-red-500', bg: 'bg-red-500' };
  }, [weightedScore]);

  const validate = useCallback(
    (_id: number, value: number, min: number, max: number): string | null => {
      if (Number.isNaN(value)) return 'Enter a valid number';
      if (value < min) return `Minimum is ${min}`;
      if (value > max) return `Maximum is ${max}`;
      return null;
    },
    []
  );

  const handleScoreChange = useCallback(
    (id: number, raw: string, min: number, max: number) => {
      const value = parseFloat(raw);
      setScores((prev) => ({ ...prev, [id]: value }));

      const error = validate(id, value, min, max);
      setErrors((prev) => {
        const next = { ...prev };
        if (error) next[id] = error;
        else delete next[id];
        return next;
      });
    },
    [validate]
  );

  const handleSubmit = () => {
    const validationErrors: Record<number, string> = {};
    for (const c of currentScores) {
      const error = validate(c.id, c.score, c.min, c.max);
      if (error) validationErrors[c.id] = error;
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onSubmit?.(currentScores);
  };

  const handleApprove = () => {
    const validationErrors: Record<number, string> = {};
    for (const c of currentScores) {
      const error = validate(c.id, c.score, c.min, c.max);
      if (error) validationErrors[c.id] = error;
    }
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    onApprove?.(data?.applicationId ?? 0);
  };

  const handleReject = () => {
    onReject?.(data?.applicationId ?? 0);
  };

  const getFileName = (file: string | File) => {
    if (file instanceof File) return file.name;
    const parts = file.split('/');
    return parts[parts.length - 1];
  };

  const handleViewFile = (file: string | File) => {
    if (file instanceof File) {
      const url = URL.createObjectURL(file);
      window.open(url, '_blank');
    } else {
      window.open(file, '_blank');
    }
  };

  if (!data) return null;

  const { user } = data;
  const circumference = 2 * Math.PI * 54;
  const dashOffset = circumference - (Math.min(weightedScore, 100) / 100) * circumference;

  return (
    <Modal controller={controller} title="Applicant Evaluation" size="full" closable>
      <div className="flex flex-col lg:flex-row gap-6 h-full">
        {/* Sidebar */}
        <div className="lg:w-[340px] xl:w-[380px] shrink-0 flex flex-col gap-5">
          {/* Applicant card */}
          <div className="rounded-xl border bg-gradient-to-br from-primary/5 via-background to-background p-5">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl shadow-md">
                  {user.name?.charAt(0)?.toUpperCase() ?? '?'}
                </div>
                <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 rounded-full border-2 border-background bg-emerald-500" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-base truncate">{user.name}</p>
                <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                {user.role && (
                  <Badge
                    variant="secondary"
                    className="mt-1.5 text-[10px] uppercase tracking-wider"
                  >
                    {user.role.replace(/_/g, ' ')}
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Score gauge */}
          <div className="rounded-xl border p-5 space-y-4">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Target className="h-4 w-4 text-primary" />
              Overall Score
            </div>

            <div className="flex justify-center py-2">
              <div className="relative h-36 w-36">
                <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    strokeWidth="8"
                    className="stroke-muted"
                  />
                  <circle
                    cx="60"
                    cy="60"
                    r="54"
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={dashOffset}
                    className={cn('transition-all duration-700 ease-out', scoreColor.ring)}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={cn('text-3xl font-bold tabular-nums', scoreColor.text)}>
                    {weightedScore.toFixed(1)}
                  </span>
                  <span className="text-[11px] text-muted-foreground font-medium">out of 100</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Stats grid */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-muted/50 p-2.5">
                <p className="text-lg font-bold tabular-nums">{criteriaList.length}</p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  Criteria
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2.5">
                <p
                  className={cn(
                    'text-lg font-bold tabular-nums',
                    totalWeight !== 100 && 'text-amber-600'
                  )}
                >
                  {totalWeight}%
                </p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  Weight
                </p>
              </div>
              <div className="rounded-lg bg-muted/50 p-2.5">
                <p className="text-lg font-bold tabular-nums">
                  {scoredCount}/{criteriaList.length}
                </p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  Scored
                </p>
              </div>
            </div>

            {/* Per-criteria breakdown */}
            {criteriaList.length > 0 && (
              <>
                <Separator />
                <div className="space-y-2.5">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Breakdown
                  </p>
                  {currentScores.map((c) => {
                    const s = Number(c.score) || 0;
                    const lo = Number(c.min) || 0;
                    const hi = Number(c.max) || 0;
                    const range = hi - lo;
                    const pct = range > 0 ? ((s - lo) / range) * 100 : hi > 0 ? (s / hi) * 100 : 0;
                    const clampedPct = Math.max(0, Math.min(100, pct));
                    return (
                      <div key={c.id} className="space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="truncate font-medium max-w-[180px]">{c.label}</span>
                          <span className="text-muted-foreground tabular-nums ml-2 shrink-0">
                            {c.score}/{c.max}
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                          <div
                            className={cn(
                              'h-full rounded-full transition-all duration-500',
                              clampedPct >= 75
                                ? 'bg-emerald-500'
                                : clampedPct >= 50
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                            )}
                            style={{ width: `${clampedPct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Status + actions */}
          <div className="mt-auto space-y-3">
            <div className="flex items-center justify-between rounded-lg border px-4 py-3">
              <span className="text-sm font-medium">Status</span>
              {allScored && !hasErrors ? (
                <Badge className="gap-1 bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800">
                  <CheckCircle2 className="h-3 w-3" />
                  Ready to Submit
                </Badge>
              ) : (
                <Badge variant="secondary" className="gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  Incomplete
                </Badge>
              )}
            </div>

            {onSubmit && (
              <Button
                className="w-full h-11 shadow-sm"
                disabled={isSubmitting || hasErrors}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Evaluation
                  </>
                )}
              </Button>
            )}

            {(onApprove || onReject) && (
              <div className="flex gap-2">
                {onReject && (
                  <Button
                    variant="destructive"
                    className="flex-1 h-11"
                    disabled={isSubmitting}
                    onClick={handleReject}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                )}
                {onApprove && (
                  <Button
                    variant="default"
                    className="flex-1 h-11 bg-emerald-600 hover:bg-emerald-700 text-white"
                    disabled={isSubmitting || hasErrors}
                    onClick={handleApprove}
                  >
                    <Check className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Criteria list */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-sm">Evaluation Criteria</h3>
            </div>
            <span className="text-xs text-muted-foreground">
              {scoredCount} of {criteriaList.length} scored
            </span>
          </div>

          <ScrollArea className="h-[calc(95vh-12rem)]">
            <div className="space-y-3 pr-3">
              {criteriaList.length === 0 ? (
                <Card>
                  <CardContent className="flex flex-col items-center justify-center py-20">
                    <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                      <FileText className="h-8 w-8 text-muted-foreground/40" />
                    </div>
                    <p className="font-medium">No Evaluation Criteria</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      There are no criteria configured for this applicant.
                    </p>
                  </CardContent>
                </Card>
              ) : (
                currentScores.map((criteria, index) => {
                  const error = errors[criteria.id];
                  const cScore = Number(criteria.score) || 0;
                  const cMin = Number(criteria.min) || 0;
                  const cMax = Number(criteria.max) || 0;
                  const cRange = cMax - cMin;
                  const scorePercent =
                    cRange > 0
                      ? ((cScore - cMin) / cRange) * 100
                      : cMax > 0
                        ? (cScore / cMax) * 100
                        : 0;
                  const clampedPercent = Math.max(0, Math.min(100, scorePercent));

                  return (
                    <div
                      key={criteria.id}
                      className={cn(
                        'group rounded-xl border bg-card transition-all duration-200 hover:shadow-sm',
                        error
                          ? 'border-destructive/50 bg-destructive/[0.02]'
                          : 'hover:border-primary/20'
                      )}
                    >
                      {/* Header */}
                      <div className="flex items-start gap-3 p-4 pb-3">
                        <div
                          className={cn(
                            'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold transition-colors',
                            error
                              ? 'bg-destructive/10 text-destructive'
                              : clampedPercent >= 75
                                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                : 'bg-primary/10 text-primary'
                          )}
                        >
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold leading-tight">{criteria.label}</p>
                          {criteria.description && (
                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                              {criteria.description}
                            </p>
                          )}
                        </div>
                        <Badge
                          variant="outline"
                          className="shrink-0 text-[10px] font-semibold tabular-nums"
                        >
                          {criteria.weight}%
                        </Badge>
                      </div>

                      <div className="px-4 pb-4 space-y-3">
                        {/* File attachment */}
                        {criteria.file && (
                          <button
                            type="button"
                            onClick={() => handleViewFile(criteria.file)}
                            className="flex items-center gap-3 w-full rounded-lg border border-dashed bg-muted/20 p-2.5 text-left transition-colors hover:bg-muted/40 hover:border-primary/30"
                          >
                            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 shrink-0">
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium truncate">
                                {criteria.requirement?.requirement_name ?? 'Submitted Document'}
                              </p>
                              <p className="text-[10px] text-muted-foreground truncate">
                                {getFileName(criteria.file)}
                              </p>
                            </div>
                            <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          </button>
                        )}

                        {/* Score section */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <Label htmlFor={`score-${criteria.id}`} className="text-xs font-medium">
                              Score
                            </Label>
                            <span className="text-[10px] text-muted-foreground font-medium tabular-nums">
                              {criteria.min} – {criteria.max} range
                            </span>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <Input
                                id={`score-${criteria.id}`}
                                type="number"
                                min={criteria.min}
                                max={criteria.max}
                                step="0.01"
                                value={criteria.score}
                                onChange={(e) =>
                                  handleScoreChange(
                                    criteria.id,
                                    e.target.value,
                                    criteria.min,
                                    criteria.max
                                  )
                                }
                                className={cn(
                                  'w-24 text-right tabular-nums pr-3 font-medium',
                                  error && 'border-destructive focus-visible:ring-destructive'
                                )}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground shrink-0 font-medium">
                              / {criteria.max}
                            </span>
                            <div className="flex-1 flex items-center gap-2">
                              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                                <div
                                  className={cn(
                                    'h-full rounded-full transition-all duration-500 ease-out',
                                    error
                                      ? 'bg-destructive'
                                      : clampedPercent >= 75
                                        ? 'bg-emerald-500'
                                        : clampedPercent >= 50
                                          ? 'bg-amber-500'
                                          : 'bg-red-500'
                                  )}
                                  style={{ width: `${clampedPercent}%` }}
                                />
                              </div>
                              <span
                                className={cn(
                                  'text-[10px] font-bold tabular-nums w-8 text-right',
                                  error ? 'text-destructive' : 'text-muted-foreground'
                                )}
                              >
                                {clampedPercent.toFixed(0)}%
                              </span>
                            </div>
                          </div>

                          {error && (
                            <p className="text-xs text-destructive flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                              <XCircle className="h-3 w-3 shrink-0" />
                              {error}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Modal>
  );
}
