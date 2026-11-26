import { useId, type ComponentProps, type ReactNode } from 'react'
import { describedBy } from '@/utils/describedBy'
import { cx } from '@/utils/cx'
import { Field, FieldMessages, RequiredMark } from '@/components/Field'
import { CheckIcon, Icon } from '@/components/Icon'
import { focusRing } from '@/components/styles'

const boxClass = cx(
  'peer size-4 shrink-0 cursor-pointer appearance-none rounded-sm border border-border bg-surface',
  'checked:border-brand-solid checked:bg-brand-solid',
  focusRing,
  'aria-[invalid=true]:border-error-fg aria-[invalid=true]:ring-2 aria-[invalid=true]:ring-error-fg',
  'aria-[invalid=true]:focus-visible:ring-error-fg data-[state=focus]:aria-[invalid=true]:ring-error-fg',
  'disabled:cursor-not-allowed disabled:border-border disabled:bg-neutral-100 disabled:ring-0',
  'disabled:checked:border-neutral-300 disabled:checked:bg-neutral-300',
  'dark:disabled:bg-neutral-800 dark:disabled:checked:border-neutral-600 dark:disabled:checked:bg-neutral-600',
)

type CheckboxProps = Omit<ComponentProps<'input'>, 'type'> & {
  label: ReactNode
  hint?: ReactNode
  error?: ReactNode
}

export const Checkbox = ({ label, hint, error, required, id, className, disabled, ...props }: CheckboxProps) => {
  const autoId = useId()
  const fieldId = id ?? autoId
  const hintId = useId()
  const errorId = useId()

  return (
    <Field>
      <label
        htmlFor={fieldId}
        className="inline-flex cursor-pointer items-center gap-2 text-body text-fg has-disabled:cursor-not-allowed has-disabled:text-fg-muted"
      >
        <span className="relative inline-flex size-4 shrink-0">
          <input
            {...props}
            id={fieldId}
            type="checkbox"
            disabled={disabled}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(hint, hintId, error, errorId)}
            className={cx(boxClass, className)}
          />
          <Icon
            size="sm"
            className="pointer-events-none absolute inset-0 text-on-brand opacity-0 peer-checked:opacity-100 peer-disabled:text-neutral-700 dark:peer-disabled:text-neutral-100"
          >
            <CheckIcon />
          </Icon>
        </span>
        {label}
        {required ? <RequiredMark /> : null}
      </label>
      <FieldMessages hint={hint} error={error} hintId={hintId} errorId={errorId} />
    </Field>
  )
}
