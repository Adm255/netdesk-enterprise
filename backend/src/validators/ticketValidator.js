const { z } = require("zod");

const createTicketSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional().default("LOW"),
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional().default("OPEN"),
  assignedToId: z.number().nullable().optional(),
  createdById: z.number(),
  reporterId: z.number().optional(),
  department: z.string().optional(),
});

const updateTicketSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]).optional(),
  assignedToId: z.number().nullable().optional(),
  department: z.string().optional(),
});

module.exports = {
  createTicketSchema,
  updateTicketSchema,
};