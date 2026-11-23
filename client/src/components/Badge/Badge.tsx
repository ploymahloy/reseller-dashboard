import type { ComponentProps, ReactNode } from 'react'
import { cx } from '../../utils/cx'

const variants = {
  neutral: 'bg-neutral-500/15 text-fg',
  success: 'bg-success-500/15 text-success-fg',
  warning: 'bg-warning-500/15 text-warning-fg',
  error: 'bg-error-500/15 text-error-fg',
  info: 'bg-info-500/15 text-info-fg',
} as const

const dots = {
  neutral: 'bg-fg-muted',
  success: 'bg-success-fg',
  warning: 'bg-warning-fg',
  error: 'bg-error-fg',
  info: 'bg-info-fg',
} as const

export type BadgeVariant = keyof typeof variants

type BadgeProps = ComponentProps<'span'> & {
  variant?: BadgeVariant
  dot?: boolean
  children: ReactNode
}

export const Badge = ({ variant = 'neutral', dot = false, className, children, ...props }: BadgeProps) => {
  return (
    <span
      {...props}
      className={cx(
        'inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-sans text-label',
        variants[variant],
        className,
      )}
    >
      {dot ? <span aria-hidden="true" className={cx('size-1.5 rounded-full', dots[variant])} /> : null}
      {children}
    </span>
  )
}
