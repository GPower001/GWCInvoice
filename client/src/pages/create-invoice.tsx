

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
//   price: number;
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
//   const [items, setItems] = useState<InvoiceItem[]>([
//     { id: crypto.randomUUID(), service: "Web Development", description: "Frontend implementation", price: 150000 }
//   ]);

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

//   const subtotal = items.reduce((acc, item) => acc + (item.price || 0), 0);
//   const discountAmount = hasDiscount ? subtotal * (discountRate / 100) : 0;
//   const total = subtotal - discountAmount;

//   const addItem = () => {
//     setItems([...items, { id: crypto.randomUUID(), service: "", description: "", price: 0 }]);
//   };

//   const removeItem = (id: string) => {
//     if (items.length === 1) return;
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
//       items: items.map(({ service, description, price }) => ({ service, description, price })),
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
//           <Card className="border-border/50 shadow-lg">
//             <CardContent className="p-6 space-y-6">
//               <h2 className="text-xl font-bold font-display text-foreground mb-4">Invoice Details</h2>
              
//               <div className="space-y-4">
//                 <div className="space-y-2">
//                   <label className="text-xs font-semibold uppercase text-muted-foreground">Invoice #</label>
//                   <div className="flex gap-2">
//                     <Input 
//                       value={invoiceNumber} 
//                       onChange={(e) => setInvoiceNumber(e.target.value)}
//                       className="font-mono bg-muted/30"
//                     />
//                     <Button 
//                       variant="outline" 
//                       size="icon"
//                       onClick={() => setInvoiceNumber(generateInvoiceNumber())}
//                       title="Generate new number"
//                     >
//                       <RefreshCw className="w-4 h-4" />
//                     </Button>
//                   </div>
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-xs font-semibold uppercase text-muted-foreground">Company Logo</label>
//                   <Input 
//                     type="file" 
//                     accept="image/*" 
//                     onChange={handleLogoUpload}
//                     className="cursor-pointer"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-xs font-semibold uppercase text-muted-foreground">Company Name</label>
//                   <Input 
//                     placeholder="e.g. Acme Corp" 
//                     value={companyName}
//                     onChange={(e) => setCompanyName(e.target.value)}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-xs font-semibold uppercase text-muted-foreground">Client Name</label>
//                   <Input 
//                     placeholder="e.g. John Doe" 
//                     value={clientName}
//                     onChange={(e) => setClientName(e.target.value)}
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label className="text-xs font-semibold uppercase text-muted-foreground">Client Email</label>
//                   <Input 
//                     type="email"
//                     placeholder="client@example.com" 
//                     value={clientEmail}
//                     onChange={(e) => setClientEmail(e.target.value)}
//                   />
//                 </div>

//                 <div className="grid grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <label className="text-xs font-semibold uppercase text-muted-foreground">Status</label>
//                     <Select value={status} onValueChange={setStatus}>
//                       <SelectTrigger>
//                         <SelectValue />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="pending">Pending</SelectItem>
//                         <SelectItem value="paid">Paid</SelectItem>
//                         <SelectItem value="overdue">Overdue</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </div>
                  
//                   <div className="space-y-2">
//                     <label className="text-xs font-semibold uppercase text-muted-foreground">Currency</label>
//                     <Select value={currency} onValueChange={setCurrency}>
//                       <SelectTrigger>
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
//                   <label className="text-xs font-semibold uppercase text-muted-foreground">Due Date</label>
//                   <Input 
//                     type="date"
//                     value={dueDate}
//                     onChange={(e) => setDueDate(e.target.value)}
//                   />
//                 </div>
                
//                 <div className="space-y-4 pt-4 border-t border-border/50">
//                   <div className="flex items-center justify-between">
//                     <label className="text-xs font-semibold uppercase text-muted-foreground">Discount</label>
//                     <div className="flex items-center gap-2">
//                       <span className="text-xs text-muted-foreground">{hasDiscount ? "Enabled" : "Disabled"}</span>
//                       <Switch 
//                         checked={hasDiscount} 
//                         onCheckedChange={setHasDiscount} 
//                       />
//                     </div>
//                   </div>
                  
//                   {hasDiscount && (
//                     <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
//                       <label className="text-xs font-semibold uppercase text-muted-foreground">Discount Rate (%)</label>
//                       <Input 
//                         type="number"
//                         min="0"
//                         max="100"
//                         value={discountRate}
//                         onChange={(e) => setDiscountRate(parseFloat(e.target.value) || 0)}
//                       />
//                     </div>
//                   )}
//                 </div>
//               </div>

//               <div className="pt-4 flex gap-3">
//                 <Button 
//                   className="flex-1" 
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
                
//                 <Button variant="outline" onClick={handleDownloadPDF}>
//                   <Printer className="w-4 h-4" />
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Right Column: Preview & Items */}
//         <div className="lg:col-span-2 space-y-6">
//           <div className="flex items-center justify-between">
//             <h2 className="text-xl font-bold font-display text-foreground">Invoice Preview</h2>
//             <div className="text-sm text-muted-foreground">
//               Preview updates automatically
//             </div>
//           </div>

//           <div className="bg-white rounded-xl shadow-xl border border-border/40 overflow-hidden">
//             <div ref={invoiceRef} className="p-8 md:p-12 min-h-[800px] flex flex-col bg-white text-slate-900">
//               <div className="flex justify-between items-start mb-12">
//                 <div className="flex items-start gap-6">
//                   {logo && <img src={logo} alt="Company Logo" className="h-16 w-auto object-contain" />}
//                   <div>
//                     <h1 className="text-4xl font-bold font-display tracking-tight text-slate-900 mb-2">INVOICE</h1>
//                     <p className="text-slate-500 font-mono text-sm">#{invoiceNumber}</p>
//                     <div className={`mt-4 inline-flex px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
//                       ${status === 'paid' ? 'bg-green-100 text-green-700' : 
//                         status === 'overdue' ? 'bg-red-100 text-red-700' : 
//                         'bg-amber-100 text-amber-700'}`}>
//                       {status.charAt(0).toUpperCase() + status.slice(1)}
//                     </div>
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-2xl font-bold text-primary mb-1">
//                     {companyName || "Your Company Name"}
//                   </div>
//                   <div className="text-sm text-slate-500">
//                     {format(new Date(), "MMMM dd, yyyy")}
//                   </div>
//                 </div>
//               </div>

//               {/* Client Info */}
//               <div className="mb-12 p-6 bg-slate-50 rounded-lg border border-slate-100">
//                 <h3 className="text-xs font-bold uppercase text-slate-400 mb-3">Bill To</h3>
//                 <div className="text-lg font-semibold text-slate-900">{clientName || "Client Name"}</div>
//                 <div className="text-slate-500">{clientEmail || "email@example.com"}</div>
//               </div>

//               {/* Items List - Interactive in Preview */}
//               <div className="flex-1">
//                 <table className="w-full mb-8">
//                   <thead>
//                     <tr className="border-b border-slate-200">
//                       <th className="text-left py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-1/3">Service</th>
//                       <th className="text-left py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Description</th>
//                       <th className="text-right py-3 text-xs font-bold text-slate-400 uppercase tracking-wider w-32">Price</th>
//                       <th className="w-10"></th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100">
//                     {items.map((item) => (
//                       <tr key={item.id} className="group">
//                         <td className="py-4 align-top pr-4">
//                           <Input 
//                             className="border-transparent bg-transparent hover:bg-slate-50 focus:bg-white h-auto p-2 text-sm font-medium text-slate-900 placeholder:text-slate-300 transition-colors"
//                             placeholder="Service Name"
//                             value={item.service}
//                             onChange={(e) => updateItem(item.id, "service", e.target.value)}
//                           />
//                         </td>
//                         <td className="py-4 align-top pr-4">
//                           <Input 
//                             className="border-transparent bg-transparent hover:bg-slate-50 focus:bg-white h-auto p-2 text-sm text-slate-600 placeholder:text-slate-300 transition-colors"
//                             placeholder="Description of work..."
//                             value={item.description}
//                             onChange={(e) => updateItem(item.id, "description", e.target.value)}
//                           />
//                         </td>
//                         <td className="py-4 align-top">
//                           <Input 
//                             type="number"
//                             className="border-transparent bg-transparent hover:bg-slate-50 focus:bg-white h-auto p-2 text-sm font-mono text-right text-slate-900 placeholder:text-slate-300 transition-colors"
//                             placeholder="0.00"
//                             value={item.price || ""}
//                             onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
//                           />
//                         </td>
//                         <td className="py-4 align-top text-right">
//                           <button 
//                             onClick={() => removeItem(item.id)}
//                             className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100"
//                           >
//                             <Trash2 className="w-4 h-4" />
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
                
//                 <Button 
//                   variant="ghost" 
//                   size="sm" 
//                   onClick={addItem}
//                   className="text-primary hover:text-primary/80 hover:bg-primary/5"
//                 >
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add Item
//                 </Button>
//               </div>

//               {/* Footer / Totals */}
//               <div className="mt-8 border-t-2 border-slate-100 pt-8">
//                 <div className="flex justify-end">
//                   <div className="w-64 space-y-3">
//                     <div className="flex justify-between text-sm text-slate-500">
//                       <span>Subtotal</span>
//                       <span>{currency === 'NGN' ? '₦' : '$'}{subtotal.toLocaleString()}</span>
//                     </div>
//                     {hasDiscount && (
//                       <div className="flex justify-between text-sm text-slate-500">
//                         <span>Discount ({discountRate}%)</span>
//                         <span>-{currency === 'NGN' ? '₦' : '$'}{discountAmount.toLocaleString()}</span>
//                       </div>
//                     )}
//                     <div className="flex justify-between text-lg font-bold text-slate-900 pt-3 border-t border-slate-100">
//                       <span>Total</span>
//                       <span>{currency === 'NGN' ? '₦' : '$'}{total.toLocaleString()}</span>
//                     </div>
//                   </div>
//                 </div>
//               </div>
              
//               <div className="mt-12 text-center text-xs text-slate-400">
//                 <p>Thank you for your business!</p>
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
  price: number;
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

  const subtotal = items.reduce((acc, item) => acc + (item.price || 0), 0);
  const discountAmount = hasDiscount ? subtotal * (discountRate / 100) : 0;
  const total = subtotal - discountAmount;

  const addItem = () => {
    setItems([...items, { id: crypto.randomUUID(), service: "", description: "", price: 0 }]);
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
    if (!clientName || !companyName || items.some(i => !i.service || !i.price)) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    saveInvoice({
      invoiceNumber,
      clientName,
      companyName,
      clientEmail,
      status,
      dueDate,
      amount: total,
      currency,
      items: items.map(({ service, description, price }) => ({ service, description, price })),
      subtotal,
      discountRate: hasDiscount ? discountRate : 0,
      discountAmount,
      total,
    }, {
      onSuccess: () => {
        // Reset form or redirect
        setInvoiceNumber(generateInvoiceNumber());
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
      pdf.save(`${invoiceNumber}.pdf`);
      
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
                  <label className="text-xs font-semibold uppercase text-amber-900/70 tracking-wider">Client Name</label>
                  <Input 
                    value={clientName} 
                    onChange={(e) => setClientName(e.target.value)}
                    className="bg-amber-50/30 border-amber-200/50 focus:border-amber-400 focus:ring-amber-400"
                    placeholder="Client Name"
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
                      <th className="text-left py-3 text-xs font-bold text-amber-900/70 uppercase tracking-wider w-1/3">Service</th>
                      <th className="text-left py-3 text-xs font-bold text-amber-900/70 uppercase tracking-wider">Description</th>
                      <th className="text-right py-3 text-xs font-bold text-amber-900/70 uppercase tracking-wider w-32">Price</th>
                      <th className="w-10"></th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {items.map((item) => (
                      <tr key={item.id} className="group hover:bg-amber-50/30 transition-colors">
                        <td className="py-4 align-top pr-4">
                          <Input 
                            className="border-transparent bg-transparent hover:bg-amber-50/50 focus:bg-white focus:border-amber-300 h-auto p-2 text-sm font-medium text-amber-950 placeholder:text-amber-300 transition-colors"
                            placeholder="Service Name"
                            value={item.service}
                            onChange={(e) => updateItem(item.id, "service", e.target.value)}
                          />
                        </td>
                        <td className="py-4 align-top pr-4">
                          <Input 
                            className="border-transparent bg-transparent hover:bg-amber-50/50 focus:bg-white focus:border-amber-300 h-auto p-2 text-sm text-amber-700/80 placeholder:text-amber-300 transition-colors"
                            placeholder="Description of work..."
                            value={item.description}
                            onChange={(e) => updateItem(item.id, "description", e.target.value)}
                          />
                        </td>
                        <td className="py-4 align-top">
                          <Input 
                            type="number"
                            className="border-transparent bg-transparent hover:bg-amber-50/50 focus:bg-white focus:border-amber-300 h-auto p-2 text-sm font-mono text-right text-amber-950 placeholder:text-amber-300 transition-colors"
                            placeholder="0.00"
                            value={item.price || ""}
                            onChange={(e) => updateItem(item.id, "price", parseFloat(e.target.value) || 0)}
                          />
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
                    ))}
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
              
              <div className="mt-12 text-center text-xs text-amber-700/60 font-medium">
                <p>Thank you for your business!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}