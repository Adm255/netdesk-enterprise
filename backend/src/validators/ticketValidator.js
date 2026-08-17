const { z } = require("zod");

const createTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Ticket title must be at least 3 characters")
    .max(150, "Ticket title must not exceed 150 characters"),

  description: z
    .string()
    .trim()
    .min(5, "Ticket description must be at least 5 characters")
    .max(5000, "Ticket description must not exceed 5000 characters"),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
    .default("MEDIUM"),

  status: z
    .enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"])
    .default("OPEN"),

  createdById: z
    .number()
    .int()
    .positive("Created by ID must be a positive number"),

  assignedToId: z
    .number()
    .int()
    .positive("Assigned technician ID must be a positive number")
    .nullable()
    .optional(),
});

const updateTicketSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Ticket title must be at least 3 characters")
    .max(150, "Ticket title must not exceed 150 characters")
    .optional(),

  description: z
    .string()
    .trim()
    .min(5, "Ticket description must be at least 5 characters")
    .max(5000, "Ticket description must not exceed 5000 characters")
    .optional(),

  priority: z
    .enum(["LOW", "MEDIUM", "HIGH", "URGENT"])
    .optional(),

  status: z
    .enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"])
    .optional(),

  assignedToId: z
    .number()
    .int()
    .positive("Assigned technician ID must be a positive number")
    .nullable()
    .optional(),
});

module.exports = {
  createTicketSchema,
  updateTicketSchema,
};