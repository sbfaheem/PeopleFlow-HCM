/**
 * Data Models for Phase 5: Recruitment (ATS), Performance Management, Learning & Development
 */

// --- 1. Recruitment (ATS) ---
export type JobStage = 'sourced' | 'applied' | 'screening' | 'interview' | 'offered' | 'hired' | 'rejected';

export interface JobOpening {
  id: string;
  tenantId: string;
  title: string;
  departmentId: string;
  branchId: string;
  employmentType: 'full_time' | 'part_time' | 'contract';
  openingsCount: number;
  status: 'draft' | 'published' | 'closed';
  salaryMin?: number;
  salaryMax?: number;
  currency: string;
  createdAt: string;
}

export interface Candidate {
  id: string;
  tenantId: string;
  jobOpeningId: string;
  fullName: string;
  email: string;
  phone: string;
  stage: JobStage;
  cvUrl?: string;
  interviewRating?: number; // 1-5 scale
  notes?: string;
  createdAt: string;
}

// --- 2. Performance Management (OKRs & Appraisals) ---
export type ReviewCycleStatus = 'planning' | 'in_progress' | 'completed';

export interface PerformanceCycle {
  id: string;
  tenantId: string;
  title: string; // e.g. "Q1 2026 Appraisal Review"
  startDate: string;
  endDate: string;
  status: ReviewCycleStatus;
}

export interface EmployeeGoal {
  id: string;
  tenantId: string;
  employeeId: string;
  cycleId: string;
  title: string;
  category: 'OKR' | 'KPI';
  targetValue: number;
  currentValue: number;
  metric: string; // e.g. "% completed", "deals closed"
  status: 'not_started' | 'in_progress' | 'achieved';
}

export interface PerformanceReview {
  id: string;
  tenantId: string;
  cycleId: string;
  employeeId: string;
  reviewerId: string;
  selfScore?: number;    // 1-5
  managerScore?: number; // 1-5
  feedback?: string;
  status: 'draft' | 'submitted' | 'finalized';
}

// --- 3. Learning & Development (L&D) ---
export interface Course {
  id: string;
  tenantId: string;
  title: string;
  category: 'Compliance' | 'Technical' | 'Leadership';
  durationHours: number;
  isMandatory: boolean;
  description: string;
}

export interface CourseEnrollment {
  id: string;
  tenantId: string;
  courseId: string;
  employeeId: string;
  status: 'enrolled' | 'in_progress' | 'completed';
  progressPercentage: number;
  completedAt?: string;
}
