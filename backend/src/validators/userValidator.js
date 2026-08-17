const { z } = require("zod");

const createUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters"),

  phone: z
    .string()
    .trim()
    .max(30, "Phone number must not exceed 30 characters")
    .optional()
    .nullable(),

  roleId: z
    .number()
    .int()
    .positive("Role ID must be a positive number"),

  departmentId: z
    .number()
    .int()
    .positive("Department ID must be a positive number"),
});

const updateUserSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters")
    .optional(),

  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters")
    .optional(),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .optional(),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must not exceed 100 characters")
    .optional(),

  phone: z
    .string()
    .trim()
    .max(30, "Phone number must not exceed 30 characters")
    .optional()
    .nullable(),

  roleId: z
    .number()
    .int()
    .positive("Role ID must be a positive number")
    .optional(),

  departmentId: z
    .number()
    .int()
    .positive("Department ID must be a positive number")
    .optional(),

  status: z
    .boolean()
    .optional(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
};