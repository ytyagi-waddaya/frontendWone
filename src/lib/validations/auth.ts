import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").max(50),
    email: z
      .string()
      .email("Invalid email")
      .min(2)
      .max(50),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  roles: z
  .array(z.enum(["ADMIN", "AGENT", "CLIENT", "APPROVER"]))
  .min(1, "Select at least one role"),
  departments: z
  .array(z.enum(["BASIS", "ABAP", "FUNCTIONAL", "CLIENT"]))
  .min(1, "Select at least one department"),


  });

export type RegisterSchemaType = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
  email: z
    .string()
    .email("Invalid email")
    .min(2)
    .max(50),
  password: z
    .string()
    .min(6, "Password is required")
});

export type LoginSchemaType = z.infer<typeof loginSchema>;



export const ticketSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  priority: z.enum(["low", "medium", "high", "critical"]),
  department: z.enum(["BASIS", "ABAP", "FUNCTIONAL"]),
  //  attachments: z
  //   .array(
  //     z.instanceof(File, { message: "Each attachment must be a File" })
  //   )
  //   .optional(),
})

export type TicketSchemaType = z.infer<typeof ticketSchema>


export const updateTicketSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).optional(),
  department: z.enum(["BASIS", "ABAP", "FUNCTIONAL"]).optional(),
  status: z.enum(["OPEN", "IN_PROGRESS", "CLOSED"]).optional(),
  assignedToId: z.string().nullable().optional(),
  approverId: z.string().nullable().optional(),
  estimatedHours: z.number().nullable().optional(),
  detectedSkillLevelId: z.string().nullable().optional(),
  // attachments: z.array(z.instanceof(File)).optional(), // uncomment if needed
});

export type UpdateTicketSchemaType = z.infer<typeof updateTicketSchema>;