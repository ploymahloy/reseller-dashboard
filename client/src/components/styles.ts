import { cx } from '../utils/cx'

export const focusRing =
  'outline-none focus-visible:border-focus focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-canvas data-[state=focus]:border-focus data-[state=focus]:ring-2 data-[state=focus]:ring-focus data-[state=focus]:ring-offset-2 data-[state=focus]:ring-offset-canvas'

export const controlClass = cx(
  'w-full min-w-0 rounded-md border border-border bg-surface font-sans text-body text-fg',
  'placeholder:text-fg-muted',
  'hover:border-border-strong',
  focusRing,
  'aria-[invalid=true]:border-error-fg aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-error-fg',
  'aria-[invalid=true]:hover:border-error-fg',
  'aria-[invalid=true]:focus-visible:border-error-fg aria-[invalid=true]:focus-visible:ring-error-fg',
  'data-[state=focus]:aria-[invalid=true]:border-error-fg data-[state=focus]:aria-[invalid=true]:ring-error-fg',
  'disabled:cursor-not-allowed disabled:border-border disabled:bg-neutral-100 disabled:text-fg-muted disabled:ring-0 disabled:hover:border-border',
  'dark:disabled:bg-neutral-800',
)
