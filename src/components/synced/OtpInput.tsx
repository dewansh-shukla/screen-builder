// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/OtpInput.tsx
// Last synced: 2026-03-17T11:05:34.419Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  phoneNumber: string;
  onChangeNumber: () => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  onResendOtp: () => void;
}

export function OtpInput({
  value,
  onChange,
  phoneNumber,
  onChangeNumber,
  onSubmit,
  isLoading,
  onResendOtp,
}: OtpInputProps) {
  const [otp, setOtp] = useState<string[]>(Array(4).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Initialize refs array
    inputRefs.current = inputRefs.current.slice(0, 4);

    // Focus first input on mount
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  useEffect(() => {
    // Update internal OTP state when value changes from parent
    if (value) {
      const otpArray = value.split('').slice(0, 4);
      setOtp([...otpArray, ...Array(4 - otpArray.length).fill('')]);
    } else {
      setOtp(Array(4).fill(''));
    }
  }, [value]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const newValue = e.target.value;

    // Only allow numbers
    if (!/^\d*$/.test(newValue)) return;

    // Update the OTP array
    const newOtp = [...otp];

    // Take only the last character if multiple characters are pasted
    newOtp[index] = newValue.slice(-1);
    setOtp(newOtp);

    // Combine OTP digits and call parent onChange
    const combinedOtp = newOtp.join('');
    onChange(combinedOtp);

    // Auto-focus next input if current input is filled
    if (newValue && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    // Move focus to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text/plain').trim();

    // Only allow numbers
    if (!/^\d+$/.test(pastedData)) return;

    // Fill OTP fields with pasted data
    const newOtp = [...otp];
    for (let i = 0; i < Math.min(pastedData.length, 4); i++) {
      newOtp[i] = pastedData[i];
    }

    setOtp(newOtp);
    onChange(newOtp.join(''));

    // Focus the next empty input or the last input
    const nextEmptyIndex = newOtp.findIndex(val => !val);
    if (nextEmptyIndex !== -1 && nextEmptyIndex < 4) {
      inputRefs.current[nextEmptyIndex]?.focus();
    } else {
      inputRefs.current[3]?.focus();
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full space-y-4">
      <div className="text-muted-foreground mb-2 text-sm">
        ENTER THE CODE WE JUST SENT YOU VIA SMS OR WHATSAPP
      </div>

      <div className="mb-4 flex justify-between gap-2">
        {[0, 1, 2, 3].map(index => (
          <input
            key={index}
            ref={el => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={otp[index]}
            onChange={e => handleChange(e, index)}
            onKeyDown={e => handleKeyDown(e, index)}
            onPaste={index === 0 ? handlePaste : undefined}
            className="border-primary focus:ring-primary h-12 w-full rounded-lg border-2 text-center text-xl focus:ring-2 focus:outline-none"
          />
        ))}
      </div>

      <div className="text-muted-foreground text-sm">
        If +91 {phoneNumber} is not correct,{' '}
        <button
          type="button"
          onClick={onChangeNumber}
          className="text-brand-secondary"
        >
          click here to change it
        </button>
      </div>

      <Button
        type="submit"
        className="w-full bg-black text-white"
        disabled={otp.join('').length !== 4 || isLoading}
      >
        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'SUBMIT'}
      </Button>

      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={onResendOtp}
          className="text-primary text-sm underline"
          disabled={isLoading}
        >
          Resend OTP
        </button>
      </div>
    </form>
  );
}
