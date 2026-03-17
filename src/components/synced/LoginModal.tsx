// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/LoginModal.tsx
// Last synced: 2026-03-17T11:17:27.005Z
// API integrations stripped. Use props for data and callbacks.
'use client';
/*
 * ============================================================
 * EXTRACTED PROPS (added by api-stripper)
 * Add these to the component's props interface:
 * ============================================================
 * // Auth function — pass as prop
 * sendOtp?: (...args: any[]) => void | Promise<void>;
 * // Auth function — pass as prop
 * verifyOtp?: (...args: any[]) => void | Promise<void>;
 * // Auth function — pass as prop
 * resendOtp?: (...args: any[]) => void | Promise<void>;
 * // Auth function — pass as prop
 * updateUserProfile?: (...args: any[]) => void | Promise<void>;
 * // Auth boolean state — pass as prop
 * isSendingOtp?: boolean;
 * // Auth boolean state — pass as prop
 * isVerifyingOtp?: boolean;
 * // Auth boolean state — pass as prop
 * isResendingOtp?: boolean;
 * // Auth boolean state — pass as prop
 * isUpdatingProfile?: boolean;
 * // User data from auth — pass as prop
 * userData?: { id: string; name: string; email: string; phone?: string } | null;
 * ============================================================
 */


import { useEffect, useState } from 'react';
import { Input, InputBase } from '@/components/base/input/input';
import { InputGroup } from '@/components/base/input/input-group';
import { Checkbox } from '@/components/base/checkbox/checkbox';
import { Button } from '@/components/base/buttons/button';
import { PinInput } from '@/components/base/pin-input/pin-input';
import Link from 'next/link';
// [STRIPPED] import { useAuth } from '@/hooks/useAuth';
// Untitled UI icons are used globally via base components; no direct icons needed here.
// [STRIPPED] import { useToast } from '@/hooks/use-toast';
import CustomModal from './CustomModal';

type Step = 1 | 2 | 3;

interface LoginModalProps {
  open: boolean;
  onClose: () => void;
  onLoginSuccess: (userData?: unknown) => void;
  zIndex?: number;
}

export function LoginModal({
  open,
  onClose,
  onLoginSuccess,
  zIndex = 50,
}: LoginModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [otpTermsAccepted, setOtpTermsAccepted] = useState(true);
  const [otpError, setOtpError] = useState<string | null>(null);
  // [STRIPPED] useToast — replaced with console.log
const toast = (...args: any[]) => console.log('[Toast]', ...args);

  // [STRIPPED] useAuth/useAuthStore — values now come from props

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setStep(1);
      setPhoneNumber('');
      setOtp(['', '', '', '']);
      setFirstName('');
      setLastName('');
      setEmail('');
      setAgreedToTerms(true);
      setOtpTermsAccepted(true);
      setOtpError(null);
    }
  }, [open]);

  // OTP input handlers
  // const handleOtpChange = (index: number, value: string) => {
  //   if (value.length <= 1) {
  //     const newOtp = [...otp];
  //     newOtp[index] = value;
  //     setOtp(newOtp);

  //     // Auto-focus next input
  //     if (value !== '' && index < 3) {
  //       const nextInput = document.getElementById(`otp-modal-${index + 1}`);
  //       if (nextInput) nextInput.focus();
  //     }
  //   }
  // };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const phoneNumberWithCountryCode = '91' + phoneNumber;
      await sendOtp(phoneNumberWithCountryCode);
      setStep(2);
    } catch (error: unknown) {
      console.error(
        'Error during phone authentication:',
        error instanceof Error ? error.message : String(error),
      );
      toast({
        variant: 'destructive',
        title: 'Failed to send OTP',
        description:
          error instanceof Error ? error.message : 'Please try again',
        duration: 3000,
      });
    }
  };

  const handleResendOtp = async () => {
    setOtp(['', '', '', '']);
    setOtpError(null);

    try {
      const phoneNumberWithCountryCode = '91' + phoneNumber;
      await resendOtp(phoneNumberWithCountryCode);
      toast({
        title: 'OTP Resent',
        description: 'A new OTP has been sent to your phone',
        duration: 3000,
      });
    } catch (error: unknown) {
      console.error(
        'Error resending OTP:',
        error instanceof Error ? error.message : String(error),
      );
      toast({
        variant: 'destructive',
        title: 'Failed to resend OTP',
        description:
          error instanceof Error ? error.message : 'Please try again',
        duration: 3000,
      });
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpString = otp.join('');

    if (otpString.length !== 4) {
      toast({
        variant: 'destructive',
        title: 'Invalid OTP',
        description: 'Please enter a valid 4-digit OTP',
        duration: 3000,
      });
      return;
    }

    if (!otpTermsAccepted) {
      toast({
        variant: 'destructive',
        title: 'Terms & Conditions',
        description: 'Please agree to the terms and conditions to continue',
        duration: 3000,
      });
      return;
    }

    try {
      const phoneNumberWithCountryCode = '91' + phoneNumber;
      const result = await verifyOtp({
        phoneNumber: phoneNumberWithCountryCode,
        otp: otpString,
      });

      if (
        result &&
        typeof result === 'object' &&
        'response' in result &&
        result.response &&
        typeof result.response === 'object' &&
        'type' in result.response &&
        result.response.type === 'error'
      ) {
        const errorMessage =
          result.response &&
            typeof result.response === 'object' &&
            'message' in result.response
            ? String(result.response.message)
            : 'Invalid OTP. Please try again.';
        setOtpError(errorMessage);
        toast({
          variant: 'destructive',
          title: 'Verification Failed',
          description: errorMessage,
          duration: 3000,
        });
        return;
      }

      // Clear error on success
      setOtpError(null);

      // If user has name, complete login process
      if (result.userData.firstName) {
        // Pass the complete user data to the callback
        onLoginSuccess(result.userData);
      } else {
        // If user doesn't have name, go to name input step
        setStep(3);
      }
    } catch (error: unknown) {
      console.error(
        'Error during OTP verification:',
        error instanceof Error ? error.message : String(error),
      );
      const errorMessage = 'Invalid OTP. Please try again.';
      setOtpError(errorMessage);
      toast({
        variant: 'destructive',
        title: 'Verification Failed',
        description: errorMessage,
        duration: 3000,
      });
    }
  };

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agreedToTerms) {
      toast({
        variant: 'destructive',
        title: 'Terms & Conditions',
        description: 'Please agree to the terms and conditions to continue',
        duration: 3000,
      });
      return;
    }

    try {
      const updatedUserData = await updateUserProfile({
        firstName,
        lastName,
        email,
        updatedBy: userData?.uid,
      });

      // Complete login process with updated user data
      onLoginSuccess(updatedUserData);
    } catch (error: unknown) {
      console.error(
        'Error updating user profile:',
        error instanceof Error ? error.message : String(error),
      );
      toast({
        variant: 'destructive',
        title: 'Profile Update Failed',
        description: 'Failed to update profile. Please try again.',
        duration: 3000,
      });
    }
  };

  const handleChangeNumber = () => {
    // Clear OTP
    setOtp(['', '', '', '']);
    // Go back to step 1
    setStep(1);
  };

  const renderModalContent = () => {
    switch (step) {
      case 1:
        return (
          <div>
            <form onSubmit={handlePhoneSubmit} className="w-full space-y-4">
              <InputGroup size="md" prefix="+91" label="Mobile Number">
                <InputBase
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phoneNumber}
                  placeholder="Enter your mobile number"
                  onChange={(value: unknown) => {
                    let raw = '';
                    if (typeof value === 'string') raw = value;
                    else if (Array.isArray(value))
                      raw = (value as string[]).join('');
                    else if (
                      value &&
                      typeof value === 'object' &&
                      'target' in value &&
                      value.target &&
                      typeof value.target === 'object' &&
                      'value' in value.target
                    )
                      raw = String(value.target.value);
                    const onlyDigits = raw.replace(/\D/g, '');
                    setPhoneNumber(onlyDigits.slice(0, 10));
                  }}
                  isDisabled={isSendingOtp}
                />
              </InputGroup>

              <div className="text-text-tertiary text-sm leading-5">
                We do not share your number with anyone else. We only send
                updates and reminders from Zapigo on this number via SMS and /
                or WhatsApp
              </div>

              <Button
                size="lg"
                color="primary"
                className="w-full"
                isDisabled={isSendingOtp}
                isLoading={isSendingOtp}
                type="submit"
              >
                Verify
              </Button>
            </form>
          </div>
        );
      case 2:
        return (
          <div className="w-full space-y-4">
            <form onSubmit={handleOtpSubmit}>
              <PinInput size="md" className="w-full" hasError={!!otpError}>
                <PinInput.Group
                  value={otp.join('')}
                  onChange={(value: unknown) => {
                    // Clear error when user starts typing
                    if (otpError) {
                      setOtpError(null);
                    }
                    let raw = '';
                    if (typeof value === 'string') raw = value;
                    else if (Array.isArray(value))
                      raw = (value as string[]).join('');
                    else if (
                      value &&
                      typeof value === 'object' &&
                      'target' in value &&
                      value.target &&
                      typeof value.target === 'object' &&
                      'value' in value.target
                    )
                      raw = String(value.target.value);
                    const sanitized = raw.replace(/\D/g, '').slice(0, 4);
                    const next = [
                      sanitized[0] || '',
                      sanitized[1] || '',
                      sanitized[2] || '',
                      sanitized[3] || '',
                    ];
                    setOtp(next);
                  }}
                  maxLength={4}
                >
                  {[0, 1, 2, 3].map(index => (
                    <PinInput.Slot key={index} index={index} />
                  ))}
                </PinInput.Group>
              </PinInput>

              {otpError && (
                <p className="mt-2 text-sm text-red-500">
                  {otpError}
                </p>
              )}

              <p className="text-body-lg font-lato mb-3 text-gray-500">
                If +91 {phoneNumber} is not correct,{' '}
                <button
                  type="button"
                  onClick={handleChangeNumber}
                  className="text-brand-secondary"
                >
                  click here to change it
                </button>
              </p>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="otp-terms-modal"
                  isSelected={otpTermsAccepted}
                  onChange={(value) => {
                    // Prevent unchecking - only allow checked state
                    if (value) {
                      setOtpTermsAccepted(true);
                    }
                  }}
                />
                <label htmlFor="otp-terms-modal" className="text-sm text-gray-600">
                  I agree to Zapigo&apos;s{' '}
                  <Link
                    href="/terms-policies"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-secondary"
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                  >
                    terms & conditions
                  </Link>{' '}
                  for its users
                </label>
              </div>

              <Button
                size="lg"
                color="primary"
                className="w-full"
                isDisabled={isVerifyingOtp || !otpTermsAccepted || otp.join('').length !== 4}
                isLoading={isVerifyingOtp}
                type="submit"
              >
                Submit
              </Button>

              <div className="mt-2 text-center">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isResendingOtp || isVerifyingOtp}
                  className="text-body-lg font-lato text-font-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isResendingOtp ? 'Resending...' : 'Resend OTP'}
                </button>
              </div>
            </form>
          </div>
        );
      case 3:
        return (
          <form onSubmit={handleNameSubmit} className="w-full space-y-4">
            <div className="space-y-4">
              <Input
                value={firstName}
                onChange={(value: unknown) => {
                  if (typeof value === 'string') {
                    setFirstName(value);
                  } else if (
                    value &&
                    typeof value === 'object' &&
                    'target' in value &&
                    value.target &&
                    typeof value.target === 'object' &&
                    'value' in value.target
                  ) {
                    setFirstName(String(value.target.value));
                  } else {
                    setFirstName('');
                  }
                }}
                placeholder="First Name"
                isRequired
                wrapperClassName="w-full"
              />

              <Input
                id="lastName"
                value={lastName}
                onChange={(value: unknown) => {
                  if (typeof value === 'string') {
                    setLastName(value);
                  } else if (
                    value &&
                    typeof value === 'object' &&
                    'target' in value &&
                    value.target &&
                    typeof value.target === 'object' &&
                    'value' in value.target
                  ) {
                    setLastName(String(value.target.value));
                  } else {
                    setLastName('');
                  }
                }}
                placeholder="Last Name"
                wrapperClassName="w-full"
              />

              <Input
                id="email"
                type="email"
                value={email}
                onChange={(value: unknown) => {
                  if (typeof value === 'string') {
                    setEmail(value);
                  } else if (
                    value &&
                    typeof value === 'object' &&
                    'target' in value &&
                    value.target &&
                    typeof value.target === 'object' &&
                    'value' in value.target
                  ) {
                    setEmail(String(value.target.value));
                  } else {
                    setEmail('');
                  }
                }}
                placeholder="Email Address"
                wrapperClassName="w-full"
              />
            </div>
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms-modal"
                isSelected={agreedToTerms}
                onChange={(value) => {
                  // Prevent unchecking - only allow checked state
                  if (value) {
                    setAgreedToTerms(true);
                  }
                }}
              />
              <label htmlFor="terms-modal" className="text-sm text-gray-600">
                I agree to Zapigo&apos;s{' '}
                <Link
                  href="/terms-policies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  terms & conditions
                </Link>{' '}
                for its users
              </label>
            </div>
            <div className="flex w-full justify-center">
              <Button
                size="lg"
                color="primary"
                className="w-full"
                isDisabled={!agreedToTerms || isUpdatingProfile}
                isLoading={isUpdatingProfile}
                type="submit"
              >
                Next
              </Button>
            </div>
          </form>
        );
      default:
        return null;
    }
  };

  return (
    <CustomModal
      open={open}
      onClose={onClose}
      zIndex={zIndex}
      title={
        step === 1
          ? 'Login to Proceed'
          : step === 2
            ? 'Verify Your Number'
            : 'What is Your Name?'
      }
    >
      <div className="-mt-2">
        <div className="font-dm-sans mb-2 text-sm text-gray-500 uppercase sm:text-base -mt-1">
          {step === 1 && 'ENTER YOUR MOBILE NUMBER'}
          {step === 2 && 'ENTER THE CODE WE JUST SENT YOU VIA SMS OR WHATSAPP'}
        </div>
        {renderModalContent()}
      </div>
    </CustomModal>
  );
}
