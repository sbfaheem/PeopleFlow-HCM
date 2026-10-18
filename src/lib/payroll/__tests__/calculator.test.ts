import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFbrTaxWithholding,
  calculateEobiContributions,
  calculatePessiContribution,
  calculateEmployeePayroll,
} from '../calculator';
import { PayrollInput } from '../types';

describe('Deterministic Pakistan Payroll Engine', () => {
  it('calculates zero tax for income within exempt slab (<= PKR 50,000/mo => 600,000/yr)', () => {
    const tax = calculateFbrTaxWithholding(50000);
    assert.equal(tax, 0);
  });

  it('calculates 5% tax for slab 2 (e.g. PKR 100,000/mo => 1,200,000/yr)', () => {
    // Annual = 1,200,000. Exceeds 600,000 by 600,000. Tax = 600,000 * 0.05 = 30,000 / year => 2,500 / month.
    const tax = calculateFbrTaxWithholding(100000);
    assert.equal(tax, 2500);
  });

  it('calculates progressive tax for higher salaried tiers (e.g. PKR 200,000/mo => 2,400,000/yr)', () => {
    // Annual = 2,400,000. Sits in PKR 2,200,001 - 3,200,000 slab.
    // Tax = 180,000 + (200,000 * 0.25) = 180,000 + 50,000 = 230,000 / yr => ~19,166.67 / mo.
    const tax = calculateFbrTaxWithholding(200000);
    assert.equal(tax, 19166.67);
  });

  it('calculates statutory EOBI and PESSI contributions correctly', () => {
    const eobi = calculateEobiContributions();
    assert.equal(eobi.employee, 370);
    assert.equal(eobi.employer, 1850);

    const pessi = calculatePessiContribution(150000); // capped at 25,000 * 6% = 1,500
    assert.equal(pessi, 1500);
  });

  it('computes full monthly payslip accurately without deductions', () => {
    const input: PayrollInput = {
      employeeId: 'emp-01',
      employeeName: 'Zainab Ahmed',
      grossSalary: 120000,
      unpaidLeaveDays: 0,
      overtimeHours: 0,
      daysInMonth: 30,
      workedDays: 30,
    };

    const slip = calculateEmployeePayroll(input);
    assert.equal(slip.proratedGross, 120000);
    assert.equal(slip.basicSalary, 72000); // 60%
    assert.equal(slip.houseRent, 30000);   // 25%
    assert.equal(slip.medicalAllowance, 12000); // 10%
    assert.equal(slip.conveyanceAllowance, 6000); // 5%
    assert.equal(slip.eobiEmployee, 370);
    assert.equal(slip.netPay > 0, true);
    assert.equal(slip.netPay, slip.totalEarnings - slip.totalDeductions);
  });

  it('deducts unpaid leave accurately (LWP proration)', () => {
    const input: PayrollInput = {
      employeeId: 'emp-02',
      employeeName: 'Bilal Faheem',
      grossSalary: 150000,
      unpaidLeaveDays: 2, // 2 days unpaid leave in 30-day month = 10,000 deduction
      overtimeHours: 0,
      daysInMonth: 30,
      workedDays: 30,
    };

    const slip = calculateEmployeePayroll(input);
    assert.equal(slip.unpaidLeaveDeduction, 10000);
    assert.equal(slip.totalEarnings, 140000);
  });

  it('prorates gross pay for mid-month joiner', () => {
    const input: PayrollInput = {
      employeeId: 'emp-03',
      employeeName: 'New Hire',
      grossSalary: 100000,
      unpaidLeaveDays: 0,
      overtimeHours: 0,
      daysInMonth: 30,
      workedDays: 15, // Joined mid-month (15 days worked)
    };

    const slip = calculateEmployeePayroll(input);
    assert.equal(slip.proratedGross, 50000);
    assert.equal(slip.basicSalary, 30000);
  });
});
