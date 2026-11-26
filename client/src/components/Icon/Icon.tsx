import type { ReactNode } from 'react'
import { cx } from '@/utils/cx'

const sizes = {
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
  xl: 'size-8',
} as const

export type IconSize = keyof typeof sizes

type IconProps = {
  size?: IconSize
  label?: string
  className?: string
  children: ReactNode
}

export const Icon = ({ size = 'md', label, className, children }: IconProps) => {
  return (
    <span
      className={cx('inline-flex shrink-0 items-center justify-center', sizes[size], className)}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      {children}
    </span>
  )
}
