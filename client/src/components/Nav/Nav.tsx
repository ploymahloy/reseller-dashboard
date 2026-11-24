import { createContext, useContext, useId, useRef, useState, type ComponentProps, type ElementType, type KeyboardEvent, type MouseEvent, type ReactNode, type RefObject } from 'react'
import useLineClamp from 'use-line-clamp'

import { cx } from '../../utils/cx'
import { Button } from '../Button'
import { CloseIcon, Icon, MenuIcon } from '../Icon'
import { focusRing } from '../styles'

const NavMenuContext = createContext<(() => void) | null>(null)

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
  as?: ElementType
  to?: string
  end?: boolean
}

export const NavItem = ({ current = false, className, onClick, as: Component = 'a', ...props }: NavItemProps) => {
  const closeMenu = useContext(NavMenuContext)

  return (
    <Component
      {...props}
      aria-current={current ? 'page' : undefined}
      onClick={(event: MouseEvent<HTMLAnchorElement>) => {
        onClick?.(event)
        if (!event.defaultPrevented) closeMenu?.()
      }}
      className={cx(itemClass, current ? 'bg-neutral-100 text-fg dark:bg-neutral-800' : idleClass, className)}
    />
  )
}

type TopBarProps = ComponentProps<'header'> & {
  wordmark: ReactNode
  label: string
  actions?: ReactNode
}

export const TopBar = ({ wordmark, label, actions, className, children, onKeyDown, ...props }: TopBarProps) => {
  const [open, setOpen] = useState(false)
  const navId = useId()
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const measureRef = useRef<HTMLDivElement>(null)
  const wrapped = useLineClamp(measureRef as RefObject<HTMLDivElement>, { lines: 1 })
  const closeMenu = () => setOpen(false)

  const onHeaderKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented || !open || event.key !== 'Escape') return
    closeMenu()
    menuButtonRef.current?.focus()
  }

  return (
    <header
      {...props}
      onKeyDown={onHeaderKeyDown}
      className={cx('relative @container border-b border-border bg-surface font-sans', className)}
    >
      <div
        ref={measureRef}
        inert
        aria-hidden
        className="pointer-events-none absolute inset-x-4 opacity-0"
      >
        <span className="inline-flex items-center whitespace-nowrap text-title">{wordmark}</span>
        <span className="ml-6 inline-flex items-center gap-2 whitespace-nowrap">{actions}<span className="inline-block size-9" /></span>
      </div>
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-6 px-4 @min-[42rem]:grid-cols-[auto_minmax(0,1fr)_auto]">
        <div className="text-title flex h-14 items-center">{wordmark}</div>
        <div className="flex h-14 items-center justify-end gap-2 @min-[42rem]:col-start-3">
          {wrapped ? null : actions}
          <div className="@min-[42rem]:hidden">
            <Button
              ref={menuButtonRef}
              variant="ghost"
              className="size-9 px-0!"
              aria-expanded={open}
              aria-controls={navId}
              aria-label={open ? 'Close menu' : 'Open menu'}
              onClick={() => setOpen((value) => !value)}
            >
              <Icon size="sm">{open ? <CloseIcon /> : <MenuIcon />}</Icon>
            </Button>
          </div>
        </div>
        <nav
          id={navId}
          aria-label={label}
          data-open={open ? '' : undefined}
          className={cx(
            'col-span-full -mx-4 hidden flex-col justify-center gap-1 border-t border-border px-4 py-3 [&_a]:w-full',
            'data-open:flex',
            '@min-[42rem]:col-span-1 @min-[42rem]:col-start-2 @min-[42rem]:row-start-1 @min-[42rem]:mx-0 @min-[42rem]:flex @min-[42rem]:flex-row @min-[42rem]:items-center @min-[42rem]:border-0 @min-[42rem]:p-0 @min-[42rem]:[&_a]:w-auto',
          )}
        >
          <NavMenuContext.Provider value={closeMenu}>
            {wrapped ? (
              <div className="[&_button]:w-full" onClick={closeMenu}>
                {actions}
              </div>
            ) : null}
            {children}
          </NavMenuContext.Provider>
        </nav>
      </div>
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
