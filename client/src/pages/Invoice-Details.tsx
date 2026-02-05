// // import { useParams, Link } from "wouter";
// // import { useInvoices } from "@/hooks/use-invoices";
// // import { Layout } from "@/components/layout";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// // import { Badge } from "@/components/ui/badge";
// // import { Input } from "@/components/ui/input";
// // import { Textarea } from "@/components/ui/textarea";
// // import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// // import { Loader2, ArrowLeft, Download, Printer, Edit2, Save, X, Calendar } from "lucide-react";
// // import { format } from "date-fns";
// // import { useRef, useState, useEffect } from "react";
// // import html2canvas from "html2canvas";
// // import jsPDF from "jspdf";
// // import { useToast } from "@/hooks/use-toast";
// // import { useMutation, useQueryClient } from "@tanstack/react-query";
// // import logoGif from "@/assets/GWCLogo.jpeg";

// // // Helper function to convert numbers to words
// // function formatNumberToWords(num: number): string {
// //   const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
// //   const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
// //   const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  
// //   if (num === 0) return "Zero";
// //   if (num < 0) return "Negative " + formatNumberToWords(Math.abs(num));
  
// //   function convertLessThanThousand(n: number): string {
// //     let result = "";
    
// //     if (n >= 100) {
// //       result += units[Math.floor(n / 100)] + " Hundred";
// //       n %= 100;
// //       if (n > 0) result += " and ";
// //     }
    
// //     if (n >= 20) {
// //       result += tens[Math.floor(n / 10)];
// //       n %= 10;
// //       if (n > 0) result += " " + units[n];
// //     } else if (n >= 10) {
// //       result += teens[n - 10];
// //     } else if (n > 0) {
// //       result += units[n];
// //     }
    
// //     return result;
// //   }
  
// //   let result = "";
// //   let n = Math.floor(num);
  
// //   if (n >= 1000000000) {
// //     const billions = Math.floor(n / 1000000000);
// //     result += convertLessThanThousand(billions) + " Billion";
// //     n %= 1000000000;
// //     if (n > 0) result += " ";
// //   }
  
// //   if (n >= 1000000) {
// //     const millions = Math.floor(n / 1000000);
// //     result += convertLessThanThousand(millions) + " Million";
// //     n %= 1000000;
// //     if (n > 0) result += " ";
// //   }
  
// //   if (n >= 1000) {
// //     const thousands = Math.floor(n / 1000);
// //     result += convertLessThanThousand(thousands) + " Thousand";
// //     n %= 1000;
// //     if (n > 0) result += " ";
// //   }
  
// //   if (n > 0) {
// //     result += convertLessThanThousand(n);
// //   }
  
// //   // Add kobo if there are decimal places
// //   const decimalPart = Math.round((num - Math.floor(num)) * 100);
// //   if (decimalPart > 0) {
// //     result += " Naira";
// //     result += " and " + convertLessThanThousand(decimalPart) + " Kobo";
// //   } else {
// //     result += " Naira";
// //   }
  
// //   return result;
// // }

// // export default function InvoiceDetail() {
// //   const params = useParams();
// //   const id = params.id as string;
// //   const { data: invoices, isLoading } = useInvoices();
// //   const { toast } = useToast();
// //   const invoiceRef = useRef<HTMLDivElement>(null);
// //   const [isEditing, setIsEditing] = useState(false);
// //   const [editedInvoice, setEditedInvoice] = useState<any>(null);
// //   const queryClient = useQueryClient();

 

// //   // Find the invoice from the list
// //   const invoice = invoices?.find((inv: any) => inv._id === id);

// //   // Update editedInvoice whenever invoice changes from the server
// //   useEffect(() => {
// //     if (invoice) {
// //       setEditedInvoice({...invoice});
// //     }
// //   }, [invoice]);

// //   // Helper function to calculate item amount
// //   const calculateItemAmount = (item: any) => {
// //     const quantity = Number(item.quantity) || 1;
// //     const unitPrice = Number(item.price) || 0;
// //     return quantity * unitPrice;
// //   };

// //   // Helper function to calculate all totals from items and discount rate
// //   const calculateAllTotals = (items: any[], discountRate: number = 0) => {
// //     // Calculate amounts for each item
// //     const itemsWithAmounts = items.map(item => {
// //       const amount = calculateItemAmount(item);
// //       return {
// //         ...item,
// //         amount: amount
// //       };
// //     });

// //     // Calculate subtotal
// //     const subtotal = itemsWithAmounts.reduce((sum, item) => sum + (item.amount || 0), 0);
    
// //     // Calculate discount
// //     const discountAmount = discountRate ? subtotal * (discountRate / 100) : 0;
    
// //     const total = subtotal - discountAmount;
    
// //     return {
// //       items: itemsWithAmounts,
// //       subtotal,
// //       discountAmount,
// //       total
// //     };
// //   };

// //   // Helper function to generate the fixed Notes/Terms text with dynamic values
// //   const generateNotesTermsText = (date: Date, amount: number) => {
// //     const formattedDate = format(date, "do 'of' MMMM, yyyy");
// //     const amountInWords = formatNumberToWords(amount);
// //     const formattedAmount = amount.toLocaleString('en-NG', {
// //       minimumFractionDigits: 2,
// //       maximumFractionDigits: 2
// //     });
    
// //     return `Notes / Terms
// // As of ${formattedDate}, patient have a credit balance of ${amountInWords} [N${formattedAmount}] with the Clinic.`;
// //   };

// //   // Update mutation with immediate cache update
// //   const updateMutation = useMutation({
// //     mutationFn: async (data: any) => {
// //       const res = await fetch(`/api/invoices/${id}`, {
// //         method: 'PUT',
// //         headers: { 'Content-Type': 'application/json' },
// //         body: JSON.stringify(data),
// //       });
// //       if (!res.ok) throw new Error('Failed to update invoice');
// //       return res.json();
// //     },
// //     onSuccess: (updatedInvoice) => {
// //       // Update the cache immediately for instant UI update
// //       queryClient.setQueryData(['/api/invoices'], (old: any) => {
// //         if (!old) return old;
// //         return old.map((inv: any) => 
// //           inv._id === id ? { ...inv, ...updatedInvoice } : inv
// //         );
// //       });
      
// //       // Also update the editedInvoice state with the server response
// //       setEditedInvoice(updatedInvoice);
      
// //       setIsEditing(false);
// //       toast({
// //         title: "Success",
// //         description: "Invoice updated successfully",
// //       });
// //     },
// //     onError: (error) => {
// //       toast({
// //         title: "Error",
// //         description: "Failed to update invoice",
// //         variant: "destructive",
// //       });
// //     },
// //   });

// //   const handleSave = () => {
// //     if (!editedInvoice) return;

// //     // Calculate and update all totals
// //     const discountRate = editedInvoice.discountRate || 0;
// //     const { items: updatedItems, subtotal, discountAmount, total } = calculateAllTotals(editedInvoice.items || [], discountRate);

// //     // Prepare data to send - INCLUDING ALL FIELDS
// //     const dataToSend = {
// //       ...editedInvoice,
// //       items: updatedItems,
// //       subtotal,
// //       discountAmount,
// //       total,
// //       // Make sure to include all editable fields
// //       patientCreditBalance: editedInvoice.patientCreditBalance || total || 0,
// //       creditBalanceDate: editedInvoice.creditBalanceDate || editedInvoice.dueDate || new Date().toISOString(),
// //       extraNotes: editedInvoice.extraNotes || "",
// //     };

// //     console.log('Saving data:', dataToSend); // Debug log

// //     updateMutation.mutate(dataToSend);
// //   };

// //   const handleCancel = () => {
// //     if (invoice) {
// //       setEditedInvoice({...invoice});
// //     }
// //     setIsEditing(false);
// //   };

// //   const updateItem = (index: number, field: string, value: any) => {
// //     const newItems = [...(editedInvoice?.items || [])];
// //     newItems[index] = { ...newItems[index], [field]: value };
    
// //     // Create updated invoice with new items
// //     const updatedInvoiceData = { ...editedInvoice, items: newItems };
    
// //     // Recalculate amounts and totals
// //     const discountRate = updatedInvoiceData.discountRate || 0;
// //     const { items: itemsWithAmounts, subtotal, discountAmount, total } = calculateAllTotals(newItems, discountRate);
    
// //     updatedInvoiceData.items = itemsWithAmounts;
// //     updatedInvoiceData.subtotal = subtotal;
// //     updatedInvoiceData.discountAmount = discountAmount;
// //     updatedInvoiceData.total = total;
    
// //     setEditedInvoice(updatedInvoiceData);
// //   };

// //   const handleDownloadPDF = async () => {
// //     if (!invoiceRef.current || !invoice) return;

// //     try {
// //       // Hide action buttons during PDF generation
// //       const buttons = invoiceRef.current.querySelectorAll('button');
// //       buttons.forEach(btn => (btn as HTMLElement).style.display = 'none');

// //       const canvas = await html2canvas(invoiceRef.current, {
// //         scale: 3,
// //         logging: false,
// //         backgroundColor: "#ffffff",
// //         useCORS: true,
// //         allowTaint: true,
// //       });
      
// //       // Show buttons again
// //       buttons.forEach(btn => (btn as HTMLElement).style.display = '');

// //       const imgData = canvas.toDataURL("image/png");
// //       const pdf = new jsPDF({
// //         orientation: "portrait",
// //         unit: "mm",
// //         format: "a4",
// //         compress: true,
// //       });

// //       const pdfWidth = pdf.internal.pageSize.getWidth();
// //       const imgWidth = pdfWidth;
// //       const imgHeight = (canvas.height * pdfWidth) / canvas.width;

// //       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
// //       pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
      
// //       toast({
// //         title: "Downloaded",
// //         description: "Invoice PDF has been downloaded",
// //       });
// //     } catch (err) {
// //       console.error(err);
// //       toast({
// //         title: "Error",
// //         description: "Failed to generate PDF",
// //         variant: "destructive",
// //       });
// //     }
// //   };

// //   if (isLoading) {
// //     return (
// //       <Layout>
// //         <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-amber-50 via-white to-amber-50/30 rounded-2xl">
// //           <div className="text-center">
// //             <Loader2 className="h-10 w-10 animate-spin text-amber-600 mx-auto mb-4" />
// //             <p className="text-amber-800 font-medium">Loading invoice...</p>
// //           </div>
// //         </div>
// //       </Layout>
// //     );
// //   }

// //   if (!invoice || !editedInvoice) {
// //     return (
// //       <Layout>
// //         <div className="max-w-4xl mx-auto">
// //           <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 via-white to-red-50/30">
// //             <CardContent className="p-8 text-center">
// //               <p className="text-red-700 mb-4 font-semibold">Invoice not found</p>
// //               <Link href="/history">
// //                 <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/30">
// //                   <ArrowLeft className="w-4 h-4 mr-2" />
// //                   Back to History
// //                 </Button>
// //               </Link>
// //             </CardContent>
// //           </Card>
// //         </div>
// //       </Layout>
// //     );
// //   }

// //   // Use editedInvoice when editing, otherwise use invoice (which now gets updated immediately via cache)
// //   const displayInvoice = isEditing ? editedInvoice : invoice;
// //   const items = (displayInvoice.items || []) as any[];
// //   const currencySymbol = displayInvoice.currency === 'NGN' ? '₦' : '$';
  
// //   // Use stored totals instead of recalculating each time
// //   const subtotal = displayInvoice.subtotal || 0;
// //   const discountAmount = displayInvoice.discountAmount || 0;
// //   const total = displayInvoice.total || 0;

// //   // Get data from invoice - use editedInvoice values when editing
// //   const extraNotes = displayInvoice.extraNotes || "";
// //   const patientCreditBalance = displayInvoice.patientCreditBalance || total || 0;
// //   const creditBalanceDate = displayInvoice.creditBalanceDate 
// //     ? new Date(displayInvoice.creditBalanceDate) 
// //     : (displayInvoice.dueDate ? new Date(displayInvoice.dueDate) : new Date());

// //   // Generate the fixed Notes/Terms text with dynamic values
// //   const notesTermsText = generateNotesTermsText(creditBalanceDate, patientCreditBalance);

// //   return (
// //     <Layout>
// //       <div className="max-w-5xl mx-auto space-y-6">
// //         {/* Header with Gold Theme */}
// //         <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50/30 rounded-2xl p-6 border-2 border-amber-200/50 shadow-lg">
// //           <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-3xl"></div>
// //           <div className="relative flex items-center justify-between">
// //             <Link href="/history">
// //               <Button variant="ghost" size="sm" className="hover:bg-amber-100 hover:text-amber-900 transition-all">
// //                 <ArrowLeft className="w-4 h-4 mr-2" />
// //                 Back to History
// //               </Button>
// //             </Link>
            
// //             <div className="flex gap-2">
// //               {isEditing ? (
// //                 <>
// //                   <Button 
// //                     onClick={handleSave} 
// //                     disabled={updateMutation.isPending} 
// //                     className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/30"
// //                   >
// //                     {updateMutation.isPending ? (
// //                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
// //                     ) : (
// //                       <Save className="w-4 h-4 mr-2" />
// //                     )}
// //                     Save Changes
// //                   </Button>
// //                   <Button onClick={handleCancel} variant="outline" className="border-amber-300 hover:bg-amber-50">
// //                     <X className="w-4 h-4 mr-2" />
// //                     Cancel
// //                   </Button>
// //                 </>
// //               ) : (
// //                 <>
// //                   <Button onClick={() => setIsEditing(true)} variant="outline" className="border-amber-300 hover:bg-amber-50">
// //                     <Edit2 className="w-4 h-4 mr-2" />
// //                     Edit Invoice
// //                   </Button>
// //                   <Button onClick={handleDownloadPDF} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/30">
// //                     <Download className="w-4 h-4 mr-2" />
// //                     Download
// //                   </Button>
// //                   <Button onClick={handleDownloadPDF} variant="outline" className="border-amber-300 hover:bg-amber-50">
// //                     <Printer className="w-4 h-4 mr-2" />
// //                     Print
// //                   </Button>
// //                 </>
// //               )}
// //             </div>
// //           </div>
// //         </div>

// //         {/* Invoice Card */}
// //         <Card className="border-2 border-amber-200/50 shadow-2xl rounded-2xl overflow-hidden bg-gradient-to-br from-white via-amber-50/10 to-white">
// //           <CardContent className="p-0">
// //             <div ref={invoiceRef} className="p-12 md:p-16 bg-white text-slate-900">
// //               {/* Header */}
// //               <div className="flex justify-between items-start mb-16 pb-8 border-b-2 border-amber-200">
// //                 <div>
// //                   {/* Logo */}
// //                   <img src={logoGif} alt="Company Logo" className="h-16 w-auto object-contain mb-4" />
                  
// //                   <h1 className="text-3xl font-bold font-display tracking-tight text-amber-700 mb-2">
// //                     INVOICE
// //                   </h1>
// //                   <p className="text-amber-700/70 font-mono text-sm font-semibold">#{displayInvoice.invoiceNumber}</p>
// //                   <div className="mt-4">
// //                     {isEditing ? (
// //                       <Select 
// //                         value={editedInvoice.status} 
// //                         onValueChange={(value) => {
// //                           const updated = {...editedInvoice, status: value};
// //                           setEditedInvoice(updated);
// //                         }}
// //                       >
// //                         <SelectTrigger className="w-[150px] border-amber-300">
// //                           <SelectValue />
// //                         </SelectTrigger>
// //                         <SelectContent>
// //                           <SelectItem value="pending">Pending</SelectItem>
// //                           <SelectItem value="paid">Paid</SelectItem>
// //                           <SelectItem value="overdue">Overdue</SelectItem>
// //                         </SelectContent>
// //                       </Select>
// //                     ) : (
// //                       <Badge 
// //                         className={`font-semibold shadow-sm px-4 py-1.5 text-sm ${
// //                           displayInvoice.status === 'paid' ? 'bg-green-600 text-white border-0' : 
// //                           displayInvoice.status === 'overdue' ? 'bg-red-600 text-white border-0' : 
// //                           'bg-amber-500 text-white border-0'
// //                         }`}
// //                       >
// //                         {displayInvoice.status.toUpperCase()}
// //                       </Badge>
// //                     )}
// //                   </div>
// //                 </div>
// //                 <div className="text-right">
// //                   <div className="text-2xl font-bold text-amber-700 mb-2">
// //                     {displayInvoice.companyName || "Your Company"}
// //                   </div>
// //                   <div className="text-xs text-slate-700 leading-relaxed">
// //                     <p>14B, Dan Ogbeide Close, Off Oyibo Adjarho Street, Lekki Phase 1, Lagos</p>
// //                     <p>7, Mamman Kontagora Crescent, Katampe Extension, Abuja</p>
// //                     <p className="mt-1">Phone No: 09090004531 | Website: glorywellnessng.com</p>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Bill To and Invoice Details - Side by Side */}
// //               <div className="grid grid-cols-2 gap-6 mb-12">
// //                 {/* Bill To - Left Side */}
// //                 <div className="p-6 bg-gradient-to-br from-amber-50/50 to-white rounded-xl border-2 border-amber-200/50 shadow-inner">
// //                   <h3 className="text-xs font-bold uppercase text-amber-700 mb-3 tracking-wider">Bill To</h3>
// //                   {isEditing ? (
// //                     <div className="space-y-2">
// //                       <Input
// //                         value={editedInvoice.clientName}
// //                         onChange={(e) => setEditedInvoice({...editedInvoice, clientName: e.target.value})}
// //                         className="text-lg font-semibold border-amber-300 focus:border-amber-500"
// //                         placeholder="Client Name"
// //                       />
// //                       <Input
// //                         value={editedInvoice.clientEmail || ''}
// //                         onChange={(e) => setEditedInvoice({...editedInvoice, clientEmail: e.target.value})}
// //                         className="border-amber-300 focus:border-amber-500"
// //                         placeholder="Client Email"
// //                       />
// //                     </div>
// //                   ) : (
// //                     <>
// //                       <div className="text-lg font-bold text-slate-900">{displayInvoice.clientName}</div>
// //                       {displayInvoice.clientEmail && <div className="text-amber-700/70 mt-1">{displayInvoice.clientEmail}</div>}
// //                     </>
// //                   )}
// //                 </div>

// //                 {/* Invoice Details - Right Side */}
// //                 <div className="p-6 bg-gradient-to-br from-amber-50/50 to-white rounded-xl border-2 border-amber-200/50">
// //                   <div className="space-y-2">
// //                     <div className="flex justify-between items-baseline">
// //                       <span className="text-sm font-bold text-slate-900">Invoice Number:</span>
// //                       <span className="text-sm text-slate-900">{displayInvoice.invoiceNumber || 'N/A'}</span>
// //                     </div>
// //                     <div className="flex justify-between items-baseline">
// //                       <span className="text-sm font-bold text-slate-900">Invoice Date:</span>
// //                       <span className="text-sm text-slate-900">
// //                         {displayInvoice.createdAt ? format(new Date(displayInvoice.createdAt), "MMMM d, yyyy") : 'N/A'}
// //                       </span>
// //                     </div>
// //                     <div className="flex justify-between items-baseline">
// //                       <span className="text-sm font-bold text-slate-900">Payment Due:</span>
// //                       <span className="text-sm text-slate-900">
// //                         {displayInvoice.dueDate ? format(new Date(displayInvoice.dueDate), "MMMM d, yyyy") : 'N/A'}
// //                       </span>
// //                     </div>
// //                     <div className="flex justify-between items-baseline pt-1">
// //                       <span className="text-sm font-bold text-slate-900">Amount Due ({currencySymbol}):</span>
// //                       <span className="text-sm font-bold text-slate-900">
// //                         {total.toLocaleString()}
// //                       </span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Items Table */}
// //               {items.length > 0 ? (
// //                 <div className="mb-10">
// //                   <table className="w-full">
// //                     <thead>
// //                       <tr className="border-b-2 border-amber-300 bg-amber-50">
// //                         <th className="text-left py-4 px-2 text-xs font-bold text-amber-900 uppercase tracking-wider">Item</th>
// //                         <th className="text-left py-4 px-2 text-xs font-bold text-amber-900 uppercase tracking-wider">Description</th>
// //                         <th className="text-center py-4 px-2 text-xs font-bold text-amber-900 uppercase tracking-wider">Quantity</th>
// //                         <th className="text-right py-4 px-2 text-xs font-bold text-amber-900 uppercase tracking-wider">Unit Price</th>
// //                         <th className="text-right py-4 px-2 text-xs font-bold text-amber-900 uppercase tracking-wider">Amount</th>
// //                       </tr>
// //                     </thead>
// //                     <tbody className="divide-y divide-amber-100">
// //                       {items.map((item, index) => {
// //                         const quantity = Number(item.quantity) || 1;
// //                         const unitPrice = Number(item.price) || 0;
// //                         // Use stored amount if it exists, otherwise calculate it
// //                         const amount = item.amount || calculateItemAmount(item);
                        
// //                         return (
// //                           <tr key={index} className="group hover:bg-amber-50/30 transition-colors">
// //                             <td className="py-4 px-2 text-sm font-semibold text-slate-900">
// //                               {isEditing ? (
// //                                 <Input
// //                                   value={item.service}
// //                                   onChange={(e) => updateItem(index, 'service', e.target.value)}
// //                                   className="h-8 border-amber-300"
// //                                 />
// //                               ) : (
// //                                 item.service
// //                               )}
// //                             </td>
// //                             <td className="py-4 px-2 text-sm text-slate-700">
// //                               {isEditing ? (
// //                                 <Input
// //                                   value={item.description || ''}
// //                                   onChange={(e) => updateItem(index, 'description', e.target.value)}
// //                                   className="h-8 border-amber-300"
// //                                 />
// //                               ) : (
// //                                 item.description || '-'
// //                               )}
// //                             </td>
// //                             <td className="py-4 px-2 text-sm text-center">
// //                               {isEditing ? (
// //                                 <Input
// //                                   type="number"
// //                                   value={quantity}
// //                                   onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
// //                                   className="h-8 text-center border-amber-300 w-20 mx-auto"
// //                                   min="1"
// //                                 />
// //                               ) : (
// //                                 <span className="font-medium text-slate-900">{quantity}</span>
// //                               )}
// //                             </td>
// //                             <td className="py-4 px-2 text-sm font-mono text-right">
// //                               {isEditing ? (
// //                                 <Input
// //                                   type="number"
// //                                   value={unitPrice}
// //                                   onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
// //                                   className="h-8 text-right border-amber-300"
// //                                 />
// //                               ) : (
// //                                 <span className="text-slate-900">
// //                                   {currencySymbol}{unitPrice.toLocaleString()}
// //                                 </span>
// //                               )}
// //                             </td>
// //                             <td className="py-4 px-2 text-sm font-mono text-right">
// //                               <span className="font-bold text-lg text-amber-700">
// //                                 {currencySymbol}{amount.toLocaleString()}
// //                               </span>
// //                             </td>
// //                           </tr>
// //                         );
// //                       })}
// //                     </tbody>
// //                   </table>
// //                 </div>
// //               ) : (
// //                 <div className="mb-8 p-6 bg-amber-50/30 rounded-lg border-2 border-dashed border-amber-200 text-center text-amber-700">
// //                   No items in this invoice
// //                 </div>
// //               )}

// //               {/* Totals */}
// //               <div className="border-t-2 border-amber-300 pt-8">
// //                 <div className="flex justify-end">
// //                   <div className="w-96 space-y-4 bg-amber-50/50 p-6 rounded-lg">
// //                     <div className="flex justify-between text-base text-slate-800 font-medium">
// //                       <span>Subtotal</span>
// //                       <span className="font-bold text-amber-700">
// //                         {currencySymbol}{subtotal.toLocaleString()}
// //                       </span>
// //                     </div>
// //                     {displayInvoice.discountRate && displayInvoice.discountRate > 0 && (
// //                       <div className="flex justify-between text-base text-slate-800 font-medium">
// //                         <span>Discount ({displayInvoice.discountRate}%)</span>
// //                         <span className="font-bold text-red-600">
// //                           -{currencySymbol}{discountAmount.toLocaleString()}
// //                         </span>
// //                       </div>
// //                     )}
// //                     <div className="flex justify-between text-2xl font-bold pt-4 border-t-2 border-amber-300">
// //                       <span className="text-slate-900">TOTAL</span>
// //                       <span className="text-amber-700">
// //                         {currencySymbol}{total.toLocaleString()}
// //                       </span>
// //                     </div>
// //                   </div>
// //                 </div>
// //               </div>

// //               {/* Footer Section with Notes/Terms */}
// //               <div className="mt-12 pt-8 border-t-2 border-amber-300">
// //                 <div className="bg-gradient-to-br from-amber-50/30 to-white p-6 rounded-xl border-2 border-amber-200/50 shadow-inner">
// //                   <h3 className="text-sm font-bold uppercase text-amber-700 mb-4 tracking-wider border-b pb-2 border-amber-200">
// //                     Notes / Terms
// //                   </h3>
                  
// //                   {isEditing ? (
// //                     <div className="space-y-6">
// //                       {/* Fixed Notes/Terms Section - Not Editable Text but Dynamic Values Can Be Edited */}
// //                       <div className="space-y-3">
// //                         <div className="flex justify-between items-center">
// //                           <label className="text-sm font-semibold text-slate-700">
// //                             Credit Balance Information
// //                           </label>
// //                           <div className="text-xs text-slate-500 bg-amber-50 px-2 py-1 rounded">
// //                             Date and amount are editable
// //                           </div>
// //                         </div>
// //                         <div className="p-4 bg-amber-50/50 rounded-lg border border-amber-200">
// //                           <p className="text-sm font-mono whitespace-pre-line text-slate-700">
// //                             {notesTermsText}
// //                           </p>
// //                         </div>
                        
// //                         <div className="grid grid-cols-2 gap-4">
// //                           <div>
// //                             <label className="text-xs font-semibold text-slate-700 mb-1 block">
// //                               Balance Date
// //                             </label>
// //                             <Input
// //                               type="date"
// //                               value={format(creditBalanceDate, 'yyyy-MM-dd')}
// //                               onChange={(e) => {
// //                                 const updated = {...editedInvoice, creditBalanceDate: new Date(e.target.value).toISOString()};
// //                                 setEditedInvoice(updated);
// //                               }}
// //                               className="border-amber-300 focus:border-amber-500"
// //                             />
// //                           </div>
// //                           <div>
// //                             <label className="text-xs font-semibold text-slate-700 mb-1 block">
// //                               Balance Amount (₦)
// //                             </label>
// //                             <Input
// //                               type="number"
// //                               value={patientCreditBalance}
// //                               onChange={(e) => {
// //                                 const updated = {...editedInvoice, patientCreditBalance: Number(e.target.value)};
// //                                 setEditedInvoice(updated);
// //                               }}
// //                               step="0.01"
// //                               className="border-amber-300 focus:border-amber-500"
// //                             />
// //                           </div>
// //                         </div>
// //                       </div>

// //                       {/* Editable Extra Notes Section */}
// //                       <div className="space-y-3 pt-4 border-t border-amber-200">
// //                         <div className="flex justify-between items-center">
// //                           <label className="text-sm font-semibold text-slate-700">
// //                             Additional Notes (Optional)
// //                           </label>
// //                           <div className="text-xs text-slate-500 bg-amber-50 px-2 py-1 rounded">
// //                             Add payment instructions, contact info, etc.
// //                           </div>
// //                         </div>
// //                         <Textarea
// //                           value={extraNotes}
// //                           onChange={(e) => {
// //                             const updated = {...editedInvoice, extraNotes: e.target.value};
// //                             setEditedInvoice(updated);
// //                           }}
// //                           className="min-h-[120px] border-amber-300 focus:border-amber-500 text-sm"
// //                           placeholder="Add payment instructions, contact information, or any additional notes for the client..."
// //                         />
// //                         {extraNotes.trim() && (
// //                           <div className="text-xs text-slate-500">
// //                             <p className="font-medium mb-1">Preview:</p>
// //                             <div className="bg-amber-50/50 p-3 rounded border border-amber-200">
// //                               <p className="whitespace-pre-line text-slate-700 text-sm">
// //                                 {extraNotes}
// //                               </p>
// //                             </div>
// //                           </div>
// //                         )}
// //                       </div>
// //                     </div>
// //                   ) : (
// //                     <div className="space-y-4">
// //                       {/* Fixed Notes/Terms Display */}
// //                       <div className="p-4 bg-amber-50/30 rounded-lg">
// //                         <p className="text-sm font-mono whitespace-pre-line text-slate-700">
// //                           {notesTermsText}
// //                         </p>
// //                       </div>
                      
// //                       {/* Extra Notes Display (if any) */}
// //                       {extraNotes.trim() && (
// //                         <div className="mt-4 p-4 bg-white rounded-lg border border-amber-200">
// //                           <p className="text-sm whitespace-pre-line text-slate-700">
// //                             {extraNotes}
// //                           </p>
// //                         </div>
// //                       )}
                      
// //                       <div className="flex justify-between text-xs text-slate-500 mt-2 pt-2 border-t border-amber-200">
// //                         <span>Balance Date: {format(creditBalanceDate, "MMMM d, yyyy")}</span>
// //                         <span>Balance Amount: ₦{patientCreditBalance.toLocaleString('en-NG', {
// //                           minimumFractionDigits: 2,
// //                           maximumFractionDigits: 2
// //                         })}</span>
// //                       </div>
// //                     </div>
// //                   )}
// //                 </div>
// //               </div>
// //             </div>
// //           </CardContent>
// //         </Card>
// //       </div>
// //     </Layout>
// //   );
// // }


// import { useParams, Link } from "wouter";
// import { useInvoices } from "@/hooks/use-invoices";
// import { Layout } from "@/components/layout";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Badge } from "@/components/ui/badge";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Loader2, ArrowLeft, Download, Printer, Edit2, Save, X } from "lucide-react";
// import { format } from "date-fns";
// import { useRef, useState, useEffect } from "react";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { useToast } from "@/hooks/use-toast";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import logoGif from "@/assets/GWCLogo.jpeg";

// export default function InvoiceDetail() {
//   const params = useParams();
//   const id = params.id as string;
//   const { data: invoices, isLoading } = useInvoices();
//   const { toast } = useToast();
//   const invoiceRef = useRef<HTMLDivElement>(null);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedInvoice, setEditedInvoice] = useState<any>(null);
//   const queryClient = useQueryClient();

//   // Find the invoice from the list
//   const invoice = invoices?.find((inv: any) => inv._id === id);

//   // Update editedInvoice whenever invoice changes from the server
//   useEffect(() => {
//     if (invoice) {
//       setEditedInvoice({...invoice});
//     }
//   }, [invoice]);

//   // Helper function to calculate item amount
//   const calculateItemAmount = (item: any) => {
//     const quantity = Number(item.quantity) || 1;
//     const unitPrice = Number(item.price) || 0;
//     return quantity * unitPrice;
//   };

//   // Helper function to calculate all totals from items and discount rate
//   const calculateAllTotals = (items: any[], discountRate: number = 0) => {
//     // Calculate amounts for each item
//     const itemsWithAmounts = items.map(item => {
//       const amount = calculateItemAmount(item);
//       return {
//         ...item,
//         amount: amount
//       };
//     });

//     // Calculate subtotal
//     const subtotal = itemsWithAmounts.reduce((sum, item) => sum + (item.amount || 0), 0);
    
//     // Calculate discount
//     const discountAmount = discountRate ? subtotal * (discountRate / 100) : 0;
    
//     const total = subtotal - discountAmount;
    
//     return {
//       items: itemsWithAmounts,
//       subtotal,
//       discountAmount,
//       total
//     };
//   };

//   // Update mutation with immediate cache update
//   const updateMutation = useMutation({
//     mutationFn: async (data: any) => {
//       const res = await fetch(`/api/invoices/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(data),
//       });
//       if (!res.ok) throw new Error('Failed to update invoice');
//       return res.json();
//     },
//     onSuccess: (updatedInvoice) => {
//       // Update the cache immediately for instant UI update
//       queryClient.setQueryData(['/api/invoices'], (old: any) => {
//         if (!old) return old;
//         return old.map((inv: any) => 
//           inv._id === id ? { ...inv, ...updatedInvoice } : inv
//         );
//       });
      
//       // Also update the editedInvoice state with the server response
//       setEditedInvoice(updatedInvoice);
      
//       setIsEditing(false);
//       toast({
//         title: "Success",
//         description: "Invoice updated successfully",
//       });
//     },
//     onError: (error) => {
//       toast({
//         title: "Error",
//         description: "Failed to update invoice",
//         variant: "destructive",
//       });
//     },
//   });

//   const handleSave = () => {
//     if (!editedInvoice) return;

//     // Calculate and update all totals
//     const discountRate = editedInvoice.discountRate || 0;
//     const { items: updatedItems, subtotal, discountAmount, total } = calculateAllTotals(editedInvoice.items || [], discountRate);

//     // Prepare data to send
//     const dataToSend = {
//       ...editedInvoice,
//       items: updatedItems,
//       subtotal,
//       discountAmount,
//       total,
//     };

//     updateMutation.mutate(dataToSend);
//   };

//   const handleCancel = () => {
//     if (invoice) {
//       setEditedInvoice({...invoice});
//     }
//     setIsEditing(false);
//   };

//   const updateItem = (index: number, field: string, value: any) => {
//     const newItems = [...(editedInvoice?.items || [])];
//     newItems[index] = { ...newItems[index], [field]: value };
    
//     // Create updated invoice with new items
//     const updatedInvoiceData = { ...editedInvoice, items: newItems };
    
//     // Recalculate amounts and totals
//     const discountRate = updatedInvoiceData.discountRate || 0;
//     const { items: itemsWithAmounts, subtotal, discountAmount, total } = calculateAllTotals(newItems, discountRate);
    
//     updatedInvoiceData.items = itemsWithAmounts;
//     updatedInvoiceData.subtotal = subtotal;
//     updatedInvoiceData.discountAmount = discountAmount;
//     updatedInvoiceData.total = total;
    
//     setEditedInvoice(updatedInvoiceData);
//   };

//   const handleDownloadPDF = async () => {
//     if (!invoiceRef.current || !invoice) return;

//     try {
//       // Hide action buttons during PDF generation
//       const buttons = invoiceRef.current.querySelectorAll('button');
//       buttons.forEach(btn => (btn as HTMLElement).style.display = 'none');

//       const canvas = await html2canvas(invoiceRef.current, {
//         scale: 3,
//         logging: false,
//         backgroundColor: "#ffffff",
//         useCORS: true,
//         allowTaint: true,
//       });
      
//       // Show buttons again
//       buttons.forEach(btn => (btn as HTMLElement).style.display = '');

//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//         compress: true,
//       });

//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const imgWidth = pdfWidth;
//       const imgHeight = (canvas.height * pdfWidth) / canvas.width;

//       pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
//       pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
      
//       toast({
//         title: "Downloaded",
//         description: "Invoice PDF has been downloaded",
//       });
//     } catch (err) {
//       console.error(err);
//       toast({
//         title: "Error",
//         description: "Failed to generate PDF",
//         variant: "destructive",
//       });
//     }
//   };

//   if (isLoading) {
//     return (
//       <Layout>
//         <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-amber-50 via-white to-amber-50/30 rounded-2xl">
//           <div className="text-center">
//             <Loader2 className="h-10 w-10 animate-spin text-amber-600 mx-auto mb-4" />
//             <p className="text-amber-800 font-medium">Loading invoice...</p>
//           </div>
//         </div>
//       </Layout>
//     );
//   }

//   if (!invoice || !editedInvoice) {
//     return (
//       <Layout>
//         <div className="max-w-4xl mx-auto">
//           <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 via-white to-red-50/30">
//             <CardContent className="p-8 text-center">
//               <p className="text-red-700 mb-4 font-semibold">Invoice not found</p>
//               <Link href="/history">
//                 <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/30">
//                   <ArrowLeft className="w-4 h-4 mr-2" />
//                   Back to History
//                 </Button>
//               </Link>
//             </CardContent>
//           </Card>
//         </div>
//       </Layout>
//     );
//   }

//   // Use editedInvoice when editing, otherwise use invoice
//   const displayInvoice = isEditing ? editedInvoice : invoice;
//   const items = (displayInvoice.items || []) as any[];
//   const currencySymbol = displayInvoice.currency === 'NGN' ? '₦' : '$';
  
//   // Use stored totals
//   const subtotal = displayInvoice.subtotal || 0;
//   const discountAmount = displayInvoice.discountAmount || 0;
//   const total = displayInvoice.total || 0;

//   return (
//     <Layout>
//       <div className="max-w-5xl mx-auto space-y-6">
//         {/* Header with Gold Theme */}
//         <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50/30 rounded-2xl p-6 border-2 border-amber-200/50 shadow-lg">
//           <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-3xl"></div>
//           <div className="relative flex items-center justify-between">
//             <Link href="/history">
//               <Button variant="ghost" size="sm" className="hover:bg-amber-100 hover:text-amber-900 transition-all">
//                 <ArrowLeft className="w-4 h-4 mr-2" />
//                 Back to History
//               </Button>
//             </Link>
            
//             <div className="flex gap-2">
//               {isEditing ? (
//                 <>
//                   <Button 
//                     onClick={handleSave} 
//                     disabled={updateMutation.isPending} 
//                     className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/30"
//                   >
//                     {updateMutation.isPending ? (
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     ) : (
//                       <Save className="w-4 h-4 mr-2" />
//                     )}
//                     Save Changes
//                   </Button>
//                   <Button onClick={handleCancel} variant="outline" className="border-amber-300 hover:bg-amber-50">
//                     <X className="w-4 h-4 mr-2" />
//                     Cancel
//                   </Button>
//                 </>
//               ) : (
//                 <>
//                   <Button onClick={() => setIsEditing(true)} variant="outline" className="border-amber-300 hover:bg-amber-50">
//                     <Edit2 className="w-4 h-4 mr-2" />
//                     Edit Invoice
//                   </Button>
//                   <Button onClick={handleDownloadPDF} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/30">
//                     <Download className="w-4 h-4 mr-2" />
//                     Download
//                   </Button>
//                   <Button onClick={handleDownloadPDF} variant="outline" className="border-amber-300 hover:bg-amber-50">
//                     <Printer className="w-4 h-4 mr-2" />
//                     Print
//                   </Button>
//                 </>
//               )}
//             </div>
//           </div>
//         </div>

//         {/* Invoice Card */}
//         <Card className="border-2 border-amber-200/50 shadow-2xl rounded-2xl overflow-hidden bg-gradient-to-br from-white via-amber-50/10 to-white">
//           <CardContent className="p-0">
//             <div ref={invoiceRef} className="p-12 md:p-16 bg-white text-slate-900">
//               {/* Header */}
//               <div className="flex justify-between items-start mb-16 pb-8 border-b-2 border-amber-200">
//                 <div>
//                   {/* Logo */}
//                   <img src={logoGif} alt="Company Logo" className="h-16 w-auto object-contain mb-4" />
                  
//                   <h1 className="text-3xl font-bold font-display tracking-tight text-amber-700 mb-2">
//                     INVOICE
//                   </h1>
//                   <p className="text-amber-700/70 font-mono text-sm font-semibold">#{displayInvoice.invoiceNumber}</p>
//                   <div className="mt-4">
//                     {isEditing ? (
//                       <Select 
//                         value={editedInvoice.status} 
//                         onValueChange={(value) => {
//                           const updated = {...editedInvoice, status: value};
//                           setEditedInvoice(updated);
//                         }}
//                       >
//                         <SelectTrigger className="w-[150px] border-amber-300">
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="pending">Pending</SelectItem>
//                           <SelectItem value="paid">Paid</SelectItem>
//                           <SelectItem value="overdue">Overdue</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     ) : (
//                       <Badge 
//                         className={`font-semibold shadow-sm px-4 py-1.5 text-sm ${
//                           displayInvoice.status === 'paid' ? 'bg-green-600 text-white border-0' : 
//                           displayInvoice.status === 'overdue' ? 'bg-red-600 text-white border-0' : 
//                           'bg-amber-500 text-white border-0'
//                         }`}
//                       >
//                         {displayInvoice.status.toUpperCase()}
//                       </Badge>
//                     )}
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-2xl font-bold text-amber-700 mb-2">
//                     {displayInvoice.companyName || "Your Company"}
//                   </div>
//                   <div className="text-xs text-slate-700 leading-relaxed">
//                     <p>14B, Dan Ogbeide Close, Off Oyibo Adjarho Street, Lekki Phase 1, Lagos</p>
//                     <p>7, Mamman Kontagora Crescent, Katampe Extension, Abuja</p>
//                     <p className="mt-1">Phone No: 09090004531 | Website: glorywellnessng.com</p>
//                   </div>
//                 </div>
//               </div>

//               {/* Bill To and Invoice Details - Side by Side */}
//               <div className="grid grid-cols-2 gap-6 mb-12">
//                 {/* Bill To - Left Side */}
//                 <div className="p-6 bg-gradient-to-br from-amber-50/50 to-white rounded-xl border-2 border-amber-200/50 shadow-inner">
//                   <h3 className="text-xs font-bold uppercase text-amber-700 mb-3 tracking-wider">Bill To</h3>
//                   {isEditing ? (
//                     <div className="space-y-2">
//                       <Input
//                         value={editedInvoice.clientName}
//                         onChange={(e) => setEditedInvoice({...editedInvoice, clientName: e.target.value})}
//                         className="text-lg font-semibold border-amber-300 focus:border-amber-500"
//                         placeholder="Client Name"
//                       />
//                       <Input
//                         value={editedInvoice.clientEmail || ''}
//                         onChange={(e) => setEditedInvoice({...editedInvoice, clientEmail: e.target.value})}
//                         className="border-amber-300 focus:border-amber-500"
//                         placeholder="Client Email"
//                       />
//                     </div>
//                   ) : (
//                     <>
//                       <div className="text-lg font-bold text-slate-900">{displayInvoice.clientName}</div>
//                       {displayInvoice.clientEmail && <div className="text-amber-700/70 mt-1">{displayInvoice.clientEmail}</div>}
//                     </>
//                   )}
//                 </div>

//                 {/* Invoice Details - Right Side */}
//                 <div className="p-6 bg-gradient-to-br from-amber-50/50 to-white rounded-xl border-2 border-amber-200/50">
//                   <div className="space-y-2">
//                     <div className="flex justify-between items-baseline">
//                       <span className="text-sm font-bold text-slate-900">Invoice Number:</span>
//                       <span className="text-sm text-slate-900">{displayInvoice.invoiceNumber || 'N/A'}</span>
//                     </div>
//                     <div className="flex justify-between items-baseline">
//                       <span className="text-sm font-bold text-slate-900">Invoice Date:</span>
//                       <span className="text-sm text-slate-900">
//                         {displayInvoice.createdAt ? format(new Date(displayInvoice.createdAt), "MMMM d, yyyy") : 'N/A'}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-baseline">
//                       <span className="text-sm font-bold text-slate-900">Payment Due:</span>
//                       <span className="text-sm text-slate-900">
//                         {displayInvoice.dueDate ? format(new Date(displayInvoice.dueDate), "MMMM d, yyyy") : 'N/A'}
//                       </span>
//                     </div>
//                     <div className="flex justify-between items-baseline pt-1">
//                       <span className="text-sm font-bold text-slate-900">Amount Due ({currencySymbol}):</span>
//                       <span className="text-sm font-bold text-slate-900">
//                         {total.toLocaleString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Items Table */}
//               {items.length > 0 ? (
//                 <div className="mb-10">
//                   <table className="w-full">
//                     <thead>
//                       <tr className="border-b-2 border-amber-300 bg-amber-50">
//                         <th className="text-left py-4 px-2 text-xs font-bold text-amber-900 uppercase tracking-wider">Item</th>
//                         <th className="text-left py-4 px-2 text-xs font-bold text-amber-900 uppercase tracking-wider">Description</th>
//                         <th className="text-center py-4 px-2 text-xs font-bold text-amber-900 uppercase tracking-wider">Quantity</th>
//                         <th className="text-right py-4 px-2 text-xs font-bold text-amber-900 uppercase tracking-wider">Unit Price</th>
//                         <th className="text-right py-4 px-2 text-xs font-bold text-amber-900 uppercase tracking-wider">Amount</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-amber-100">
//                       {items.map((item, index) => {
//                         const quantity = Number(item.quantity) || 1;
//                         const unitPrice = Number(item.price) || 0;
//                         const amount = item.amount || calculateItemAmount(item);
                        
//                         return (
//                           <tr key={index} className="group hover:bg-amber-50/30 transition-colors">
//                             <td className="py-4 px-2 text-sm font-semibold text-slate-900">
//                               {isEditing ? (
//                                 <Input
//                                   value={item.service}
//                                   onChange={(e) => updateItem(index, 'service', e.target.value)}
//                                   className="h-8 border-amber-300"
//                                 />
//                               ) : (
//                                 item.service
//                               )}
//                             </td>
//                             <td className="py-4 px-2 text-sm text-slate-700">
//                               {isEditing ? (
//                                 <Input
//                                   value={item.description || ''}
//                                   onChange={(e) => updateItem(index, 'description', e.target.value)}
//                                   className="h-8 border-amber-300"
//                                 />
//                               ) : (
//                                 item.description || '-'
//                               )}
//                             </td>
//                             <td className="py-4 px-2 text-sm text-center">
//                               {isEditing ? (
//                                 <Input
//                                   type="number"
//                                   value={quantity}
//                                   onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
//                                   className="h-8 text-center border-amber-300 w-20 mx-auto"
//                                   min="1"
//                                 />
//                               ) : (
//                                 <span className="font-medium text-slate-900">{quantity}</span>
//                               )}
//                             </td>
//                             <td className="py-4 px-2 text-sm font-mono text-right">
//                               {isEditing ? (
//                                 <Input
//                                   type="number"
//                                   value={unitPrice}
//                                   onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
//                                   className="h-8 text-right border-amber-300"
//                                 />
//                               ) : (
//                                 <span className="text-slate-900">
//                                   {currencySymbol}{unitPrice.toLocaleString()}
//                                 </span>
//                               )}
//                             </td>
//                             <td className="py-4 px-2 text-sm font-mono text-right">
//                               <span className="font-bold text-lg text-amber-700">
//                                 {currencySymbol}{amount.toLocaleString()}
//                               </span>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               ) : (
//                 <div className="mb-8 p-6 bg-amber-50/30 rounded-lg border-2 border-dashed border-amber-200 text-center text-amber-700">
//                   No items in this invoice
//                 </div>
//               )}

//               {/* Totals */}
//               <div className="border-t-2 border-amber-300 pt-8">
//                 <div className="flex justify-end">
//                   <div className="w-96 space-y-4 bg-amber-50/50 p-6 rounded-lg">
//                     <div className="flex justify-between text-base text-slate-800 font-medium">
//                       <span>Subtotal</span>
//                       <span className="font-bold text-amber-700">
//                         {currencySymbol}{subtotal.toLocaleString()}
//                       </span>
//                     </div>
//                     {displayInvoice.discountRate && displayInvoice.discountRate > 0 && (
//                       <div className="flex justify-between text-base text-slate-800 font-medium">
//                         <span>Discount ({displayInvoice.discountRate}%)</span>
//                         <span className="font-bold text-red-600">
//                           -{currencySymbol}{discountAmount.toLocaleString()}
//                         </span>
//                       </div>
//                     )}
//                     <div className="flex justify-between text-2xl font-bold pt-4 border-t-2 border-amber-300">
//                       <span className="text-slate-900">TOTAL</span>
//                       <span className="text-amber-700">
//                         {currencySymbol}{total.toLocaleString()}
//                       </span>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Notes Section */}
//               <div className="mt-12 pt-8 border-t-2 border-amber-300">
//                 <div className="bg-gradient-to-br from-amber-50/30 to-white p-6 rounded-xl border-2 border-amber-200/50 shadow-inner">
//                   <h3 className="text-sm font-bold uppercase text-amber-700 mb-4 tracking-wider border-b pb-2 border-amber-200">
//                     Notes
//                   </h3>
                  
//                   {isEditing ? (
//                     <div>
//                       <Textarea
//                         value={displayInvoice.notes || ''}
//                         onChange={(e) => {
//                           const updated = {...editedInvoice, notes: e.target.value};
//                           setEditedInvoice(updated);
//                         }}
//                         className="min-h-[120px] border-amber-300 focus:border-amber-500 text-sm"
//                         placeholder="Add payment instructions, contact information, or any additional notes for the client..."
//                       />
//                       <p className="text-xs text-slate-500 mt-2">
//                         Add any notes or terms for the client to see on the invoice.
//                       </p>
//                     </div>
//                   ) : (
//                     <div>
//                       {displayInvoice.notes ? (
//                         <div className="p-4 bg-amber-50/30 rounded-lg">
//                           <p className="text-sm whitespace-pre-line text-slate-700">
//                             {displayInvoice.notes}
//                           </p>
//                         </div>
//                       ) : (
//                         <p className="text-sm text-slate-500 italic">
//                           No notes added to this invoice.
//                         </p>
//                       )}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </Layout>
//   );
// }


import { useParams, Link } from "wouter";
import { useInvoices } from "@/hooks/use-invoices";
import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Download, Printer, Edit2, Save, X } from "lucide-react";
import { format } from "date-fns";
import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import logoGif from "@/assets/GWCLogo.jpeg";

export default function InvoiceDetail() {
  const params = useParams();
  const id = params.id as string;
  const { data: invoices, isLoading } = useInvoices();
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState<any>(null);
  const queryClient = useQueryClient();

  // Find the invoice from the list
  const invoice = invoices?.find((inv: any) => inv._id === id);

  // Update editedInvoice whenever invoice changes from the server
  useEffect(() => {
    if (invoice) {
      setEditedInvoice({...invoice});
    }
  }, [invoice]);

  // Helper function to calculate item amount
  const calculateItemAmount = (item: any) => {
    const quantity = Number(item.quantity) || 1;
    const unitPrice = Number(item.price) || 0;
    return quantity * unitPrice;
  };

  // Helper function to calculate all totals from items and discount rate
  const calculateAllTotals = (items: any[], discountRate: number = 0) => {
    // Calculate amounts for each item
    const itemsWithAmounts = items.map(item => {
      const amount = calculateItemAmount(item);
      return {
        ...item,
        amount: amount
      };
    });

    // Calculate subtotal
    const subtotal = itemsWithAmounts.reduce((sum, item) => sum + (item.amount || 0), 0);
    
    // Calculate discount
    const discountAmount = discountRate ? subtotal * (discountRate / 100) : 0;
    
    const total = subtotal - discountAmount;
    
    return {
      items: itemsWithAmounts,
      subtotal,
      discountAmount,
      total
    };
  };

  // Update mutation with immediate cache update
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      console.log('Sending update with notes:', data.notes);
      
      const res = await fetch(`/api/invoices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to update invoice: ${res.status}`);
      }
      
      return res.json();
    },
    onSuccess: (updatedInvoiceFromServer, variables) => {
      console.log('Server response:', updatedInvoiceFromServer);
      console.log('What we sent (variables):', variables);
      
      // IMPORTANT: The server is not returning the notes field in the response
      // So we need to manually merge it from what we sent
      const notesValue = variables.notes || "";
      
      // Create a merged invoice object that includes the notes
      const mergedInvoice = {
        ...updatedInvoiceFromServer,
        notes: notesValue, // Add the notes from our request
      };
      
      console.log('Merged invoice with notes:', mergedInvoice);
      
      // Update the cache with the merged invoice (includes notes)
      queryClient.setQueryData(['/api/invoices'], (old: any) => {
        if (!old) return old;
        return old.map((inv: any) => 
          inv._id === id ? { ...inv, ...mergedInvoice } : inv
        );
      });
      
      // Also update the editedInvoice state with the merged invoice
      setEditedInvoice(mergedInvoice);
      
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
    },
    onError: (error) => {
      console.error('Update error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update invoice",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!editedInvoice) return;

    // Calculate and update all totals
    const discountRate = editedInvoice.discountRate || 0;
    const { items: updatedItems, subtotal, discountAmount, total } = calculateAllTotals(editedInvoice.items || [], discountRate);

    // Get the notes value from editedInvoice
    const notesValue = editedInvoice.notes || "";
    
    // Create data to send - include notes field
    const dataToSend = {
      // Basic invoice info
      invoiceNumber: editedInvoice.invoiceNumber || '',
      clientName: editedInvoice.clientName || '',
      companyName: editedInvoice.companyName || "Glorywellness Regenerative Center",
      clientEmail: editedInvoice.clientEmail || '',
      status: editedInvoice.status || "pending",
      dueDate: editedInvoice.dueDate || new Date().toISOString().split('T')[0],
      currency: editedInvoice.currency || "NGN",
      
      // Financial data
      amount: total,
      subtotal,
      discountRate: discountRate,
      discountAmount,
      total,
      
      // Items
      items: updatedItems,
      
      // Notes field - this is what we're trying to save
      notes: notesValue,
      
      // Also include other fields that might be in the backend schema
      extraNotes: editedInvoice.extraNotes || "",
      patientCreditBalance: editedInvoice.patientCreditBalance || total,
      creditBalanceDate: editedInvoice.creditBalanceDate || new Date().toISOString(),
    };

    updateMutation.mutate(dataToSend);
  };

  const handleCancel = () => {
    if (invoice) {
      setEditedInvoice({...invoice});
    }
    setIsEditing(false);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...(editedInvoice?.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    
    // Create updated invoice with new items
    const updatedInvoiceData = { ...editedInvoice, items: newItems };
    
    // Recalculate amounts and totals
    const discountRate = updatedInvoiceData.discountRate || 0;
    const { items: itemsWithAmounts, subtotal, discountAmount, total } = calculateAllTotals(newItems, discountRate);
    
    updatedInvoiceData.items = itemsWithAmounts;
    updatedInvoiceData.subtotal = subtotal;
    updatedInvoiceData.discountAmount = discountAmount;
    updatedInvoiceData.total = total;
    
    setEditedInvoice(updatedInvoiceData);
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current || !invoice) return;

    try {
      // Hide action buttons during PDF generation
      const buttons = invoiceRef.current.querySelectorAll('button');
      buttons.forEach(btn => (btn as HTMLElement).style.display = 'none');

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 3,
        logging: false,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
      });
      
      // Show buttons again
      buttons.forEach(btn => (btn as HTMLElement).style.display = '');

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
      pdf.save(`invoice-${invoice.invoiceNumber}.pdf`);
      
      toast({
        title: "Downloaded",
        description: "Invoice PDF has been downloaded",
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to generate PDF",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px] bg-gradient-to-br from-amber-50 via-white to-amber-50/30 rounded-2xl">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin text-amber-600 mx-auto mb-4" />
            <p className="text-amber-800 font-medium">Loading invoice...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!invoice || !editedInvoice) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto">
          <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 via-white to-red-50/30">
            <CardContent className="p-8 text-center">
              <p className="text-red-700 mb-4 font-semibold">Invoice not found</p>
              <Link href="/history">
                <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/30">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to History
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Use editedInvoice when editing, otherwise use invoice
  const displayInvoice = isEditing ? editedInvoice : invoice;
  const items = (displayInvoice.items || []) as any[];
  const currencySymbol = displayInvoice.currency === 'NGN' ? '₦' : '$';
  
  // Use stored totals
  const subtotal = displayInvoice.subtotal || 0;
  const discountAmount = displayInvoice.discountAmount || 0;
  const total = displayInvoice.total || 0;

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header with Gold Theme */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50/30 rounded-2xl p-6 border-2 border-amber-200/50 shadow-lg">
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-3xl"></div>
          <div className="relative flex items-center justify-between">
            <Link href="/history">
              <Button variant="ghost" size="sm" className="hover:bg-amber-100 hover:text-amber-900 transition-all">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to History
              </Button>
            </Link>
            
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Button 
                    onClick={handleSave} 
                    disabled={updateMutation.isPending} 
                    className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/30"
                  >
                    {updateMutation.isPending ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                  </Button>
                  <Button onClick={handleCancel} variant="outline" className="border-amber-300 hover:bg-amber-50">
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="border-amber-300 hover:bg-amber-50">
                    <Edit2 className="w-4 h-4 mr-2" />
                    Edit Invoice
                  </Button>
                  <Button onClick={handleDownloadPDF} className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/30">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                  <Button onClick={handleDownloadPDF} variant="outline" className="border-amber-300 hover:bg-amber-50">
                    <Printer className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Invoice Card */}
        <Card className="border-2 border-amber-200/50 shadow-2xl rounded-2xl overflow-hidden bg-gradient-to-br from-white via-amber-50/10 to-white">
          <CardContent className="p-0">
            <div ref={invoiceRef} className="p-12 md:p-16 bg-white text-slate-900">
              {/* Header */}
              <div className="flex justify-between items-start mb-16 pb-8 border-b-2 border-amber-200">
                <div>
                  {/* Logo */}
                  <img src={logoGif} alt="Company Logo" className="h-16 w-auto object-contain mb-4" />
                  
                  <h1 className="text-3xl font-bold font-display tracking-tight text-amber-700 mb-2">
                    INVOICE
                  </h1>
                  <p className="text-amber-700/70 font-mono text-sm font-semibold">#{displayInvoice.invoiceNumber}</p>
                  <div className="mt-4">
                    {isEditing ? (
                      <Select 
                        value={editedInvoice.status} 
                        onValueChange={(value) => {
                          const updated = {...editedInvoice, status: value};
                          setEditedInvoice(updated);
                        }}
                      >
                        <SelectTrigger className="w-[150px] border-amber-300">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="overdue">Overdue</SelectItem>
                        </SelectContent>
                      </Select>
                    ) : (
                      <Badge 
                        className={`font-semibold shadow-sm px-4 py-1.5 text-sm ${
                          displayInvoice.status === 'paid' ? 'bg-green-600 text-white border-0' : 
                          displayInvoice.status === 'overdue' ? 'bg-red-600 text-white border-0' : 
                          'bg-amber-500 text-white border-0'
                        }`}
                      >
                        {displayInvoice.status.toUpperCase()}
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-amber-700 mb-2">
                    {displayInvoice.companyName || "Your Company"}
                  </div>
                  <div className="text-xs text-slate-700 leading-relaxed">
                    <p>14B, Dan Ogbeide Close, Off Oyibo Adjarho Street, Lekki Phase 1, Lagos</p>
                    <p>7, Mamman Kontagora Crescent, Katampe Extension, Abuja</p>
                    <p className="mt-1">Phone No: 09090004531 | Website: glorywellnessng.com</p>
                  </div>
                </div>
              </div>

              {/* Bill To and Invoice Details - Side by Side */}
              <div className="grid grid-cols-2 gap-6 mb-12">
                {/* Bill To - Left Side */}
                <div className="p-6 bg-gradient-to-br from-amber-50/50 to-white rounded-xl border-2 border-amber-200/50 shadow-inner">
                  <h3 className="text-xs font-bold uppercase text-amber-700 mb-3 tracking-wider">Bill To</h3>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={editedInvoice.clientName}
                        onChange={(e) => setEditedInvoice({...editedInvoice, clientName: e.target.value})}
                        className="text-lg font-semibold border-amber-300 focus:border-amber-500"
                        placeholder="Client Name"
                      />
                      <Input
                        value={editedInvoice.clientEmail || ''}
                        onChange={(e) => setEditedInvoice({...editedInvoice, clientEmail: e.target.value})}
                        className="border-amber-300 focus:border-amber-500"
                        placeholder="Client Email"
                      />
                    </div>
                  ) : (
                    <>
                      <div className="text-lg font-bold text-slate-900">{displayInvoice.clientName}</div>
                      {displayInvoice.clientEmail && <div className="text-amber-700/70 mt-1">{displayInvoice.clientEmail}</div>}
                    </>
                  )}
                </div>

                {/* Invoice Details - Right Side */}
                <div className="p-6 bg-gradient-to-br from-amber-50/50 to-white rounded-xl border-2 border-amber-200/50">
                  <div className="space-y-2">
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-bold text-slate-900">Invoice Number:</span>
                      <span className="text-sm text-slate-900">{displayInvoice.invoiceNumber || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-bold text-slate-900">Invoice Date:</span>
                      <span className="text-sm text-slate-900">
                        {displayInvoice.createdAt ? format(new Date(displayInvoice.createdAt), "MMMM d, yyyy") : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm font-bold text-slate-900">Payment Due:</span>
                      <span className="text-sm text-slate-900">
                        {displayInvoice.dueDate ? format(new Date(displayInvoice.dueDate), "MMMM d, yyyy") : 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-baseline pt-1">
                      <span className="text-sm font-bold text-slate-900">Amount Due ({currencySymbol}):</span>
                      <span className="text-sm font-bold text-slate-900">
                        {total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              {items.length > 0 ? (
                <div className="mb-10">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-amber-300 bg-amber-50">
                        <th className="text-left py-4 px-2 text-xs font-bold text-amber-900 uppercase tracking-wider">Item</th>
                        <th className="text-left py-4 px-2 text-xs font-bold text-amber-900 uppercase tracking-wider">Description</th>
                        <th className="text-center py-4 px-2 text-xs font-bold text-amber-900 uppercase tracking-wider">Quantity</th>
                        <th className="text-right py-4 px-2 text-xs font-bold text-amber-900 uppercase tracking-wider">Unit Price</th>
                        <th className="text-right py-4 px-2 text-xs font-bold text-amber-900 uppercase tracking-wider">Amount</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-amber-100">
                      {items.map((item, index) => {
                        const quantity = Number(item.quantity) || 1;
                        const unitPrice = Number(item.price) || 0;
                        const amount = item.amount || calculateItemAmount(item);
                        
                        return (
                          <tr key={index} className="group hover:bg-amber-50/30 transition-colors">
                            <td className="py-4 px-2 text-sm font-semibold text-slate-900">
                              {isEditing ? (
                                <Input
                                  value={item.service}
                                  onChange={(e) => updateItem(index, 'service', e.target.value)}
                                  className="h-8 border-amber-300"
                                />
                              ) : (
                                item.service
                              )}
                            </td>
                            <td className="py-4 px-2 text-sm text-slate-700">
                              {isEditing ? (
                                <Input
                                  value={item.description || ''}
                                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                                  className="h-8 border-amber-300"
                                />
                              ) : (
                                item.description || '-'
                              )}
                            </td>
                            <td className="py-4 px-2 text-sm text-center">
                              {isEditing ? (
                                <Input
                                  type="number"
                                  value={quantity}
                                  onChange={(e) => updateItem(index, 'quantity', Number(e.target.value))}
                                  className="h-8 text-center border-amber-300 w-20 mx-auto"
                                  min="1"
                                />
                              ) : (
                                <span className="font-medium text-slate-900">{quantity}</span>
                              )}
                            </td>
                            <td className="py-4 px-2 text-sm font-mono text-right">
                              {isEditing ? (
                                <Input
                                  type="number"
                                  value={unitPrice}
                                  onChange={(e) => updateItem(index, 'price', Number(e.target.value))}
                                  className="h-8 text-right border-amber-300"
                                />
                              ) : (
                                <span className="text-slate-900">
                                  {currencySymbol}{unitPrice.toLocaleString()}
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-2 text-sm font-mono text-right">
                              <span className="font-bold text-lg text-amber-700">
                                {currencySymbol}{amount.toLocaleString()}
                              </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="mb-8 p-6 bg-amber-50/30 rounded-lg border-2 border-dashed border-amber-200 text-center text-amber-700">
                  No items in this invoice
                </div>
              )}

              {/* Totals */}
              <div className="border-t-2 border-amber-300 pt-8">
                <div className="flex justify-end">
                  <div className="w-96 space-y-4 bg-amber-50/50 p-6 rounded-lg">
                    <div className="flex justify-between text-base text-slate-800 font-medium">
                      <span>Subtotal</span>
                      <span className="font-bold text-amber-700">
                        {currencySymbol}{subtotal.toLocaleString()}
                      </span>
                    </div>
                    {displayInvoice.discountRate && displayInvoice.discountRate > 0 && (
                      <div className="flex justify-between text-base text-slate-800 font-medium">
                        <span>Discount ({displayInvoice.discountRate}%)</span>
                        <span className="font-bold text-red-600">
                          -{currencySymbol}{discountAmount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between text-2xl font-bold pt-4 border-t-2 border-amber-300">
                      <span className="text-slate-900">TOTAL</span>
                      <span className="text-amber-700">
                        {currencySymbol}{total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="mt-12 pt-8 border-t-2 border-amber-300">
                <div className="bg-gradient-to-br from-amber-50/30 to-white p-6 rounded-xl border-2 border-amber-200/50 shadow-inner">
                  <h3 className="text-sm font-bold uppercase text-amber-700 mb-4 tracking-wider border-b pb-2 border-amber-200">
                    Notes/Terms
                  </h3>
                  
                  {isEditing ? (
                    <div>
                      <Textarea
                        value={editedInvoice.notes || ''}
                        onChange={(e) => {
                          const updated = {...editedInvoice, notes: e.target.value};
                          setEditedInvoice(updated);
                        }}
                        className="min-h-[120px] border-amber-300 focus:border-amber-500 text-sm"
                        placeholder="Add payment instructions, contact information, or any additional notes for the client..."
                      />
                      <p className="text-xs text-slate-500 mt-2">
                        Add any notes or terms for the client to see on the invoice.
                      </p>
                    </div>
                  ) : (
                    <div>
                      {displayInvoice.notes ? (
                        <div className="p-4 bg-amber-50/30 rounded-lg">
                          <p className="text-sm whitespace-pre-line text-slate-700">
                            {displayInvoice.notes}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-slate-500 italic">
                          No notes added to this invoice.
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}