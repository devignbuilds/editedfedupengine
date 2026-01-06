import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await login(email, password);
    if (result.success) {
      // Simple role-based redirect (in a real app, this might be better in the AuthContext or a protected route wrapper)
      // For now, we'll just redirect to dashboard, but let's assume the user object is available in context immediately or we check the response
      // The login function returns success but doesn't return the user object directly here, but it sets it in context.
      // We can't easily access the updated user context here immediately due to closure.
      // So we'll redirect to /dashboard and let Dashboard.tsx handle the redirection or just redirect to /client-dashboard if we know.
      // Actually, let's just redirect to /dashboard and have a smart Dashboard component.
      navigate('/dashboard');
    } else {
      setError(result.message || 'Login failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground">
      <div className="w-full max-w-md p-8 space-y-6 bg-card border border-border rounded-lg shadow-sm">
        <h2 className="text-2xl font-bold text-center text-foreground">Login</h2>
        {error && <p className="text-destructive text-center text-sm">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 mt-1 bg-input border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 mt-1 bg-input border border-input rounded focus:outline-none focus:ring-2 focus:ring-ring text-foreground"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 font-bold text-primary-foreground bg-primary rounded hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-ring"
          >
            Login
          </button>
        </form>
        <p className="text-center text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/register" className="text-foreground hover:underline underline-offset-4">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
