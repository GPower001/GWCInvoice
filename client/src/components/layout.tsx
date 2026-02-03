// import { Link, useLocation } from "wouter";
// import { FileText, History, Plus, LayoutDashboard } from "lucide-react";

// export function Layout({ children }: { children: React.ReactNode }) {
//   const [location] = useLocation();

//   const navItems = [
//     { href: "/", label: "Dashboard", icon: LayoutDashboard },
//     { href: "/create", label: "New Invoice", icon: Plus },
//     { href: "/history", label: "History", icon: History },
//   ];

//   return (
//     <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
//       <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-50">
//         <div className="container mx-auto px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-2">
//             <div className="bg-primary/10 p-2 rounded-xl">
//               <FileText className="w-6 h-6 text-primary" />
//             </div>
//             <span className="font-display font-bold text-xl tracking-tight">InvoiceGen</span>
//           </div>

//           <nav className="flex items-center gap-1">
//             {navItems.map((item) => {
//               const isActive = location === item.href;
//               return (
//                 <Link key={item.href} href={item.href} className={`
//                   flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
//                   ${isActive 
//                     ? "bg-primary text-primary-foreground shadow-md shadow-primary/20" 
//                     : "text-muted-foreground hover:bg-secondary hover:text-foreground"
//                   }
//                 `}>
//                   <item.icon className="w-4 h-4" />
//                   {item.label}
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>
//       </header>

//       <main className="flex-1 container mx-auto px-4 py-8">
//         {children}
//       </main>
//     </div>
//   );
// }



import { Link, useLocation } from "wouter";
import { FileText, History, Plus, LayoutDashboard } from "lucide-react";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/create", label: "New Invoice", icon: Plus },
    { href: "/history", label: "History", icon: History },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50/30 via-white to-amber-50/20 text-foreground flex flex-col font-sans">
      <header className="border-b-2 border-amber-200/50 bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-2 rounded-xl shadow-lg shadow-amber-500/30">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight bg-gradient-to-r from-amber-700 to-amber-600 bg-clip-text text-transparent">InvoiceGen</span>
          </div>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location === item.href;
              return (
                <Link key={item.href} href={item.href} className={`
                  flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200
                  ${isActive 
                    ? "bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30" 
                    : "text-amber-900/70 hover:bg-amber-50 hover:text-amber-900 border border-transparent hover:border-amber-200"
                  }
                `}>
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}