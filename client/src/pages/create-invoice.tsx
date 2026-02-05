// import { useState, useRef } from "react";
// import { useCreateInvoice } from "@/hooks/use-invoices";
// import { Layout } from "@/components/layout";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Switch } from "@/components/ui/switch";
// import { Card, CardContent } from "@/components/ui/card";
// import { Plus, Trash2, Printer, Save, Loader2, RefreshCw } from "lucide-react";
// import { useToast } from "@/hooks/use-toast";
// import html2canvas from "html2canvas";
// import jsPDF from "jspdf";
// import { format } from "date-fns";
// import logoGif from "@/assets/GWCLogo.jpeg";

// type InvoiceItem = {
//   id: string;
//   service: string;
//   description: string;
//   quantity: number;
//   price: number; // This is the unit price
// };

// export default function CreateInvoice() {
//   const { mutate: saveInvoice, isPending } = useCreateInvoice();
//   const { toast } = useToast();
//   const invoiceRef = useRef<HTMLDivElement>(null);

//   const generateInvoiceNumber = () => {
//     const now = new Date();
//     return `${String(now.getHours()).padStart(2, "0")}${String(
//       now.getMinutes()
//     ).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
//   };

//   const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber());
//   const [clientName, setClientName] = useState("");
//   const [companyName, setCompanyName] = useState("Glorywellness Regenerative Center");
//   const [clientEmail, setClientEmail] = useState("");
//   const [status, setStatus] = useState("pending");
//   const [dueDate, setDueDate] = useState(() => {
//     const date = new Date();
//     date.setDate(date.getDate() + 30); // Default to 30 days from now
//     return date.toISOString().split('T')[0];
//   });
//   const [currency, setCurrency] = useState("NGN");
//   const [hasDiscount, setHasDiscount] = useState(false);
//   const [discountRate, setDiscountRate] = useState(5);
//   const [logo, setLogo] = useState<string | null>(logoGif);
//   const [items, setItems] = useState<InvoiceItem[]>([]);

//   const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onload = (event) => {
//         setLogo(event.target?.result as string);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Calculate subtotal: sum of (quantity × unit price) for all items
//   const subtotal = items.reduce((acc, item) => {
//     const quantity = Number(item.quantity) || 1;
//     const unitPrice = Number(item.price) || 0;
//     return acc + (quantity * unitPrice);
//   }, 0);
  
//   const discountAmount = hasDiscount ? subtotal * (discountRate / 100) : 0;
//   const total = subtotal - discountAmount;

//   const addItem = () => {
//     setItems([...items, { id: crypto.randomUUID(), service: "", description: "", quantity: 1, price: 0 }]);
//   };

//   const removeItem = (id: string) => {
//     setItems(items.filter(item => item.id !== id));
//   };

//   const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
//     setItems(items.map(item => 
//       item.id === id ? { ...item, [field]: value } : item
//     ));
//   };

//   const handleSave = () => {
//     if (!clientName || !companyName || items.some(i => !i.service || !i.price)) {
//       toast({
//         title: "Validation Error",
//         description: "Please fill in all required fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     saveInvoice({
//       invoiceNumber,
//       clientName,
//       companyName,
//       clientEmail,
//       status,
//       dueDate,
//       amount: total,
//       currency,
//       items: items.map(({ service, description, quantity, price }) => ({ service, description, quantity, price })),
//       subtotal,
//       discountRate: hasDiscount ? discountRate : 0,
//       discountAmount,
//       total,
//     }, {
//       onSuccess: () => {
//         // Reset form or redirect
//         setInvoiceNumber(generateInvoiceNumber());
//       }
//     });
//   };

//   const handleDownloadPDF = async () => {
//     if (!invoiceRef.current) return;

//     try {
//       const canvas = await html2canvas(invoiceRef.current, {
//         scale: 2,
//         logging: false,
//         backgroundColor: "#ffffff",
//       });
      
//       const imgData = canvas.toDataURL("image/png");
//       const pdf = new jsPDF({
//         orientation: "portrait",
//         unit: "mm",
//         format: "a4",
//       });

//       const pdfWidth = pdf.internal.pageSize.getWidth();
//       const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//       pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//       pdf.save(`${invoiceNumber}.pdf`);
      
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

//   return (
//     <Layout>
//       <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
//         {/* Left Column: Editor */}
//         <div className="lg:col-span-1 space-y-6">
//           <Card className="border-2 border-amber-200/50 bg-gradient-to-br from-white via-amber-50/10 to-white shadow-lg">
//             <CardContent className="p-6 space-y-6">
//               <h2 className="text-xl font-bold font-display text-amber-900 mb-4">Invoice Details</h2>
              
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">Invoice #</label>
//                   <div className="flex gap-2">
//                     <Input 
//                       value={invoiceNumber} 
//                       onChange={(e) => setInvoiceNumber(e.target.value)}
//                       className="font-mono bg-amber-50/30 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400"
//                     />
//                     <Button 
//                       variant="outline" 
//                       size="icon"
//                       onClick={() => setInvoiceNumber(generateInvoiceNumber())}
//                       title="Generate new number"
//                       className="border-amber-200/50 hover:bg-amber-50 hover:border-amber-300"
//                     >
//                       <RefreshCw className="w-4 h-4 text-amber-600" />
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">Company Logo</label>
//                   <Input 
//                     type="file" 
//                     accept="image/*" 
//                     onChange={handleLogoUpload}
//                     className="bg-amber-50/30 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-amber-500 file:to-amber-600 file:text-white hover:file:from-amber-600 hover:file:to-amber-700"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">Company Name</label>
//                   <Input 
//                     value={companyName} 
//                     onChange={(e) => setCompanyName(e.target.value)}
//                     className="bg-amber-50/30 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400"
//                     placeholder="Your Company Name"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">Client Name</label>
//                   <Input 
//                     value={clientName} 
//                     onChange={(e) => setClientName(e.target.value)}
//                     className="bg-amber-50/30 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400"
//                     placeholder="Client Name"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">Client Email</label>
//                   <Input 
//                     type="email"
//                     value={clientEmail} 
//                     onChange={(e) => setClientEmail(e.target.value)}
//                     className="bg-amber-50/30 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400"
//                     placeholder="email@example.com"
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">Status</label>
//                     <Select value={status} onValueChange={setStatus}>
//                       <SelectTrigger className="bg-amber-50/30 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="paid">Paid</SelectItem>
//                         <SelectItem value="pending">Pending</SelectItem>
//                         <SelectItem value="overdue">Overdue</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>

//                   <div className="space-y-2">
//                     <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">Currency</label>
//                     <Select value={currency} onValueChange={setCurrency}>
//                       <SelectTrigger className="bg-amber-50/30 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400">
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="NGN">NGN (₦)</SelectItem>
//                         <SelectItem value="USD">USD ($)</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">Due Date</label>
//                   <Input 
//                     type="date"
//                     value={dueDate}
//                     onChange={(e) => setDueDate(e.target.value)}
//                     className="bg-amber-50/30 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400"
//                   />
//                 </div>

//                 <div className="pt-4 border-t border-amber-200/50">
//                   <div className="flex items-center justify-between mb-4">
//                     <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">Apply Discount</label>
//                     <Switch 
//                       checked={hasDiscount} 
//                       onCheckedChange={setHasDiscount} 
//                     />
//                   </div>
                  
//                   {hasDiscount && (
//                     <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
//                       <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">Discount Rate (%)</label>
//                       <Input 
//                         type="number"
//                         min="0"
//                         max="100"
//                         value={discountRate}
//                         onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 0)}
//                         className="bg-amber-50/30 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400"
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="pt-4 flex gap-3">
//                 <Button 
//                   className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/30" 
//                   onClick={handleSave} 
//                   disabled={isPending}
//                 >
//                   {isPending ? (
//                     <>
//                       <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                       Saving...
//                     </>
//                   ) : (
//                     <>
//                       <Save className="w-4 h-4 mr-2" />
//                       Save Invoice
//                     </>
//                   )}
//                 </Button>
                
//                 <Button 
//                   variant="outline" 
//                   onClick={handleDownloadPDF}
//                   className="border-amber-200/50 hover:bg-amber-50 hover:border-amber-300"
//                 >
//                   <Printer className="w-4 h-4 text-amber-600" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right Column: Preview & Items */}
//         <div className="lg:col-span-2 space-y-6">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-bold font-display text-amber-900">Invoice Preview</h2>
//             <div className="text-sm text-amber-700/60 font-medium">
//               Preview updates automatically
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-xl border-2 border-amber-200/50 overflow-hidden">
//             <div ref={invoiceRef} className="p-8 md:p-12 min-h-[800px] flex flex-col bg-white text-amber-950">
//               <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-12">
//                 <div className="flex items-start gap-6">
//                   {logo && <img src={logo} alt="Company Logo" className="h-16 w-auto object-contain" />}
//                   <div>
//                     <h1 className="text-4xl font-bold font-display tracking-tight bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent mb-2">INVOICE</h1>
//                     <p className="text-amber-700/60 font-mono text-sm font-medium">#{invoiceNumber}</p>
//                     <div className={`mt-4 inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm
//                       ${status === 'paid' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 
//                         status === 'overdue' ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white' : 
//                         'bg-gradient-to-r from-amber-400 to-amber-500 text-white'}`}>
//                       {status.charAt(0).toUpperCase() + status.slice(1)}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="md:text-right">
//                   <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent mb-1 break-words max-w-xs">
//                     {companyName || "Your Company Name"}
//                   </div>
//                   <div className="text-sm text-amber-700/60 font-medium">
//                     {format(new Date(), "MMMM dd, yyyy")}
//                   </div>
//                 </div>
//               </div>

//               {/* Client Info */}
//               <div className="mb-12 p-6 bg-gradient-to-br from-amber-50/50 to-amber-50/30 rounded-lg border-2 border-amber-200/50">
//                 <h3 className="text-xs font-bold uppercase text-amber-900/70 tracking-wider mb-3">Bill To</h3>
//                 <div className="text-lg font-semibold text-amber-950">{clientName || "Client Name"}</div>
//                 <div className="text-amber-700/60 font-medium">{clientEmail || "email@example.com"}</div>
//               </div>

//               {/* Items List - Interactive in Preview */}
//               <div className="flex-1">
//                 <table className="w-full mb-8">
//                   <thead>
//                     <tr className="border-b-2 border-amber-200/50">
//                       <th className="text-left py-3 text-xs font-bold text-amber-900/70 uppercase tracking-wider">Items</th>
//                       <th className="text-left py-3 text-xs font-bold text-amber-900/70 uppercase tracking-wider">Description</th>
//                       <th className="text-center py-3 text-xs font-bold text-amber-900/70 uppercase tracking-wider w-20">Qty</th>
//                       <th className="text-right py-3 text-xs font-bold text-amber-900/70 uppercase tracking-wider w-28">Unit Price</th>
//                       <th className="text-right py-3 text-xs font-bold text-amber-900/70 uppercase tracking-wider w-32">Amount</th>
//                       <th className="w-10"></th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-amber-100">
//                     {items.map((item) => {
//                       const quantity = Number(item.quantity) || 1;
//                       const unitPrice = Number(item.price) || 0;
//                       const amount = quantity * unitPrice;
                      
//                       return (
//                         <tr key={item.id} className="group hover:bg-amber-50/30 transition-colors">
//                           <td className="py-4 align-top pr-2">
//                             <Input 
//                               className="border-transparent bg-transparent hover:bg-amber-50/50 focus:bg-white focus:border-amber-300 h-auto p-2 text-sm font-medium text-amber-950 placeholder:text-amber-300 transition-colors"
//                               placeholder="Item Name"
//                               value={item.service}
//                               onChange={(e) => updateItem(item.id, "service", e.target.value)}
//                             />
//                           </td>
//                           <td className="py-4 align-top pr-2">
//                             <Input 
//                               className="border-transparent bg-transparent hover:bg-amber-50/50 focus:bg-white focus:border-amber-300 h-auto p-2 text-sm text-amber-700/80 placeholder:text-amber-300 transition-colors"
//                               placeholder="Description..."
//                               value={item.description}
//                               onChange={(e) => updateItem(item.id, "description", e.target.value)}
//                             />
//                           </td>
//                           <td className="py-4 align-top">
//                             <Input 
//                               type="number"
//                               min="1"
//                               className="border-transparent bg-transparent hover:bg-amber-50/50 focus:bg-white focus:border-amber-300 h-auto p-2 text-sm text-center text-amber-950 placeholder:text-amber-300 transition-colors"
//                               placeholder="1"
//                               value={item.quantity || ""}
//                               onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
//                             />
//                           </td>
//                           <td className="py-4 align-top">
//                             <Input 
//                               type="number"
//                               className="border-transparent bg-transparent hover:bg-amber-50/50 focus:bg-white focus:border-amber-300 h-auto p-2 text-sm font-mono text-right text-amber-950 placeholder:text-amber-300 transition-colors"
//                               placeholder="0.00"
//                               value={item.price || ""}
//                               onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
//                             />
//                           </td>
//                           <td className="py-4 align-top text-right pr-2">
//                             <div className="p-2 text-sm font-mono font-bold text-amber-700">
//                               {currency === 'NGN' ? '₦' : '$'}{amount.toLocaleString()}
//                             </div>
//                           </td>
//                           <td className="py-4 align-top text-right">
//                             <button 
//                               onClick={() => removeItem(item.id)}
//                               className="p-2 text-amber-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
                
//                 <Button 
//                   variant="ghost" 
//                   size="sm" 
//                   onClick={addItem}
//                   className="text-amber-700 hover:text-amber-800 hover:bg-amber-50/50 border border-transparent hover:border-amber-200"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Item
//                 </Button>
//               </div>

//               {/* Footer / Totals */}
//               <div className="mt-8 border-t-2 border-amber-200/50 pt-8">
//                 <div className="flex justify-end">
//                   <div className="w-64 space-y-3">
//                     <div className="flex justify-between text-sm text-amber-700/70 font-medium">
//                       <span>Subtotal</span>
//                       <span>{currency === 'NGN' ? '₦' : '$'}{subtotal.toLocaleString()}</span>
//                     </div>
//                     {hasDiscount && (
//                       <div className="flex justify-between text-sm text-amber-700/70 font-medium">
//                         <span>Discount ({discountRate}%)</span>
//                         <span>-{currency === 'NGN' ? '₦' : '$'}{discountAmount.toLocaleString()}</span>
//                       </div>
//                     )}
//                     <div className="flex justify-between text-lg font-bold pt-3 border-t border-amber-200/50">
//                       <span className="bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent">Total</span>
//                       <span className="bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent">{currency === 'NGN' ? '₦' : '$'}{total.toLocaleString()}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </Layout>
//   );
// }



import { useState, useRef } from "react";
import { useCreateInvoice } from "@/hooks/use-invoices";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Trash2, Printer, Save, Loader2, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { format } from "date-fns";
import logoGif from "@/assets/GWCLogo.jpeg";

type InvoiceItem = {
  id: string;
  service: string;
  description: string;
  quantity: number;
  price: number; // This is the unit price
};

export default function CreateInvoice() {
  const { mutate: saveInvoice, isPending } = useCreateInvoice();
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);

  const generateInvoiceNumber = () => {
    const now = new Date();
    return `${String(now.getHours()).padStart(2, "0")}${String(
      now.getMinutes()
    ).padStart(2, "0")}${String(now.getSeconds()).padStart(2, "0")}`;
  };

  const [invoiceNumber, setInvoiceNumber] = useState(generateInvoiceNumber());
  const [clientName, setClientName] = useState("");
  const [companyName, setCompanyName] = useState("Glorywellness Regenerative Center");
  const [clientEmail, setClientEmail] = useState("");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() + 30); // Default to 30 days from now
    return date.toISOString().split('T')[0];
  });
  const [currency, setCurrency] = useState("NGN");
  const [hasDiscount, setHasDiscount] = useState(false);
  const [discountRate, setDiscountRate] = useState(5);
  const [logo, setLogo] = useState<string | null>(logoGif);
  const [items, setItems] = useState<InvoiceItem[]>([]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setLogo(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate subtotal: sum of (quantity × unit price) for all items
  const calculateSubtotal = () => {
    return items.reduce((acc, item) => {
      const quantity = Number(item.quantity) || 1;
      const unitPrice = Number(item.price) || 0;
      return acc + (quantity * unitPrice);
    }, 0);
  };
  
  const subtotal = calculateSubtotal();
  const discountAmount = hasDiscount ? subtotal * (discountRate / 100) : 0;
  const total = subtotal - discountAmount;

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), service: "", description: "", quantity: 1, price: 0 }]);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: any) => {
    setItems(items.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleSave = () => {
    // Check for required fields
    if (!clientName.trim() || !companyName.trim() || items.length === 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and add at least one item",
        variant: "destructive",
      });
      return;
    }

    // Check each item for required fields
    const invalidItems = items.filter(item => {
      const service = item.service?.trim();
      const price = Number(item.price);
      
      // Check if service is empty OR price is 0 or NaN
      return !service || isNaN(price) || price <= 0;
    });

    if (invalidItems.length > 0) {
      toast({
        title: "Validation Error",
        description: "Please ensure all items have a service name and a valid price (> 0)",
        variant: "destructive",
      });
      return;
    }

    // Prepare items with calculated amount for each (backend expects amount field)
    const itemsWithAmount = items.map(({ service, description, quantity, price }) => {
      const qty = Number(quantity) || 1;
      const unitPrice = Number(price) || 0;
      const amount = qty * unitPrice;
      
      return { 
        service: service.trim(), 
        description: description.trim(), 
        quantity: qty, 
        price: unitPrice,
        amount: amount // Add the calculated amount field that backend expects
      };
    });

    // Recalculate totals with the prepared items
    const invoiceSubtotal = itemsWithAmount.reduce((acc, item) => acc + item.amount, 0);
    const invoiceDiscountAmount = hasDiscount ? invoiceSubtotal * (discountRate / 100) : 0;
    const invoiceTotal = invoiceSubtotal - invoiceDiscountAmount;

    saveInvoice({
      invoiceNumber,
      clientName: clientName.trim(),
      companyName: companyName.trim(),
      clientEmail,
      status,
      dueDate,
      amount: invoiceTotal,
      currency,
      items: itemsWithAmount, // Use items with calculated amount
      subtotal: invoiceSubtotal,
      discountRate: hasDiscount ? discountRate : 0,
      discountAmount: invoiceDiscountAmount,
      total: invoiceTotal,
    }, {
      onSuccess: () => {
        // Reset form
        setInvoiceNumber(generateInvoiceNumber());
        setClientName("");
        setClientEmail("");
        setItems([]);
        toast({
          title: "Success",
          description: "Invoice saved successfully",
        });
      },
      onError: (error) => {
        console.error("Invoice save error:", error);
        toast({
          title: "Error",
          description: error.message || "Failed to save invoice. Please check all fields.",
          variant: "destructive",
        });
      }
    });
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current) return;

    try {
      const canvas = await html2canvas(invoiceRef.current, {
        scale: 2,
        logging: false,
        backgroundColor: "#ffffff",
      });
      
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`invoice-${invoiceNumber}.pdf`);
      
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

  return (
    <Layout>
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Editor */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="border-2 border-amber-200/50 bg-gradient-to-br from-white via-amber-50/10 to-white shadow-lg">
            <CardContent className="p-6 space-y-6">
              <h2 className="text-xl font-bold font-display text-amber-900 mb-4">Invoice Details</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">Invoice #</label>
                  <div className="flex gap-2">
                    <Input 
                      value={invoiceNumber} 
                      onChange={(e) => setInvoiceNumber(e.target.value)}
                      className="font-mono bg-amber-50/30 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400"
                    />
                    <Button 
                      variant="outline" 
                      size="icon"
                      onClick={() => setInvoiceNumber(generateInvoiceNumber())}
                      title="Generate new number"
                      className="border-amber-200/50 hover:bg-amber-50 hover:border-amber-300"
                    >
                      <RefreshCw className="w-4 h-4 text-amber-600" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">Company Logo</label>
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleLogoUpload}
                    className="bg-amber-50/30 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-amber-500 file:to-amber-600 file:text-white hover:file:from-amber-600 hover:file:to-amber-700"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">Company Name</label>
                  <Input 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="bg-amber-50/30 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400"
                    placeholder="Your Company Name"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">
                    Client Name <span className="text-red-500">*</span>
                  </label>
                  <Input 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)}
                    className={`bg-amber-50/30 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400 ${!clientName.trim() ? 'ring-1 ring-red-300' : ''}`}
                    placeholder="Client Name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">Client Email</label>
                  <Input 
                    type="email"
                    value={clientEmail} 
                    onChange={(e) => setClientEmail(e.target.value)}
                    className="bg-amber-50/30 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400"
                    placeholder="email@example.com"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">Status</label>
                    <Select value={status} onValueChange={setStatus}>
                      <SelectTrigger className="bg-amber-50/30 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="overdue">Overdue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">Currency</label>
                    <Select value={currency} onValueChange={setCurrency}>
                      <SelectTrigger className="bg-amber-50/30 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NGN">NGN (₦)</SelectItem>
                        <SelectItem value="USD">USD ($)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">Due Date</label>
                  <Input 
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="bg-amber-50/30 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400"
                  />
                </div>

                <div className="pt-4 border-t border-amber-200/50">
                  <div className="flex items-center justify-between mb-4">
                    <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">Apply Discount</label>
                    <Switch 
                      checked={hasDiscount} 
                      onCheckedChange={setHasDiscount} 
                    />
                  </div>
                  
                  {hasDiscount && (
                    <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
                      <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">Discount Rate (%)</label>
                      <Input 
                        type="number"
                        min="0"
                        max="100"
                        value={discountRate}
                        onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 0)}
                        className="bg-amber-50/30 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <Button 
                  className="flex-1 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/30" 
                  onClick={handleSave} 
                  disabled={isPending}
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Invoice
                    </>
                  )}
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleDownloadPDF}
                  className="border-amber-200/50 hover:bg-amber-50 hover:border-amber-300"
                >
                  <Printer className="w-4 h-4 text-amber-600" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Preview & Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold font-display text-amber-900">Invoice Preview</h2>
            <div className="text-sm text-amber-700/60 font-medium">
              Preview updates automatically
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-xl border-2 border-amber-200/50 overflow-hidden">
            <div ref={invoiceRef} className="p-8 md:p-12 min-h-[800px] flex flex-col bg-white text-amber-950">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6 mb-12">
                <div className="flex items-start gap-6">
                  {logo && <img src={logo} alt="Company Logo" className="h-16 w-auto object-contain" />}
                  <div>
                    <h1 className="text-4xl font-bold font-display tracking-tight bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent mb-2">INVOICE</h1>
                    <p className="text-amber-700/60 font-mono text-sm font-medium">#{invoiceNumber}</p>
                    <div className={`mt-4 inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide shadow-sm
                      ${status === 'paid' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white' : 
                        status === 'overdue' ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white' : 
                        'bg-gradient-to-r from-amber-400 to-amber-500 text-white'}`}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </div>
                  </div>
                </div>
                <div className="md:text-right">
                  <div className="text-xl md:text-2xl font-bold bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent mb-1 break-words max-w-xs">
                    {companyName || "Your Company Name"}
                  </div>
                  <div className="text-sm text-amber-700/60 font-medium">
                    {format(new Date(), "MMMM dd, yyyy")}
                  </div>
                </div>
              </div>

              {/* Client Info */}
              <div className="mb-12 p-6 bg-gradient-to-br from-amber-50/50 to-amber-50/30 rounded-lg border-2 border-amber-200/50">
                <h3 className="text-xs font-bold uppercase text-amber-900/70 tracking-wider mb-3">Bill To</h3>
                <div className="text-lg font-semibold text-amber-950">{clientName || "Client Name"}</div>
                <div className="text-amber-700/60 font-medium">{clientEmail || "email@example.com"}</div>
              </div>

              {/* Items List - Interactive in Preview */}
              <div className="flex-1">
                <table className="w-full mb-8">
                  <thead>
                    <tr className="border-b-2 border-amber-200/50">
                      <th className="text-left py-3 text-xs font-bold text-amber-900/70 uppercase tracking-wider">
                        Items <span className="text-red-500">*</span>
                      </th>
                      <th className="text-left py-3 text-xs font-bold text-amber-900/70 uppercase tracking-wider">Description</th>
                      <th className="text-center py-3 text-xs font-bold text-amber-900/70 uppercase tracking-wider w-20">Qty</th>
                      <th className="text-right py-3 text-xs font-bold text-amber-900/70 uppercase tracking-wider w-28">
                        Unit Price <span className="text-red-500">*</span>
                      </th>
                      <th className="text-right py-3 text-xs font-bold text-amber-900/70 uppercase tracking-wider w-32">Amount</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {items.map((item) => {
                      const quantity = Number(item.quantity) || 1;
                      const unitPrice = Number(item.price) || 0;
                      const amount = quantity * unitPrice;
                      
                      return (
                        <tr key={item.id} className="group hover:bg-amber-50/30 transition-colors">
                          <td className="py-4 align-top pr-2">
                            <Input 
                              className={`border-transparent bg-transparent hover:bg-amber-50/50 focus:bg-white focus:border-amber-300 h-auto p-2 text-sm font-medium text-amber-950 placeholder:text-amber-300 transition-colors ${!item.service.trim() ? 'ring-1 ring-red-300' : ''}`}
                              placeholder="Item Name"
                              value={item.service}
                              onChange={(e) => updateItem(item.id, "service", e.target.value)}
                              required
                            />
                          </td>
                          <td className="py-4 align-top pr-2">
                            <Input 
                              className="border-transparent bg-transparent hover:bg-amber-50/50 focus:bg-white focus:border-amber-300 h-auto p-2 text-sm text-amber-700/80 placeholder:text-amber-300 transition-colors"
                              placeholder="Description..."
                              value={item.description}
                              onChange={(e) => updateItem(item.id, "description", e.target.value)}
                            />
                          </td>
                          <td className="py-4 align-top">
                            <Input 
                              type="number"
                              min="1"
                              className="border-transparent bg-transparent hover:bg-amber-50/50 focus:bg-white focus:border-amber-300 h-auto p-2 text-sm text-center text-amber-950 placeholder:text-amber-300 transition-colors"
                              placeholder="1"
                              value={item.quantity || ""}
                              onChange={(e) => updateItem(item.id, "quantity", parseInt(e.target.value) || 1)}
                            />
                          </td>
                          <td className="py-4 align-top">
                            <Input 
                              type="number"
                              min="0"
                              step="0.01"
                              className={`border-transparent bg-transparent hover:bg-amber-50/50 focus:bg-white focus:border-amber-300 h-auto p-2 text-sm font-mono text-right text-amber-950 placeholder:text-amber-300 transition-colors ${(!item.price || Number(item.price) <= 0) ? 'ring-1 ring-red-300' : ''}`}
                              placeholder="0.00"
                              value={item.price || ""}
                              onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                              required
                            />
                          </td>
                          <td className="py-4 align-top text-right pr-2">
                            <div className="p-2 text-sm font-mono font-bold text-amber-700">
                              {currency === 'NGN' ? '₦' : '$'}{amount.toLocaleString()}
                            </div>
                          </td>
                          <td className="py-4 align-top text-right">
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="p-2 text-amber-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={addItem}
                  className="text-amber-700 hover:text-amber-800 hover:bg-amber-50/50 border border-transparent hover:border-amber-200"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              {/* Footer / Totals */}
              <div className="mt-8 border-t-2 border-amber-200/50 pt-8">
                <div className="flex justify-end">
                  <div className="w-64 space-y-3">
                    <div className="flex justify-between text-sm text-amber-700/70 font-medium">
                      <span>Subtotal</span>
                      <span>{currency === 'NGN' ? '₦' : '$'}{subtotal.toLocaleString()}</span>
                    </div>
                    {hasDiscount && (
                      <div className="flex justify-between text-sm text-amber-700/70 font-medium">
                        <span>Discount ({discountRate}%)</span>
                        <span>-{currency === 'NGN' ? '₦' : '$'}{discountAmount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-lg font-bold pt-3 border-t border-amber-200/50">
                      <span className="bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent">Total</span>
                      <span className="bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent">{currency === 'NGN' ? '₦' : '$'}{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}