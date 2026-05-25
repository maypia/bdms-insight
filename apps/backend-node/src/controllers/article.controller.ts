import { Elysia, t } from "elysia";
import { prisma } from "@hospital-ap/database";
import { ensureEmployeeExists } from "../utils/db.helpers";
import mammoth from "mammoth";

export const articleController = new Elysia({ prefix: "/api/articles" })
  // 1. Submit/Create an Article (Manual Write)
  .post(
    "/",
    async ({ body, set }) => {
      try {
        // Validate / ensure department existence
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

        // Validate / ensure author exists if provided
        if (body.authorId) {
          await ensureEmployeeExists(body.authorId);
        }

        const article = await prisma.article.create({
          data: {
            title: body.title,
            content: body.content,
            contentType: body.contentType,
            category: body.category,
            tags: body.tags || [],
            departmentId: body.departmentId,
            authorId: body.authorId || null,
            sourceFileUrl: body.sourceFileUrl || null,
          },
          include: {
            department: true,
            author: true,
          },
        });

        set.status = 201;
        return article;
      } catch (error) {
        set.status = 500;
        return { error: error instanceof Error ? error.message : String(error) };
      }
    },
    {
      body: t.Object({
        title: t.String(),
        content: t.String(), // Stores HTML or Markdown
        contentType: t.String(), // "MARKDOWN" | "HTML"
        category: t.String(), // "FAQ" | "SOP" | "POLICY"
        tags: t.Optional(t.Array(t.String())),
        departmentId: t.String(),
        authorId: t.Optional(t.String()),
        sourceFileUrl: t.Optional(t.String()),
      }),
    }
  )

  // 2. Get all Articles (with filters & search query)
  .get(
    "/",
    async ({ query }) => {
      const where: any = {};

      if (query.departmentId) {
        where.departmentId = query.departmentId;
      }

      if (query.category) {
        where.category = query.category;
      }

      if (query.tags) {
        // Find articles containing all or any of the provided tags
        const tagList = query.tags.split(",");
        where.tags = {
          hasSome: tagList,
        };
      }

      if (query.searchQuery) {
        where.OR = [
          { title: { contains: query.searchQuery, mode: "insensitive" } },
          { content: { contains: query.searchQuery, mode: "insensitive" } },
        ];
      }

      return prisma.article.findMany({
        where,
        include: {
          department: true,
          author: true,
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
          category: t.Optional(t.String()),
          tags: t.Optional(t.String()), // Comma separated tags
          searchQuery: t.Optional(t.String()),
        })
      ),
    }
  )

  // 3. Get single Article details
  .get("/:id", async ({ params, set }) => {
    const article = await prisma.article.findUnique({
      where: { articleId: params.id },
      include: {
        department: true,
        author: true,
      },
    });

    if (!article) {
      set.status = 404;
      return { error: "Article not found" };
    }

    return article;
  })

  // 4. Update an Article
  .put(
    "/:id",
    async ({ params, body, set }) => {
      try {
        const existing = await prisma.article.findUnique({
          where: { articleId: params.id },
        });

        if (!existing) {
          set.status = 404;
          return { error: "Article not found" };
        }

        // Validate / ensure department if changing
        if (body.departmentId) {
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
            await prisma.department.create({
              data: {
                departmentId: body.departmentId,
                departmentName: name,
              },
            });
          }
        }

        // Validate / ensure author exists if changing
        if (body.authorId) {
          await ensureEmployeeExists(body.authorId);
        }

        const updated = await prisma.article.update({
          where: { articleId: params.id },
          data: {
            title: body.title !== undefined ? body.title : existing.title,
            content: body.content !== undefined ? body.content : existing.content,
            contentType: body.contentType !== undefined ? body.contentType : existing.contentType,
            category: body.category !== undefined ? body.category : existing.category,
            tags: body.tags !== undefined ? body.tags : existing.tags,
            departmentId: body.departmentId !== undefined ? body.departmentId : existing.departmentId,
            authorId: body.authorId !== undefined ? body.authorId : existing.authorId,
            sourceFileUrl: body.sourceFileUrl !== undefined ? body.sourceFileUrl : existing.sourceFileUrl,
          },
          include: {
            department: true,
            author: true,
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
        title: t.Optional(t.String()),
        content: t.Optional(t.String()),
        contentType: t.Optional(t.String()),
        category: t.Optional(t.String()),
        tags: t.Optional(t.Array(t.String())),
        departmentId: t.Optional(t.String()),
        authorId: t.Optional(t.String()),
        sourceFileUrl: t.Optional(t.String()),
      }),
    }
  )

  // 5. Delete an Article
  .delete("/:id", async ({ params, set }) => {
    try {
      const existing = await prisma.article.findUnique({
        where: { articleId: params.id },
      });

      if (!existing) {
        set.status = 404;
        return { error: "Article not found" };
      }

      await prisma.article.delete({
        where: { articleId: params.id },
      });

      return { message: "Article successfully deleted" };
    } catch (error) {
      set.status = 500;
      return { error: error instanceof Error ? error.message : String(error) };
    }
  })

  // 6. Parse DOCX file to HTML and plain text
  .post(
    "/parse-docx",
    async ({ body, set }) => {
      try {
        const file = body.file;
        const fileBuffer = await file.arrayBuffer();

        // Convert docx buffer to HTML
        const htmlResult = await mammoth.convertToHtml({
          buffer: Buffer.from(fileBuffer),
        });

        // Extract plain text for semantic search readiness
        const textResult = await mammoth.extractRawText({
          buffer: Buffer.from(fileBuffer),
        });

        return {
          title: file.name.replace(/\.[^/.]+$/, ""), // File name without extension
          html: htmlResult.value,
          text: textResult.value,
          warnings: htmlResult.messages.map((m) => ({
            type: m.type,
            message: m.message,
          })),
        };
      } catch (error) {
        set.status = 500;
        return { error: `Failed to parse DOCX: ${error instanceof Error ? error.message : String(error)}` };
      }
    },
    {
      body: t.Object({
        file: t.File(),
      }),
    }
  );
