import { useState, type FormEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const result = await register(name, email, password, 'client');
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background text-foreground px-4 font-sans">
      <Card className="w-full max-w-sm border-border shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-black tracking-tight text-center">Join Engine</CardTitle>
          <CardDescription className="text-center font-medium">
            Create your client workspace.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-xs font-bold text-center">{error}</div>}
            
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="font-medium"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Email</label>
              <Input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Password</label>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="font-medium"
              />
            </div>
            <Button className="w-full font-black uppercase tracking-widest" type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="text-foreground font-bold hover:underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </CardFooter>
      </Card>
      
      {/* Background decorations */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl opacity-50" />
      </div>
    </div>
  );
};

export default Register;
