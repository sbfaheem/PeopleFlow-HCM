import { EmployeeGoal, PerformanceReview } from './types';

/**
 * Calculates overall OKR completion percentage for an employee.
 */
export function calculateOkrProgress(goals: EmployeeGoal[]): number {
  if (goals.length === 0) return 0;
  const total = goals.reduce((acc, g) => {
    const ratio = Math.min(1, Math.max(0, g.currentValue / g.targetValue));
    return acc + ratio;
  }, 0);

  return Math.round((total / goals.length) * 100);
}

/**
 * Evaluates performance appraisal score.
 * Weighted average: 30% self-assessment, 70% manager rating.
 */
export function calculateWeightedAppraisalScore(review: PerformanceReview): number {
  const self = review.selfScore || 0;
  const manager = review.managerScore || 0;

  if (manager === 0) return self;
  if (self === 0) return manager;

  const score = (self * 0.3) + (manager * 0.7);
  return Math.round(score * 10) / 10;
}
