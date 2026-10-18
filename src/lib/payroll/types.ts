/**
 * Pakistan Statutory & Salary Structure Types
 */

export interface SalaryStructure {
  id: string;
  tenantId: string;
  name: string;
  basicPercentage: number;       // e.g. 60% of Gross
  houseRentPercentage: number;   // e.g. 25% of Gross
  medicalPercentage: number;     // e.g. 10% of Gross (exempt from tax up to 10% of Basic under FBR rules)
  conveyancePercentage: number;  // e.g. 5% of Gross
}

export interface CompensationRecord {
  id: string;
  tenantId: string;
  employeeId: string;
  grossSalary: number; // In PKR, decimal rounded
  effectiveDate: string;
}

export interface PayrollInput {
  employeeId: string;
  employeeName: string;
  grossSalary: number;
  unpaidLeaveDays: number;
  overtimeHours: number;
  daysInMonth: number;
  workedDays: number; // For mid-month joiner/leaver proration
}

export interface PayrollLineItem {
  name: string;
  category: 'earning' | 'deduction' | 'tax' | 'statutory';
  amount: number;
}

export interface CalculatedPayrollSlip {
  employeeId: string;
  employeeName: string;
  baseGross: number;
  proratedGross: number;
  basicSalary: number;
  houseRent: number;
  medicalAllowance: number;
  conveyanceAllowance: number;
  overtimePay: number;
  unpaidLeaveDeduction: number;
  taxWithholdingFbr: number;
  eobiEmployee: number;
  eobiEmployer: number;
  pessiEmployer: number;
  totalEarnings: number;
  totalDeductions: number;
  netPay: number;
  lineItems: PayrollLineItem[];
}
