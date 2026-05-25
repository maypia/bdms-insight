import { Elysia } from "elysia";
import { cors } from "@elysiajs/cors";
import { prisma } from "@hospital-ap/database";
import { expenseController } from "./controllers/expense.controller";
import { invoiceController } from "./controllers/invoice.controller";
import { articleController } from "./controllers/article.controller";
import { ticketController } from "./controllers/ticket.controller";

const app = new Elysia()
  .use(cors())

  // Basic Server and DB Health Endpoint
  .get("/", () => ({
    status: "online",
    message: "BDMS Insight Backend (Elysia) is running",
    timestamp: new Date().toISOString(),
  }))
  .get("/api/health", async () => {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return { 
        database: "healthy", 
        server: "healthy", 
        databaseUrlExists: !!process.env.DATABASE_URL,
        databaseUrlLength: process.env.DATABASE_URL?.length ?? 0
      };
    } catch (error) {
      return {
        database: "unhealthy",
        server: "healthy",
        error: error instanceof Error ? error.message : String(error),
      };
    }
  })

  // Mount Modular Routes/Controllers
  .use(expenseController)
  .use(invoiceController)
  .use(articleController)
  .use(ticketController)

  .listen(3001);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);

export type App = typeof app;

