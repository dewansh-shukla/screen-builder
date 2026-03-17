// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/AddCoHostModal.tsx
// Last synced: 2026-03-17T11:05:34.390Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { X } from '@untitledui/icons';

export interface CoHostData {
  co_host_name: string;
  co_host_phone: string;
  co_host_country_code: string;
  co_host_role: string;
}

interface AddCoHostModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (data: CoHostData) => void;
  existingCoHost?: CoHostData | null;
}

export const AddCoHostModal: React.FC<AddCoHostModalProps> = ({
  open,
  onClose,
  onConfirm,
  existingCoHost,
}) => {
  const [coHostName, setCoHostName] = useState('');
  const [coHostPhone, setCoHostPhone] = useState('');
  const [coHostCountryCode, setCoHostCountryCode] = useState('91');
  const [coHostRole, setCoHostRole] = useState('CO-HOST');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Pre-populate form if editing existing co-host
  useEffect(() => {
    if (open && existingCoHost) {
      setCoHostName(existingCoHost.co_host_name || '');
      setCoHostPhone(existingCoHost.co_host_phone || '');
      setCoHostCountryCode(existingCoHost.co_host_country_code || '91');
      setCoHostRole(existingCoHost.co_host_role || 'CO-HOST');
      setErrors({});
    } else if (open) {
      // Reset form for new co-host
      setCoHostName('');
      setCoHostPhone('');
      setCoHostCountryCode('91');
      setCoHostRole('CO-HOST');
      setErrors({});
    } else {
      // Reset form when modal closes
      setCoHostName('');
      setCoHostPhone('');
      setCoHostCountryCode('91');
      setCoHostRole('CO-HOST');
      setErrors({});
    }
  }, [open, existingCoHost]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!coHostName.trim()) {
      newErrors.coHostName = 'Co-host name is required';
    }

    if (!coHostPhone.trim()) {
      newErrors.coHostPhone = 'Phone number is required';
    } else if (coHostPhone.trim().length < 10) {
      newErrors.coHostPhone = 'Phone number must be at least 10 digits';
    } else if (!/^\d+$/.test(coHostPhone.trim())) {
      newErrors.coHostPhone = 'Phone number must contain only digits';
    }

    if (!coHostCountryCode.trim()) {
      newErrors.coHostCountryCode = 'Country code is required';
    }

    if (!coHostRole.trim()) {
      newErrors.coHostRole = 'Role is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirm = () => {
    if (!validateForm()) {
      return;
    }

    onConfirm({
      co_host_name: coHostName.trim(),
      co_host_phone: coHostPhone.trim(),
      co_host_country_code: coHostCountryCode.trim(),
      co_host_role: coHostRole.trim(),
    });
    
    // Reset form after confirmation
    setCoHostName('');
    setCoHostPhone('');
    setCoHostCountryCode('91');
    setCoHostRole('CO-HOST');
    setErrors({});
  };

  if (!open) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-end justify-center"
      style={{ backgroundColor: 'rgba(10, 13, 18, 0.7)' }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div 
        className="relative z-10 w-full max-w-[393px] max-h-[85vh] flex flex-col rounded-tl-2xl rounded-tr-2xl bg-white shadow-[0px_20px_24px_-4px_rgba(10,13,18,0.08),0px_8px_8px_-4px_rgba(10,13,18,0.03),0px_3px_3px_-1.5px_rgba(10,13,18,0.04)]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 flex items-center justify-between px-4 py-4 bg-white border-b border-gray-200 rounded-tl-2xl rounded-tr-2xl">
          <h2 className="text-lg font-semibold text-gray-900 font-lexend">
            {existingCoHost ? 'Edit Co-Host' : 'Add Co-Host'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex w-full flex-col p-4 gap-4">
          {/* Co-Host Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 font-lexend">
              Co-Host Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={coHostName}
              onChange={(e) => {
                setCoHostName(e.target.value);
                if (errors.coHostName) {
                  setErrors((prev) => ({ ...prev, coHostName: '' }));
                }
              }}
              placeholder="Enter co-host name"
              className={`w-full px-3 py-2.5 border rounded-lg font-lexend text-sm outline-none transition-all ${
                errors.coHostName
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/10'
              }`}
            />
            {errors.coHostName && (
              <p className="text-xs text-red-500 font-lexend">{errors.coHostName}</p>
            )}
          </div>

          {/* Country Code and Phone Number */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 font-lexend">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={coHostCountryCode}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setCoHostCountryCode(value);
                  if (errors.coHostCountryCode) {
                    setErrors((prev) => ({ ...prev, coHostCountryCode: '' }));
                  }
                }}
                placeholder="91"
                maxLength={3}
                className={`w-20 px-3 py-2.5 border rounded-lg font-lexend text-sm outline-none transition-all ${
                  errors.coHostCountryCode
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/10'
                }`}
              />
              <input
                type="tel"
                value={coHostPhone}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setCoHostPhone(value);
                  if (errors.coHostPhone) {
                    setErrors((prev) => ({ ...prev, coHostPhone: '' }));
                  }
                }}
                placeholder="9876543210"
                maxLength={15}
                className={`flex-1 px-3 py-2.5 border rounded-lg font-lexend text-sm outline-none transition-all ${
                  errors.coHostPhone
                    ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                    : 'border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/10'
                }`}
              />
            </div>
            {errors.coHostPhone && (
              <p className="text-xs text-red-500 font-lexend">{errors.coHostPhone}</p>
            )}
            {errors.coHostCountryCode && (
              <p className="text-xs text-red-500 font-lexend">{errors.coHostCountryCode}</p>
            )}
            <p className="text-xs text-gray-500 font-lexend">
              Phone number must be at least 10 digits
            </p>
          </div>

          {/* Co-Host Role */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700 font-lexend">
              Role <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={coHostRole}
              onChange={(e) => {
                setCoHostRole(e.target.value);
                if (errors.coHostRole) {
                  setErrors((prev) => ({ ...prev, coHostRole: '' }));
                }
              }}
              placeholder="CO-HOST"
              className={`w-full px-3 py-2.5 border rounded-lg font-lexend text-sm outline-none transition-all ${
                errors.coHostRole
                  ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/20'
                  : 'border-gray-300 focus:border-orange focus:ring-2 focus:ring-orange/10'
              }`}
            />
            {errors.coHostRole && (
              <p className="text-xs text-red-500 font-lexend">{errors.coHostRole}</p>
            )}
            <p className="text-xs text-gray-500 font-lexend">
              Default: CO-HOST
            </p>
          </div>
          </div>
        </div>

        {/* Footer - Always visible */}
        <div className="flex-shrink-0 flex gap-3 px-4 py-4 bg-white border-t border-gray-200 rounded-bl-2xl rounded-br-2xl">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-lexend text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 px-4 py-2.5 rounded-lg font-lexend text-sm font-medium text-white transition-colors"
            style={{
              backgroundColor: '#F79009',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#DC6803';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#F79009';
            }}
          >
            {existingCoHost ? 'Update' : 'Add'} Co-Host
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};

