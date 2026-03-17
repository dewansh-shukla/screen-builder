'use client';

import { getLocalTimeZone, today } from '@internationalized/date';
import type { CSSProperties, ReactNode } from 'react';
import { useControlledState } from '@react-stately/utils';
import { Calendar as CalendarIcon } from '@untitledui/icons';
import { useDateFormatter } from 'react-aria';
import type {
  DatePickerProps as AriaDatePickerProps,
  DateValue,
} from 'react-aria-components';
import {
  DatePicker as AriaDatePicker,
  Dialog as AriaDialog,
  Group as AriaGroup,
  Popover as AriaPopover,
} from 'react-aria-components';
import { Button } from '@/components/base/buttons/button';
import { cx } from '@/utils/cx';
import { Calendar } from './calendar';

const highlightedDates = [today(getLocalTimeZone())];

interface DatePickerProps extends AriaDatePickerProps<DateValue> {
  /** The function to call when the apply button is clicked. */
  onApply?: (value: DateValue | null) => void;
  /** The function to call when the cancel button is clicked. */
  onCancel?: () => void;
  /** Whether to auto-apply on date selection without showing Apply/Cancel buttons */
  autoApply?: boolean;
  /** Custom styling for the trigger button */
  customButtonStyle?: CSSProperties;
  /** Custom class name for the trigger button */
  customButtonClassName?: string;
  /** Custom children to render inside the button instead of default content */
  children?: ReactNode;
  /** Trailing icon to show at the right side of the button */
  iconTrailing?: FC<{ className?: string }> | ReactNode;
}

export const DatePicker = ({
  value: valueProp,
  defaultValue,
  onChange,
  onApply,
  onCancel,
  autoApply = false,
  customButtonStyle,
  customButtonClassName,
  children,
  iconTrailing,
  ...props
}: DatePickerProps) => {
  const formatter = useDateFormatter({
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const [value, setValue] = useControlledState(
    valueProp,
    defaultValue || null,
    onChange,
  );

  const formattedDate = value
    ? formatter.format(value.toDate(getLocalTimeZone()))
    : 'Tap to select date';

  return (
    <AriaDatePicker
      shouldCloseOnSelect={autoApply}
      {...props}
      value={value}
      onChange={newValue => {
        setValue(newValue);
        // If auto-apply is enabled and a value is selected, trigger onApply immediately
        if (autoApply && newValue && onApply) {
          setTimeout(() => onApply(newValue), 0); // Use setTimeout to allow state to update first
        }
      }}
    >
      <AriaGroup>
        <Button
          size="md"
          color="secondary"
          iconLeading={children ? undefined : CalendarIcon}
          iconTrailing={iconTrailing}
          style={customButtonStyle}
          className={customButtonClassName}
        >
          {children || formattedDate}
        </Button>
      </AriaGroup>
      <AriaPopover
        offset={8}
        placement="bottom"
        className={({ isEntering, isExiting }) =>
          cx(
            'will-change-transform',
            isEntering &&
            'animate-in fade-in placement-right:origin-left placement-right:slide-in-from-left-0.5 placement-top:origin-bottom placement-top:slide-in-from-bottom-0.5 placement-bottom:origin-top placement-bottom:slide-in-from-top-0.5 duration-150 ease-out',
            isExiting &&
            'animate-out fade-out placement-right:origin-left placement-right:slide-out-to-left-0.5 placement-top:origin-bottom placement-top:slide-out-to-bottom-0.5 placement-bottom:origin-top placement-bottom:slide-out-to-top-0.5 duration-100 ease-in',
          )
        }
      >
        <AriaDialog className="bg-primary ring-secondary_alt rounded-2xl shadow-xl ring">
          {({ close }) => (
            <>
              <div className="flex px-6 py-5">
                <Calendar
                  highlightedDates={highlightedDates}
                  minValue={props.minValue}
                />
              </div>
              {!autoApply && (
                <div className="border-secondary grid grid-cols-2 gap-3 border-t p-4">
                  <Button
                    size="md"
                    color="secondary"
                    onClick={() => {
                      onCancel?.();
                      close();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="md"
                    color="primary"
                    onClick={() => {
                      onApply?.(value ?? null);
                      close();
                    }}
                  >
                    Apply
                  </Button>
                </div>
              )}
            </>
          )}
        </AriaDialog>
      </AriaPopover>
    </AriaDatePicker>
  );
};
