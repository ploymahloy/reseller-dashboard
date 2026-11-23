import { useId, type ComponentProps, type ReactNode } from 'react'
import { describedBy } from '../../utils/describedBy'
import { cx } from '../../utils/cx'
import { Field, FieldLabel, FieldMessages } from '../Field'
import { controlClass } from '../styles'

type TextFieldProps = ComponentProps<'input'> & {
  label: ReactNode
  hint?: ReactNode
  error?: ReactNode
}

export const TextField = ({ label, hint, error, required, id, className, disabled, ...props }: TextFieldProps) => {
  const autoId = useId()
  const fieldId = id ?? autoId
  const hintId = useId()
  const errorId = useId()

  return (
    <Field>
      <FieldLabel htmlFor={fieldId} required={required}>
        {label}
      </FieldLabel>
      <input
        {...props}
        id={fieldId}
        required={required}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hint, hintId, error, errorId)}
        className={cx(controlClass, 'h-9 px-3', className)}
      />
      <FieldMessages hint={hint} error={error} hintId={hintId} errorId={errorId} />
    </Field>
  )
}
