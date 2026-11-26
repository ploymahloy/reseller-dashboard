import { useId, type ComponentProps, type ReactNode } from 'react'
import { describedBy } from '@/utils/describedBy'
import { cx } from '@/utils/cx'
import { Field, FieldLabel, FieldMessages } from '@/components/Field'
import { ChevronDownIcon, Icon } from '@/components/Icon'
import { controlClass } from '@/components/styles'

type SelectProps = ComponentProps<'select'> & {
  label: ReactNode
  hint?: ReactNode
  error?: ReactNode
}

export const Select = ({ label, hint, error, required, id, className, disabled, children, ...props }: SelectProps) => {
  const autoId = useId()
  const fieldId = id ?? autoId
  const hintId = useId()
  const errorId = useId()

  return (
    <Field>
      <FieldLabel htmlFor={fieldId} required={required}>
        {label}
      </FieldLabel>
      <div className="relative">
        <select
          {...props}
          id={fieldId}
          required={required}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy(hint, hintId, error, errorId)}
          className={cx(controlClass, 'peer h-9 appearance-none pl-3 pr-9', className)}
        >
          {children}
        </select>
        <Icon
          size="sm"
          className="pointer-events-none absolute top-1/2 right-2.5 -translate-y-1/2 text-fg-muted peer-aria-invalid:text-error-fg peer-disabled:text-neutral-400"
        >
          <ChevronDownIcon />
        </Icon>
      </div>
      <FieldMessages hint={hint} error={error} hintId={hintId} errorId={errorId} />
    </Field>
  )
}
