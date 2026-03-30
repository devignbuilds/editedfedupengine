import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "../context/useAuth";
import type { User } from "../types/user";

interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectCreated: () => void;
}

const CreateProjectModal = ({
  isOpen,
  onClose,
  onProjectCreated,
}: CreateProjectModalProps) => {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [clientId, setClientId] = useState("");
  const [deadline, setDeadline] = useState("");
  const [budget, setBudget] = useState("");

  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchClients();
    }
  }, [isOpen]);

  const fetchClients = async () => {
    try {
      // Fetch users with role 'client'
      const response = await fetch(
        "http://localhost:5001/api/users?role=client",
        {
          headers: { Authorization: `Bearer ${user?.token}` },
        }
      );
      const data = await response.json();
      setClients(data);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5001/api/projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify({
          name,
          description,
          client: clientId,
          deadline: deadline || undefined,
          budget: budget ? Number(budget) : 0,
          status: "active",
          employees: [], // MVP: Assign employees later
        }),
      });

      const data = await response.json();

      if (response.ok) {
        onProjectCreated();
        onClose();
        resetForm();
      } else {
        setError(data.message || "Failed to create project");
      }
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName("");
    setDescription("");
    setClientId("");
    setDeadline("");
    setBudget("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-lg p-6 bg-card border border-border rounded-lg shadow-xl animate-in fade-in zoom-in duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-foreground">New Project</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            ✕
          </button>
        </div>

        {error && <div className="mb-4 text-sm text-destructive">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Project Name
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 bg-input border border-input rounded text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Description
            </label>
            <textarea
              className="w-full px-3 py-2 bg-input border border-input rounded text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Client
              </label>
              <select
                required
                className="w-full px-3 py-2 bg-input border border-input rounded text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              >
                <option value="">Select Client...</option>
                {clients.map((client) => (
                  <option key={client._id} value={client._id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Budget ($)
              </label>
              <input
                type="number"
                min="0"
                className="w-full px-3 py-2 bg-input border border-input rounded text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Deadline
            </label>
            <input
              type="date"
              className="w-full px-3 py-2 bg-input border border-input rounded text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-bold text-primary-foreground bg-primary rounded hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProjectModal;
