// import mongoose, { Schema, Document } from 'mongoose';

// export interface IInvoice extends Document {
//   clientName: string;
//   amount: number;
//   status: 'pending' | 'paid' | 'overdue';
//   dueDate: Date;
//   description?: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

// const InvoiceSchema: Schema = new Schema({
//   clientName: { type: String, required: true },
//   amount: { type: Number, required: true },
//   status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
//   dueDate: { type: Date, required: true },
//   description: { type: String, required: false },
// }, {
//   timestamps: true, // Automatically adds createdAt and updatedAt
// });

// export const Invoice = mongoose.model<IInvoice>('Invoice', InvoiceSchema);

import mongoose, { Schema, Document } from 'mongoose';

export interface IInvoiceItem {
  service: string;
  description: string;
  quantity: number;
  price: number;
  amount: number;        
}

export interface IInvoice extends Document {
  invoiceNumber: string;
  clientName: string;
  companyName?: string;
  clientEmail?: string;
  amount: number;
  status: 'pending' | 'paid' | 'overdue';
  dueDate: Date;
  currency?: string;
  items: IInvoiceItem[];
  subtotal?: number;
  discountRate?: number;
  discountAmount?: number;
  total: number;
   patientCreditBalance?: number;
  creditBalanceDate?: Date;
  extraNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema({
  service: { type: String, required: true },
  description: { type: String, required: false },
  quantity: { type: Number, required: true, default: 1 },
  price: { type: Number, required: true },
  amount: { type: Number, required: true },
}, { _id: false }); // Don't create _id for sub-documents

const InvoiceSchema: Schema = new Schema({
  invoiceNumber: { type: String, required: true, unique: true },
  clientName: { type: String, required: true },
  companyName: { type: String, required: false },
  clientEmail: { type: String, required: false },
  amount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  dueDate: { type: Date, required: true },
  currency: { type: String, default: 'NGN' },
  items: { type: [InvoiceItemSchema], required: true },
  subtotal: { type: Number, required: false },
  discountRate: { type: Number, default: 0 },
  discountAmount: { type: Number, default: 0 },
  total: { type: Number, required: true },
    patientCreditBalance: { 
    type: Number, 
    default: 0 
  },
  creditBalanceDate: { 
    type: Date, 
    default: Date.now 
  },
  extraNotes: { 
    type: String, 
    default: "" 
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

export const Invoice = mongoose.model<IInvoice>('Invoice', InvoiceSchema);