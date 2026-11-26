import type { ComponentProps, ReactNode } from 'react'
import { cx } from '@/utils/cx'
import { Button } from '@/components/Button'
import { CloseIcon, Icon } from '@/components/Icon'

const variants = {
  neutral: 'bg-neutral-500/15 text-fg',
  success: 'bg-success-500/15 text-success-fg',
  warning: 'bg-warning-500/15 text-warning-fg',
  error: 'bg-error-500/15 text-error-fg',
  info: 'bg-info-500/15 text-info-fg',
} as const

export type AlertVariant = keyof typeof variants

type AlertProps = Omit<ComponentProps<'div'>, 'title'> & {
  variant?: AlertVariant
  title?: ReactNode
  onDismiss?: () => void
  children: ReactNode
}

export const Alert = ({ variant = 'neutral', title, onDismiss, className, children, ...props }: AlertProps) => {
  return (
    <div
      {...props}
      role={variant === 'error' || variant === 'warning' ? 'alert' : 'status'}
      className={cx(
        'flex items-start gap-3 rounded-md border border-current/20 px-3 py-3 font-sans',
        variants[variant],
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        {title ? <p className="text-label">{title}</p> : null}
        <div className={cx('text-body-sm', title ? 'mt-1' : undefined)}>{children}</div>
      </div>
      {onDismiss ? (
        <Button
          variant="ghost"
          className="size-9 shrink-0 px-0! text-current!"
          aria-label="Dismiss"
          onClick={onDismiss}
        >
          <Icon size="sm">
            <CloseIcon />
          </Icon>
        </Button>
      ) : null}
    </div>
  )
}
