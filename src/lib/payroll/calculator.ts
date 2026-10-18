import { PayrollInput, CalculatedPayrollSlip, SalaryStructure } from './types';

/**
 * Default standard Pakistan salary structure.
 * 60% Basic, 25% House Rent, 10% Medical, 5% Conveyance.
 */
export const DEFAULT_PK_STRUCTURE: SalaryStructure = {
  id: 'pk-std-struct',
  tenantId: 'global',
  name: 'Pakistan Standard Structure',
  basicPercentage: 60,
  houseRentPercentage: 25,
  medicalPercentage: 10,
  conveyancePercentage: 5,
};

/**
 * Pure function: Calculates monthly Pakistan FBR income tax withholding for salaried individuals.
 * Based on Pakistan Federal Budget Tax Slabs:
 * - Up to PKR 600,000 / year: 0%
 * - PKR 600,001 to 1,200,000: 5% of amount exceeding 600,000
 * - PKR 1,200,001 to 2,200,000: PKR 30,000 + 15% of amount exceeding 1,200,000
 * - PKR 2,200,001 to 3,200,000: PKR 180,000 + 25% of amount exceeding 2,200,000
 * - PKR 3,200,001 to 4,100,000: PKR 430,000 + 30% of amount exceeding 3,200,000
 * - Exceeding PKR 4,100,000: PKR 700,000 + 35% of amount exceeding 4,100,000
 */
export function calculateFbrTaxWithholding(monthlyTaxableIncome: number): number {
  const annualTaxable = monthlyTaxableIncome * 12;
  let annualTax = 0;

  if (annualTaxable <= 600000) {
    annualTax = 0;
  } else if (annualTaxable <= 1200000) {
    annualTax = (annualTaxable - 600000) * 0.05;
  } else if (annualTaxable <= 2200000) {
    annualTax = 30000 + (annualTaxable - 1200000) * 0.15;
  } else if (annualTaxable <= 3200000) {
    annualTax = 180000 + (annualTaxable - 2200000) * 0.25;
  } else if (annualTaxable <= 4100000) {
    annualTax = 430000 + (annualTaxable - 3200000) * 0.30;
  } else {
    annualTax = 700000 + (annualTaxable - 4100000) * 0.35;
  }

  // Monthly withholding rounded to 2 decimal places
  return Math.round((annualTax / 12) * 100) / 100;
}

/**
 * Pure function: Calculates EOBI (Employees' Old-Age Benefits Institution) contributions.
 * Under current statutory benchmark:
 * - Employee contribution: 1% of minimum wage (PKR 37,000 min wage benchmark => PKR 370/month)
 * - Employer contribution: 5% of minimum wage (PKR 37,000 min wage benchmark => PKR 1,850/month)
 */
export function calculateEobiContributions(): { employee: number; employer: number } {
  return {
    employee: 370,
    employer: 1850,
  };
}

/**
 * Pure function: Calculates Provincial Social Security (SESSI / PESSI).
 * Employer contribution is 6% of wages up to statutory wage ceiling of PKR 25,000 (i.e. PKR 1,500/month).
 */
export function calculatePessiContribution(grossSalary: number): number {
  const ceiling = Math.min(grossSalary, 25000);
  return Math.round(ceiling * 0.06 * 100) / 100;
}

/**
 * Pure function: Deterministic Payroll Calculator.
 * Operates on exact decimals, handles mid-month proration, unpaid leave deductions, and statutory taxes.
 */
export function calculateEmployeePayroll(
  input: PayrollInput,
  structure: SalaryStructure = DEFAULT_PK_STRUCTURE
): CalculatedPayrollSlip {
  // 1. Mid-month joiner / leaver proration
  const prorationFactor = Math.min(1, Math.max(0, input.workedDays / input.daysInMonth));
  const proratedGross = Math.round(input.grossSalary * prorationFactor * 100) / 100;

  // 2. Salary Components
  const basicSalary = Math.round(proratedGross * (structure.basicPercentage / 100) * 100) / 100;
  const houseRent = Math.round(proratedGross * (structure.houseRentPercentage / 100) * 100) / 100;
  const medicalAllowance = Math.round(proratedGross * (structure.medicalPercentage / 100) * 100) / 100;
  const conveyanceAllowance = Math.round(proratedGross * (structure.conveyancePercentage / 100) * 100) / 100;

  // 3. Overtime Pay: Standard formula = (Basic / (daysInMonth * 8)) * 2 * overtimeHours
  const hourlyRate = basicSalary / (input.daysInMonth * 8);
  const overtimePay = Math.round(hourlyRate * 2 * input.overtimeHours * 100) / 100;

  // 4. Unpaid Leave (LWP) Deduction: (Gross / daysInMonth) * unpaidLeaveDays
  const dailyRate = proratedGross / input.daysInMonth;
  const unpaidLeaveDeduction = Math.round(dailyRate * input.unpaidLeaveDays * 100) / 100;

  // 5. Total Gross Earnings
  const totalEarnings = Math.round((proratedGross + overtimePay - unpaidLeaveDeduction) * 100) / 100;

  // 6. Taxable Income Calculation:
  // Under Pakistan tax law, Medical Allowance is exempt from tax up to 10% of Basic Salary.
  const medicalExemption = Math.min(medicalAllowance, basicSalary * 0.10);
  const taxableMedical = Math.max(0, medicalAllowance - medicalExemption);
  const monthlyTaxable = Math.max(0, totalEarnings - medicalAllowance + taxableMedical);

  // 7. Statutory Deductions
  const taxWithholdingFbr = calculateFbrTaxWithholding(monthlyTaxable);
  const eobi = calculateEobiContributions();
  const pessiEmployer = calculatePessiContribution(input.grossSalary);

  const totalDeductions = Math.round((taxWithholdingFbr + eobi.employee) * 100) / 100;
  const netPay = Math.round((totalEarnings - totalDeductions) * 100) / 100;

  return {
    employeeId: input.employeeId,
    employeeName: input.employeeName,
    baseGross: input.grossSalary,
    proratedGross,
    basicSalary,
    houseRent,
    medicalAllowance,
    conveyanceAllowance,
    overtimePay,
    unpaidLeaveDeduction,
    taxWithholdingFbr,
    eobiEmployee: eobi.employee,
    eobiEmployer: eobi.employer,
    pessiEmployer,
    totalEarnings,
    totalDeductions,
    netPay,
    lineItems: [
      { name: 'Basic Salary', category: 'earning', amount: basicSalary },
      { name: 'House Rent Allowance', category: 'earning', amount: houseRent },
      { name: 'Medical Allowance', category: 'earning', amount: medicalAllowance },
      { name: 'Conveyance Allowance', category: 'earning', amount: conveyanceAllowance },
      ...(overtimePay > 0 ? [{ name: 'Overtime Pay', category: 'earning' as const, amount: overtimePay }] : []),
      ...(unpaidLeaveDeduction > 0
        ? [{ name: 'Leave Without Pay (LWP)', category: 'deduction' as const, amount: unpaidLeaveDeduction }]
        : []),
      { name: 'Income Tax (FBR Withholding)', category: 'tax', amount: taxWithholdingFbr },
      { name: 'EOBI (Employee Pension)', category: 'statutory', amount: eobi.employee },
    ],
  };
}
