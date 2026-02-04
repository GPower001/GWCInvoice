// import { z } from 'zod';

// // Invoice schema for MongoDB
// export const invoiceSchema = z.object({
//   _id: z.string(),
//   clientName: z.string(),
//   amount: z.number(),
//   status: z.enum(['pending', 'paid', 'overdue']),
//   dueDate: z.date(),
//   description: z.string().optional(),
//   createdAt: z.date(),
//   updatedAt: z.date(),
// });

// // Schema for creating an invoice (without auto-generated fields)
// export const insertInvoiceSchema = z.object({
//   clientName: z.string().min(1, 'Client name is required'),
//   amount: z.union([z.number(), z.string()]).pipe(z.coerce.number().min(0, 'Amount must be positive')),
//   status: z.string().transform(val => val.toLowerCase()).pipe(z.enum(['pending', 'paid', 'overdue'])).optional().default('pending'),
//   dueDate: z.string().min(1, 'Due date is required').transform((val) => new Date(val)),
//   description: z.string().optional().default(''),
// });

// // Type inference
// export type Invoice = z.infer<typeof invoiceSchema>;
// export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

// // API routes definition
// export const api = {
//   invoices: {
//     list: {
//       method: 'GET' as const,
//       path: '/api/invoices',
//       responses: {
//         200: z.array(invoiceSchema),
//       },
//     },
//     create: {
//       method: 'POST' as const,
//       path: '/api/invoices',
//       input: insertInvoiceSchema,
//       responses: {
//         201: invoiceSchema,
//         400: z.object({ message: z.string(), errors: z.array(z.any()).optional() }),
//       },
//     },
//     get: {
//       method: 'GET' as const,
//       path: '/api/invoices/:id',
//       responses: {
//         200: invoiceSchema,
//         404: z.object({ message: z.string() }),
//       },
//     },
//   },
// };

import { z } from 'zod';

// Invoice item schema
const invoiceItemSchema = z.object({
  service: z.string(),
  description: z.string().optional(),
  quantity: z.number(),
  price: z.number(),
  amount: z.number(),
});

// Invoice schema for MongoDB
export const invoiceSchema = z.object({
  _id: z.string(),
  invoiceNumber: z.string(),
  clientName: z.string(),
  companyName: z.string().optional(),
  clientEmail: z.string().optional(),
  amount: z.number(),
  status: z.enum(['pending', 'paid', 'overdue']),
  dueDate: z.date(),
  currency: z.string().optional(),
  items: z.array(invoiceItemSchema),
  subtotal: z.number().optional(),
  discountRate: z.number().optional(),
  discountAmount: z.number().optional(),
  total: z.number(),
  // NEW FIELDS FOR FOOTER SECTION
  patientCreditBalance: z.number().optional(),
  creditBalanceDate: z.date().optional(),
  extraNotes: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Schema for creating an invoice (without auto-generated fields)
export const insertInvoiceSchema = z.object({
  invoiceNumber: z.string().min(1, 'Invoice number is required'),
  clientName: z.string().min(1, 'Client name is required'),
  companyName: z.string().optional(),
  clientEmail: z.string().email().optional().or(z.literal('')),
  amount: z.union([z.number(), z.string()]).pipe(z.coerce.number().min(0, 'Amount must be positive')),
  status: z.string().transform(val => val.toLowerCase()).pipe(z.enum(['pending', 'paid', 'overdue'])).optional().default('pending'),
  dueDate: z.string().min(1, 'Due date is required').transform((val) => new Date(val)),
  currency: z.string().optional().default('NGN'),
  items: z.array(invoiceItemSchema).min(1, 'At least one item is required'),
  subtotal: z.number().optional(),
  discountRate: z.number().optional().default(0),
  discountAmount: z.number().optional().default(0),
  total: z.union([z.number(), z.string()]).pipe(z.coerce.number().min(0, 'Total must be positive')),
  // NEW FIELDS FOR FOOTER SECTION
  patientCreditBalance: z.union([z.number(), z.string()]).pipe(z.coerce.number()).optional().default(0),
  creditBalanceDate: z.string().transform((val) => new Date(val)).optional(),
  extraNotes: z.string().optional().default(''),
});

// Type inference
export type Invoice = z.infer<typeof invoiceSchema>;
export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;

// API routes definition
export const api = {
  invoices: {
    list: {
      method: 'GET' as const,
      path: '/api/invoices',
      responses: {
        200: z.array(invoiceSchema),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/invoices',
      input: insertInvoiceSchema,
      responses: {
        201: invoiceSchema,
        400: z.object({ message: z.string(), errors: z.array(z.any()).optional() }),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/invoices/:id',
      responses: {
        200: invoiceSchema,
        404: z.object({ message: z.string() }),
      },
    },
    update: {
      method: 'PUT' as const,
      path: '/api/invoices/:id',
      input: insertInvoiceSchema.partial(), // All fields optional for updates
      responses: {
        200: invoiceSchema,
        400: z.object({ message: z.string(), errors: z.array(z.any()).optional() }),
        404: z.object({ message: z.string() }),
      },
    },
    delete: {
      method: 'DELETE' as const,
      path: '/api/invoices/:id',
      responses: {
        200: z.object({ message: z.string() }),
        404: z.object({ message: z.string() }),
      },
    },
  },
};