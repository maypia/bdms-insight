import { prisma } from "@hospital-ap/database";

export async function ensureEmployeeExists(employeeIdOrEmail: string): Promise<string> {
  // Try to find by employeeId or email
  const existingEmployee = await prisma.employee.findFirst({
    where: {
      OR: [
        { employeeId: employeeIdOrEmail },
        { email: employeeIdOrEmail },
      ],
    },
  });

  if (existingEmployee) {
    return existingEmployee.employeeId;
  }

  const deptId = "ap";
  await prisma.department.upsert({
    where: { departmentId: deptId },
    update: {},
    create: {
      departmentId: deptId,
      departmentName: "Accounts Payable",
    },
  });

  // Calculate clean email: if it's already an email, use it. Otherwise append domain.
  const email = employeeIdOrEmail.includes("@") 
    ? employeeIdOrEmail 
    : `${employeeIdOrEmail}@bdms.local`;

  // Avoid unique constraint violation if email is already in DB under a different ID
  const emailConflict = await prisma.employee.findUnique({
    where: { email },
  });

  if (emailConflict) {
    return emailConflict.employeeId;
  }

  // Derive employeeId: if employeeIdOrEmail has @, use part before @ or just use it directly
  const employeeId = employeeIdOrEmail;
  const username = employeeIdOrEmail.includes("@") 
    ? employeeIdOrEmail.split("@")[0] 
    : employeeIdOrEmail;
  
  const firstName = username.split(".")[0] || "Test";
  const lastName = username.split(".")[1] || "Employee";

  // Capitalize name parts
  const capitalizedFirst = firstName.charAt(0).toUpperCase() + firstName.slice(1);
  const capitalizedLast = lastName.charAt(0).toUpperCase() + lastName.slice(1);

  await prisma.employee.create({
    data: {
      employeeId,
      firstName: capitalizedFirst,
      lastName: capitalizedLast,
      email,
      departmentId: deptId,
    },
  });

  return employeeId;
}
