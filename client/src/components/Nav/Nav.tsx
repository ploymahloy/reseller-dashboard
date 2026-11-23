import type { ComponentProps, ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { focusRing } from '../styles'

const itemClass = cx(
  'inline-flex h-9 cursor-pointer items-center gap-2 rounded-md px-3 font-sans text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-medium whitespace-nowrap no-underline',
  focusRing,
)

const idleClass = cx(
  'text-fg-muted',
  'hover:bg-neutral-100 hover:text-fg active:bg-neutral-200 active:text-fg',
  'dark:hover:bg-neutral-800 dark:active:bg-neutral-700',
  'data-[state=hover]:bg-neutral-100 data-[state=hover]:text-fg data-[state=active]:bg-neutral-200 data-[state=active]:text-fg',
  'dark:data-[state=hover]:bg-neutral-800 dark:data-[state=active]:bg-neutral-700',
)

type NavItemProps = ComponentProps<'a'> & {
  current?: boolean
}

export const NavItem = ({ current = false, className, ...props }: NavItemProps) => {
  return (
    <a
      {...props}
      aria-current={current ? 'page' : undefined}
      className={cx(itemClass, current ? 'bg-neutral-100 text-fg dark:bg-neutral-800' : idleClass, className)}
    />
  )
}

type TopBarProps = ComponentProps<'header'> & {
  wordmark: ReactNode
  label: string
  actions?: ReactNode
}

export const TopBar = ({ wordmark, label, actions, className, children, ...props }: TopBarProps) => {
  return (
    <header
      {...props}
      className={cx('flex h-14 items-center gap-6 border-b border-border bg-surface px-4 font-sans', className)}
    >
      <div className="text-title shrink-0">{wordmark}</div>
      <nav aria-label={label} className="flex min-w-0 flex-1 items-center gap-1">
        {children}
      </nav>
      {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
    </header>
  )
}

type SidebarProps = ComponentProps<'nav'> & {
  label: string
}

export const Sidebar = ({ label, className, children, ...props }: SidebarProps) => {
  return (
    <nav
      {...props}
      aria-label={label}
      className={cx(
        'flex w-56 flex-col gap-1 border-r border-border bg-surface p-3 font-sans [&_a]:w-full',
        className,
      )}
    >
      {children}
    </nav>
  )
}
