import { Elysia, t } from "elysia";
import { prisma } from "@hospital-ap/database";
import { ensureEmployeeExists } from "../utils/db.helpers";

export const expenseController = new Elysia({ prefix: "/api/expense-claims" })
  // 1. Submit an Expense Claim
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const employeeId = await ensureEmployeeExists(body.employeeId);

        // Optional check if parent advance exists
        if (body.parentAdvanceId) {
          const parentAdvance = await prisma.expenseClaim.findUnique({
            where: { claimId: body.parentAdvanceId },
          });
          if (!parentAdvance) {
            set.status = 400;
            return { error: `Parent TE-ADVANCE claim ${body.parentAdvanceId} not found` };
          }
        }

        const claim = await prisma.expenseClaim.create({
          data: {
            employeeId,
            claimType: body.claimType,
            amount: body.amount,
            description: body.description,
            status: "PENDING",
            parentAdvanceId: body.parentAdvanceId || null,
            checklists: {
              create: body.checklists.map((chk) => ({
                documentType: chk.documentType,
                pdfStorageUrl: chk.pdfStorageUrl,
                status: "PENDING",
              })),
            },
          },
          include: {
            checklists: true,
          },
        });

        set.status = 201;
        return claim;
      } catch (error) {
        set.status = 500;
        return { error: error instanceof Error ? error.message : String(error) };
      }
    },
    {
      body: t.Object({
        employeeId: t.String(),
        claimType: t.String(), // "PETTY_CASH" | "TE-ADVANCE" | "TE_Clear"
        amount: t.Numeric(),
        description: t.String(),
        parentAdvanceId: t.Optional(t.String()),
        checklists: t.Array(
          t.Object({
            documentType: t.String(),
            pdfStorageUrl: t.String(),
          })
        ),
      }),
    }
  )

  // 2. Get all Expense Claims (with optional status / type filters)
  .get(
    "/",
    async ({ query }) => {
      const where: any = {};
      if (query.status) {
        where.status = query.status;
      }
      if (query.claimType) {
        where.claimType = query.claimType;
      }
      if (query.employeeId) {
        where.employeeId = query.employeeId;
      }

      return prisma.expenseClaim.findMany({
        where,
        include: {
          checklists: true,
          employee: {
            include: {
              department: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    },
    {
      query: t.Optional(
        t.Object({
          status: t.Optional(t.String()),
          claimType: t.Optional(t.String()),
          employeeId: t.Optional(t.String()),
        })
      ),
    }
  )

  // 3. Get single Expense Claim details
  .get("/:id", async ({ params, set }) => {
    const claim = await prisma.expenseClaim.findUnique({
      where: { claimId: params.id },
      include: {
        checklists: true,
        employee: {
          include: {
            department: true,
          },
        },
        parentAdvance: true,
        clearanceClaims: true,
      },
    });

    if (!claim) {
      set.status = 404;
      return { error: "Expense Claim not found" };
    }

    return claim;
  })

  // 4. Update individual Expense Checklist item status (AP Clerk action)
  .put(
    "/:id/checklist/:checklistId",
    async ({ params, body, set }) => {
      try {
        const checklistItem = await prisma.expenseChecklist.findUnique({
          where: { expCheckId: params.checklistId },
        });

        if (!checklistItem || checklistItem.claimId !== params.id) {
          set.status = 404;
          return { error: "Checklist item not found for this claim" };
        }

        const updated = await prisma.expenseChecklist.update({
          where: { expCheckId: params.checklistId },
          data: {
            status: body.status,
          },
        });

        return updated;
      } catch (error) {
        set.status = 500;
        return { error: error instanceof Error ? error.message : String(error) };
      }
    },
    {
      body: t.Object({
        status: t.String(), // "VERIFIED" | "FAILED" | "PENDING"
      }),
    }
  )

  // 5. Approve or Reject an Expense Claim (Department Head action)
  .put(
    "/:id/approve",
    async ({ params, body, set }) => {
      try {
        const claim = await prisma.expenseClaim.findUnique({
          where: { claimId: params.id },
        });

        if (!claim) {
          set.status = 404;
          return { error: "Expense Claim not found" };
        }

        if (claim.status !== "PENDING") {
          set.status = 400;
          return { error: `Claim is already in status: ${claim.status}` };
        }

        const nextStatus = body.action === "APPROVE" ? "APPROVED" : "REJECTED";

        const updated = await prisma.expenseClaim.update({
          where: { claimId: params.id },
          data: {
            status: nextStatus,
          },
        });

        return updated;
      } catch (error) {
        set.status = 500;
        return { error: error instanceof Error ? error.message : String(error) };
      }
    },
    {
      body: t.Object({
        action: t.String(), // "APPROVE" | "REJECT"
      }),
    }
  )

  // 6. Clear and Pay an Expense Claim (AP Clerk/Auditor action)
  .put("/:id/clear", async ({ params, set }) => {
    try {
      const claim = await prisma.expenseClaim.findUnique({
        where: { claimId: params.id },
        include: { checklists: true },
      });

      if (!claim) {
        set.status = 404;
        return { error: "Expense Claim not found" };
      }

      if (claim.status !== "APPROVED") {
        set.status = 400;
        return { error: "Claim must be APPROVED by Department Head first" };
      }

      // Ensure all checklist items are verified
      const unverified = claim.checklists.filter((chk) => chk.status !== "VERIFIED");
      if (unverified.length > 0) {
        set.status = 400;
        return {
          error: "Cannot clear claim. Some document links have not been verified.",
          unverified: unverified.map((u) => u.documentType),
        };
      }

      const updated = await prisma.expenseClaim.update({
        where: { claimId: params.id },
        data: {
          status: "CLEARED",
        },
      });

      return updated;
    } catch (error) {
      set.status = 500;
      return { error: error instanceof Error ? error.message : String(error) };
    }
  });
