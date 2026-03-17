// AUTO-SYNCED from zapigowebclient — DO NOT EDIT DIRECTLY
// Source: /Users/dewanshshukla/Desktop/zapigo/zapigowebclient/src/components/CustomTimePicker.tsx
// Last synced: 2026-03-17T11:17:26.983Z
// API integrations stripped. Use props for data and callbacks.
'use client';

import { useState, useEffect, useRef } from 'react';
import { Select } from '@/components/base/select/select';
import { SelectItem } from '@/components/base/select/select-item';
import { Clock, ChevronDown } from '@untitledui/icons';
import { cn } from '@/lib/utils';

interface TimeValue {
  hours: string;
  minutes: string;
  period: 'AM' | 'PM';
}

interface CustomTimePickerProps {
  value?: TimeValue;
  onChange?: (time: TimeValue) => void;
  className?: string;
  placeholder?: string;
}

interface EditableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  className?: string;
  maxLength?: number;
  validator?: (value: string) => boolean;
}

const EditableSelect = ({
  value,
  onChange,
  options,
  placeholder,
  className,
  maxLength = 2,
  validator,
}: EditableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Only allow numeric input and respect maxLength
    if (!/^\d*$/.test(newValue) || newValue.length > maxLength) return;

    setInputValue(newValue);
  };

  const handleInputBlur = () => {
    // Format and validate the value when losing focus
    if (inputValue && inputValue.length > 0) {
      const numValue = parseInt(inputValue, 10);

      // Validate the numeric value
      if (validator && !validator(inputValue)) {
        // Reset to current valid value if invalid
        setInputValue(value);
        return;
      }

      // Format to 2 digits only if it's a valid number
      if (!isNaN(numValue)) {
        const formattedValue = numValue.toString().padStart(2, '0');
        setInputValue(formattedValue);
        onChange(formattedValue);
      }
    } else {
      // Reset to current value if empty
      setInputValue(value);
    }
    setIsOpen(false);
  };

  const handleOptionSelect = (selectedValue: string) => {
    setInputValue(selectedValue);
    onChange(selectedValue);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle Enter key to commit the value
    if (e.key === 'Enter') {
      handleInputBlur();
      inputRef.current?.blur();
    }
  };

  return (
    <div className={cn('relative', className)}>
      <input
        ref={inputRef}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={() => setIsOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-8 text-center focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
      />
      <ChevronDown className="pointer-events-none absolute top-1/2 right-2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      {isOpen && (
        <div className="absolute top-full right-0 left-0 z-50 max-h-40 w-20 overflow-y-auto rounded-lg border border-gray-200 bg-white p-1 shadow-lg">
          {options.map(option => (
            <div
              key={option}
              className="cursor-pointer rounded px-2 py-1 text-center text-sm hover:bg-gray-100"
              onMouseDown={e => {
                // Prevent input blur from firing before selection
                e.preventDefault();
                handleOptionSelect(option);
              }}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const CustomTimePicker = ({
  value,
  onChange,
  className,
}: CustomTimePickerProps) => {
  // Initialize local state from the value prop
  const [localHours, setLocalHours] = useState(value?.hours || '12');
  const [localMinutes, setLocalMinutes] = useState(value?.minutes || '00');
  const [localPeriod, setLocalPeriod] = useState<'AM' | 'PM'>(
    value?.period || 'AM',
  );

  // Generate hour options (1-12 for 12-hour format)
  const hourOptions = Array.from({ length: 12 }, (_, i) => {
    const hour = (i + 1).toString();
    return hour.padStart(2, '0');
  });

  // Generate minute options (every 5 minutes)
  const minuteOptions = Array.from({ length: 12 }, (_, i) => {
    const minute = (i * 5).toString();
    return minute.padStart(2, '0');
  });

  // Update local state when the value prop changes
  useEffect(() => {
    if (value) {
      setLocalHours(value.hours);
      setLocalMinutes(value.minutes);
      setLocalPeriod(value.period);
    }
  }, [value]);

  const handleHoursChange = (newHours: string) => {
    setLocalHours(newHours);
    onChange?.({ hours: newHours, minutes: localMinutes, period: localPeriod });
  };

  const handleMinutesChange = (newMinutes: string) => {
    setLocalMinutes(newMinutes);
    onChange?.({ hours: localHours, minutes: newMinutes, period: localPeriod });
  };

  const handlePeriodChange = (newPeriod: 'AM' | 'PM') => {
    setLocalPeriod(newPeriod);
    onChange?.({ hours: localHours, minutes: localMinutes, period: newPeriod });
  };

  // Validators
  const validateHours = (value: string): boolean => {
    if (!value) return true;
    const num = parseInt(value, 10);
    return num >= 1 && num <= 12;
  };

  const validateMinutes = (value: string): boolean => {
    if (!value) return true;
    const num = parseInt(value, 10);
    return num >= 0 && num <= 59;
  };

  // Use local state for display to show immediate updates
  const displayValue = `${localHours}:${localMinutes} ${localPeriod}`;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Clock className="h-4 w-4" />
        <span>{displayValue}</span>
      </div>

      <div className="flex items-center gap-2">
        {/* Hours Input with Dropdown */}
        <div className="flex-1">
          <EditableSelect
            value={localHours}
            onChange={handleHoursChange}
            options={hourOptions}
            placeholder="HR"
            validator={validateHours}
          />
        </div>

        <span className="text-lg font-semibold">:</span>

        {/* Minutes Input with Dropdown */}
        <div className="flex-1">
          <EditableSelect
            value={localMinutes}
            onChange={handleMinutesChange}
            options={minuteOptions}
            placeholder="MIN"
            validator={validateMinutes}
          />
        </div>

        {/* AM/PM Select */}
        <div className="w-20">
          <Select
            items={[
              { id: 'AM', label: 'AM' },
              { id: 'PM', label: 'PM' },
            ]}
            selectedKey={localPeriod}
            onSelectionChange={key => {
              if (key) {
                handlePeriodChange(key as 'AM' | 'PM');
              }
            }}
            size="sm"
          >
            {item => <SelectItem key={item.id} {...item} />}
          </Select>
        </div>
      </div>
    </div>
  );
};
