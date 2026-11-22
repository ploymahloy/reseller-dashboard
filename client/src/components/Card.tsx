import type { ComponentProps } from 'react'

const cx = (...parts: Array<string | undefined>): string => {
  return parts.filter(Boolean).join(' ')
}

const padX = 'px-[clamp(1rem,0.25rem+4.2cqi,1.25rem)]'
const padY = 'py-[clamp(1rem,0.25rem+4.2cqi,1.25rem)]'
const bodyType = 'text-[length:clamp(0.8125rem,0.625rem+1.05cqi,0.9375rem)] leading-snug'
const titleType = 'text-[length:clamp(0.9375rem,0.75rem+1.1cqi,1.125rem)] leading-snug'

export const Card = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={cx(
        '@container min-w-0 max-w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-100 shadow-sm',
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
      className={cx('block aspect-[4/3] h-auto w-full max-w-full bg-zinc-800 object-cover', className)}
    />
  )
}

export const CardHeader = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={cx(
        'flex min-w-0 flex-col gap-1 pt-[clamp(1rem,0.25rem+4.2cqi,1.25rem)]',
        padX,
        className,
      )}
      {...props}
    />
  )
}

export const CardTitle = ({ className, ...props }: ComponentProps<'h2'>) => {
  return (
    <h2
      className={cx(titleType, 'font-semibold tracking-tight wrap-break-word', className)}
      {...props}
    />
  )
}

export const CardDescription = ({ className, ...props }: ComponentProps<'p'>) => {
  return <p className={cx(bodyType, 'text-zinc-400 wrap-break-word', className)} {...props} />
}

export const CardContent = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={cx('min-w-0 wrap-break-word', padX, padY, bodyType, className)}
      {...props}
    />
  )
}

export const CardFooter = ({ className, ...props }: ComponentProps<'div'>) => {
  return (
    <div
      className={cx(
        'flex min-w-0 flex-wrap items-center gap-x-3 gap-y-2 border-t border-zinc-800 py-[clamp(0.75rem,4.2cqi,1rem)]',
        bodyType,
        padX,
        className,
      )}
      {...props}
    />
  )
}
