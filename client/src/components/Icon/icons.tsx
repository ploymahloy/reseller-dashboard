import type { SVGProps } from 'react'
import { cx } from '@/utils/cx'

type IconSvgProps = SVGProps<SVGSVGElement>

const base = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true as const,
}

export const CheckIcon = ({ className, ...props }: IconSvgProps) => {
  return (
    <svg {...base} {...props} className={cx('size-full', className)}>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  )
}

export const ChevronDownIcon = ({ className, ...props }: IconSvgProps) => {
  return (
    <svg {...base} {...props} className={cx('size-full', className)}>
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}

export const PlusIcon = ({ className, ...props }: IconSvgProps) => {
  return (
    <svg {...base} {...props} className={cx('size-full', className)}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  )
}

export const SearchIcon = ({ className, ...props }: IconSvgProps) => {
  return (
    <svg {...base} {...props} className={cx('size-full', className)}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

export const MenuIcon = ({ className, ...props }: IconSvgProps) => {
  return (
    <svg {...base} {...props} className={cx('size-full', className)}>
      <path d="M4 7h16" />
      <path d="M4 12h16" />
      <path d="M4 17h16" />
    </svg>
  )
}

export const CloseIcon = ({ className, ...props }: IconSvgProps) => {
  return (
    <svg {...base} {...props} className={cx('size-full', className)}>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </svg>
  )
}

export const SpinnerIcon = ({ className, ...props }: IconSvgProps) => {
  return (
    <svg {...base} {...props} strokeWidth={1.5} className={cx('size-full motion-safe:animate-spin', className)}>
      <circle cx="12" cy="12" r="9" opacity="0.25" />
      <path d="M21 12a9 9 0 0 0-9-9" />
    </svg>
  )
}
