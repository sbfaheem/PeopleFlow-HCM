import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { transitionCandidateStage, convertCandidateToEmployee, RecruitmentWorkflowError } from '../recruitment-service';
import { calculateOkrProgress, calculateWeightedAppraisalScore } from '../performance-service';
import { Candidate, EmployeeGoal, PerformanceReview } from '../types';

describe('Advanced Modules: Recruitment ATS & Performance OKRs', () => {
  const candidate: Candidate = {
    id: 'cand-01',
    tenantId: 't-01',
    jobOpeningId: 'job-01',
    fullName: 'Hamza Tariq',
    email: 'hamza.tariq@example.com',
    phone: '+92 300 1234567',
    stage: 'screening',
    interviewRating: 4,
    createdAt: new Date().toISOString(),
  };

  it('transitions candidate stage through valid recruitment workflow', () => {
    const updated = transitionCandidateStage(candidate, 'interview');
    assert.equal(updated.stage, 'interview');

    const offered = transitionCandidateStage(updated, 'offered');
    assert.equal(offered.stage, 'offered');
  });

  it('rejects transitioning an already hired candidate', () => {
    const hiredCand = { ...candidate, stage: 'hired' as const };
    assert.throws(
      () => transitionCandidateStage(hiredCand, 'interview'),
      RecruitmentWorkflowError
    );
  });

  it('converts an offered/hired candidate to an employee record cleanly', () => {
    const offeredCand = { ...candidate, stage: 'offered' as const };
    const empData = convertCandidateToEmployee(offeredCand, {
      cnic: '35201-1122334-1',
      departmentId: 'dept-01',
      designationId: 'des-02',
      branchId: 'br-01',
      legalEntityId: 'le-01',
      joiningDate: '2026-05-01',
    });

    assert.equal(empData.firstName, 'Hamza');
    assert.equal(empData.lastName, 'Tariq');
    assert.equal(empData.workEmail, 'hamza.tariq@example.com');
    assert.equal(empData.cnic, '35201-1122334-1');
  });

  it('calculates average OKR completion progress correctly', () => {
    const goals: EmployeeGoal[] = [
      {
        id: 'g-01',
        tenantId: 't-01',
        employeeId: 'emp-01',
        cycleId: 'c-01',
        title: 'Ship Core HCM modules',
        category: 'OKR',
        targetValue: 100,
        currentValue: 100, // 100%
        metric: '% completed',
        status: 'achieved',
      },
      {
        id: 'g-02',
        tenantId: 't-01',
        employeeId: 'emp-01',
        cycleId: 'c-01',
        title: 'Reduce bug report volume',
        category: 'OKR',
        targetValue: 10,
        currentValue: 5, // 50%
        metric: 'tickets',
        status: 'in_progress',
      },
    ];

    // (100% + 50%) / 2 = 75%
    const progress = calculateOkrProgress(goals);
    assert.equal(progress, 75);
  });

  it('calculates weighted appraisal rating (30% self, 70% manager)', () => {
    const review: PerformanceReview = {
      id: 'rev-01',
      tenantId: 't-01',
      cycleId: 'c-01',
      employeeId: 'emp-01',
      reviewerId: 'emp-mgr',
      selfScore: 5.0,
      managerScore: 4.0,
      status: 'submitted',
    };

    // (5 * 0.3) + (4 * 0.7) = 1.5 + 2.8 = 4.3
    const score = calculateWeightedAppraisalScore(review);
    assert.equal(score, 4.3);
  });
});
