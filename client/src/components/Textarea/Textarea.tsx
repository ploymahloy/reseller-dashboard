import { useId, type ComponentProps, type ReactNode } from 'react'
import { describedBy } from '../../utils/describedBy'
import { cx } from '../../utils/cx'
import { Field, FieldLabel, FieldMessages } from '../Field'
import { controlClass } from '../styles'

type TextareaProps = ComponentProps<'textarea'> & {
  label: ReactNode
  hint?: ReactNode
  error?: ReactNode
}

export const Textarea = ({ label, hint, error, id, className, disabled, ...props }: TextareaProps) => {
  const autoId = useId()
  const fieldId = id ?? autoId
  const hintId = useId()
  const errorId = useId()

  return (
    <Field>
      <FieldLabel htmlFor={fieldId}>{label}</FieldLabel>
      <textarea
        {...props}
        id={fieldId}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy(hint, hintId, error, errorId)}
        className={cx(controlClass, 'min-h-24 resize-y px-3 py-2', className)}
      />
      <FieldMessages hint={hint} error={error} hintId={hintId} errorId={errorId} />
    </Field>
  )
}
