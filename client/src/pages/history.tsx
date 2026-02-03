// import { useInvoices } from "@/hooks/use-invoices";
// import { Layout } from "@/components/layout";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Badge } from "@/components/ui/badge";
// import { Search, Loader2, FileText, Eye, Trash2, AlertCircle } from "lucide-react";
// import { format } from "date-fns";
// import { useState } from "react";
// import { Link } from "wouter";
// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import { useToast } from "@/hooks/use-toast";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";

// export default function History() {
//   const { data: invoices, isLoading, error } = useInvoices();
//   const [search, setSearch] = useState("");
//   const [deleteId, setDeleteId] = useState<string | null>(null);
//   const queryClient = useQueryClient();
//   const { toast } = useToast();

//   const deleteMutation = useMutation({
//     mutationFn: async (id: string) => {
//       const res = await fetch(`/api/invoices/${id}`, {
//         method: 'DELETE',
//       });
//       if (!res.ok) throw new Error('Failed to delete invoice');
//       return res.json();
//     },
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
//       toast({
//         title: "Success",
//         description: "Invoice deleted successfully",
//       });
//       setDeleteId(null);
//     },
//     onError: () => {
//       toast({
//         title: "Error",
//         description: "Failed to delete invoice",
//         variant: "destructive",
//       });
//       setDeleteId(null);
//     },
//   });

//   const handleDelete = (id: string) => {
//     setDeleteId(id);
//   };

//   const confirmDelete = () => {
//     if (deleteId) {
//       deleteMutation.mutate(deleteId);
//     }
//   };

//   const filteredInvoices = invoices?.filter(inv => 
//     inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
//     inv.invoiceNumber.toLowerCase().includes(search.toLowerCase())
//   ) || [];

//   return (
//     <Layout>
//       <div className="max-w-7xl mx-auto space-y-6">
//         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//           <div>
//             <h1 className="text-3xl font-bold font-display text-foreground">Invoice History</h1>
//             <p className="text-muted-foreground mt-1">Manage and view your saved invoices</p>
//           </div>
          
//           <div className="relative w-full md:w-72">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
//             <Input 
//               placeholder="Search client or invoice #..." 
//               className="pl-9 bg-background border-border/60"
//               value={search}
//               onChange={(e) => setSearch(e.target.value)}
//             />
//           </div>
//         </div>

//         {isLoading ? (
//           <div className="h-64 flex flex-col items-center justify-center text-muted-foreground">
//             <Loader2 className="w-8 h-8 animate-spin mb-4 text-primary" />
//             <p>Loading your invoices...</p>
//           </div>
//         ) : error ? (
//           <div className="h-64 flex flex-col items-center justify-center text-destructive">
//             <AlertCircle className="w-8 h-8 mb-4" />
//             <p>Failed to load invoices. Please try again later.</p>
//           </div>
//         ) : filteredInvoices.length === 0 ? (
//           <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-border/60 rounded-xl bg-muted/5">
//             <FileText className="w-12 h-12 mb-4 opacity-50" />
//             <p className="text-lg font-medium">No invoices found</p>
//             <p className="text-sm mb-6">Create your first invoice to get started</p>
//             <Link href="/">
//               <Button>Create Invoice</Button>
//             </Link>
//           </div>
//         ) : (
//           <Card>
//             <CardContent className="p-0">
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="border-b bg-muted/50">
//                       <th className="text-left p-4 font-semibold text-sm">Invoice #</th>
//                       <th className="text-left p-4 font-semibold text-sm">Client</th>
//                       <th className="text-left p-4 font-semibold text-sm">Amount</th>
//                       <th className="text-left p-4 font-semibold text-sm">Status</th>
//                       <th className="text-left p-4 font-semibold text-sm">Date</th>
//                       <th className="text-left p-4 font-semibold text-sm">Due Date</th>
//                       <th className="text-right p-4 font-semibold text-sm">Actions</th>
//                     </tr>
//                   </thead>
//                   <tbody>
//                     {filteredInvoices.map((invoice) => (
//                       <tr 
//                         key={invoice._id} 
//                         className="border-b hover:bg-muted/30 transition-colors"
//                       >
//                         <td className="p-4">
//                           <div className="font-mono text-sm font-medium">
//                             #{invoice.invoiceNumber}
//                           </div>
//                         </td>
//                         <td className="p-4">
//                           <div className="font-medium">{invoice.clientName}</div>
//                           {invoice.companyName && (
//                             <div className="text-xs text-muted-foreground">{invoice.companyName}</div>
//                           )}
//                         </td>
//                         <td className="p-4">
//                           <div className="font-semibold">
//                             {invoice.currency === 'NGN' ? '₦' : '$'}
//                             {(Number(invoice.total) || 0).toLocaleString()}
//                           </div>
//                         </td>
//                         <td className="p-4">
//                           <Badge 
//                             variant={invoice.status === 'paid' ? 'default' : 'outline'}
//                             className={`${
//                               invoice.status === 'paid' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 
//                               invoice.status === 'overdue' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 
//                               'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
//                             }`}
//                           >
//                             {invoice.status}
//                           </Badge>
//                         </td>
//                         <td className="p-4 text-sm text-muted-foreground">
//                           {invoice.createdAt ? format(new Date(invoice.createdAt), 'MMM dd, yyyy') : 'N/A'}
//                         </td>
//                         <td className="p-4 text-sm text-muted-foreground">
//                           {invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM dd, yyyy') : 'N/A'}
//                         </td>
//                         <td className="p-4">
//                           <div className="flex items-center justify-end gap-2">
//                             <Link href={`/invoice/${invoice._id}`}>
//                               <Button variant="ghost" size="sm">
//                                 <Eye className="w-4 h-4 mr-2" />
//                                 View
//                               </Button>
//                             </Link>
//                             <Button 
//                               variant="ghost" 
//                               size="sm"
//                               onClick={() => handleDelete(invoice._id)}
//                               className="hover:bg-destructive hover:text-destructive-foreground"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </Button>
//                           </div>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             </CardContent>
//           </Card>
//         )}

//         {/* Delete Confirmation Dialog */}
//         <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
//           <AlertDialogContent>
//             <AlertDialogHeader>
//               <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//               <AlertDialogDescription>
//                 This action cannot be undone. This will permanently delete the invoice
//                 and remove it from our servers.
//               </AlertDialogDescription>
//             </AlertDialogHeader>
//             <AlertDialogFooter>
//               <AlertDialogCancel>Cancel</AlertDialogCancel>
//               <AlertDialogAction
//                 onClick={confirmDelete}
//                 className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
//               >
//                 {deleteMutation.isPending ? (
//                   <>
//                     <Loader2 className="w-4 h-4 mr-2 animate-spin" />
//                     Deleting...
//                   </>
//                 ) : (
//                   'Delete'
//                 )}
//               </AlertDialogAction>
//             </AlertDialogFooter>
//           </AlertDialogContent>
//         </AlertDialog>
//       </div>
//     </Layout>
//   );
// }

import { useInvoices } from "@/hooks/use-invoices";
import { Layout } from "@/components/layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, FileText, Eye, Trash2, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import { Link } from "wouter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function History() {
  const { data: invoices, isLoading, error } = useInvoices();
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/invoices/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete invoice');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/invoices'] });
      toast({
        title: "Success",
        description: "Invoice deleted successfully",
      });
      setDeleteId(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete invoice",
        variant: "destructive",
      });
      setDeleteId(null);
    },
  });

  const handleDelete = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteMutation.mutate(deleteId);
    }
  };

  const filteredInvoices = invoices?.filter(inv => 
    inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
    inv.invoiceNumber.toLowerCase().includes(search.toLowerCase())
  ) || [];

  return (
    <Layout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Elegant Header with Gold Accent */}
        <div className="relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-amber-50/30 rounded-2xl p-8 border-2 border-amber-200/50 shadow-lg">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400/10 to-transparent rounded-full blur-3xl"></div>
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold font-display bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 bg-clip-text text-transparent mb-2">
                Invoice History
              </h1>
              <p className="text-amber-800/70 mt-1 font-medium">Manage and view your saved invoices</p>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600/60 w-5 h-5" />
              <Input 
                placeholder="Search client or invoice #..." 
                className="pl-12 h-12 bg-white/80 backdrop-blur border-2 border-amber-300/50 focus:border-amber-500 rounded-xl shadow-sm text-amber-900 placeholder:text-amber-600/40"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="h-64 flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-white to-amber-50/30 rounded-2xl border-2 border-amber-200/50">
            <Loader2 className="w-10 h-10 animate-spin mb-4 text-amber-600" />
            <p className="text-amber-800 font-medium">Loading your invoices...</p>
          </div>
        ) : error ? (
          <div className="h-64 flex flex-col items-center justify-center bg-gradient-to-br from-red-50 via-white to-red-50/30 rounded-2xl border-2 border-red-200/50">
            <AlertCircle className="w-10 h-10 mb-4 text-red-600" />
            <p className="text-red-700 font-medium">Failed to load invoices. Please try again later.</p>
          </div>
        ) : filteredInvoices.length === 0 ? (
          <div className="h-80 flex flex-col items-center justify-center border-4 border-dashed border-amber-300/50 rounded-2xl bg-gradient-to-br from-amber-50/50 via-white to-amber-50/30 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.05),transparent_70%)]"></div>
            <FileText className="w-16 h-16 mb-6 text-amber-400/70 relative z-10" />
            <p className="text-xl font-semibold text-amber-900 mb-2 relative z-10">No invoices found</p>
            <p className="text-sm text-amber-700/70 mb-8 relative z-10">Create your first invoice to get started</p>
            <Link href="/">
              <Button className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white shadow-lg shadow-amber-500/30 relative z-10">
                Create Invoice
              </Button>
            </Link>
          </div>
        ) : (
          <Card className="border-2 border-amber-200/50 shadow-xl rounded-2xl overflow-hidden bg-gradient-to-br from-white via-amber-50/20 to-white">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-amber-200 bg-gradient-to-r from-amber-50 via-amber-100/50 to-amber-50">
                      <th className="text-left p-5 font-bold text-sm text-amber-900 uppercase tracking-wider">Invoice #</th>
                      <th className="text-left p-5 font-bold text-sm text-amber-900 uppercase tracking-wider">Client</th>
                      <th className="text-left p-5 font-bold text-sm text-amber-900 uppercase tracking-wider">Amount</th>
                      <th className="text-left p-5 font-bold text-sm text-amber-900 uppercase tracking-wider">Status</th>
                      <th className="text-left p-5 font-bold text-sm text-amber-900 uppercase tracking-wider">Date</th>
                      <th className="text-left p-5 font-bold text-sm text-amber-900 uppercase tracking-wider">Due Date</th>
                      <th className="text-right p-5 font-bold text-sm text-amber-900 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((invoice) => (
                      <tr 
                        key={invoice._id} 
                        className="border-b border-amber-100/50 hover:bg-gradient-to-r hover:from-amber-50/50 hover:to-transparent transition-all duration-200 group"
                      >
                        <td className="p-5">
                          <div className="font-mono text-sm font-bold text-amber-900 group-hover:text-amber-600 transition-colors">
                            #{invoice.invoiceNumber}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="font-semibold text-gray-900">{invoice.clientName}</div>
                          {invoice.companyName && (
                            <div className="text-xs text-amber-700/60 mt-0.5">{invoice.companyName}</div>
                          )}
                        </td>
                        <td className="p-5">
                          <div className="font-bold text-lg bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent">
                            {invoice.currency === 'NGN' ? '₦' : '$'}
                            {(Number(invoice.total) || 0).toLocaleString()}
                          </div>
                        </td>
                        <td className="p-5">
                          <Badge 
                            variant={invoice.status === 'paid' ? 'default' : 'outline'}
                            className={`font-semibold shadow-sm ${
                              invoice.status === 'paid' ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0' : 
                              invoice.status === 'overdue' ? 'bg-gradient-to-r from-red-500 to-rose-600 text-white border-0' : 
                              'bg-gradient-to-r from-amber-400 to-amber-500 text-white border-0'
                            }`}
                          >
                            {invoice.status}
                          </Badge>
                        </td>
                        <td className="p-5 text-sm text-gray-700 font-medium">
                          {invoice.createdAt ? format(new Date(invoice.createdAt), 'MMM dd, yyyy') : 'N/A'}
                        </td>
                        <td className="p-5 text-sm text-gray-700 font-medium">
                          {invoice.dueDate ? format(new Date(invoice.dueDate), 'MMM dd, yyyy') : 'N/A'}
                        </td>
                        <td className="p-5">
                          <div className="flex items-center justify-end gap-2">
                            <Link href={`/invoice/${invoice._id}`}>
                              <Button variant="ghost" size="sm" className="hover:bg-amber-100 hover:text-amber-900 transition-all">
                                <Eye className="w-4 h-4 mr-2" />
                                View
                              </Button>
                            </Link>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDelete(invoice._id)}
                              className="hover:bg-red-100 hover:text-red-700 transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
          <AlertDialogContent className="border-2 border-amber-200 bg-gradient-to-br from-white via-amber-50/20 to-white">
            <AlertDialogHeader>
              <AlertDialogTitle className="text-2xl font-bold text-amber-900">Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-amber-800/70">
                This action cannot be undone. This will permanently delete the invoice
                and remove it from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="border-amber-300 hover:bg-amber-50">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmDelete}
                className="bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg shadow-red-500/30"
              >
                {deleteMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Layout>
  );
}