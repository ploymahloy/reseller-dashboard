import { useId, type ComponentProps, type ReactNode } from 'react'
import { describedBy } from '../../utils/describedBy'
import { cx } from '../../utils/cx'
import { Field, FieldMessages } from '../Field'

const trackClass = cx(
  'pointer-events-none block h-5 w-9 shrink-0 rounded-full bg-neutral-300 p-0.5 transition-colors',
  'peer-checked:bg-brand-solid peer-checked:[&>span]:translate-x-4',
  'dark:bg-neutral-700',
  'peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-focus',
  'peer-data-[state=focus]:outline-2 peer-data-[state=focus]:outline-offset-2 peer-data-[state=focus]:outline-focus',
  'peer-aria-invalid:outline-2 peer-aria-invalid:outline-offset-2 peer-aria-invalid:outline-error-fg',
  'peer-disabled:bg-neutral-200 peer-disabled:peer-checked:bg-neutral-300',
  'dark:peer-disabled:bg-neutral-800 dark:peer-disabled:peer-checked:bg-neutral-600',
)

type SwitchProps = Omit<ComponentProps<'input'>, 'type' | 'role'> & {
  label: ReactNode
  hint?: ReactNode
  error?: ReactNode
}

export const Switch = ({ label, hint, error, id, className, disabled, ...props }: SwitchProps) => {
  const autoId = useId()
  const fieldId = id ?? autoId
  const hintId = useId()
  const errorId = useId()

  return (
    <Field>
      <label
        htmlFor={fieldId}
        className="relative inline-flex cursor-pointer items-center gap-2 text-body text-fg has-disabled:cursor-not-allowed has-disabled:text-fg-muted"
      >
        <input
          {...props}
          id={fieldId}
          type="checkbox"
          role="switch"
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(hint, hintId, error, errorId)}
          className={cx('peer sr-only outline-none', className)}
        />
        <span className={trackClass} aria-hidden="true">
          <span className="block size-4 rounded-full bg-white shadow-sm transition-transform" />
        </span>
        {label}
      </label>
      <FieldMessages hint={hint} error={error} hintId={hintId} errorId={errorId} />
    </Field>
  )
}
