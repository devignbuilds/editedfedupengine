import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import type { Invoice } from "../types/invoice";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { FileText, Loader2, CreditCard } from "lucide-react";

const InvoiceList = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/payments/invoices",
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setInvoices(data);
      }
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (invoiceId: string) => {
    setProcessing(invoiceId);
    try {
      const response = await fetch(
        `http://localhost:5001/api/payments/invoices/${invoiceId}/pay`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );

      if (response.ok) {
        fetchInvoices();
      }
    } catch (error) {
      console.error("Error paying invoice:", error);
    } finally {
      setProcessing(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {invoices.map((invoice, index) => (
          <motion.div
            key={invoice._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group bg-card text-card-foreground border border-border p-5 rounded-xl flex items-center justify-between hover:border-primary/50 transition-all shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                <FileText className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <h4 className="font-bold text-sm tracking-tight">
                  {invoice.project.name}
                </h4>
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                  Due: {new Date(invoice.dueDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <span className="font-black text-lg tabular-nums tracking-tight">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: invoice.currency || "USD",
                }).format(invoice.amount)}
              </span>

              {invoice.status === "pending" ? (
                <Button
                  size="sm"
                  onClick={() => handlePay(invoice._id)}
                  disabled={!!processing}
                  className="rounded-full px-6 font-bold uppercase tracking-widest text-[10px]"
                >
                  {processing === invoice._id ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-2" />
                  ) : (
                    <CreditCard className="h-3 w-3 mr-2" />
                  )}
                  {processing === invoice._id ? "Processing" : "Pay Now"}
                </Button>
              ) : (
                <Badge
                  variant={invoice.status === "paid" ? "secondary" : "outline"}
                  className="uppercase tracking-widest text-[10px]"
                >
                  {invoice.status}
                </Badge>
              )}
            </div>
          </motion.div>
        ))}
        {invoices.length === 0 && (
          <div className="text-center py-12 border-2 border-dashed border-border rounded-xl">
            <p className="text-muted-foreground italic text-sm">
              No invoices found on record.
            </p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default InvoiceList;
