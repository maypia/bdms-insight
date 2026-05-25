import { Elysia, t } from "elysia";
import { prisma } from "@hospital-ap/database";

export const invoiceController = new Elysia({ prefix: "/api/invoices" })
  // 1. Submit an Invoice
  .post(
    "/",
    async ({ body, set }) => {
      try {
        const invoice = await prisma.invoice.create({
          data: {
            vendorName: body.vendorName,
            invoiceNumber: body.invoiceNumber,
            jobType: body.jobType,
            netAmount: body.netAmount,
            dueDate: new Date(body.dueDate),
            status: "PENDING",
            fhirReferenceId: body.fhirReferenceId || null,
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
        return invoice;
      } catch (error) {
        set.status = 500;
        return { error: error instanceof Error ? error.message : String(error) };
      }
    },
    {
      body: t.Object({
        vendorName: t.String(),
        invoiceNumber: t.String(),
        jobType: t.String(),
        netAmount: t.Numeric(),
        dueDate: t.String(), // ISO format date
        fhirReferenceId: t.Optional(t.String()),
        checklists: t.Array(
          t.Object({
            documentType: t.String(),
            pdfStorageUrl: t.String(),
          })
        ),
      }),
    }
  )

  // 2. Get all Invoices
  .get("/", async () => {
    return prisma.invoice.findMany({
      include: {
        checklists: true,
        paymentSchedule: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  })

  // 3. Get single Invoice details
  .get("/:id", async ({ params, set }) => {
    const invoice = await prisma.invoice.findUnique({
      where: { invoiceId: params.id },
      include: {
        checklists: true,
        paymentSchedule: true,
      },
    });

    if (!invoice) {
      set.status = 404;
      return { error: "Invoice not found" };
    }

    return invoice;
  })

  // 4. Update individual Invoice Checklist item status (AP Clerk action)
  .put(
    "/:id/checklist/:checklistId",
    async ({ params, body, set }) => {
      try {
        const checklistItem = await prisma.invoiceChecklist.findUnique({
          where: { checklistId: params.checklistId },
        });

        if (!checklistItem || checklistItem.invoiceId !== params.id) {
          set.status = 404;
          return { error: "Checklist item not found for this invoice" };
        }

        const updated = await prisma.invoiceChecklist.update({
          where: { checklistId: params.checklistId },
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

  // 5. Schedule Payment & Approve Invoice (AP Clerk action)
  .post(
    "/:id/schedule",
    async ({ params, body, set }) => {
      try {
        const invoice = await prisma.invoice.findUnique({
          where: { invoiceId: params.id },
          include: { checklists: true },
        });

        if (!invoice) {
          set.status = 404;
          return { error: "Invoice not found" };
        }

        // Ensure all checklist items are verified
        const unverified = invoice.checklists.filter((chk) => chk.status !== "VERIFIED");
        if (unverified.length > 0) {
          set.status = 400;
          return {
            error: "Cannot schedule payment. Some document checklists have not been verified.",
            unverified: unverified.map((u) => u.documentType),
          };
        }

        // Upsert or create Payment Schedule
        const schedule = await prisma.paymentSchedule.upsert({
          where: { invoiceId: params.id },
          update: {
            paymentMethod: body.paymentMethod,
            actionDate: new Date(body.actionDate),
            timeSlot: body.timeSlot,
            contactPhone: body.contactPhone,
          },
          create: {
            invoiceId: params.id,
            paymentMethod: body.paymentMethod,
            actionDate: new Date(body.actionDate),
            timeSlot: body.timeSlot,
            contactPhone: body.contactPhone,
          },
        });

        // Update Invoice status to APPROVED/SCHEDULED
        await prisma.invoice.update({
          where: { invoiceId: params.id },
          data: {
            status: "APPROVED",
          },
        });

        return {
          message: "Payment successfully scheduled and invoice APPROVED.",
          schedule,
        };
      } catch (error) {
        set.status = 500;
        return { error: error instanceof Error ? error.message : String(error) };
      }
    },
    {
      body: t.Object({
        paymentMethod: t.String(), // "BANK_TRANSFER" | "CHEQUE"
        actionDate: t.String(), // ISO date format
        timeSlot: t.String(), // e.g. "13:30 - 16:00"
        contactPhone: t.String(),
      }),
    }
  );
