'use client';

import * as React from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useControlledState } from '@react-stately/utils';
import { Clock } from '@untitledui/icons';
import {
  Dialog as AriaDialog,
  ModalOverlay as AriaModalOverlay,
  Modal as AriaModal,
} from 'react-aria-components';
import { createPortal } from 'react-dom';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';

export interface TimeValue {
  hour: string;
  minute: string;
  period: 'AM' | 'PM';
}

interface TimePickerProps {
  /** The selected time values (array for multiple selection) */
  value?: TimeValue[];
  /** The default time values */
  defaultValue?: TimeValue[];
  /** The function to call when the time changes */
  onChange?: (value: TimeValue[]) => void;
  /** The function to call when the apply button is clicked */
  onApply?: (value: TimeValue[]) => void;
  /** The function to call when the cancel button is clicked */
  onCancel?: () => void;
  /** Whether to auto-apply on time selection without showing Apply/Cancel buttons */
  autoApply?: boolean;
  /** Custom styling for the trigger button */
  customButtonStyle?: CSSProperties;
  /** Custom class name for the trigger button */
  customButtonClassName?: string;
  /** Custom children to render inside the button instead of default content */
  children?: ReactNode;
  /** Placeholder text when no time is selected */
  placeholder?: string;
  /** Time interval in minutes (default: 30) */
  timeInterval?: number;
  /** Whether to show 12-hour or 24-hour format */
  hour12?: boolean;
  /** Type of time picker - 'from' or 'to' for labeling */
  pickerType?: 'from' | 'to';
  /** Layout variant - 'list' for single column list, 'columns' for 2-column hours/minutes layout */
  variant?: 'list' | 'columns';
}

export const TimePicker = ({
  value: valueProp,
  defaultValue,
  onChange,
  onApply,
  onCancel,
  autoApply = false,
  customButtonStyle,
  customButtonClassName,
  children,
  placeholder = 'Tap to select time',
  timeInterval = 30,
  hour12 = true,
  pickerType,
  variant = 'list',
}: TimePickerProps) => {
  const [value, setValue] = useControlledState(
    valueProp,
    defaultValue || [],
    onChange,
  );

  // Initialize isPM based on existing value or default to false
  const initialValue = valueProp || defaultValue || [];
  const [isPM, setIsPM] = React.useState(() => {
    if (initialValue && initialValue.length > 0) {
      return initialValue[0].period === 'PM';
    }
    return false;
  });
  
  const [localSelectedTimes, setLocalSelectedTimes] = React.useState<Set<string>>(
    new Set((initialValue || []).map(v => `${v.hour}:${v.minute}:${v.period}`))
  );

  // For columns variant: track selected hour and minute separately
  const [selectedHour, setSelectedHour] = React.useState<string | null>(() => {
    if (variant === 'columns' && initialValue && initialValue.length > 0) {
      return initialValue[0].hour;
    }
    return null;
  });
  const [selectedMinute, setSelectedMinute] = React.useState<string | null>(() => {
    if (variant === 'columns' && initialValue && initialValue.length > 0) {
      return initialValue[0].minute;
    }
    return null;
  });

  // Update local state when value prop changes
  React.useEffect(() => {
    setLocalSelectedTimes(new Set((value || []).map(v => `${v.hour}:${v.minute}:${v.period}`)));
    // Update PM state if value has times
    if (value && value.length > 0) {
      setIsPM(value[0].period === 'PM');
      // Update column selections if in columns variant
      if (variant === 'columns') {
        setSelectedHour(value[0].hour);
        setSelectedMinute(value[0].minute);
      }
    }
  }, [value, variant]);

  // Generate time options based on interval and period
  const generateTimeOptions = (): string[] => {
    const options: string[] = [];
    
    if (!hour12) {
      // 24-hour format: 00:00 to 23:59
      const totalMinutes = 24 * 60;
      for (let minutes = 0; minutes < totalMinutes; minutes += timeInterval) {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        const hourStr = hours.toString().padStart(2, '0');
        const minStr = mins.toString().padStart(2, '0');
        options.push(`${hourStr}:${minStr}`);
      }
    } else {
      // 12-hour format: show times for current period (AM or PM)
      const startHour = isPM ? 12 : 0;
      const endHour = isPM ? 23 : 11;
      
      for (let hour = startHour; hour <= endHour; hour++) {
        for (let minute = 0; minute < 60; minute += timeInterval) {
          if (hour === endHour && minute + timeInterval > 60) break;
          
          const hour12Format = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
          const hourStr = hour12Format.toString().padStart(2, '0');
          const minStr = minute.toString().padStart(2, '0');
          options.push(`${hourStr}:${minStr}`);
        }
      }
    }
    
    return options;
  };

  const currentOptions = React.useMemo(() => generateTimeOptions(), [timeInterval, hour12, isPM]);

  // Generate hour options for columns variant (1-12 for 12-hour format)
  const hourOptions = React.useMemo(() => {
    if (variant === 'columns' && hour12) {
      return Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
    }
    return [];
  }, [variant, hour12]);

  // Generate minute options for columns variant (5-minute intervals)
  const minuteOptions = React.useMemo(() => {
    if (variant === 'columns') {
      const interval = timeInterval || 5; // Use timeInterval prop, default to 5 for agenda
      const options: string[] = [];
      for (let minute = 0; minute < 60; minute += interval) {
        options.push(minute.toString().padStart(2, '0'));
      }
      return options;
    }
    return [];
  }, [variant, timeInterval]);

  // Handle hour selection in columns variant
  const handleHourSelect = (hour: string) => {
    if (variant === 'columns') {
      setSelectedHour(hour);
      // Auto-apply if both hour and minute are selected
      if (selectedMinute !== null) {
        const timeValue: TimeValue = {
          hour,
          minute: selectedMinute,
          period: isPM ? 'PM' : 'AM',
        };
        const newValue = [timeValue];
        setValue(newValue);
        if (autoApply) {
          onApply?.(newValue);
        }
      }
    }
  };

  // Handle minute selection in columns variant
  const handleMinuteSelect = (minute: string) => {
    if (variant === 'columns') {
      setSelectedMinute(minute);
      // Auto-apply if both hour and minute are selected
      if (selectedHour !== null) {
        const timeValue: TimeValue = {
          hour: selectedHour,
          minute,
          period: isPM ? 'PM' : 'AM',
        };
        const newValue = [timeValue];
        setValue(newValue);
        if (autoApply) {
          onApply?.(newValue);
        }
      }
    }
  };

  const handleTimeToggle = (time: string) => {
    const period = isPM ? 'PM' : 'AM';
    const timeKey = `${time}:${period}`;
    const newSelected = new Set(localSelectedTimes);
    
    if (newSelected.has(timeKey)) {
      newSelected.delete(timeKey);
    } else {
      newSelected.add(timeKey);
    }
    
    setLocalSelectedTimes(newSelected);

    if (autoApply) {
      const selectedTimes: TimeValue[] = Array.from(newSelected).map(timeStr => {
        // timeStr format is "HH:MM:AM" or "HH:MM:PM"
        // Split by ':' to get ["HH", "MM", "AM"] or ["HH", "MM", "PM"]
        const parts = timeStr.split(':');
        const hour = parts[0];
        const minute = parts[1];
        const period = parts[2] as 'AM' | 'PM';
        return {
          hour,
          minute,
          period,
        };
      });
      setValue(selectedTimes);
      onApply?.(selectedTimes);
    }
  };

  const handleApply = () => {
    if (variant === 'columns') {
      // For columns variant, use selected hour and minute
      if (selectedHour !== null && selectedMinute !== null) {
        const selectedTimes: TimeValue[] = [{
          hour: selectedHour,
          minute: selectedMinute,
          period: isPM ? 'PM' : 'AM',
        }];
        setValue(selectedTimes);
        onApply?.(selectedTimes);
      }
    } else {
      // For list variant, use existing logic
      const selectedTimes: TimeValue[] = Array.from(localSelectedTimes).map(timeStr => {
        // timeStr format is "HH:MM:AM" or "HH:MM:PM"
        // Split by ':' to get ["HH", "MM", "AM"] or ["HH", "MM", "PM"]
        const parts = timeStr.split(':');
        const hour = parts[0];
        const minute = parts[1];
        const period = parts[2] as 'AM' | 'PM';
        return {
          hour,
          minute,
          period,
        };
      });
      setValue(selectedTimes);
      onApply?.(selectedTimes);
    }
  };

  const handleCancel = () => {
    // Reset to original value
    setLocalSelectedTimes(new Set((value || []).map(v => `${v.hour}:${v.minute}:${v.period}`)));
    setIsPM((value && value.length > 0) ? value[0].period === 'PM' : false);
    if (variant === 'columns') {
      if (value && value.length > 0) {
        setSelectedHour(value[0].hour);
        setSelectedMinute(value[0].minute);
      } else {
        setSelectedHour(null);
        setSelectedMinute(null);
      }
    }
    onCancel?.();
  };

  const [isOpen, setIsOpen] = React.useState(false);
  const buttonRef = React.useRef<HTMLDivElement>(null);

  const formattedTimes = (value && value.length > 0)
    ? value.map(v => `${v.hour}:${v.minute} ${v.period}`).join(', ')
    : placeholder;

  return (
    <>
      <div ref={buttonRef} className="relative">
        <Button
          size="md"
          color="secondary"
          iconTrailing={children ? undefined : Clock}
          style={customButtonStyle}
          className={customButtonClassName}
          onClick={() => setIsOpen(!isOpen)}
        >
          {children || formattedTimes}
        </Button>
      </div>
      {isOpen && typeof window !== 'undefined' && createPortal(
        <AriaModalOverlay
          isOpen={isOpen}
          onOpenChange={setIsOpen}
          isDismissable
          className={({ isEntering, isExiting }) =>
            cx(
              'fixed inset-0 z-[110] flex items-center justify-center bg-black/50 backdrop-blur-sm',
              isEntering && 'animate-in fade-in duration-200 ease-out',
              isExiting && 'animate-out fade-out duration-150 ease-in',
            )
          }
        >
          <AriaModal
            className={({ isEntering, isExiting }) =>
              cx(
                'w-full max-w-lg mx-4 outline-hidden',
                isEntering && 'animate-in zoom-in-95 duration-200 ease-out',
                isExiting && 'animate-out zoom-out-95 duration-150 ease-in',
              )
            }
          >
            <AriaDialog className="bg-primary ring-secondary_alt rounded-2xl shadow-xl ring">
          {({ close }) => (
            <>
              <div className="flex flex-col px-8 py-6 max-h-[600px]">
                {/* Header with picker type */}
                {pickerType && (
                  <div className="mb-4 pb-2 border-b border-gray-200">
                    <span className="text-lg font-semibold text-gray-900 uppercase">
                      {pickerType === 'from' ? 'FROM' : 'TO'}
                    </span>
                  </div>
                )}

                {/* Time Selection - Columns or List */}
                {variant === 'columns' ? (
                  <div className="flex gap-4">
                    {/* Hours Column */}
                    <div className="flex-1 flex flex-col gap-2 items-center overflow-y-auto max-h-[450px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      <div className="text-sm font-semibold text-gray-600 mb-2 sticky top-0 bg-primary z-10 py-1">Hours</div>
                      {hourOptions.map((hour) => {
                        const isSelected = selectedHour === hour;
                        return (
                          <div
                            key={hour}
                            onClick={() => handleHourSelect(hour)}
                            className={cx(
                              "flex items-center justify-center min-h-[44px] w-full cursor-pointer rounded-lg transition-colors",
                              isSelected
                                ? "bg-brand-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            )}
                          >
                            <span className="text-xl font-medium py-2">{hour}</span>
                          </div>
                        );
                      })}
                    </div>
                    {/* Minutes Column */}
                    <div className="flex-1 flex flex-col gap-2 items-center overflow-y-auto max-h-[450px] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                      <div className="text-sm font-semibold text-gray-600 mb-2 sticky top-0 bg-primary z-10 py-1">Minutes</div>
                      {minuteOptions.map((minute) => {
                        const isSelected = selectedMinute === minute;
                        return (
                          <div
                            key={minute}
                            onClick={() => handleMinuteSelect(minute)}
                            className={cx(
                              "flex items-center justify-center min-h-[44px] w-full cursor-pointer rounded-lg transition-colors",
                              isSelected
                                ? "bg-brand-600 text-white"
                                : "bg-white text-gray-700 hover:bg-gray-100"
                            )}
                          >
                            <span className="text-xl font-medium py-2">{minute}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="overflow-y-auto max-h-[450px] pr-2">
                    <div className="flex flex-col gap-3 items-center">
                      {currentOptions.map((time) => {
                        const period = hour12 ? (isPM ? 'PM' : 'AM') : 'AM';
                        const timeKey = `${time}:${period}`;
                        const isChecked = localSelectedTimes.has(timeKey);
                        
                        return (
                          <div
                            key={timeKey}
                            onClick={() => handleTimeToggle(time)}
                            className="flex items-center gap-3 min-h-[44px] cursor-pointer w-full justify-center"
                          >
                            <div className={cx(
                              "bg-white flex size-6 shrink-0 items-center justify-center rounded ring-1 ring-transparent",
                              !isChecked && "opacity-0 invisible"
                            )}>
                              <svg
                                viewBox="0 0 14 14"
                                fill="none"
                                className="size-5 text-brand-600"
                              >
                                <path
                                  d="M11.6666 3.5L5.24992 9.91667L2.33325 7"
                                  stroke="currentColor"
                                  strokeWidth="4"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            </div>
                            <span className="text-2xl font-medium py-2">{time}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
              {/* AM/PM Toggle Buttons */}
              {hour12 && (
                <div className="border-secondary border-t px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        if (variant === 'columns') {
                          // For columns variant, just update period and apply if both hour and minute are selected
                          setIsPM(false);
                          if (selectedHour !== null && selectedMinute !== null) {
                            const timeValue: TimeValue = {
                              hour: selectedHour,
                              minute: selectedMinute,
                              period: 'AM',
                            };
                            const newValue = [timeValue];
                            setValue(newValue);
                            if (autoApply) {
                              onApply?.(newValue);
                            }
                          }
                        } else {
                          // When switching to AM, preserve selected times by converting PM times to AM
                          if (isPM && localSelectedTimes.size > 0) {
                            const convertedTimes = new Set<string>();
                            localSelectedTimes.forEach(timeKey => {
                              // Convert "02:30:PM" to "02:30:AM"
                              const parts = timeKey.split(':');
                              if (parts.length === 3 && parts[2] === 'PM') {
                                convertedTimes.add(`${parts[0]}:${parts[1]}:AM`);
                              } else {
                                convertedTimes.add(timeKey);
                              }
                            });
                            setLocalSelectedTimes(convertedTimes);
                          }
                          setIsPM(false);
                        }
                      }}
                      className={cx(
                        'flex-1 rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors',
                        !isPM
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      )}
                    >
                      AM
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (variant === 'columns') {
                          // For columns variant, just update period and apply if both hour and minute are selected
                          setIsPM(true);
                          if (selectedHour !== null && selectedMinute !== null) {
                            const timeValue: TimeValue = {
                              hour: selectedHour,
                              minute: selectedMinute,
                              period: 'PM',
                            };
                            const newValue = [timeValue];
                            setValue(newValue);
                            if (autoApply) {
                              onApply?.(newValue);
                            }
                          }
                        } else {
                          // When switching to PM, preserve selected times by converting AM times to PM
                          if (!isPM && localSelectedTimes.size > 0) {
                            const convertedTimes = new Set<string>();
                            localSelectedTimes.forEach(timeKey => {
                              // Convert "02:30:AM" to "02:30:PM"
                              const parts = timeKey.split(':');
                              if (parts.length === 3 && parts[2] === 'AM') {
                                convertedTimes.add(`${parts[0]}:${parts[1]}:PM`);
                              } else {
                                convertedTimes.add(timeKey);
                              }
                            });
                            setLocalSelectedTimes(convertedTimes);
                          }
                          setIsPM(true);
                        }
                      }}
                      className={cx(
                        'flex-1 rounded-lg border-2 px-4 py-2 text-sm font-medium transition-colors',
                        isPM
                          ? 'border-brand-600 bg-brand-600 text-white'
                          : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                      )}
                    >
                      PM
                    </button>
                  </div>
                </div>
              )}
              <div className="border-secondary grid grid-cols-2 gap-3 border-t p-4">
                <button
                  type="button"
                  onClick={() => {
                    handleCancel();
                    close();
                  }}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-brand-600 hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleApply();
                    close();
                  }}
                  className="rounded-lg bg-white px-4 py-2 text-sm font-medium text-brand-600 hover:bg-gray-50 transition-colors"
                >
                  OK
                </button>
              </div>
            </>
          )}
            </AriaDialog>
          </AriaModal>
        </AriaModalOverlay>,
        document.body
      )}
    </>
  );
};

