"use client";

import type {
  FocusEventHandler,
  PointerEventHandler,
  RefAttributes,
} from "react";
import { forwardRef, useCallback, useRef, useState } from "react";
import { SearchLg as SearchIcon } from "@untitledui/icons";
import type {
  ComboBoxProps as AriaComboBoxProps,
  GroupProps as AriaGroupProps,
  ListBoxProps as AriaListBoxProps,
} from "react-aria-components";
import {
  ComboBox as AriaComboBox,
  Group as AriaGroup,
  Input as AriaInput,
  ListBox as AriaListBox,
} from "react-aria-components";

import { HintText } from "@/components/base/input/hint-text";
import { Label } from "@/components/base/input/label";
import { Popover } from "@/components/base/select/popover";
import {
  type CommonProps,
  SelectContext,
  type SelectItemType,
  sizes,
} from "@/components/base/select/select";
import { useResizeObserver } from "@/hooks/use-resize-observer";
import { cx } from "@/utils/cx";


interface ComboBoxProps
  extends Omit<AriaComboBoxProps<SelectItemType>, "children" | "items">,
    RefAttributes<HTMLDivElement>,
    CommonProps {
  shortcut?: boolean;
  items?: SelectItemType[];
  popoverClassName?: string;
  shortcutClassName?: string;
  children: AriaListBoxProps<SelectItemType>["children"];
}

interface ComboBoxValueProps extends AriaGroupProps {
  size: "sm" | "md";
  shortcut: boolean;
  placeholder?: string;
  shortcutClassName?: string;
  onFocus?: FocusEventHandler;
  onPointerEnter?: PointerEventHandler;
}

const ComboBoxValue = forwardRef<HTMLDivElement, ComboBoxValueProps>(({
  size,
  shortcut,
  placeholder,
  shortcutClassName,
  ...otherProps
}, ref) => {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <AriaGroup
      ref={ref}
      {...otherProps}
      className={({ isFocusWithin, isDisabled, isInvalid }) =>
        cx(
          "relative flex w-full items-center gap-2 rounded-lg",
          "bg-primary shadow-xs ring-1 ring-primary ring-inset transition-shadow",
          isDisabled && "cursor-not-allowed bg-disabled_subtle",
          isInvalid && "ring-error_subtle",
          isInvalid && isFocusWithin && "ring-2 ring-error",
          !isInvalid && isFocusWithin && "ring-2 ring-brand",
          sizes[size].root
        )
      }
    >
      {({ isDisabled }) => (
        <>
          <SearchIcon className="pointer-events-none size-5 shrink-0 text-fg-quaternary" />

          <AriaInput
            ref={inputRef}
            placeholder={placeholder}
            className={cx(
              "w-full min-w-0 appearance-none bg-transparent",
              "text-md leading-6 text-primary",
              "caret-alpha-black/90",
              "placeholder:text-placeholder",
              "focus:outline-hidden",
              isDisabled &&
                "cursor-not-allowed text-disabled placeholder:text-disabled"
            )}
          />

          {shortcut && (
            <div
              className={cx(
                "absolute inset-y-0.5 right-0.5 z-10 flex items-center",
                "rounded-r-[inherit] bg-linear-to-r from-transparent to-bg-primary to-40% pl-8",
                isDisabled && "to-bg-disabled_subtle",
                sizes[size].shortcut,
                shortcutClassName
              )}
            >
              <span
                className={cx(
                  "pointer-events-none rounded px-1 py-px text-xs font-medium",
                  "text-quaternary ring-1 ring-secondary ring-inset select-none",
                  isDisabled && "bg-transparent text-disabled"
                )}
                aria-hidden="true"
              >
                ⌘K
              </span>
            </div>
          )}
        </>
      )}
    </AriaGroup>
  );
});

ComboBoxValue.displayName = 'ComboBoxValue';

export const ComboBox = ({
  placeholder = "Search",
  shortcut = true,
  size = "sm",
  children,
  items,
  shortcutClassName,
  ...otherProps
}: ComboBoxProps) => {
  const placeholderRef = useRef<HTMLDivElement>(null);
  const [popoverWidth, setPopoverWidth] = useState("");

  const onResize = useCallback(() => {
    if (!placeholderRef.current) return;
    setPopoverWidth(
      placeholderRef.current.getBoundingClientRect().width + "px"
    );
  }, []);

  useResizeObserver({
    ref: placeholderRef,
    box: "border-box",
    onResize,
  });

  return (
    <SelectContext.Provider value={{ size }}>
      <AriaComboBox menuTrigger="focus" {...otherProps}>
        {(state) => (
          <div className="flex flex-col gap-1.5">
            {otherProps.label && (
              <Label
                isRequired={state.isRequired}
                tooltip={otherProps.tooltip}
              >
                {otherProps.label}
              </Label>
            )}

            <ComboBoxValue
              ref={placeholderRef}
              placeholder={placeholder}
              shortcut={shortcut}
              shortcutClassName={shortcutClassName}
              size={size}
              onFocus={onResize}
              onPointerEnter={onResize}
            />

            <Popover
              size={size}
              triggerRef={placeholderRef}
              style={{ width: popoverWidth }}
              className={otherProps.popoverClassName}
            >
              <AriaListBox items={items} className="size-full outline-hidden">
                {children}
              </AriaListBox>
            </Popover>

            {otherProps.hint && (
              <HintText isInvalid={state.isInvalid}>
                {otherProps.hint}
              </HintText>
            )}
          </div>
        )}
      </AriaComboBox>
    </SelectContext.Provider>
  );
};
