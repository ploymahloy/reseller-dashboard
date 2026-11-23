import type { ComponentProps } from 'react'
import { cx } from '../../utils/cx'
import { Icon, SpinnerIcon } from '../Icon'
import { focusRing } from '../styles'

const variants = {
  primary: cx(
    'bg-brand-solid text-on-brand',
    'hover:bg-brand-700 active:bg-brand-800',
    'dark:hover:bg-brand-500 dark:active:bg-brand-700',
    'data-[state=hover]:bg-brand-700 data-[state=active]:bg-brand-800',
    'dark:data-[state=hover]:bg-brand-500 dark:data-[state=active]:bg-brand-700',
    'disabled:bg-neutral-200 disabled:text-neutral-600 disabled:hover:bg-neutral-200 disabled:active:bg-neutral-200',
    'dark:disabled:bg-neutral-800 dark:disabled:text-neutral-400 dark:disabled:hover:bg-neutral-800 dark:disabled:active:bg-neutral-800',
    'aria-busy:disabled:bg-brand-solid aria-busy:disabled:text-on-brand aria-busy:disabled:hover:bg-brand-solid aria-busy:disabled:active:bg-brand-solid',
    'dark:aria-busy:disabled:bg-brand-solid dark:aria-busy:disabled:text-on-brand dark:aria-busy:disabled:hover:bg-brand-solid dark:aria-busy:disabled:active:bg-brand-solid',
  ),
  secondary: cx(
    'border border-border bg-surface text-fg',
    'hover:bg-neutral-100 active:bg-neutral-200',
    'dark:hover:bg-neutral-800 dark:active:bg-neutral-700',
    'data-[state=hover]:bg-neutral-100 data-[state=active]:bg-neutral-200',
    'dark:data-[state=hover]:bg-neutral-800 dark:data-[state=active]:bg-neutral-700',
    'disabled:border-border disabled:bg-neutral-100 disabled:text-neutral-600 disabled:hover:bg-neutral-100 disabled:active:bg-neutral-100',
    'dark:disabled:bg-neutral-800 dark:disabled:text-neutral-400 dark:disabled:hover:bg-neutral-800 dark:disabled:active:bg-neutral-800',
    'aria-busy:disabled:border-border aria-busy:disabled:bg-surface aria-busy:disabled:text-fg aria-busy:disabled:hover:bg-surface aria-busy:disabled:active:bg-surface',
    'dark:aria-busy:disabled:bg-surface dark:aria-busy:disabled:text-fg dark:aria-busy:disabled:hover:bg-surface dark:aria-busy:disabled:active:bg-surface',
  ),
  outline: cx(
    'border border-border bg-transparent text-fg',
    'hover:bg-neutral-100 active:bg-neutral-200',
    'dark:hover:bg-neutral-800 dark:active:bg-neutral-700',
    'data-[state=hover]:bg-neutral-100 data-[state=active]:bg-neutral-200',
    'dark:data-[state=hover]:bg-neutral-800 dark:data-[state=active]:bg-neutral-700',
    'disabled:border-border disabled:bg-transparent disabled:text-neutral-600 disabled:hover:bg-transparent disabled:active:bg-transparent',
    'dark:disabled:text-neutral-400',
    'aria-busy:disabled:border-border aria-busy:disabled:bg-transparent aria-busy:disabled:text-fg aria-busy:disabled:hover:bg-transparent aria-busy:disabled:active:bg-transparent',
    'dark:aria-busy:disabled:text-fg',
  ),
  ghost: cx(
    'bg-transparent text-fg',
    'hover:bg-neutral-100 active:bg-neutral-200',
    'dark:hover:bg-neutral-800 dark:active:bg-neutral-700',
    'data-[state=hover]:bg-neutral-100 data-[state=active]:bg-neutral-200',
    'dark:data-[state=hover]:bg-neutral-800 dark:data-[state=active]:bg-neutral-700',
    'disabled:bg-transparent disabled:text-neutral-600 disabled:hover:bg-transparent disabled:active:bg-transparent',
    'dark:disabled:text-neutral-400',
    'aria-busy:disabled:bg-transparent aria-busy:disabled:text-fg aria-busy:disabled:hover:bg-transparent aria-busy:disabled:active:bg-transparent',
    'dark:aria-busy:disabled:text-fg',
  ),
  destructive: cx(
    'bg-error-solid text-on-error',
    'hover:bg-error-800 active:bg-error-900',
    'dark:hover:bg-error-600 dark:active:bg-error-500',
    'data-[state=hover]:bg-error-800 data-[state=active]:bg-error-900',
    'dark:data-[state=hover]:bg-error-600 dark:data-[state=active]:bg-error-500',
    'disabled:bg-neutral-200 disabled:text-neutral-600 disabled:hover:bg-neutral-200 disabled:active:bg-neutral-200',
    'dark:disabled:bg-neutral-800 dark:disabled:text-neutral-400 dark:disabled:hover:bg-neutral-800 dark:disabled:active:bg-neutral-800',
    'aria-busy:disabled:bg-error-solid aria-busy:disabled:text-on-error aria-busy:disabled:hover:bg-error-solid aria-busy:disabled:active:bg-error-solid',
    'dark:aria-busy:disabled:bg-error-solid dark:aria-busy:disabled:text-on-error dark:aria-busy:disabled:hover:bg-error-solid dark:aria-busy:disabled:active:bg-error-solid',
  ),
} as const

export type ButtonVariant = keyof typeof variants

type ButtonProps = ComponentProps<'button'> & {
  variant?: ButtonVariant
  loading?: boolean
}

export const Button = ({
  variant = 'primary',
  loading = false,
  disabled = false,
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        'inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-md px-3 font-sans text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-medium whitespace-nowrap',
        'disabled:cursor-not-allowed',
        focusRing,
        variants[variant],
        className,
      )}
    >
      {loading ? (
        <Icon size="sm">
          <SpinnerIcon />
        </Icon>
      ) : null}
      {children}
    </button>
  )
}
