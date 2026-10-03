import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShieldCheck, Smartphone, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface SecurityVerificationProps {
  onVerify: () => void;
  onCancel: () => void;
  email?: string | null;
}

export function SecurityVerification({ onVerify, onCancel, email }: SecurityVerificationProps) {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`code-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Simulation: Any 6-digit code works for this demo, or we can check for "123456"
    const fullCode = code.join('');
    
    setTimeout(() => {
      if (fullCode.length === 6) {
        onVerify();
      } else {
        setError('Please enter a valid 6-digit verification code.');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 border border-yellow-500/20">
            <ShieldCheck className="h-8 w-8 text-yellow-500" />
          </div>
          <h2 className="text-2xl font-bold text-zinc-100">Security Verification</h2>
          <p className="text-zinc-400 mt-2 text-sm">
            To secure your account, please enter the 6-digit verification code sent to your registered device.
          </p>
          {email && (
            <div className="mt-4 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800 flex items-center gap-2">
              <Mail className="h-3 w-3 text-zinc-500" />
              <span className="text-xs text-zinc-300 font-medium">{email}</span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between gap-2">
            {code.map((digit, idx) => (
              <Input
                key={idx}
                id={`code-${idx}`}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={1}
                className="w-12 h-14 text-center text-xl font-bold bg-zinc-900 border-zinc-800 focus-visible:ring-yellow-500"
                value={digit}
                onChange={(e) => handleChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                required
              />
            ))}
          </div>

          {error && <p className="text-xs text-red-500 text-center">{error}</p>}

          <div className="space-y-3">
            <Button 
              type="submit" 
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-6"
              disabled={loading}
            >
              {loading ? 'Verifying...' : 'Verify Device'}
              {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              className="w-full text-zinc-500 hover:text-zinc-300"
              onClick={onCancel}
            >
              Cancel & Sign Out
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-900 text-center">
          <p className="text-xs text-zinc-600">
            Didn't receive the code? <button className="text-yellow-500 hover:underline">Resend Code</button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
