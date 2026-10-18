import { NextResponse } from 'next/server';
import { mockDb } from '@/lib/db/mock-repository';
import { SecurityContext, ROLE_PERMISSIONS } from '@/lib/auth/types';
import { hasPermission } from '@/lib/auth/guards';

// Demo session context for local development / testing
const demoContext: SecurityContext = {
  user: { id: 'user-hr-demo', email: 'hr.admin@acmepk.com' },
  tenant: {
    tenantId: 't-acme-pk-01',
    tenantSlug: 'acme-pk',
    membershipId: 'mem-demo-01',
    role: 'HR_MANAGER',
    permissions: ROLE_PERMISSIONS['HR_MANAGER'],
  },
};

export async function GET(request: Request) {
  try {
    if (!hasPermission(demoContext, 'employees.read')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const departmentId = searchParams.get('departmentId') || undefined;
    const status = searchParams.get('status') || undefined;
    const search = searchParams.get('search') || undefined;

    const employees = mockDb.getEmployees(demoContext, { departmentId, status, search });
    const departments = mockDb.getDepartments(demoContext);
    const branches = mockDb.getBranches(demoContext);
    const designations = mockDb.getDesignations(demoContext);

    return NextResponse.json({
      data: employees,
      meta: {
        total: employees.length,
        tenant: demoContext.tenant?.tenantSlug,
      },
      lookups: {
        departments,
        branches,
        designations,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!hasPermission(demoContext, 'employees.create')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await request.json();
    const newEmployee = mockDb.createEmployee(demoContext, body);

    return NextResponse.json({ data: newEmployee }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
