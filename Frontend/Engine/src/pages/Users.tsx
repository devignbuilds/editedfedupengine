import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { User, Trash2, Search, ShieldCheck, UserCog, UserCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Users = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, [currentUser]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      }
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId: string, newRole: string) => {
    setUpdateLoading(userId);
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${currentUser?.token}` 
        },
        body: JSON.stringify({ role: newRole })
      });
      if (response.ok) {
        setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      }
    } catch (error) {
      console.error('Failed to update role', error);
    } finally {
      setUpdateLoading(null);
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${currentUser?.token}` },
      });
      if (response.ok) {
        setUsers(users.filter((u) => u._id !== userId));
        setConfirmDelete(null);
      }
    } catch (error) {
      console.error('Failed to delete user', error);
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(search.toLowerCase()) || 
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-between items-end"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Identity Engine</h1>
            <p className="text-muted-foreground mt-2 text-sm max-w-md">Assign permissions and manage cross-functional roles for your internal team and clients.</p>
          </div>
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground opacity-50" />
            <input
              type="text"
              placeholder="Filter users..."
              className="w-full pl-10 pr-4 py-2 bg-muted/30 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </motion.div>

        <Card className="border-border shadow-sm overflow-hidden bg-card">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left border-collapse">
                <thead className="bg-muted/50 border-b border-border">
                  <tr>
                    <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest opacity-60">Identity</th>
                    <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest opacity-60">Access Layer</th>
                    <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest opacity-60 text-right">Synchronization</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <AnimatePresence mode="popLayout">
                    {filteredUsers.map((u) => (
                      <motion.tr
                        key={u._id}
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="group hover:bg-muted/30 transition-colors"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/10">
                              {u.name.charAt(0)}
                            </div>
                            <div className="min-w-0">
                              <p className="font-bold truncate">{u.name}</p>
                              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter truncate">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-2">
                            {['admin', 'employee', 'client'].map((role) => (
                              <button
                                key={role}
                                disabled={updateLoading === u._id || (role === u.role) || (u._id === currentUser?._id && role !== 'admin')}
                                onClick={() => handleUpdateRole(u._id, role)}
                                className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border transition-all ${
                                  u.role === role 
                                    ? 'bg-foreground text-background border-foreground shadow-sm' 
                                    : 'bg-muted/50 text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                              >
                                {role}
                              </button>
                            ))}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-3">
                             {u._id !== currentUser?._id && (
                               <>
                                  {confirmDelete === u._id ? (
                                    <div className="flex items-center gap-2">
                                       <button onClick={() => handleDelete(u._id)} className="text-[10px] font-bold text-destructive uppercase hover:underline">Confirm</button>
                                       <button onClick={() => setConfirmDelete(null)} className="text-[10px] font-bold opacity-40 uppercase">Cancel</button>
                                    </div>
                                  ) : (
                                    <button 
                                      onClick={() => setConfirmDelete(u._id)}
                                      className="h-8 w-8 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive flex items-center justify-center transition-colors"
                                      title="Decommission User"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  )}
                               </>
                             )}
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
              {!loading && filteredUsers.length === 0 && (
                <div className="py-24 text-center">
                  <UserCog className="h-10 w-10 mx-auto mb-4 opacity-10" />
                  <p className="text-muted-foreground text-sm font-medium italic">No identities found sequence.</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           <Card className="border-border shadow-sm p-6 bg-card">
              <ShieldCheck className="h-5 w-5 text-primary mb-4" />
              <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">Admin Level</h4>
              <p className="text-[10px] text-muted-foreground leading-relaxed font-medium uppercase truncate">Full Infrastructure Control</p>
           </Card>
           <Card className="border-border shadow-sm p-6 bg-card">
              <UserCheck className="h-5 w-5 text-primary mb-4" />
              <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">Employee Level</h4>
              <p className="text-[10px] text-muted-foreground leading-relaxed font-medium uppercase truncate">Operational & Technical Execution</p>
           </Card>
           <Card className="border-border shadow-sm p-6 bg-card">
              <User className="h-5 w-5 text-primary mb-4" />
              <h4 className="font-bold text-sm mb-1 uppercase tracking-tight">Client Level</h4>
              <p className="text-[10px] text-muted-foreground leading-relaxed font-medium uppercase truncate">Project Consumption & Feedback</p>
           </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Users;
