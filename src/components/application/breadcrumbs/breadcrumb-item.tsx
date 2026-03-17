'use client';

import type { HTMLAttributes } from 'react';
import { type FC, type ReactNode, isValidElement, useContext } from 'react';
import { ChevronRight, SlashDivider } from '@untitledui/icons';
import {
  Breadcrumb as AriaBreadcrumb,
  type BreadcrumbProps as AriaBreadcrumbProps,
  Link as AriaLink,
} from 'react-aria-components';
import {
  type BreadcrumbType,
  BreadcrumbsContext,
} from '@/components/application/breadcrumbs/breadcrumbs';
import { cx } from '@/utils/cx';
import { isReactComponent } from '@/utils/is-react-component';

const baseStyles = {
  text: {
    root: '',
    icon: 'text-fg-quaternary group-hover:text-fg-quaternary_hover',
    label: 'text-quaternary group-hover:text-tertiary_hover',
    current: {
      root: '',
      icon: 'text-fg-brand-primary group-hover:text-fg-brand-primary',
      label: 'text-brand-secondary group-hover:text-brand-secondary',
    },
  },
  button: {
    root: 'p-1 hover:bg-primary_hover',
    icon: 'text-fg-quaternary group-hover:text-fg-quaternary_hover',
    label: 'px-1 text-quaternary group-hover:text-tertiary_hover',
    current: {
      root: 'bg-primary_hover',
      icon: 'text-fg-quaternary_hover',
      label: 'text-fg-tertiary_hover',
    },
  },
};

interface BreadcrumbItemBaseProps extends HTMLAttributes<Element> {
  href?: string;
  icon?: FC<{ className?: string }> | ReactNode;
  type?: 'text' | 'button';
  current?: boolean;
  children?: ReactNode;
}

const BreadcrumbBase = ({
  href,
  children,
  icon: Icon,
  type = 'text',
  current,
  className,
  ...otherProps
}: BreadcrumbItemBaseProps) => {
  const Wrapper = href ? AriaLink : 'button';

  return (
    <Wrapper
      {...otherProps}
      href={href}
      className={cx(
        'group outline-focus-ring in-current:max-w-full inline-flex cursor-pointer items-center justify-center gap-1 rounded-md transition duration-100 ease-linear focus-visible:outline-2 focus-visible:outline-offset-2',
        baseStyles[type].root,
        current && baseStyles[type].current.root,
        !href && !otherProps.onClick && 'cursor-default',
        className,
      )}
    >
      {isReactComponent(Icon) && (
        <Icon
          className={cx(
            'transition-inherit-all size-5',
            baseStyles[type].icon,
            current && baseStyles[type].current.icon,
          )}
        />
      )}
      {isValidElement(Icon) && Icon}

      {children && (
        <span
          className={cx(
            'transition-inherit-all in-current:truncate text-sm font-semibold whitespace-nowrap',
            baseStyles[type].label,
            current && baseStyles[type].current.label,
          )}
        >
          {children}
        </span>
      )}
    </Wrapper>
  );
};

interface BreadcrumbItemProps extends AriaBreadcrumbProps {
  href?: string;
  divider?: 'chevron' | 'slash';
  type?: BreadcrumbType;
  isEllipsis?: boolean;
  children?: ReactNode;
  icon?: FC<{ className?: string }> | ReactNode;
  onClick?: () => void;
}

export const BreadcrumbItem = ({
  href,
  icon,
  divider,
  type,
  isEllipsis,
  children,
  onClick,
  ...otherProps
}: BreadcrumbItemProps) => {
  const context = useContext(BreadcrumbsContext);

  type = context.type || 'text';
  divider = context.divider || 'chevron';

  return (
    <AriaBreadcrumb
      {...otherProps}
      className={cx(
        'current:overflow-hidden flex items-center',
        type === 'text' || type === 'text-line'
          ? 'gap-1.5 md:gap-2'
          : 'gap-0.5 md:gap-1',
      )}
    >
      {({ isCurrent }) => (
        <>
          {isEllipsis ? (
            <BreadcrumbBase
              // The label for screen readers.
              aria-label="See all breadcrumb items"
              type={type === 'text-line' ? 'text' : type}
              onClick={onClick}
            >
              ...
            </BreadcrumbBase>
          ) : (
            <BreadcrumbBase
              href={href}
              icon={icon}
              current={isCurrent}
              type={type === 'text-line' ? 'text' : type}
              onClick={onClick}
            >
              {children}
            </BreadcrumbBase>
          )}

          {/* Divider */}
          {!isCurrent && (
            <div className="text-fg-quaternary shrink-0">
              {divider === 'slash' ? (
                <SlashDivider className="size-5" />
              ) : (
                <ChevronRight className="size-4" />
              )}
            </div>
          )}
        </>
      )}
    </AriaBreadcrumb>
  );
};
