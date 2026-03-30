import { useState, useEffect } from "react";
import { useAuth } from "../context/useAuth";
import DashboardLayout from "../components/layout/DashboardLayout";
import {
  Card,
  CardContent,
} from "../components/ui/card";
import {
  User,
  Trash2,
  Search,
  ShieldCheck,
  UserCog,
  UserCheck,
} from "lucide-react";
import { engineApi } from "../api/engineApi";
import { motion, AnimatePresence } from "framer-motion";

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const isAmine = (currentUser?.email || "").toLowerCase() === "amine@engine.com";

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  const fetchUsers = async () => {
    if (!currentUser?.token) return;
    setError(null);
    try {
      const data = await engineApi.users.getAll(currentUser.token);
      setUsers(data);
    } catch (err) {
      console.error("Failed to fetch users", err);
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    if (!currentUser?.token) return;
    setUpdateLoading(userId);
    setError(null);
    try {
      const data = await engineApi.users.update(userId, { role: newRole }, currentUser.token);
      if (data.message && data.message !== "Role updated") {
         setError(data.message);
      } else {
        setUsers(
          users.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
        );
        setStatusMessage("Role updated successfully");
        setTimeout(() => setStatusMessage(null), 2500);
      }
    } catch (err) {
      console.error("Failed to update role", err);
      setError("Server error");
    } finally {
      setUpdateLoading(null);
    }
  };

  const handleDelete = async (userId: string, role?: string) => {
    try {
      if (role === "admin" && !isAmine) {
        setError("Only root admins can delete other admin users");
        return;
      }

      if (role === "admin" && isAmine) {
        const typed = window.prompt("Type DELETE to confirm deleting this admin account");
        if (typed !== "DELETE") return;
      }

      const response = await fetch(`http://localhost:5001/api/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });
      
      if (response.ok) {
        setUsers(users.filter((u) => u._id !== userId));
        setConfirmDelete(null);
        setStatusMessage("User deactivated");
        setTimeout(() => setStatusMessage(null), 2500);
      } else {
        const data = await response.json().catch(() => ({}));
        setError(data.message || "Failed to delete user");
      }
    } catch (err) {
      console.error("Failed to delete user", err);
      setError("Server error");
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const adminCount = users.filter(u => u.role === "admin" && !u.isDeleted).length;

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6"
        >
          <div className="flex-1">
            <h1 className="text-4xl font-black tracking-tighter uppercase italic mb-2">
              Identity Engine
            </h1>
            <p className="text-muted-foreground text-lg max-w-md font-medium leading-relaxed">
              Manage cross-functional roles for your internal team and clients.
            </p>
            
            <AnimatePresence>
              {error && (
                <motion.div 
                   initial={{ opacity: 0, height: 0 }}
                   animate={{ opacity: 1, height: 'auto' }}
                   exit={{ opacity: 0, height: 0 }}
                   className="mt-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-bold"
                >
                  {error}
                </motion.div>
              )}
              {statusMessage && (
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="mt-4 p-3 rounded-xl bg-primary/10 text-xs border border-primary/20 text-primary font-bold flex items-center gap-2"
                >
                  <UserCheck className="h-4 w-4" />
                  {statusMessage}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="relative w-full md:w-80">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
            <input
              type="text"
              placeholder="Search by name, email, or role..."
              className="w-full pl-11 pr-4 py-3 bg-muted/30 border border-border rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

        <Card className="border-border shadow-sm overflow-hidden bg-card rounded-2xl">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/30 border-b border-border">
                  <tr>
                    <th className="px-6 py-5 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Identity</th>
                    <th className="px-6 py-5 font-black text-[10px] uppercase tracking-widest text-muted-foreground">Access Layer</th>
                    <th className="px-6 py-5 font-black text-[10px] uppercase tracking-widest text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50 font-medium">
                  {filteredUsers.map((u) => (
                    <motion.tr
                      key={u._id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="group hover:bg-muted/10 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/10 shadow-sm">
                            {u.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-bold text-foreground text-base">{u.name}</p>
                            <p className="text-[10px] text-muted-foreground font-black uppercase tracking-tighter">
                              {u.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-2">
                          {["admin", "employee", "client"].map((role) => (
                            <button
                              key={role}
                              disabled={
                                updateLoading === u._id ||
                                role === u.role ||
                                (u._id === currentUser?._id && role !== "admin") ||
                                currentUser?.role !== "admin" ||
                                (adminCount === 1 && u.role === "admin" && role !== "admin" && !isAmine)
                              }
                              onClick={() => handleUpdateRole(u._id, role)}
                              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all ${
                                u.role === role
                                  ? "bg-foreground text-background border-foreground shadow-md"
                                  : "bg-muted/50 text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground"
                              } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {role}
                            </button>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {u._id !== currentUser?._id && (u.role !== "admin" || isAmine) && (
                            <>
                              {confirmDelete === u._id ? (
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => handleDelete(u._id, u.role)}
                                    className="text-[10px] font-black text-destructive uppercase hover:underline"
                                  >
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => setConfirmDelete(null)}
                                    className="text-[10px] font-black opacity-40 uppercase"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setConfirmDelete(u._id)}
                                  className="h-9 w-9 rounded-xl border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                                  title="Decommission User"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </>
                          )}
                          {u.role === "admin" && !confirmDelete && (
                            <div className="flex items-center gap-1 text-primary">
                              <ShieldCheck className="h-4 w-4" />
                              <span className="text-[10px] uppercase font-black tracking-widest">Protected</span>
                            </div>
                          )}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {!loading && filteredUsers.length === 0 && (
                <div className="py-24 text-center">
                  <UserCog className="h-12 w-12 mx-auto mb-4 opacity-10 text-primary" />
                  <p className="text-muted-foreground font-medium italic">
                    No matching identities found in the grid.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { level: "Admin", desc: "Full infrastructure control and orchestration.", icon: ShieldCheck },
            { level: "Employee", desc: "Operational and technical project execution.", icon: UserCheck },
            { level: "Client", desc: "Digital service consumption and review portal.", icon: User }
          ].map((item, i) => (
            <Card key={i} className="border-border shadow-sm p-8 bg-card rounded-2xl group hover:border-primary/50 transition-all">
              <item.icon className="h-6 w-6 text-primary mb-6 transition-transform group-hover:scale-110" />
              <h4 className="font-black text-lg mb-2 uppercase tracking-tight italic">
                {item.level} Level
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                {item.desc}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Users;
