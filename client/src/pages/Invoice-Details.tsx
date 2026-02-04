import { useParams, Link } from "wouter";
import { useInvoices } from "@/hooks/use-invoices";
import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, ArrowLeft, Download, Printer, Edit2, Save, X } from "lucide-react";
import { format } from "date-fns";
import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import logoGif from "@/assets/GWCLogo.jpeg";

// Helper function to convert number to words (Nigerian Naira)
function numberToWords(num: number): string {
  if (num === 0) return "Zero";
  
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const teens = ["Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  
  function convertLessThanThousand(n: number): string {
    if (n === 0) return "";
    if (n < 10) return ones[n];
    if (n < 20) return teens[n - 10];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + ones[n % 10] : "");
    return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " and " + convertLessThanThousand(n % 100) : "");
  }
  
  if (num < 1000) return convertLessThanThousand(num);
  if (num < 1000000) {
    const thousands = Math.floor(num / 1000);
    const remainder = num % 1000;
    return convertLessThanThousand(thousands) + " Thousand" + (remainder !== 0 ? " " + convertLessThanThousand(remainder) : "");
  }
  if (num < 1000000000) {
    const millions = Math.floor(num / 1000000);
    const remainder = num % 1000000;
    let result = convertLessThanThousand(millions) + " Million";
    if (remainder >= 1000) {
      result += " " + convertLessThanThousand(Math.floor(remainder / 1000)) + " Thousand";
      const finalRemainder = remainder % 1000;
      if (finalRemainder !== 0) result += " " + convertLessThanThousand(finalRemainder);
    } else if (remainder !== 0) {
      result += " " + convertLessThanThousand(remainder);
    }
    return result;
  }
  return num.toLocaleString(); // For very large numbers, just return formatted number
}

export default function InvoiceDetail() {
  const params = useParams();
  const id = params.id as string;
  const { data: invoices, isLoading } = useInvoices();
  const { toast } = useToast();
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInvoice, setEditedInvoice] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const queryClient = useQueryClient();

  // Find the invoice from the list
  const invoice = invoices?.find((inv: any) => inv._id === id);

  // Initialize edited invoice when invoice is loaded
  useEffect(() => {
    if (invoice && !editedInvoice) {
      setEditedInvoice({...invoice});
      // Set default notes or load from invoice
      if (invoice.notes) {
        setNotes(invoice.notes);
      } else {
        // Default template
        const totalAmount = (invoice.items || []).reduce((sum: number, item: any) => {
          const quantity = Number(item.quantity) || 1;
          const unitPrice = Number(item.price) || 0;
          return sum + (quantity * unitPrice);
        }, 0) - (invoice.discountAmount || 0);
        
        const amountInWords = numberToWords(Math.floor(totalAmount));
        const currencyName = invoice.currency === 'NGN' ? 'Naira' : 'Dollars';
        const currencySymbol = invoice.currency === 'NGN' ? '₦' : '$';
        const invoiceDate = invoice.createdAt ? format(new Date(invoice.createdAt), "do MMMM yyyy") : format(new Date(), "do MMMM yyyy");
        
        setNotes(`As of ${invoiceDate}, patient have a credit balance of ${amountInWords} ${currencyName} (${currencySymbol}${totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}) with the Clinic.`);
      }
    }
  }, [invoice]);

  // Update mutation
  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      const res = await fetch(`/api/invoices/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to update invoice');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      setIsEditing(false);
      toast({
        title: "Success",
        description: "Invoice updated successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update invoice",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (!editedInvoice) return;

    // Recalculate totals
    const items = editedInvoice.items || [];
    const subtotal = items.reduce((sum: number, item: any) => {
      const quantity = Number(item.quantity) || 1;
      const unitPrice = Number(item.price) || 0;
      return sum + (quantity * unitPrice);
    }, 0);
    const discountAmount = editedInvoice.discountRate 
      ? subtotal * (editedInvoice.discountRate / 100) 
      : 0;
    const total = subtotal - discountAmount;

    updateMutation.mutate({
      ...editedInvoice,
      subtotal,
      discountAmount,
      total,
      notes, // Save the notes
    });
  };

  const handleCancel = () => {
    setEditedInvoice({...invoice});
    // Reset notes to original or default
    if (invoice.notes) {
      setNotes(invoice.notes);
    }
    setIsEditing(false);
  };

  const updateItem = (index: number, field: string, value: any) => {
    const newItems = [...(editedInvoice?.items || [])];
    newItems[index] = { ...newItems[index], [field]: value };
    setEditedInvoice({ ...editedInvoice, items: newItems });
  };

  const handleDownloadPDF = async () => {
    if (!invoiceRef.current || !invoice) return;

    try {
      // Hide action buttons during PDF generation
      const buttons = invoiceRef.current.querySelectorAll('button');
      buttons.forEach(btn => btn.style.display = 'none');

      const canvas = await html2canvas(invoiceRef.current, {
        scale: 3, // Higher scale for better quality
        logging: false,
        backgroundColor: "#ffffff",
        useCORS: true,
        allowTaint: true,
      });
      
      // Show buttons again
      buttons.forEach(btn => btn.style.display = '');

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
        compress: true,
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      // Center the image if it's smaller than the page
      const yPosition = 0;

      pdf.addImage(imgData, "PNG", 0, yPosition, imgWidth, imgHeight);
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

  const displayInvoice = isEditing ? editedInvoice : invoice;
  const items = (displayInvoice.items || []) as any[];
  const currencySymbol = displayInvoice.currency === 'NGN' ? '₦' : '$';

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
                    Edit
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
                        onValueChange={(value) => setEditedInvoice({...editedInvoice, status: value})}
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
                  <div className="text-xs text-black-700/70 leading-relaxed">
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
                        {(items.reduce((sum, item) => {
                          const quantity = Number(item.quantity) || 1;
                          const unitPrice = Number(item.price) || 0;
                          return sum + (quantity * unitPrice);
                        }, 0) - (displayInvoice.discountAmount || 0)).toLocaleString()}
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
                        const amount = quantity * unitPrice;
                        
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
                                  className="h-8 text-center border-amber-300"
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
              <div className="border-t-2 border-amber-300 pt-8 mt-8">
                <div className="flex justify-end">
                  <div className="w-96 space-y-4 bg-amber-50/50 p-6 rounded-lg">
                    <div className="flex justify-between text-base text-slate-800 font-medium">
                      <span>Subtotal</span>
                      <span className="font-bold text-amber-700">{currencySymbol}{items.reduce((sum, item) => {
                        const quantity = Number(item.quantity) || 1;
                        const unitPrice = Number(item.price) || 0;
                        return sum + (quantity * unitPrice);
                      }, 0).toLocaleString()}</span>
                    </div>
                    {displayInvoice.discountRate && displayInvoice.discountRate > 0 && (
                      <div className="flex justify-between text-base text-slate-800 font-medium">
                        <span>Discount ({displayInvoice.discountRate}%)</span>
                        <span className="font-bold text-red-600">-{currencySymbol}{(Number(displayInvoice.discountAmount) || 0).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-2xl font-bold pt-4 border-t-2 border-amber-300">
                      <span className="text-slate-900">TOTAL</span>
                      <span className="text-amber-700">
                        {currencySymbol}{
                          (items.reduce((sum, item) => {
                            const quantity = Number(item.quantity) || 1;
                            const unitPrice = Number(item.price) || 0;
                            return sum + (quantity * unitPrice);
                          }, 0) - (displayInvoice.discountAmount || 0)).toLocaleString()
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Notes / Terms Section */}
              <div className="text-sm text-amber-700 border-t border-amber-200 pt-8">
                 <h3 className="text-sm font-bold text-slate-900">Notes / Terms</h3>
                {isEditing ? (
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full min-h-[100px] p-3 text-sm text-slate-700 leading-relaxed border border-amber-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 resize-y"
                    placeholder="Enter notes or terms for your client..."
                  />
                ) : (
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
                    {notes || 'No notes added.'}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}