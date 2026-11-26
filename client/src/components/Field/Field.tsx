import type { ComponentProps, ReactNode } from 'react'
import { cx } from '@/utils/cx'

export const Field = ({ className, ...props }: ComponentProps<'div'>) => {
  return <div className={cx('flex w-full min-w-0 flex-col gap-1 font-sans', className)} {...props} />
}

export const RequiredMark = () => {
  return (
    <span className="text-error-fg">
      <span className="sr-only"> (required)</span>
      <span aria-hidden="true" className="ml-0.5">
        *
      </span>
    </span>
  )
}

export const FieldLabel = ({
  className,
  required = false,
  children,
  ...props
}: ComponentProps<'label'> & { required?: boolean }) => {
  return (
    <label className={cx('text-label text-fg', className)} {...props}>
      {children}
      {required ? <RequiredMark /> : null}
    </label>
  )
}

export const FieldHint = ({ className, ...props }: ComponentProps<'p'>) => {
  return <p className={cx('text-caption text-fg-muted', className)} {...props} />
}

export const FieldError = ({ className, ...props }: ComponentProps<'p'>) => {
  return <p role="alert" className={cx('text-caption text-error-fg', className)} {...props} />
}

export const FieldMessages = ({
  hint,
  error,
  hintId,
  errorId,
}: {
  hint?: ReactNode
  error?: ReactNode
  hintId: string
  errorId: string
}) => {
  return (
    <>
      {hint ? <FieldHint id={hintId}>{hint}</FieldHint> : null}
      {error ? <FieldError id={errorId}>{error}</FieldError> : null}
    </>
  )
}
