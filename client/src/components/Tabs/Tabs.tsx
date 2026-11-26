import { createContext, useContext, useId, useState, type ComponentProps, type KeyboardEvent, type ReactNode } from 'react'
import { cx } from '@/utils/cx'
import { focusRing } from '@/components/styles'

type TabsContextValue = {
  value: string
  setValue: (value: string) => void
  baseId: string
  label: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

const useTabs = () => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('Tabs components must be used within Tabs')
  }
  return context
}

type TabsProps = {
  value?: string
  defaultValue?: string
  onValueChange?: (value: string) => void
  label: string
  children: ReactNode
  className?: string
}

export const Tabs = ({ value, defaultValue, onValueChange, label, children, className }: TabsProps) => {
  const [uncontrolled, setUncontrolled] = useState(defaultValue ?? '')
  const baseId = useId()
  const selected = value ?? uncontrolled

  const setValue = (next: string) => {
    if (value === undefined) setUncontrolled(next)
    onValueChange?.(next)
  }

  return (
    <TabsContext.Provider value={{ value: selected, setValue, baseId, label }}>
      <div className={cx('min-w-0 font-sans', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

const moveKeys = ['ArrowLeft', 'ArrowRight', 'Home', 'End']

export const TabList = ({ className, children, onKeyDown, ...props }: ComponentProps<'div'>) => {
  const { label, setValue } = useTabs()

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    if (event.altKey || event.ctrlKey || event.metaKey) return
    if (!moveKeys.includes(event.key)) return
    const tabs = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]'))
    const index = tabs.findIndex((tab) => tab === document.activeElement)
    if (index < 0) return
    event.preventDefault()
    let next = index
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length
    if (event.key === 'Home') next = 0
    if (event.key === 'End') next = tabs.length - 1
    const tab = tabs[next]
    const nextValue = tab?.dataset.value
    if (!tab || !nextValue) return
    tab.focus()
    setValue(nextValue)
  }

  return (
    <div
      {...props}
      role="tablist"
      aria-label={label}
      onKeyDown={handleKeyDown}
      className={cx('flex gap-1 border-b border-border', className)}
    >
      {children}
    </div>
  )
}

type TabProps = ComponentProps<'button'> & {
  value: string
}

export const Tab = ({ value, className, children, onClick, ...props }: TabProps) => {
  const tabs = useTabs()
  const selected = tabs.value === value

  return (
    <button
      {...props}
      type="button"
      role="tab"
      id={`${tabs.baseId}-tab-${value}`}
      data-value={value}
      aria-selected={selected}
      aria-controls={`${tabs.baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) tabs.setValue(value)
      }}
      className={cx(
        'inline-flex h-9 cursor-pointer items-center rounded-t-md border-b-2 px-3 font-sans text-[length:var(--text-body)] leading-[var(--text-body--line-height)] font-medium whitespace-nowrap',
        '-mb-px',
        focusRing,
        'hover:bg-neutral-100 active:bg-neutral-200',
        'dark:hover:bg-neutral-800 dark:active:bg-neutral-700',
        'data-[state=hover]:bg-neutral-100 data-[state=active]:bg-neutral-200',
        'dark:data-[state=hover]:bg-neutral-800 dark:data-[state=active]:bg-neutral-700',
        selected
          ? 'border-brand-fg text-fg'
          : 'border-transparent text-fg-muted hover:text-fg data-[state=hover]:text-fg data-[state=active]:text-fg',
        className,
      )}
    >
      {children}
    </button>
  )
}

type TabPanelProps = ComponentProps<'div'> & {
  value: string
}

export const TabPanel = ({ value, className, children, ...props }: TabPanelProps) => {
  const tabs = useTabs()
  const selected = tabs.value === value

  return (
    <div
      {...props}
      role="tabpanel"
      id={`${tabs.baseId}-panel-${value}`}
      aria-labelledby={`${tabs.baseId}-tab-${value}`}
      hidden={!selected}
      tabIndex={selected ? 0 : undefined}
      className={cx('pt-4 text-body text-fg', className)}
    >
      {children}
    </div>
  )
}
