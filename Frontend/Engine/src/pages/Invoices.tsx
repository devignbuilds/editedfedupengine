import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { DollarSign, Plus, Download, Eye, Wallet } from "lucide-react";
import { motion } from "framer-motion";

import CreateInvoiceModal from "../components/CreateInvoiceModal";
import CryptoPaymentModal from "../components/CryptoPaymentModal";

export default function Invoices() {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isCryptoModalOpen, setIsCryptoModalOpen] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, [user]);

  const fetchInvoices = async () => {
    try {
      const response = await fetch(
        "http://localhost:5001/api/payments/invoices",
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setInvoices(data);
      } else {
        console.error("Failed to fetch invoices", data.message || data);
      }
    } catch (error) {
      console.error("Failed to fetch invoices", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-end"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
            <p className="text-muted-foreground mt-2 text-sm">
              Manage billing and payment records.
            </p>
          </div>
          {user?.role === "admin" && (
            <>
              <Button onClick={() => setIsModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create Invoice
              </Button>
            </>
          )}
        </motion.div>

        <Card className="border-border shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 text-left font-bold text-[10px] uppercase tracking-widest opacity-60">
                      Invoice#
                    </th>
                    <th className="px-6 py-4 text-left font-bold text-[10px] uppercase tracking-widest opacity-60">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left font-bold text-[10px] uppercase tracking-widest opacity-60">
                      Amount
                    </th>
                    <th className="px-6 py-4 text-left font-bold text-[10px] uppercase tracking-widest opacity-60">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left font-bold text-[10px] uppercase tracking-widest opacity-60">
                      Date
                    </th>
                    <th className="px-6 py-4 text-right font-bold text-[10px] uppercase tracking-widest opacity-60">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="inline-block h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                      </td>
                    </tr>
                  ) : invoices.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center">
                        <DollarSign className="h-10 w-10 mx-auto mb-4 opacity-10" />
                        <p className="text-muted-foreground text-sm font-medium">
                          No invoices found.
                        </p>
                        {user?.role === "admin" && (
                          <Button variant="outline" size="sm" className="mt-4">
                            <Plus className="h-3 w-3 mr-2" />
                            Create First Invoice
                          </Button>
                        )}
                      </td>
                    </tr>
                  ) : (
                    invoices.map((invoice) => (
                      <motion.tr
                        key={invoice._id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4 font-mono text-xs font-bold">
                          #{invoice.invoiceNumber || invoice._id.slice(-6)}
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-bold">
                              {invoice.client?.name || "N/A"}
                            </p>
                            <p className="text-[10px] text-muted-foreground uppercase tracking-tighter">
                              {invoice.project?.name || ""}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold">
                          ${invoice.amount?.toLocaleString() || "0.00"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border ${
                              invoice.status === "paid"
                                ? "bg-accent/10 text-accent border-accent/20"
                                : invoice.status === "pending"
                                ? "bg-primary/10 text-primary border-primary/20"
                                : "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            {invoice.status || "draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground text-xs">
                          {invoice.createdAt
                            ? new Date(invoice.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                         <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                             {user?.role === "client" && invoice.status === "pending" && (
                               <Button 
                                 size="sm" 
                                 className="h-8 px-3 rounded-md bg-accent text-accent-foreground hover:bg-accent/90 gap-1 font-black uppercase text-[10px] tracking-widest shadow-lg shadow-accent/20"
                                 onClick={() => {
                                   setSelectedInvoice(invoice);
                                   setIsCryptoModalOpen(true);
                                 }}
                               >
                                 <Wallet className="h-3 w-3" />
                                 Pay Now
                               </Button>
                             )}
                            <button
                              className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center transition-colors"
                              title="View"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              className="h-8 w-8 rounded-md hover:bg-muted flex items-center justify-center transition-colors"
                              title="Download"
                            >
                              <Download className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
      <CreateInvoiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={() => fetchInvoices()}
      />

      <CryptoPaymentModal
        isOpen={isCryptoModalOpen}
        onClose={() => {
          setIsCryptoModalOpen(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        onSuccess={() => {
          setIsCryptoModalOpen(false);
          setSelectedInvoice(null);
          fetchInvoices();
        }}
      />
    </DashboardLayout>
  );
}
