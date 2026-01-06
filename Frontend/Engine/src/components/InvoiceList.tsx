import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Invoice } from '../types/invoice';
import { motion } from 'framer-motion';

const InvoiceList = () => {
  const { user } = useAuth();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/payments/invoices', {
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setInvoices(data);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePay = async (invoiceId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/payments/invoices/${invoiceId}/pay`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${user?.token}`,
        },
      });

      if (response.ok) {
        fetchInvoices();
      }
    } catch (error) {
      console.error('Error paying invoice:', error);
    }
  };

  if (loading) return <div>Loading invoices...</div>;

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="space-y-4"
    >
      {invoices.map((invoice) => (
        <motion.div 
          key={invoice._id} 
          variants={{
            hidden: { opacity: 0, x: -10 },
            show: { opacity: 1, x: 0 }
          }}
          className="bg-card text-card-foreground border border-border p-4 rounded-xl flex justify-between items-center hover:border-foreground transition-all shadow-sm"
        >
          <div>
            <h4 className="font-bold">{invoice.project.name}</h4>
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Due: {new Date(invoice.dueDate).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-bold text-lg tabular-nums">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: invoice.currency }).format(invoice.amount)}
            </span>
            {invoice.status === 'pending' ? (
              <button
                onClick={() => handlePay(invoice._id)}
                className="bg-primary text-primary-foreground px-4 py-1.5 rounded-full text-sm hover:opacity-90 font-bold transition-opacity"
              >
                Pay Now
              </button>
            ) : (
              <span className="bg-muted px-4 py-1.5 rounded-full text-xs font-bold text-muted-foreground uppercase border border-border">
                {invoice.status}
              </span>
            )}
          </div>
        </motion.div>
      ))}
      {invoices.length === 0 && <p className="text-muted-foreground text-center py-4 italic">No invoices found.</p>}
    </motion.div>
  );
};

export default InvoiceList;
