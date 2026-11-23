import { createContext, useContext, useEffect, useId, useRef, type ComponentProps, type MouseEvent, type ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { Button } from '../Button'
import { CloseIcon, Icon } from '../Icon'

type DialogContextValue = {
  titleId: string
  descriptionId: string
  onClose: () => void
}

const DialogContext = createContext<DialogContextValue | null>(null)

const useDialog = () => {
  const context = useContext(DialogContext)
  if (!context) {
    throw new Error('Dialog components must be used within Dialog')
  }
  return context
}

type DialogProps = {
  open: boolean
  onClose: () => void
  children: ReactNode
  className?: string
}

export const Dialog = ({ open, onClose, children, className }: DialogProps) => {
  const ref = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descriptionId = useId()

  useEffect(() => {
    const node = ref.current
    if (!node) return
    if (open && !node.open) node.showModal()
    if (!open && node.open) node.close()
  }, [open])

  const onClick = (event: MouseEvent<HTMLDialogElement>) => {
    if (event.target === event.currentTarget) onClose()
  }

  return (
    <DialogContext.Provider value={{ titleId, descriptionId, onClose }}>
      <dialog
        ref={ref}
        onClose={onClose}
        onClick={onClick}
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className={cx(
          'm-auto w-[min(100%-2rem,28rem)] rounded-lg border border-border bg-surface p-0 font-sans text-fg shadow-lg backdrop:bg-neutral-950/40',
          className,
        )}
      >
        {children}
      </dialog>
    </DialogContext.Provider>
  )
}

export const DialogTitle = ({ className, children, ...props }: ComponentProps<'h2'>) => {
  const { titleId } = useDialog()
  return (
    <h2 {...props} id={titleId} className={cx('text-title', className)}>
      {children}
    </h2>
  )
}

export const DialogDescription = ({ className, children, ...props }: ComponentProps<'p'>) => {
  const { descriptionId } = useDialog()
  return (
    <p {...props} id={descriptionId} className={cx('text-body text-fg-muted', className)}>
      {children}
    </p>
  )
}

export const DialogBody = ({ className, ...props }: ComponentProps<'div'>) => {
  return <div {...props} className={cx('px-4 pb-4 text-body text-fg', className)} />
}

export const DialogFooter = ({ className, ...props }: ComponentProps<'div'>) => {
  return <div {...props} className={cx('flex items-center justify-end gap-2 px-4 pb-4', className)} />
}

export const DialogClose = ({
  className,
  onClick,
  'aria-label': ariaLabel = 'Close',
  ...props
}: Omit<ComponentProps<typeof Button>, 'children' | 'variant'>) => {
  const { onClose } = useDialog()
  return (
    <Button
      {...props}
      variant="ghost"
      className={cx('size-9 px-0!', className)}
      aria-label={ariaLabel}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) onClose()
      }}
    >
      <Icon size="sm">
        <CloseIcon />
      </Icon>
    </Button>
  )
}
