import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import CustomSelect from "./ui/CustomSelect";
import { useAuth } from "../context/useAuth";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

const CreateInvoiceModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onCreated,
}) => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<any[]>([]);
  const [projectId, setProjectId] = useState("");
  const [amount, setAmount] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      if (!user?.token) return;
      try {
        const res = await fetch("http://localhost:5001/api/projects", {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        const data = await res.json();
        if (res.ok) setProjects(data);
      } catch (err) {
        // ignore
      }
    };
    if (isOpen) fetchProjects();
  }, [isOpen, user?.token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!projectId || !amount) {
      setError("Project and amount are required");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("user")
        ? JSON.parse(localStorage.getItem("user") || "{}").token
        : null;
      const res = await fetch("http://localhost:5001/api/payments/invoices", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          projectId,
          amount: Number(amount),
          dueDate: dueDate || undefined,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        onCreated();
        onClose();
      } else {
        setError(data.message || "Failed to create invoice");
      }
    } catch (err: any) {
      setError(err.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card border border-border rounded-lg shadow-lg w-full max-w-md p-6">
        <h3 className="font-bold text-lg mb-2">Create Invoice</h3>
        {error && <div className="text-destructive text-sm mb-2">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-xs font-black uppercase text-muted-foreground">
              Project
            </label>
            <CustomSelect
              options={projects.map((p) => ({ label: p.name, value: p._id }))}
              value={projectId}
              onChange={(val) => setProjectId(val)}
              placeholder="Select project"
              className="mt-1"
            />
          </div>
          <div>
            <label className="text-xs font-black uppercase text-muted-foreground">
              Amount
            </label>
            <input
              className="w-full mt-1 p-2 border border-input rounded"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
            />
          </div>
          <div>
            <label className="text-xs font-black uppercase text-muted-foreground">
              Due Date
            </label>
            <input
              type="date"
              className="w-full mt-1 p-2 border border-input rounded"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInvoiceModal;
