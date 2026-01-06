import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await register(name, email, password, 'client');
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground selection:bg-primary selection:text-primary-foreground">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "circOut" }}
        className="w-full max-w-[420px] p-10 space-y-8 bg-card border border-border rounded-[2rem] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-foreground to-transparent opacity-10" />
        
        <div className="space-y-2 text-center">
          <h1 className="text-4xl font-black tracking-tighter uppercase italic">Engine</h1>
          <p className="text-muted-foreground text-sm font-medium opacity-60">Create your platform account.</p>
        </div>

        {error && (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-4 bg-destructive/10 border border-destructive/20 text-destructive text-xs font-black uppercase tracking-widest text-center rounded-xl"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-70">Full Name</label>
            <input
              type="text"
              className="w-full px-5 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-foreground/20 text-foreground font-medium placeholder:opacity-20 transition-all"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-70">Email Address</label>
            <input
              type="email"
              className="w-full px-5 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-foreground/20 text-foreground font-medium placeholder:opacity-20 transition-all"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest ml-1 opacity-70">Security Password</label>
            <input
              type="password"
              className="w-full px-5 py-4 bg-muted/30 border border-border rounded-2xl focus:outline-none focus:ring-2 focus:ring-foreground/20 text-foreground font-medium placeholder:opacity-20 transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full px-5 py-4 mt-4 font-black text-primary-foreground bg-primary rounded-2xl hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring uppercase tracking-widest text-xs transition-transform active:scale-[0.98] shadow-xl"
          >
            Register Account
          </button>
        </form>

        <div className="text-center">
          <p className="text-[10px] font-black uppercase tracking-widest opacity-40">
            Already a member?{' '}
            <Link to="/login" className="text-foreground hover:underline underline-offset-4 opacity-100">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
