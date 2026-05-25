import { Elysia, t } from "elysia";
import { prisma } from "@hospital-ap/database";
import { ensureEmployeeExists } from "../utils/db.helpers";

export const ticketController = new Elysia({ prefix: "/api/tickets" })
  // 1. Submit/Create a Ticket
  .post(
    "/",
    async ({ body, set }) => {
      try {
        // Ensure department existence or auto-create it
        let dept = await prisma.department.findUnique({
          where: { departmentId: body.departmentId },
        });

        if (!dept) {
          const deptNames: Record<string, string> = {
            ap: "Accounts Payable",
            purchasing: "Purchasing",
            legal: "Legal",
            acc: "Accounting",
          };
          const name = deptNames[body.departmentId.toLowerCase()] || `Department ${body.departmentId}`;
          dept = await prisma.department.create({
            data: {
              departmentId: body.departmentId,
              departmentName: name,
            },
          });
        }

        // Validate / ensure employee exists
        let employeeId = body.employeeId;
        if (employeeId) {
          employeeId = await ensureEmployeeExists(employeeId);
        } else {
          set.status = 400;
          return { error: "Employee ID (or email) is required to submit a ticket" };
        }

        const ticket = await prisma.ticket.create({
          data: {
            title: body.title,
            description: body.description,
            category: body.category,
            status: "PENDING",
            priority: body.priority || "MEDIUM",
            attachmentUrl: body.attachmentUrl || null,
            departmentId: body.departmentId,
            employeeId: employeeId,
          },
          include: {
            department: true,
            employee: true,
          },
        });

        set.status = 201;
        return ticket;
      } catch (error) {
        set.status = 500;
        return { error: error instanceof Error ? error.message : String(error) };
      }
    },
    {
      body: t.Object({
        title: t.String(),
        description: t.String(),
        category: t.String(), // "DEBT_SETUP" | "PAYMENT" | "TE_ADVANCE" | "TE_CLEAR" | "PETTY_CASH" | "OTHER"
        priority: t.Optional(t.String()), // "LOW" | "MEDIUM" | "HIGH" | "URGENT"
        attachmentUrl: t.Optional(t.String()),
        departmentId: t.String(),
        employeeId: t.String(),
      }),
    }
  )

  // 2. Get all Tickets (optionally filtered by departmentId)
  .get(
    "/",
    async ({ query }) => {
      const where: any = {};
      if (query.departmentId) {
        where.departmentId = query.departmentId;
      }

      return prisma.ticket.findMany({
        where,
        include: {
          department: true,
          employee: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
    },
    {
      query: t.Optional(
        t.Object({
          departmentId: t.Optional(t.String()),
        })
      ),
    }
  )

  // 3. Update Ticket Status and Attachments
  .put(
    "/:id/status",
    async ({ params, body, set }) => {
      try {
        const existing = await prisma.ticket.findUnique({
          where: { ticketId: params.id },
        });

        if (!existing) {
          set.status = 404;
          return { error: "Ticket not found" };
        }

        const updated = await prisma.ticket.update({
          where: { ticketId: params.id },
          data: {
            status: body.status,
            attachmentUrl: body.attachmentUrl !== undefined ? body.attachmentUrl : existing.attachmentUrl,
          },
          include: {
            department: true,
            employee: true,
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
        status: t.String(), // "PENDING" | "PROCESSING" | "APPROVED" | "REJECTED" | "CLOSED"
        attachmentUrl: t.Optional(t.String()),
      }),
    }
  )

  // 4. Delete a Ticket
  .delete("/:id", async ({ params, set }) => {
    try {
      const existing = await prisma.ticket.findUnique({
        where: { ticketId: params.id },
      });

      if (!existing) {
        set.status = 404;
        return { error: "Ticket not found" };
      }

      await prisma.ticket.delete({
        where: { ticketId: params.id },
      });

      return { message: "Ticket successfully deleted" };
    } catch (error) {
      set.status = 500;
      return { error: error instanceof Error ? error.message : String(error) };
    }
  });
