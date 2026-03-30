import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Wallet, 
  ShieldCheck, 
  Zap, 
  Bitcoin, 
  Copy, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { Button } from "./ui/button";
import { useAuth } from "../context/useAuth";

interface CryptoPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
  onSuccess: () => void;
}

const CryptoPaymentModal = ({
  isOpen,
  onClose,
  invoice,
  onSuccess,
}: CryptoPaymentModalProps) => {
  const { user } = useAuth();
  const [step, setStep] = useState(0); // 0: Select Coin, 1: Pay, 2: Confirming, 3: Success
  const [selectedCoin, setSelectedCoin] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  const coins = [
    { id: "usdc", name: "USDC (ERC-20)", symbol: "USDC", icon: Bitcoin, address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" },
    { id: "eth", name: "Ethereum", symbol: "ETH", icon: Bitcoin, address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e" },
    { id: "btc", name: "Bitcoin", symbol: "BTC", icon: Bitcoin, address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" },
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const simulatePayment = () => {
    setStep(2);
    setTimeout(async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/payments/invoices/${invoice._id}/pay`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (response.ok) {
          setStep(3);
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      } catch (err) {
        console.error("Payment sync error", err);
      }
    }, 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-xl p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="w-full max-w-xl bg-card border border-border/40 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
      >
        {/* Header */}
        <div className="p-8 border-b border-border/40 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase italic">Secure Checkout</h2>
              <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest flex items-center gap-1">
                <ShieldCheck className="h-3 w-3 text-green-500" /> Powered by Engine Finance
              </p>
            </div>
          </div>
          <button onClick={onClose} className="h-10 w-10 rounded-full hover:bg-muted flex items-center justify-center transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-8 md:p-12 min-h-[400px]">
          <AnimatePresence mode="wait">
            {step === 0 && (
              <motion.div 
                key="step0"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black">Choose Currency</h3>
                  <p className="text-muted-foreground font-medium">Select your preferred asset to proceed.</p>
                </div>
                <div className="space-y-3">
                  {coins.map(coin => (
                    <button
                      key={coin.id}
                      onClick={() => {
                        setSelectedCoin(coin);
                        setStep(1);
                      }}
                      className="w-full p-6 rounded-2xl border-2 border-border hover:border-primary/40 bg-muted/20 flex items-center justify-between transition-all group hover:scale-[1.02]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 bg-background rounded-xl flex items-center justify-center shadow-sm">
                          <coin.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="font-bold">{coin.name}</p>
                          <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">{coin.symbol} Transfer</p>
                        </div>
                      </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </button>
                  ))}
                </div>
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10 flex items-start gap-3">
                  <Zap className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Payments are settled in real-time. Please ensure you are using the correct network to avoid loss of funds.
                  </p>
                </div>
              </motion.div>
            )}

            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Pending Payment</p>
                  <h3 className="text-4xl font-black">${invoice?.amount?.toLocaleString()}</h3>
                  <p className="text-muted-foreground text-sm font-medium italic">Amount to be sent in {selectedCoin?.symbol}</p>
                </div>

                <div className="space-y-4">
                  <div className="bg-muted/30 p-8 rounded-[2rem] border-2 border-dashed border-border flex flex-col items-center gap-6">
                    <div className="h-40 w-40 bg-white p-4 rounded-2xl shadow-inner flex items-center justify-center">
                       {/* Mock QR Code */}
                       <div className="w-full h-full bg-[radial-gradient(circle,_#000_1px,_transparent_1px)] bg-[size:10px_10px] opacity-20"></div>
                    </div>
                    <div className="w-full space-y-2">
                       <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Deposit Address</label>
                       <div className="relative group">
                          <input 
                            readOnly 
                            value={selectedCoin?.address}
                            className="w-full bg-background border border-border rounded-xl px-12 py-4 text-xs font-mono font-bold focus:outline-none"
                          />
                          <Bitcoin className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
                          <button 
                            onClick={() => handleCopy(selectedCoin?.address)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 flex items-center justify-center hover:bg-muted rounded-lg transition-colors"
                          >
                             {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                          </button>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                   <Button 
                    size="lg" 
                    onClick={simulatePayment}
                    className="h-16 rounded-full font-black uppercase tracking-widest shadow-2xl shadow-primary/30 text-lg group"
                   >
                     I've Made the Transfer <Zap className="ml-2 h-5 w-5 fill-current group-hover:animate-pulse" />
                   </Button>
                   <Button variant="ghost" onClick={() => setStep(0)} className="font-bold text-xs uppercase tracking-widest text-muted-foreground">
                      Cancel & Change Currency
                   </Button>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center space-y-8 py-12"
              >
                <div className="relative">
                  <div className="h-24 w-24 border-4 border-muted rounded-full"></div>
                  <div className="absolute inset-0 h-24 w-24 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  <RefreshCw className="absolute inset-0 m-auto h-8 w-8 text-primary opacity-20" />
                </div>
                <div className="text-center space-y-2">
                  <h3 className="text-2xl font-black uppercase italic">Synchronizing...</h3>
                  <p className="text-muted-foreground font-medium max-w-[240px] mx-auto text-sm">
                    Scanning the blockchain for your transaction. This usually takes 30-60 seconds.
                  </p>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center space-y-8 py-12 text-center"
              >
                <div className="h-24 w-24 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center shadow-2xl shadow-green-500/20">
                  <CheckCircle2 className="h-12 w-12" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black uppercase italic">Transmission Received</h3>
                  <p className="text-muted-foreground font-medium">
                    Your payment of ${invoice?.amount?.toLocaleString()} has been confirmed.
                  </p>
                </div>
                <div className="bg-muted p-4 rounded-xl border border-border">
                   <p className="text-[10px] font-black tracking-widest uppercase opacity-40">TX Hash</p>
                   <p className="text-[10px] font-mono font-bold mt-1">0x93b...a12c</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer */}
        <div className="p-6 bg-muted/30 border-t border-border/40 flex justify-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-20">
              Devign Engine Financial Protocol v1
            </p>
        </div>
      </motion.div>
    </div>
  );
};

export default CryptoPaymentModal;
