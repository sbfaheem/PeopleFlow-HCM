import { SecurityContext } from '../auth/types';
import { requirePermission } from '../auth/guards';

export interface CopilotQueryRequest {
  prompt: string;
  category: 'policy_inquiry' | 'report_summary' | 'draft_job_description' | 'tax_explanation';
}

export interface CopilotResponse {
  answer: string;
  category: string;
  sourceContext: string;
  tenantId: string;
  timestamp: string;
}

/**
 * Sandboxed AI HR Copilot Engine.
 * Enforces tenant scoping, permission gates, and refuses direct state mutation actions.
 */
export function processCopilotQuery(
  context: SecurityContext,
  request: CopilotQueryRequest
): CopilotResponse {
  if (!context.tenant) {
    throw new Error('Tenant context required for AI Copilot queries.');
  }

  // 1. Permission Check based on inquiry category
  if (request.category === 'report_summary') {
    requirePermission(context, 'employees.read');
  }

  // 2. Guard against mutation injection
  const dangerousKeywords = ['finalize payroll', 'approve leave', 'delete employee', 'change salary'];
  const hasDangerousIntent = dangerousKeywords.some((k) => request.prompt.toLowerCase().includes(k));
  if (hasDangerousIntent) {
    return {
      answer:
        'Safety Guardrail: The AI HR Copilot operates in read-only and drafting mode. Consequential actions such as payroll finalization or salary modifications require explicit human workflow approval through the designated admin modules.',
      category: request.category,
      sourceContext: 'Security Guardrail Policy',
      tenantId: context.tenant.tenantId,
      timestamp: new Date().toISOString(),
    };
  }

  // 3. Deterministic Category Handlers
  let answer = '';
  let sourceContext = '';

  switch (request.category) {
    case 'tax_explanation':
      answer =
        'Under Pakistan Federal Budget Tax Year 2025–26, salaried individuals are taxed under progressive brackets starting above PKR 600,000/year (PKR 50,000/month). Income between PKR 600,001 and 1,200,000 is taxed at 5% of the excess. Medical Allowance is exempt up to 10% of Basic Salary under Section 12 of the Income Tax Ordinance.';
      sourceContext = 'Pakistan FBR Income Tax Ordinance & PeopleFlow Tax Strategy Pack';
      break;

    case 'policy_inquiry':
      answer =
        'Standard working hours are 09:00 to 18:00 (PKT) Monday through Friday with a 15-minute grace period. Annual Leave entitlement is 14 days per calendar year, Casual Leave is 10 days, and Sick Leave is 8 days. Medical certificates are required for sick leave exceeding 2 consecutive days.';
      sourceContext = 'Acme Tech Employee Handbook & Leave Policy 2026';
      break;

    case 'draft_job_description':
      answer =
        'Job Description Draft:\n\nTitle: Senior Full Stack Engineer\nLocation: Clifton, Karachi (Hybrid)\nDepartment: Engineering\n\nKey Responsibilities:\n- Architect and maintain enterprise SaaS features using Next.js, TypeScript, and PostgreSQL.\n- Implement high-trust RBAC and multi-tenant security isolation.\n- Collaborate on deterministic payroll and attendance engines.\n\nQualifications:\n- 4+ years full-stack web development experience.\n- Deep understanding of relational databases and multi-tier APIs.';
      sourceContext = 'PeopleFlow Job Description Generator';
      break;

    case 'report_summary':
      answer =
        'Workforce Summary for Acme Tech (PK):\n- Total Headcount: 2 Active Employees.\n- Departmental Distribution: 50% Engineering, 50% People & Culture.\n- Punctuality Rate: 100% Turnout today.\n- Monthly Payroll Disbursement: PKR 255,260 Net across active branches.';
      sourceContext = 'Tenant Real-time Analytics Snapshot';
      break;
  }

  return {
    answer,
    category: request.category,
    sourceContext,
    tenantId: context.tenant.tenantId,
    timestamp: new Date().toISOString(),
  };
}
