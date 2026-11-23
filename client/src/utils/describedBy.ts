import type { ReactNode } from 'react'

export const describedBy = (hint: ReactNode, hintId: string, error: ReactNode, errorId: string): string | undefined => {
  const ids = [hint ? hintId : '', error ? errorId : ''].filter((id) => id !== '')
  return ids.length > 0 ? ids.join(' ') : undefined
}
