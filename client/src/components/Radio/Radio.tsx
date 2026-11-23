import { createContext, useContext, useId, type ComponentProps, type ReactNode } from 'react'
import { describedBy } from '../../utils/describedBy'
import { cx } from '../../utils/cx'
import { Field, FieldMessages } from '../Field'

type RadioContextValue = {
  name: string
  invalid: boolean
  describedById?: string
}

const RadioContext = createContext<RadioContextValue | null>(null)

const radioClass = cx(
  'peer size-4 shrink-0 cursor-pointer appearance-none rounded-full border border-border bg-surface',
  'checked:border-brand-solid checked:bg-brand-solid',
  'outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus',
  'data-[state=focus]:outline-2 data-[state=focus]:outline-offset-2 data-[state=focus]:outline-focus',
  'aria-[invalid=true]:border-error-fg aria-[invalid=true]:outline-2 aria-[invalid=true]:outline-offset-2 aria-[invalid=true]:outline-error-fg',
  'disabled:cursor-not-allowed disabled:border-border disabled:bg-neutral-100',
  'disabled:checked:border-neutral-300 disabled:checked:bg-neutral-300',
  'dark:disabled:bg-neutral-800 dark:disabled:checked:border-neutral-600 dark:disabled:checked:bg-neutral-600',
)

type RadioGroupProps = {
  label: ReactNode
  name: string
  hint?: ReactNode
  error?: ReactNode
  children: ReactNode
  className?: string
}

export const RadioGroup = ({ label, name, hint, error, children, className }: RadioGroupProps) => {
  const labelId = useId()
  const hintId = useId()
  const errorId = useId()
  const description = describedBy(hint, hintId, error, errorId)

  return (
    <Field
      role="radiogroup"
      aria-labelledby={labelId}
      aria-invalid={error ? true : undefined}
      aria-describedby={description}
      className={className}
    >
      <span id={labelId} className="text-label text-fg">
        {label}
      </span>
      <RadioContext.Provider value={{ name, invalid: Boolean(error), describedById: description }}>
        <div className="flex flex-col gap-2">{children}</div>
      </RadioContext.Provider>
      <FieldMessages hint={hint} error={error} hintId={hintId} errorId={errorId} />
    </Field>
  )
}

type RadioProps = Omit<ComponentProps<'input'>, 'type'> & {
  label: ReactNode
}

export const Radio = ({ label, id, className, disabled, name, ...props }: RadioProps) => {
  const context = useContext(RadioContext)
  const autoId = useId()
  const fieldId = id ?? autoId

  return (
    <label
      htmlFor={fieldId}
      className="inline-flex cursor-pointer items-center gap-2 text-body text-fg has-disabled:cursor-not-allowed has-disabled:text-fg-muted"
    >
      <span className="relative inline-flex size-4 shrink-0">
        <input
          {...props}
          id={fieldId}
          name={name ?? context?.name}
          type="radio"
          disabled={disabled}
          aria-invalid={context?.invalid ? true : undefined}
          aria-describedby={context?.describedById}
          className={cx(radioClass, className)}
        />
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center text-on-brand opacity-0 peer-checked:opacity-100 peer-disabled:text-neutral-700 dark:peer-disabled:text-neutral-100">
          <span className="size-1.5 rounded-full bg-current" />
        </span>
      </span>
      {label}
    </label>
  )
}
