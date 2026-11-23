import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { Alert, type AlertVariant } from '../Alert'

type ToastProps = {
  open: boolean
  onDismiss: () => void
  variant?: AlertVariant
  title?: ReactNode
  children: ReactNode
  className?: string
}

export const Toast = ({ open, onDismiss, variant = 'neutral', title, children, className }: ToastProps) => {
  if (!open) return null

  return (
    <div className={cx('fixed right-4 bottom-4 z-50 w-[min(100%-2rem,22rem)]', className)}>
      <Alert variant={variant} title={title} onDismiss={onDismiss}>
        {children}
      </Alert>
    </div>
  )
}
