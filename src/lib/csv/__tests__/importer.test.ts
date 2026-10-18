import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseAndValidateEmployeeCsv, exportEmployeesToCsv } from '../importer';
import { Employee } from '../../db/types';

describe('CSV Bulk Importer & Data Masked Exporter', () => {
  it('parses valid employee rows successfully', () => {
    const csv = `firstName,lastName,workEmail,cnic\nAsad,Khan,asad.khan@acmepk.com,42101-1111111-1\nMarium,Noor,marium.noor@acmepk.com,42201-2222222-2`;
    const res = parseAndValidateEmployeeCsv(csv);
    assert.equal(res.totalRows, 2);
    assert.equal(res.validRows.length, 2);
    assert.equal(res.errors.length, 0);
  });

  it('detects duplicate emails within the CSV file and against existing directory', () => {
    const csv = `firstName,lastName,workEmail,cnic\nAsad,Khan,existing@acmepk.com,42101-1111111-1\nDup,User,dup@acmepk.com,42201-2222222-2\nDup2,User,dup@acmepk.com,42301-3333333-3`;
    const res = parseAndValidateEmployeeCsv(csv, ['existing@acmepk.com']);
    assert.equal(res.errors.length >= 2, true);
    assert.equal(res.validRows.length, 1);
  });

  it('exports employee data with masked CNIC when full PII is not authorized', () => {
    const mockEmployees: Employee[] = [
      {
        id: 'emp-01',
        tenantId: 't-01',
        employeeNumber: 'EMP-2026-0001',
        firstName: 'Zainab',
        lastName: 'Ahmed',
        workEmail: 'zainab@acmepk.com',
        cnic: '42201-1234567-2',
        gender: 'female',
        legalEntityId: 'le-01',
        branchId: 'br-01',
        departmentId: 'dept-01',
        designationId: 'des-01',
        employmentType: 'permanent',
        employmentStatus: 'active',
        joiningDate: '2024-01-15',
        isArchived: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    const maskedCsv = exportEmployeesToCsv(mockEmployees, false);
    assert.equal(maskedCsv.includes('42201-*******-2'), true);
    assert.equal(maskedCsv.includes('42201-1234567-2'), false);

    const unmaskedCsv = exportEmployeesToCsv(mockEmployees, true);
    assert.equal(unmaskedCsv.includes('42201-1234567-2'), true);
  });
});
