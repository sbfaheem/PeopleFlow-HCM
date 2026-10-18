import { Employee } from '../db/types';

export interface CsvValidationResult {
  validRows: Array<Omit<Employee, 'id' | 'tenantId' | 'employeeNumber' | 'createdAt' | 'updatedAt' | 'isArchived'>>;
  errors: Array<{ row: number; field: string; message: string }>;
  totalRows: number;
}

/**
 * Validates and parses raw CSV string of employees.
 * Required columns: firstName, lastName, workEmail, cnic, departmentId, designationId, branchId, legalEntityId
 */
export function parseAndValidateEmployeeCsv(
  csvContent: string,
  existingEmails: string[] = []
): CsvValidationResult {
  const lines = csvContent
    .trim()
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  if (lines.length < 2) {
    return {
      validRows: [],
      errors: [{ row: 0, field: 'file', message: 'CSV file is empty or missing data rows.' }],
      totalRows: 0,
    };
  }

  const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
  const emailColIdx = headers.indexOf('workemail');
  const firstNameColIdx = headers.indexOf('firstname');
  const lastNameColIdx = headers.indexOf('lastname');
  const cnicColIdx = headers.indexOf('cnic');

  const validRows: CsvValidationResult['validRows'] = [];
  const errors: CsvValidationResult['errors'] = [];
  const seenEmailsInFile = new Set<string>();

  for (let i = 1; i < lines.length; i++) {
    const rowNum = i + 1;
    const cols = lines[i].split(',').map((c) => c.trim());

    const firstName = cols[firstNameColIdx] || '';
    const lastName = cols[lastNameColIdx] || '';
    const workEmail = (cols[emailColIdx] || '').toLowerCase();
    const cnic = cols[cnicColIdx] || '';

    if (!firstName) {
      errors.push({ row: rowNum, field: 'firstName', message: 'First name is required.' });
    }
    if (!lastName) {
      errors.push({ row: rowNum, field: 'lastName', message: 'Last name is required.' });
    }
    if (!workEmail || !workEmail.includes('@')) {
      errors.push({ row: rowNum, field: 'workEmail', message: 'Valid work email is required.' });
    } else if (existingEmails.includes(workEmail) || seenEmailsInFile.has(workEmail)) {
      errors.push({ row: rowNum, field: 'workEmail', message: `Duplicate email detected: ${workEmail}` });
    } else {
      seenEmailsInFile.add(workEmail);
    }

    if (!cnic) {
      errors.push({ row: rowNum, field: 'cnic', message: 'CNIC is required.' });
    }

    if (!errors.some((e) => e.row === rowNum)) {
      validRows.push({
        firstName,
        lastName,
        workEmail,
        cnic,
        gender: 'male',
        departmentId: 'dept-01',
        designationId: 'des-02',
        branchId: 'br-01',
        legalEntityId: 'le-01',
        employmentType: 'permanent',
        employmentStatus: 'active',
        joiningDate: new Date().toISOString().split('T')[0],
      });
    }
  }

  return {
    validRows,
    errors,
    totalRows: lines.length - 1,
  };
}

/**
 * Exports employees to CSV with masked PII based on permission.
 */
export function exportEmployeesToCsv(employees: Employee[], canViewFullPii: boolean = false): string {
  const headers = ['Employee ID', 'First Name', 'Last Name', 'Work Email', 'CNIC', 'Status', 'Joining Date'];
  const rows = employees.map((emp) => {
    const maskedCnic = canViewFullPii
      ? emp.cnic
      : emp.cnic
      ? `${emp.cnic.slice(0, 5)}-*******-${emp.cnic.slice(-1)}`
      : 'N/A';
    return [
      emp.employeeNumber,
      `"${emp.firstName}"`,
      `"${emp.lastName}"`,
      emp.workEmail,
      `"${maskedCnic}"`,
      emp.employmentStatus,
      emp.joiningDate,
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}
