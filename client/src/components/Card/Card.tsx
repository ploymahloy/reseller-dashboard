import type { ComponentProps } from 'react'
import { cx } from '../../utils/cx'

export const Card = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={cx(
        'min-w-0 max-w-full overflow-hidden rounded-lg border border-border bg-surface text-fg shadow-sm',
        className,
      )}
      {...props}
    />
  )
}

export const CardImage = ({ className, alt, ...props }: ComponentProps<'img'> & { alt: string }) => {
  return (
    <img
      {...props}
      alt={alt}
      className={cx(
        'block aspect-[4/3] h-auto w-full max-w-full bg-neutral-100 object-cover dark:bg-neutral-800',
        className,
      )}
    />
  )
}

export const CardHeader = ({ className, ...props }: ComponentProps<'div'>) => {
  return <div className={cx('flex min-w-0 flex-col gap-1 px-4 pt-4', className)} {...props} />
}

export const CardTitle = ({ className, ...props }: ComponentProps<'h2'>) => {
  return <h2 className={cx('text-title wrap-break-word', className)} {...props} />
}

export const CardDescription = ({ className, ...props }: ComponentProps<'p'>) => {
  return <p className={cx('text-body-sm text-fg-muted wrap-break-word', className)} {...props} />
}

export const CardContent = ({ className, ...props }: ComponentProps<'div'>) => {
  return <div className={cx('min-w-0 p-4 text-body wrap-break-word', className)} {...props} />
}

export const CardFooter = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={cx(
        'flex min-w-0 flex-wrap items-center gap-2 border-t border-border px-4 py-4 text-body',
        className,
      )}
      {...props}
    />
  )
}
